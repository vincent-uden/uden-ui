import { createSignal } from 'solid-js'
import { Hello, ColorPickerBase, HuePicker, SaturationValuePicker } from '../src'

function App() {
  const [color, setColor] = createSignal<string>('#ff0')

  return (
    <div>
      <header>
        <h1>
          <Hello></Hello>
        </h1>
        <p class="text-xl">
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a href="https://github.com/solidjs/solid" target="_blank" rel="noopener noreferrer">
          Learn Solid
        </a>
        <ColorPickerBase out={setColor} value="#f00">
          <SaturationValuePicker />
          <div class="h-2" />
          <HuePicker />
        </ColorPickerBase>
        <div class="h-2" />
        <div class="w-32 h-32 rounded-xl" style={{ 'background-color': color() }} />
      </header>
    </div>
  )
}

export default App
