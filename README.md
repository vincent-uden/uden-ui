<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=uden-ui&background=tiles&project=%20" alt="uden-ui">
</p>

# uden-ui
A tailwind based component library for [SolidJS](https://www.solidjs.com/).

## Quick start

### Install it:

```bash
npm i uden-ui
# or
yarn add uden-ui
# or
pnpm add uden-ui
# or
bun i uden-ui
```

### Use it:
Modify your `tailwind.config.cjs` to include this package as content:
```javascript
module.exports = {
  content: [
      // ...
      "./node_modules/uden_ui/**/*.{html,js,jsx,ts,tsx}",
      // ...
  ],
  // ...
}

```

Import the components you want to use, for example
```tsx
import TextInput from 'uden-ui';
```
