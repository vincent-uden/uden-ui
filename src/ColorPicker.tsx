import { ColorTranslator } from "colortranslator";
import {
  JSX,
  Setter,
  Signal,
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import { twMerge } from "tailwind-merge";

import "./globals.css";

function fullySaturated(hue: number) {
  return `hsl(${hue * 360},100%,50%)`;
}

type ColorState = {
  hue: number;
  saturation: number;
  value: number;
  selecting: boolean;
};

const ColorContext = createContext<Signal<ColorState>>();
function useColor() {
  return useContext(ColorContext);
}

type ColorPickerBaseProps = {
  out?: Setter<string>;
  value?: string;
  width?: number;
  height?: number;
  children: JSX.Element;
};

export function ColorPickerBase(props: ColorPickerBaseProps) {
  const c = createSignal<ColorState>({
    hue: 0,
    saturation: 0,
    value: 0,
    selecting: false,
  });
  const [color, setColor] = c;

  if (props.value != undefined) {
    const color = new ColorTranslator(props.value);
    const hsl = color.HSLObject;
    const hue = hsl.H / 360;
    hsl.S /= 100;
    hsl.L /= 100;
    const V = hsl.L + hsl.S * Math.min(hsl.L, 1 - hsl.L);
    let Sv = 0;
    if (V !== 0) {
      Sv = 2 * (1 - hsl.L / V);
    }
    setColor(col => {
      return {
        ...col,
        hue: hue,
        saturation: Sv,
        value: V,
      };
    });
  }

  const translator = new ColorTranslator("#000");

  createEffect(() => {
    if (props.out != undefined) {
      translator.setH(color().hue * 360);
      const L = color().value * (1 - color().saturation / 2);
      translator.setL(L * 100);
      if (L == 0 || L == 1) {
        translator.setS(0);
      } else {
        translator.setS(((color().value - L) / Math.min(L, 1 - L)) * 100);
      }
      props.out(translator.HEX);
    }
  });

  onMount(() => {
    document.addEventListener("mouseup", () => {
      setColor(col => {
        return { ...col, selecting: false };
      });
    });
  });

  return <ColorContext.Provider value={c}>{props.children}</ColorContext.Provider>;
}

type HuePickerProps = {
  class?: string;
  width?: number;
};

export function HuePicker(props: HuePickerProps) {
  const [color, setColor] = useColor()!!;

  let hueRef: HTMLCanvasElement;

  let width = props.width ?? 200;

  return (
    <div class={twMerge("relative", props.class)}>
      <div
        class="h-4 rounded border border-zinc-400"
        style={{
          background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
          width: `${width}px`,
        }}
        //@ts-ignore
        ref={hueRef}
        onMouseDown={e => {
          setColor(c => {
            return { ...c, selecting: true };
          });
          const rect = hueRef.getBoundingClientRect();
          setColor(c => {
            return { ...c, hue: (e.x - rect.left) / width };
          });
        }}
        onMouseMove={e => {
          if (color().selecting) {
            const rect = hueRef.getBoundingClientRect();
            setColor(c => {
              return { ...c, hue: (e.x - rect.left) / width };
            });
          }
        }}
      />
      <div
        class="w-2 h-full absolute rounded-full border-2 border-white pointer-events-none drop-shadow-lg top-0"
        style={{
          left: `${width * color().hue}px`,
          "background-color": fullySaturated(color().hue),
          transform: `translate(-4px)`,
        }}
      />
    </div>
  );
}

type SaturationValuePickerProps = {
  class?: string;
  width?: number;
  height?: number;
};

export function SaturationValuePicker(props: SaturationValuePickerProps) {
  const [color, setColor] = useColor()!!;

  let width = props.width ?? 200;
  let height = props.height ?? 200;

  const x = () => color().saturation * width;
  const y = () => (1 - color().value) * height;

  let canvasRef: HTMLCanvasElement;
  let colorCtx: CanvasRenderingContext2D;

  function drawToCanvas() {
    let gradientH = colorCtx.createLinearGradient(0, 0, colorCtx.canvas.width, 0);
    gradientH.addColorStop(0, "#fff");
    gradientH.addColorStop(1, fullySaturated(color().hue));
    colorCtx.fillStyle = gradientH;
    colorCtx.fillRect(0, 0, colorCtx.canvas.width, colorCtx.canvas.height);

    let gradientV = colorCtx.createLinearGradient(0, 0, 0, colorCtx.canvas.height);
    gradientV.addColorStop(0, "rgba(0,0,0,0)");
    gradientV.addColorStop(1, "#000");
    colorCtx.fillStyle = gradientV;
    colorCtx.fillRect(0, 0, colorCtx.canvas.width, colorCtx.canvas.height);
  }

  onMount(() => {
    colorCtx = canvasRef.getContext("2d", { willReadFrequently: true })!!;
    drawToCanvas();
  });

  createEffect(() => {
    drawToCanvas();
  });

  return (
    <div class={twMerge("relative", props.class)}>
      <canvas
        class="rounded border border-zinc-400"
        width={width}
        height={height}
        /*@ts-ignore*/
        ref={canvasRef}
        onMouseDown={e => {
          const rect = canvasRef.getBoundingClientRect();
          setColor(c => {
            return {
              ...c,
              selecting: true,
              saturation: (e.x - rect.left) / width,
              value: 1 - (e.y - rect.top) / height,
            };
          });
        }}
        onMouseMove={e => {
          if (color().selecting) {
            const rect = canvasRef.getBoundingClientRect();
            setColor(c => {
              return {
                ...c,
                saturation: (e.x - rect.left) / width,
                value: 1 - (e.y - rect.top) / height,
              };
            });
          }
        }}
      />
      <div
        class="w-4 h-4 absolute rounded-full border-2 border-white pointer-events-none drop-shadow-lg"
        style={{
          left: `${x()}px`,
          top: `${y()}px`,
          //@ts-ignore
          "background-color": color(x(), y(), colorCtx),
          transform: `translate(-4px, -4px)`,
        }}
      />
    </div>
  );
}
