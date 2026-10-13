# Font Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make slogan fonts deterministic by default, customizable by consumers, and ready before demo export capture.

**Architecture:** A root-level internal font utility owns idempotent document resource injection and bounded Font Loading API waits. `KCelebrateSlogan` uses it only when `loadFonts` is true; rendering paths consume inherited CSS font variables, while the demo invokes the same wait helper before capture.

**Tech Stack:** React 18, TypeScript, Vitest, Testing Library, Vite, tsup.

**Spec:** `docs/superpowers/specs/2026-10-14-font-loading-design.md`

## Global Constraints

- Work on `fix/lib/font-loading`, based on `main`; do not include the Coachella branch.
- Preserve `loadFonts?: boolean` and its default of `true`.
- Use exactly `k-celebrate-slogan-google-fonts` and `k-celebrate-slogan-joseon-palace-font` as document resource IDs.
- Default Google font URL must load Nanum Myeongjo 800, Outfit 600, and Noto Sans KR 600 with `display=swap`.
- Do not claim or request a nonexistent JoseonPalace woff2; use the current woff URL with `font-display: swap`.
- Do not inject font resources or access `document` when `loadFonts` is false or during SSR.
- Bound export font waiting to 3,000 ms and continue on timeout or unavailable Font Loading API.
- Release version is `1.3.1`; all user-facing documentation and PR text are English.

## Review Focus

- Existing font resource IDs owned by another component must prevent duplicate insertion without changing that component's attributes.
- Several mounted slogan instances must not reinsert either resource after React effects run.
- `loadFonts={false}` must remain request-free even if the host supplies its own font-family CSS variables.
- A failed or permanently pending remote font must let export continue after three seconds rather than hang the UI.
- SVG text, hidden text2 measurement span, emblem SVG text, and tagline CSS must all inherit the appropriate font override variable.

---

### Task 1: Add a document-level font utility and unit tests

**Files:**

- Create: `fontUtils.ts`
- Create: `tests/fontUtils.test.ts`

**Interfaces:**

- Produces: `GOOGLE_FONTS_ELEMENT_ID`, `JOSEON_PALACE_STYLE_ELEMENT_ID`, `ensureSloganFonts(): void`, `waitForSloganFonts(texts: SloganFontTexts, timeoutMs?: number): Promise<void>`.
- Produces: `SloganFontTexts` with `emblems`, `text1`, `text2`, and `text3` string fields.

- [ ] **Step 1: Write failing utility tests**

Create tests that reset both resource IDs from `document.head` after each case and assert:

```ts
ensureSloganFonts();
ensureSloganFonts();
expect(document.querySelectorAll('#k-celebrate-slogan-google-fonts')).toHaveLength(1);
expect(document.querySelectorAll('#k-celebrate-slogan-joseon-palace-font')).toHaveLength(1);
```

Mock `document.fonts.load` to assert `waitForSloganFonts` loads `800 1em "Nanum Myeongjo"`, `400 1em "JoseonPalace"`, `600 1em "Outfit"`, and `600 1em "Noto Sans KR"`; use fake timers to assert a pending load resolves after `3000` ms.

- [ ] **Step 2: Run the new test file to verify it fails**

Run: `npx vitest run tests/fontUtils.test.ts`

Expected: FAIL because `fontUtils.ts` does not exist.

- [ ] **Step 3: Implement `fontUtils.ts`**

Define the exact Google URL and the JoseonPalace CSS string as module constants. `ensureSloganFonts` must return before any DOM access when `document` is unavailable, then use `document.getElementById` to conditionally append the link and style elements.

Implement `waitForSloganFonts` to return immediately without `document.fonts.load`; otherwise load the four exact descriptors using supplied text, race their completion against a timeout defaulting to 3000 ms, and always clear the timeout.

- [ ] **Step 4: Run utility tests to verify they pass**

Run: `npx vitest run tests/fontUtils.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add fontUtils.ts tests/fontUtils.test.ts
git commit -m "fix(lib): load shared slogan fonts once"
```

### Task 2: Integrate font loading and CSS variable stacks into the library

**Files:**

- Modify: `KCelebrateSlogan.tsx`
- Modify: `EmblemSection.tsx`
- Modify: `tests/CelebrateSlogan.test.tsx`

**Interfaces:**

- Consumes: `ensureSloganFonts(): void` from `fontUtils.ts`.
- Produces: the existing `KCelebrateSlogan` public API, with `loadFonts` unchanged.

- [ ] **Step 1: Write failing component tests**

Add tests that render three default `KCelebrateSlogan` instances and assert one of each font resource ID. Add a test that removes both IDs, renders `<KCelebrateSlogan loadFonts={false} />`, and asserts neither exists. Assert the generated style and SVG/measurement text styles contain `var(--kcs-font-emblem`, `var(--kcs-font-title`, and `var(--kcs-font-tagline` respectively, and that `font-weight: 800` replaces the old 900 request.

- [ ] **Step 2: Run the component test file to verify it fails**

Run: `npx vitest run tests/CelebrateSlogan.test.tsx`

Expected: FAIL because the old component injects only an unlabelled Google link, injects JoseonPalace per instance, and uses fixed font-family values.

- [ ] **Step 3: Integrate the utility and replace fixed font stacks**

Replace `GOOGLE_FONTS_URL` and the existing font-loading effect body in `KCelebrateSlogan.tsx` with `ensureSloganFonts()` guarded by `loadFonts`. Remove its layout-scoped JoseonPalace `@font-face` rule.

Use these values in every relevant rendering path:

```ts
var(--kcs-font-emblem, "Nanum Myeongjo", serif)
var(--kcs-font-title, 'JoseonPalace', '궁서', '궁서체', 'Gungsuh', serif)
var(--kcs-font-tagline, 'Outfit', 'Noto Sans KR', sans-serif)
```

Apply 800 to `.text1-style` and `EmblemSection` glyphs. Update the hidden title-measurement span and SVG `<text>` title styles together.

- [ ] **Step 4: Run component tests to verify they pass**

Run: `npx vitest run tests/CelebrateSlogan.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add KCelebrateSlogan.tsx EmblemSection.tsx tests/CelebrateSlogan.test.tsx
git commit -m "fix(lib): allow slogan font overrides"
```

### Task 3: Wait for required fonts before demo capture

**Files:**

- Modify: `demo-components/Preview.tsx`
- Modify: `tests/fontUtils.test.ts`

**Interfaces:**

- Consumes: `waitForSloganFonts(texts: SloganFontTexts, timeoutMs?: number): Promise<void>` from `../fontUtils`.
- Produces: a capture path that waits at most 3000 ms after React has rendered the export node.

- [ ] **Step 1: Extend the failing wait tests**

Add cases for a rejected font load and a missing `document.fonts` implementation; both must resolve without rejecting. Assert default descriptor text includes the supplied `text1`, `text2`, Korean tagline, and emblem characters.

- [ ] **Step 2: Run the utility test file to verify the new cases fail**

Run: `npx vitest run tests/fontUtils.test.ts`

Expected: FAIL until the wait helper treats rejected and unavailable Font Loading API paths as best-effort completion.

- [ ] **Step 3: Update the export pipeline**

In `Preview.tsx`, import `waitForSloganFonts` and call it after the existing double `requestAnimationFrame` synchronization, before `document.fonts.ready` and capture setup. Pass:

```ts
{ emblems: '경축', text1: cfg.text1, text2: cfg.text2, text3: `ㅡ ${cfg.text3} ㅡ` }
```

Keep the existing `document.fonts.ready` call only behind a Font Loading API guard so unsupported browsers can continue. Add `Noto Sans KR:wght@600` to the Google CSS fetched for embedded raster/SVG export fonts.

- [ ] **Step 4: Run utility and component tests to verify they pass**

Run: `npm test -- --run`

Expected: PASS with all current and new tests.

- [ ] **Step 5: Commit**

```bash
git add demo-components/Preview.tsx tests/fontUtils.test.ts
git commit -m "fix(export): wait for slogan fonts before capture"
```

### Task 4: Document the API, prepare the patch release, and verify packaging

**Files:**

- Modify: `README.md`
- Modify: `types.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**

- Consumes: the existing `loadFonts?: boolean` prop and CSS custom-property names from Tasks 1–2.
- Produces: package version `1.3.1` and documented consumer setup.

- [ ] **Step 1: Update the prop contract and README**

Add `loadFonts` to the props table. Add a Font loading section with: the font-to-component mapping, JoseonPalace size warning, `loadFonts={false}` code example with self-hosted `@font-face`, and a CSS custom-property override example that uses `--kcs-font-title: "JoseonPalaceSlogan"`. State that Noto Sans KR renders Korean tagline glyphs and Outfit renders Latin glyphs.

- [ ] **Step 2: Bump the patch version**

Run: `npm version 1.3.1 --no-git-tag-version`

Expected: `package.json` and `package-lock.json` report version `1.3.1`, without creating a tag.

- [ ] **Step 3: Run release checks**

Run: `npm test -- --run && npm run lint && npm run build && npm run build:demo`

Expected: tests, TypeScript bundle build, and Vite demo build pass; lint may retain only documented pre-existing warnings.

- [ ] **Step 4: Commit**

```bash
git add README.md types.ts package.json package-lock.json
git commit -m "docs: document slogan font loading"
```

### Task 5: Review, publish the English PR, verify CI, and release

**Files:**

- No source changes expected.

**Interfaces:**

- Consumes: commits from Tasks 1–4 and repository PR template `.github/PULL_REQUEST_TEMPLATE/lib.md`.
- Produces: an English PR into `main` that references `Fixes #7`, successful GitHub Actions checks, merged `main`, and an annotated `v1.3.1` tag when npm publication authority is available.

- [ ] **Step 1: Review the branch diff and commits**

Run: `git diff main...HEAD --check && git log --oneline main..HEAD`

Expected: no whitespace errors and only issue-related commits.

- [ ] **Step 2: Push the branch and open an English library PR**

Use a title such as `fix(lib): make slogan font loading self-contained`. The body must use the library template, describe default one-time loading, CSS variable overrides, bounded export waiting, `1.3.1`, test/build results, and end with `Fixes #7`.

- [ ] **Step 3: Verify CI/CD checks from the PR**

Wait for every required GitHub Actions check. Inspect failed logs and fix only failures introduced by this branch; rerun local release checks before pushing a correction.

- [ ] **Step 4: Merge after CI is green and verify `main`**

Merge the PR using the repository's allowed merge method, then confirm the merge commit and package version on `origin/main`.

- [ ] **Step 5: Tag and publish the release if authorized infrastructure is available**

Create and push annotated tag `v1.3.1`; verify the npm package version and GitHub release/publish workflow if configured. Report any missing publication credential or workflow as a deployment blocker rather than declaring a release.
