# Celebrate Slogan 🎉

> "Everyone is worthy of celebration, for no reason at all."

A festive, animated slogan component for React applications. Features spinning pinwheels and customizable text/colors. Perfect for congratulatory messages!

## Installation

```bash
npm install k-celebrate-slogan framer-motion
# or
yarn add k-celebrate-slogan framer-motion
```

This component uses `framer-motion` for entrance animations.

## Usage

```tsx
import { KCelebrateSlogan } from 'k-celebrate-slogan';

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <KCelebrateSlogan />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text1` | `string` | `"축하합니다"` | The top small text. |
| `text2` | `string` | `"김준호"` | The main large text. |
| `text3` | `string` | `"아무 이유 없음"` | The bottom tagline. |
| `text1Color` | `string` | `"#1c89bf"` | Color for `text1`. |
| `text2Color` | `string` | `"#222222"` | Color for `text2`. |
| `text3Color` | `string` | `"#111827"` | Color for `text3`. |
| `pinwheelColors` | `string[]` | `undefined` | Custom colors for the pinwheel blades. pass 12 colors or fewer for interpolation. |
| `animate` | `boolean` | `true` | Whether to animate the entrance and spin. |

## Themes

### Default Theme
The default pinwheel colors transition from warm colors (red/orange) to cool colors (sky blue).

### Custom Theme Example: Pastel Dream 🌸

You can customize the `pinwheelColors` prop to match your brand or theme. We also export preset themes!

```tsx
import { KCelebrateSlogan, PASTEL_THEME } from 'k-celebrate-slogan';

<KCelebrateSlogan 
  text1="Happy Birthday"
  text2="Dear Friend" 
  text3="Best Wishes"
  text1Color="#FF6B6B"
  text2Color="#4ECDC4"
  pinwheelColors={PASTEL_THEME}
/>
```

Or provide your own array:
```tsx
const myColors = ['#FF0000', '#00FF00', ...]; // up to 12 colors
<KCelebrateSlogan pinwheelColors={myColors} />
```

## Inspiration

This project was inspired by a famous Korean meme. 

![Original Meme](https://raw.githubusercontent.com/GHeeJeon/k-celebrate-slogan/main/assets/original-meme.png)

*A celebratory slogan photographed in Korea. It says "Congratulations, Jun-ho Kim, for no reason at all." (축하합니다 김준호 아무 이유 없음)*

## License

MIT
