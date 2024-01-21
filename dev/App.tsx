import { JSX, createSignal } from "solid-js";
import {
  Hello,
  ColorPickerBase,
  HuePicker,
  SaturationValuePicker,
  SelectInput,
  TextInput,
  SlideInput,
} from "../src";

import { twMerge } from "tailwind-merge";

import "./App.module.css";
import "@fontsource/inter";

type ExampleSelect = "Option 1" | "Option 2" | "Option 3" | "Option 4";
const selectOptions: ExampleSelect[] = ["Option 1", "Option 2", "Option 3", "Option 4"];

function App() {
  const [color, setColor] = createSignal<string>("#ff0");
  const [text, setText] = createSignal<string>("");
  const [select, setSelect] = createSignal<ExampleSelect>("Option 1");
  const [slide, setSlide] = createSignal<number>(0);

  return (
    <div>
      <header class="py-4 px-8 font-semibold">
        <h1 class="text-4xl text-zinc-700">Component Showcase</h1>
      </header>
      <main class="container flex flex-row flex-wrap justify-center mx-auto gap-8">
        <Panel>
          <h2 class="text-2xl text-zinc-700 mb-4">Color Picker</h2>
          <ColorPickerBase out={setColor} value="#f00">
            <SaturationValuePicker />
            <div class="h-2" />
            <HuePicker />
          </ColorPickerBase>
          <div class="h-2" />
          <div class="w-32 h-32 mx-auto rounded-xl" style={{ "background-color": color() }} />
        </Panel>
        <Panel>
          <h2 class="text-2xl text-zinc-700 mb-4">Input Components</h2>
          <h3 class="text-lg text-zinc-700 mb-1">Text Input</h3>
          <TextInput out={setText} />
          <p class="border-2 px-1 border-transparent text-black/20">{text()}</p>

          <div class="h-4" />

          <h3 class="text-lg text-zinc-700 mb-1">Select Input</h3>
          <SelectInput options={selectOptions} out={setSelect} />
          <p class="border-2 px-1 border-transparent text-black/20">{select()}</p>

          <div class="h-4" />

          <h3 class="text-lg text-zinc-700 mb-1">Select Input</h3>
          <SlideInput from={0} to={10} value={0} out={setSlide} />
          <div class="h-4" />
          <p class="border-2 px-1 border-transparent text-black/20">{slide().toFixed(2)}</p>
        </Panel>
      </main>
    </div>
  );
}

type PanelProps = {
  class?: string;
  children?: JSX.Element;
};

function Panel(props: PanelProps) {
  return (
    <div
      class={twMerge(
        "bg-white py-4 px-8 rounded-xl shadow hover:shadow-lg transition-shadow",
        props.class,
      )}
    >
      {props.children}
    </div>
  );
}

export default App;
