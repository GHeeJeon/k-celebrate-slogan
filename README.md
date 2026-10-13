# k-celebrate-slogan 🎉

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Ubuntu+Mono&weight=600&size=30&duration=1000&pause=3000&color=000000&center=true&vCenter=true&multiline=true&width=700&height=100&lines=Everyone+is+worthy+of+celebration%2C+;for+no+reason+at+all.)](https://git.io/typing-svg)

A festive, animated slogan component for React applications.  
Features spinning pinwheels and customizable text/colors.  
Remember, everyone is worthy of celebration, for no reason at all!

> **[🎨 Try the Live Demo →](https://k-celebrate-slogan.vercel.app/)**

## Preview

[![k-celebrate-slogan](https://k-celebrate-slogan.vercel.app/api?text1=%EC%B6%95%ED%95%98%ED%95%A9%EB%8B%88%EB%8B%A4&text2=%EA%B9%80%EC%A4%80%ED%98%B8&text3=%EC%95%84%EB%AC%B4+%EC%9D%B4%EC%9C%A0+%EC%97%86%EC%9D%8C&text1Color=%231c89bf&text2Color=%23222222&text3Color=%23111827&text2StrokeColor=%23222222&text2StrokeWidth=2.5px&scale=1&emblemScale=0.8&theme=default)](https://github.com/GHeeJeon/k-celebrate-slogan)

## Installation

```bash
npm i k-celebrate-slogan
```

> **Note:** `react`, `react-dom`, and `framer-motion` are peer dependencies.  
> If your project does **not** have them installed yet:
>
> ```bash
> npm i k-celebrate-slogan framer-motion react react-dom
> ```

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

| Prop               | Type       | Default            | Description                                                                       |
| ------------------ | ---------- | ------------------ | --------------------------------------------------------------------------------- |
| `text1`            | `string`   | `"축하합니다"`     | The top small text.                                                               |
| `text2`            | `string`   | `"김준호"`         | The main large text.                                                              |
| `text3`            | `string`   | `"아무 이유 없음"` | The bottom tagline.                                                               |
| `text1Color`       | `string`   | `"#1c89bf"`        | Color for `text1`.                                                                |
| `text2Color`       | `string`   | `"#222222"`        | Color for `text2`.                                                                |
| `text3Color`       | `string`   | `"#111827"`        | Color for `text3`.                                                                |
| `text2StrokeColor` | `string`   | `"#222222"`        | Stroke color for `text2`.                                                         |
| `text2StrokeWidth` | `string`   | `"2.5px"`          | Stroke width for `text2`.                                                         |
| `pinwheelColors`   | `string[]` | `undefined`        | Custom colors for the pinwheel blades. Pass 12 colors or fewer for interpolation. |
| `animate`          | `boolean`  | `true`             | Whether to animate the entrance and spin.                                         |
| `scale`            | `number`   | `1`                | Overall scale factor.                                                             |
| `emblemScale`      | `number`   | `0.75`             | Scale factor for the emblem sections.                                             |
| `loadFonts`        | `boolean`  | `true`             | Load the component's default fonts once per document.                             |

## Font loading and overrides

By default, each document receives one Google Fonts stylesheet and one JoseonPalace
`@font-face` rule when the first slogan is mounted. The component uses the following
font stacks:

| Slogan part         | Default font stack                                      | Weight |
| ------------------- | ------------------------------------------------------- | ------ |
| Emblems and `text1` | Nanum Myeongjo                                          | 800    |
| `text2`             | JoseonPalace, Korean serif fallbacks                    | 400    |
| `text3`             | Outfit for Latin glyphs, Noto Sans KR for Korean glyphs | 600    |

JoseonPalace is currently served as a 3.6 MB WOFF file. If your application has a
subsetted or self-hosted alternative, disable automatic loading and provide the font
files yourself:

```tsx
<KCelebrateSlogan loadFonts={false} className="my-slogan" />
```

```html
<link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@800&family=Noto+Sans+KR:wght@600&family=Outfit:wght@600&display=swap"
/>
```

```css
@font-face {
    font-family: 'JoseonPalaceSlogan';
    src: url('/fonts/joseon-palace-subset.woff2') format('woff2');
    font-weight: 400;
    font-display: swap;
}

.my-slogan {
    --kcs-font-emblem: 'My Nanum Myeongjo', serif;
    --kcs-font-title: 'JoseonPalaceSlogan', serif;
    --kcs-font-tagline: 'My Tagline Font', sans-serif;
}
```

When `loadFonts={false}`, the library makes no font requests. Your application must
load every font used in the override stacks. CSS custom properties inherit from the
component root, so no `!important` rule is needed.

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
/>;
```

Or provide your own array:

```tsx
const myColors = ['#FF0000', '#00FF00', ...]; // up to 12 colors
<KCelebrateSlogan pinwheelColors={myColors} />
```

## Use as a GitHub Profile Badge

Generate your own badge at **[k-celebrate-slogan.vercel.app](https://k-celebrate-slogan.vercel.app/)** and paste the result!

**Markdown:**

```markdown
[![k-celebrate-slogan](https://k-celebrate-slogan.vercel.app/api?text1=%EC%B6%95%ED%95%98%ED%95%A9%EB%8B%88%EB%8B%A4&text2=%EA%B9%80%EC%A4%80%ED%98%B8&text3=%EC%95%84%EB%AC%B4+%EC%9D%B4%EC%9C%A0+%EC%97%86%EC%9D%8C)](https://github.com/GHeeJeon/k-celebrate-slogan)
```

**HTML:**

```html
<a href="https://github.com/GHeeJeon/k-celebrate-slogan">
    <img
        src="https://k-celebrate-slogan.vercel.app/api?text1=%EC%B6%95%ED%95%98%ED%95%A9%EB%8B%88%EB%8B%A4&text2=%EA%B9%80%EC%A4%80%ED%98%B8&text3=%EC%95%84%EB%AC%B4+%EC%9D%B4%EC%9C%A0+%EC%97%86%EC%9D%8C"
        alt="k-celebrate-slogan"
    />
</a>
```

## Inspiration

This project was inspired by a famous Korean meme.

![Original Meme](https://raw.githubusercontent.com/GHeeJeon/k-celebrate-slogan/main/assets/original-meme.png)

_A celebratory slogan photographed in Korea.  
It says "Congratulations, Jun-ho Kim, for no reason at all." (축하합니다 김준호 아무 이유 없음)_

## License

[MIT](./LICENSE)
