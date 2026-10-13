# Font Loading and Override Design

## Context

Issue #7 identifies that the slogan's rendered appearance depends on fonts loaded by a host page. The library currently injects a Google Fonts stylesheet for Nanum Myeongjo and Outfit, but it does not document that behaviour, injects JoseonPalace once per rendered layout, and does not provide a normal CSS override path. Its requested Nanum Myeongjo weight (`900`) is not one of the loaded weights (`400`, `700`, `800`).

The fix is a library bug fix on top of `main` version `1.3.0`. The target release is `1.3.1` and must be merged to `main`, with the repository's existing npm-tag release process followed after merge.

## Goals

- Render the classic slogan with its intended default fonts in a host React application that has not loaded any slogan fonts.
- Inject each library-managed font resource at most once per document.
- Let consumers opt out of all font injection and replace every slogan font without `!important`.
- Make the demo's raster and SVG export paths wait briefly for the exact fonts used by their capture target.
- Document the network and override trade-offs clearly enough for consumers to self-host or subset fonts.

## Non-goals

- Bundle font binaries in the npm package.
- Change the API image generator's independently embedded font strategy.
- Introduce a new browser-test framework or modify the Coachella feature branch.
- Guarantee a successful remote font download; normal CSS fallback behaviour remains available after the bounded export wait.

## Public API and Font Policy

`loadFonts?: boolean` remains a public prop with a default of `true`.

When true, the component injects exactly two document-level resources after client-side mount:

1. One Google Fonts stylesheet, identified by `k-celebrate-slogan-google-fonts`, for `Nanum Myeongjo` weight 800, `Outfit` weight 600, and `Noto Sans KR` weight 600.
2. One style element, identified by `k-celebrate-slogan-joseon-palace-font`, defining the existing JoseonPalace CDN `woff` with `font-display: swap`.

The checked CDN path has no corresponding `.woff2` asset. The implementation must not advertise a nonexistent woff2 fallback. JoseonPalace remains a 3,599,204-byte remote font; consumers who need a smaller subset must use `loadFonts={false}` and supply their own family.

When `loadFonts` is false, the component creates neither resource. Consumers own all font requests and definitions in that mode. All document interaction is guarded for SSR and performed from a React effect.

The font stacks use these inherited CSS custom properties:

- `--kcs-font-emblem`: `"Nanum Myeongjo", serif`
- `--kcs-font-title`: `'JoseonPalace', '궁서', '궁서체', 'Gungsuh', serif`
- `--kcs-font-tagline`: `'Outfit', 'Noto Sans KR', sans-serif`

The component supplies these stacks as `var()` fallbacks. A `className` or parent selector can override a custom property without changing the component's inline styles or using `!important`.

Nanum Myeongjo uses weight 800 for the emblems and `text1`. Outfit applies to Latin glyphs in `text3`; Noto Sans KR provides the deliberate Korean glyph fallback for the default Korean tagline and decorative jamo.

## Architecture

Create a focused font utility module for three responsibilities:

- Constants for element IDs, font URLs, and the CSS needed for JoseonPalace.
- `ensureSloganFonts(): void`, which is idempotent and does nothing without `document`.
- `waitForSloganFonts(texts, timeoutMs): Promise<void>`, which starts the exact `document.fonts.load()` requests used by the slogan, waits for them or a three-second timeout, and degrades safely when the Font Loading API is unavailable.

`KCelebrateSlogan` invokes `ensureSloganFonts` from its existing font-loading effect. The duplicated layout-scoped JoseonPalace `@font-face` rules are removed. Classic layout and `EmblemSection` use the variable-based font stacks and weight 800.

The demo export workflow invokes `waitForSloganFonts` after its double animation-frame render synchronization and before capture. It passes text1 plus both emblem characters, text2, and the rendered tagline string. The helper's completion is intentionally best-effort: timeout proceeds to capture using the browser's settled fallback rather than hanging export indefinitely.

## Testing and Acceptance Criteria

Unit tests must prove:

- default rendering injects both font resources with the specified IDs;
- rendering three component instances still produces one of each resource;
- `loadFonts={false}` creates neither resource;
- SSR-style missing `document` handling is safe at utility level;
- emblem and `text1` request weight 800 and all three font stacks use their override variables;
- font waiting issues the expected Font Loading API requests, resolves on completion, resolves on timeout, and is safe when the API is absent.

Manual browser verification before release must prove:

- a clean Vite + React host without predeclared Google Fonts passes `document.fonts.check` for Nanum Myeongjo 800, Outfit 600 with Latin text, Noto Sans KR 600 with Korean text, and JoseonPalace;
- three instances produce one Google link and one JoseonPalace style element;
- `loadFonts={false}` produces no font-origin requests;
- a consumer override such as `--kcs-font-title: "JoseonPalaceSlogan"` takes effect without `!important`;
- throttled-network demo PNG, JPEG, SVG, and GIF exports complete without waiting longer than the three-second cap and use loaded fonts when they arrive in time.

## Documentation, CI, and Release

README gains a font table, the `loadFonts={false}` self-hosting example, CSS-variable override example, and the JoseonPalace size warning. It states that Noto Sans KR renders Korean tagline glyphs while Outfit is used for Latin glyphs.

The existing `fix/lib/*` workflow requires a patch version bump, test pass, build pass, and npm tag after merge. The implementation must preserve the existing GitHub Actions checks and verify their result on the English pull request. The PR body must use the repository's library template in English, list the behavioural changes and verification, and reference `Fixes #7`.

After the PR's required CI checks pass, it is merged into `main`. The `main` release state is verified, then `v1.3.1` is tagged and pushed only if the repository's npm publication process is available and succeeds; otherwise the completed tag/publish blocker is reported without claiming deployment.
