import { createEffect, createSignal, For, onCleanup, onMount, Setter, Show } from "solid-js";
import { twMerge } from "tailwind-merge";
import { FaSolidChevronDown } from "solid-icons/fa";

type SelectProps<T> = {
  id?: string;
  value?: string;
  class?: string;
  options?: T[];
  out?: Setter<T>;
  onChange?: (x: T) => void;
};

export function SelectInput<T>(props: SelectProps<T>) {
  const [selectedOption, setSelectedOption] = createSignal(
    props.value ?? props?.options?.at(0) ?? "",
  );
  const [selecting, setSelecting] = createSignal(false);

  createEffect(() => {
    if (props.out) {
      // @ts-ignore
      props.out(selectedOption());
    }
  });

  function dismiss() {
    if (selecting()) {
      setSelecting(false);
    }
  }

  onMount(() => {
    document.body.removeEventListener("mouseup", dismiss, false);
    document.body.addEventListener("mouseup", dismiss, false);
  });

  onCleanup(() => {
    document.body.removeEventListener("mouseup", dismiss, false);
  });

  return (
    <div
      class={twMerge(
        "border-gray-200 border-2 rounded px-1 hover:border-primary outline-none transition-colors bg-transparent pt-1 relative flex flex-row",
        props.class,
      )}
      id={props.id ?? ""}
    >
      <p
        class="grow -translate-y-[1px] select-none"
        onMouseUp={e => {
          e.stopPropagation();
          setSelecting(true);
        }}
      >
        {"" + selectedOption()}
      </p>
      <FaSolidChevronDown class="translate-y-[1px] text-primary" />

      <Show when={selecting()}>
        <div
          class={`absolute z-10 border-2 border-primary -right-[2px] -left-[2px] -top-[2px] rounded shadow-lg flex flex-col bg-white`}
        >
          <For each={props.options}>
            {(opt, i) => (
              <div
                class="select-none hover:bg-primary/10 px-1 py-[3px] transition-colors"
                onMouseUp={e => {
                  e.stopPropagation();
                  setSelectedOption("" + props?.options?.at(i()) ?? "");
                  if (props.onChange != undefined) {
                    props.onChange(props!!.options!![i()]);
                  }
                }}
              >
                {"" + opt}
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
