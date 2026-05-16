# Lumina UI System With DaisyUI, Tailwind, React Aria, And Next.js

> Status: implementation-grade research and proposal
>
> Date: 2026-05-16
>
> Scope:
>
> - `/home/quanghuy1242/pjs/books`
> - `ui-specs.json`
> - `src/app/layout.tsx`
> - `src/app/page.tsx`
> - future `src/components/ui/**`
> - future `src/components/app-shell/**`
>
> Source docs:
>
> - `ui-specs.json`
> - `package.json`
> - DaisyUI v5 docs via Context7, including Tailwind CSS v4 CSS plugin configuration and `daisyui/theme` custom themes: `https://github.com/saadeghi/daisyui`
> - React Aria Components docs via MCP: `Getting started`, `Styling`, `Customization`, `Button`, `Menu`, and `Toast`: `https://react-aria.adobe.com`
>
> Related docs:
>
> - `/home/quanghuy1242/.codex/skills/research-doc-writer/references/implementation-grade-structure.md`
>
> Assumptions:
>
> - First implementation milestone is foundation-only: Tailwind/DaisyUI setup, global themes, component wrappers, AppShell, typography, and layout primitives.
> - No application domain model is finalized yet, so main content remains mock-only.
> - No lint rule is added in v1 to enforce page composition boundaries; the rule is documented first.
> - A future Codex skill may be created to enforce this design system, but this document does not create that skill.

## Table Of Contents

- [1. Goal](#1-goal)
- [2. System Summary](#2-system-summary)
- [3. Current-State Findings](#3-current-state-findings)
  - [3.1 Repository State](#31-repository-state)
  - [3.2 Package And Library State](#32-package-and-library-state)
  - [3.3 UI Spec Findings](#33-ui-spec-findings)
  - [3.4 External Library Findings](#34-external-library-findings)
  - [3.5 Current Problems](#35-current-problems)
- [4. Target Model](#4-target-model)
  - [4.1 Public App-Writing Model](#41-public-app-writing-model)
  - [4.2 Component Library Layers](#42-component-library-layers)
  - [4.3 Styling Ownership](#43-styling-ownership)
  - [4.4 Server-First Interaction Model](#44-server-first-interaction-model)
  - [4.5 Theme Model](#45-theme-model)
  - [4.6 Next.js App Router Model](#46-nextjs-app-router-model)
- [5. Architecture Decisions](#5-architecture-decisions)
  - [5.1 Tailwind v4 And DaisyUI v5 CSS-First Setup](#51-tailwind-v4-and-daisyui-v5-css-first-setup)
  - [5.2 DaisyUI Wrapper Boundary](#52-daisyui-wrapper-boundary)
  - [5.3 Route Files As Composition Boundaries](#53-route-files-as-composition-boundaries)
  - [5.4 Typography Through Text And Heading](#54-typography-through-text-and-heading)
  - [5.5 Two-Layer Layout Component Model](#55-two-layer-layout-component-model)
  - [5.6 Token Props Instead Of Raw Classes](#56-token-props-instead-of-raw-classes)
  - [5.7 Server-Safe Buttons And Semantic Links](#57-server-safe-buttons-and-semantic-links)
  - [5.8 React Aria For Client Behavior](#58-react-aria-for-client-behavior)
  - [5.9 Global Light And Dark Themes](#59-global-light-and-dark-themes)
  - [5.10 Direct Lucide Imports In v1](#510-direct-lucide-imports-in-v1)
  - [5.11 Single Root Layout And Global AppShell In v1](#511-single-root-layout-and-global-appshell-in-v1)
  - [5.12 Deferred Enforcement Skill And ESLint Rules](#512-deferred-enforcement-skill-and-eslint-rules)
- [6. Proposed File Model](#6-proposed-file-model)
- [7. Implementation Strategy](#7-implementation-strategy)
- [8. Detailed Implementation Plan](#8-detailed-implementation-plan)
  - [8.1 Styling Foundation](#81-styling-foundation)
  - [8.2 Tokens And Class Composition](#82-tokens-and-class-composition)
  - [8.3 Typography Components](#83-typography-components)
  - [8.4 Layout Primitives](#84-layout-primitives)
  - [8.5 Action Components](#85-action-components)
  - [8.6 React Aria Client Components](#86-react-aria-client-components)
  - [8.7 App Shell Components](#87-app-shell-components)
  - [8.8 Route Composition](#88-route-composition)
  - [8.9 Tests And Documentation](#89-tests-and-documentation)
- [9. Migration And Rollout](#9-migration-and-rollout)
- [10. Edge Cases And Failure Modes](#10-edge-cases-and-failure-modes)
- [11. Test And Verification Plan](#11-test-and-verification-plan)
- [12. Implementation Backlog](#12-implementation-backlog)
  - [R1-A. Install Styling And Interaction Dependencies](#r1-a-install-styling-and-interaction-dependencies)
  - [R1-B. Add Global CSS And DaisyUI Themes](#r1-b-add-global-css-and-daisyui-themes)
  - [R1-C. Add Token And Class Utilities](#r1-c-add-token-and-class-utilities)
  - [R1-D. Add Typography Components](#r1-d-add-typography-components)
  - [R1-E. Add Layout Primitives](#r1-e-add-layout-primitives)
  - [R1-F. Add Button And LinkButton](#r1-f-add-button-and-linkbutton)
  - [R1-G. Add React Aria Interactive Components](#r1-g-add-react-aria-interactive-components)
  - [R1-H. Add AppShell, Topbar, Sidebar, And Mobile Dock](#r1-h-add-appshell-topbar-sidebar-and-mobile-dock)
  - [R1-I. Convert Root Layout And Home Page To Composition](#r1-i-convert-root-layout-and-home-page-to-composition)
  - [R1-J. Add Focused Tests And Manual Smoke Checks](#r1-j-add-focused-tests-and-manual-smoke-checks)
- [13. Future Backlog](#13-future-backlog)
- [14. Definition Of Done](#14-definition-of-done)
- [15. Final Model](#15-final-model)

## 1. Goal

Create a design and implementation plan for a server-first Lumina UI system built on Next.js App Router, Tailwind CSS v4, DaisyUI v5, and React Aria Components.

The goal is not to implement the UI in this document. The goal is to define the component boundary clearly enough that future implementation can proceed without rediscovering the same architectural choices.

The first release must establish:

- DaisyUI as the high-level visual class and theme system.
- Tailwind as the low-level utility engine used inside the UI library, not as route-file styling.
- React Aria Components as the default behavior layer for client-only accessible interactions.
- Route files as composition boundaries that assemble named components.
- A strict component library API so application pages do not draw UI directly with raw HTML and utility classes.

Non-goals for v1:

- No domain-complete books product UI.
- No custom ESLint enforcement.
- No generic icon registry.
- No multiple root layouts.
- No application-wide skill file yet.
- No attempt to wrap every DaisyUI or React Aria component before there is a product use case.

## 2. System Summary

The app should read like an application built from a local UI library:

```tsx
export default function HomePage() {
  return (
    <Page title="Library">
      <PageHeader>
        <Text variant="h1">Library</Text>
      </PageHeader>
      <PageBody>
        <Stack gap="md">
          <Panel tone="base">...</Panel>
        </Stack>
      </PageBody>
    </Page>
  );
}
```

The route file composes application and UI-library components. It does not decide DaisyUI class strings, spacing, heading tags, shell markup, or raw layout structure. The rendered DOM still contains `main`, `section`, `header`, `h1`, `button`, `a`, and `div` where appropriate, but these elements are owned by components such as `Page`, `PageHeader`, `Text`, `Button`, `LinkButton`, `Panel`, `Stack`, and `AppShell`.

The system has three primary layers:

- App routes under `src/app/**` compose named components and pass data.
- UI components under `src/components/ui/**` own visual primitives, DaisyUI classes, Tailwind utilities, semantic tags, and token props.
- App shell components under `src/components/app-shell/**` own global navigation, desktop sidebar, compact topbar, mobile dock, and root layout chrome.

## 3. Current-State Findings

### 3.1 Repository State

Observed files:

- `ui-specs.json`: generated compact DaisyUI app-shell specification for Lumina.
- `package.json`: Next.js 16 project with React 19, Vitest, ESLint, OpenNext Cloudflare scripts, and no Tailwind/DaisyUI/React Aria dependencies yet.
- `src/app/layout.tsx`: root layout with `<html lang="en">` and plain `<body>{children}</body>`.
- `src/app/page.tsx`: home page currently returns raw `<h1>hello world</h1>`.
- `tests/app/page.test.tsx`: existing app test file.
- `docs/`: empty before this document.

The project is fresh enough that the design-system boundary can be introduced without migration complexity.

### 3.2 Package And Library State

Current `package.json` dependencies:

- `next@16.2.6`
- `react@^19.2.5`
- `react-dom@^19.2.5`
- `@opennextjs/cloudflare@^1.19.10`

Current development dependencies include TypeScript, Vitest, Testing Library, ESLint, and Wrangler, but not Tailwind, DaisyUI, React Aria Components, or Lucide.

Registry versions checked on 2026-05-16:

- `daisyui@5.5.19`
- `tailwindcss@4.3.0`
- `react-aria-components@1.17.0`

These versions should be treated as the v1 target unless the implementation date finds a newer compatible patch.

### 3.3 UI Spec Findings

`ui-specs.json` defines a compact Lumina shell with these strong signals:

- DaisyUI is the primary visual library.
- Tailwind is the base utility system.
- Semantic DaisyUI classes are preferred over hardcoded color utilities.
- Compact sizing should use DaisyUI size modifiers first, such as `btn-sm`, `input-sm`, `menu-sm`, `card-compact`, and `dock-sm`.
- App shell rhythm should align topbar controls, nav rows, avatars, icon buttons, and cards.
- The shell should use DaisyUI components including `drawer`, `navbar`, `menu`, `input`, `btn`, `avatar`, `dropdown`, `card`, `badge`, `indicator`, `divider`, `tooltip`, and `dock`.
- Lumina theme colors in the JSON are useful input, but not a binding source of truth.
- Accessibility rules include landmarks, `aria-current="page"`, accessible labels for icon-only buttons, controlled dropdown state when applicable, keyboard behavior, and contrast guidance.

Important correction: the JSON includes a Tailwind config style example under `daisyui.themes`, but DaisyUI v5 with Tailwind v4 should use CSS plugin directives and `daisyui/theme` instead of a v3-style Tailwind config by default.

### 3.4 External Library Findings

DaisyUI v5 with Tailwind v4:

- Tailwind v4 can import DaisyUI directly from CSS with `@plugin "daisyui"`.
- Custom DaisyUI themes can be declared in CSS with `@plugin "daisyui/theme"`.
- DaisyUI theme tokens are CSS custom properties such as `--color-primary`, `--color-base-100`, `--radius-field`, `--size-field`, `--border`, `--depth`, and `--noise`.
- Themes are activated through `data-theme`, and the project should use a global `data-theme` on the root document in v1.
- A Tailwind config file is not required until a project need appears that cannot be expressed cleanly in CSS-first Tailwind v4 configuration.

React Aria Components:

- React Aria Components are unstyled by default and are intended to be wrapped into local reusable components.
- Components expose state through data attributes such as `data-pressed`, `data-hovered`, `data-focused`, `data-selected`, `data-disabled`, `data-entering`, and `data-exiting`.
- Tailwind can style those states directly with data attribute modifiers, or with `tailwindcss-react-aria-components`.
- The docs recommend wrapping component parts into reusable APIs such as local `Select`, `Menu`, `Popover`, and `Toast`.
- `Button` supports normalized `onPress` behavior and pending state, but the local default `Button` should remain server-safe; React Aria behavior should be introduced through client wrappers where needed.
- `Menu` supports keyboard navigation, sections, submenus, selection, links, text slots, and custom router rendering.
- `Toast` uses a `ToastQueue` and root-level `ToastRegion`; it is a client component and should be placed once in an app provider or shell boundary.
- React Aria `render` props are useful for router links or custom elements, but they must preserve the expected element type, pass props/ref through, and render a single root element.

### 3.5 Current Problems

Current problems are architectural gaps, not product bugs:

- `src/app/page.tsx` uses raw typography and should eventually be converted to UI-library composition.
- `src/app/layout.tsx` has no global CSS import, no DaisyUI theme, no AppShell, and no root theme strategy.
- There is no component library boundary yet.
- There are no tokenized layout, typography, action, shell, or overlay components.
- There is no rule documenting where raw HTML and Tailwind classes are allowed.
- There is no plan for splitting server-safe components from client-only React Aria behavior.
- The generated `ui-specs.json` contains useful visual guidance but should be normalized into a maintainable project architecture.

## 4. Target Model

### 4.1 Public App-Writing Model

Route files are composition boundaries. They should assemble named application and UI-library components, load data, and pass props. They should not author visual layout directly.

In route files, these should generally not appear:

- Raw layout HTML: `div`, `main`, `section`, `header`, `footer`, `aside`, `nav`.
- Raw typography tags: `h1`, `h2`, `h3`, `p`, `span`.
- Raw DaisyUI classes: `btn`, `navbar`, `drawer`, `menu`, `card`, `dock`, `input`.
- Raw Tailwind visual classes: `flex`, `grid`, `gap-*`, `p-*`, `text-*`, `bg-*`, `border-*`, `rounded-*`.

Allowed route-file responsibilities:

- Compose `Page`, `PageHeader`, `PageBody`, `PageSection`, `Stack`, `Panel`, `Text`, and domain components.
- Pass route params, search params, data, and callbacks where supported.
- Use framework-required elements only when unavoidable, without styling classes.
- Use tiny semantic glue only when there is no repeated pattern and no visual styling.

If a structure repeats, it should become a component.

### 4.2 Component Library Layers

The UI library should have two layout layers.

Small layout primitives:

- `Stack`: vertical rhythm with tokenized `gap`, `padding`, `align`, and `width`.
- `Inline`: horizontal rhythm with tokenized `gap`, `align`, `justify`, and wrapping behavior.
- `Grid`: grid layout with tokenized `gap`, `columns`, and responsive presets.
- `Columns`: page/content column layout for common split views.
- `Container`: constrained width and horizontal padding.
- `Panel`: DaisyUI-backed surface, usually `card` or boxed surface classes.
- `Spacer`: rare explicit spacing primitive for fixed rhythm.

Page-level primitives:

- `Page`: owns route page landmark and top-level content structure.
- `PageHeader`: owns page title and optional actions.
- `PageBody`: owns primary content spacing.
- `PageSection`: owns repeated section structure.
- `AppShell`: owns global shell composition.
- `Topbar`: owns compact topbar.
- `Sidebar`: owns desktop navigation.
- `MobileDock`: owns mobile primary navigation.

Route files should prefer page-level primitives. Small primitives are allowed inside reusable components and for small local composition, but raw layout HTML and raw classes remain inside the UI library.

### 4.3 Styling Ownership

DaisyUI owns high-level component styling and semantic tokens. Tailwind owns layout utilities and small adjustments, but only inside library components.

The normal component styling API is tokenized props:

- `variant`
- `tone`
- `size`
- `gap`
- `padding`
- `margin`
- `align`
- `justify`
- `columns`
- `width`

Components should not expose `className` as their default styling API.

Low-level primitives may expose `unstable_className` as a deliberate escape hatch. Rules for `unstable_className`:

- It is not allowed in route files unless there is no existing token or component that expresses the need.
- It must be explainable in code review.
- Repeated use of the same unstable class should become a token, prop, or component.
- It is acceptable for framework integration, rare layout edge cases, or temporary migration work.

### 4.4 Server-First Interaction Model

Server components are first-class. Default UI components should remain server-safe unless they need browser state, events, focus management, overlays, or dynamic interaction.

Server-safe examples:

- `Text`
- `Heading`
- `Stack`
- `Inline`
- `Grid`
- `Columns`
- `Container`
- `Panel`
- `Button`
- `LinkButton`
- `AppShell` when it only renders static shell structure

Client-only examples:

- `AriaButton`
- `Menu`
- `MenuTrigger`
- `Popover`
- `ToastRegion`
- `Select`
- `ComboBox`
- interactive `SearchField`
- controlled drawer trigger if the DaisyUI checkbox pattern is replaced by React state

Client components should be introduced at leaves or narrow shell boundaries rather than making the whole app client-rendered.

### 4.5 Theme Model

Use a global theme strategy in v1:

- Put `data-theme` on `<html>` in `src/app/layout.tsx`.
- Define exactly two themes in v1: `lumina-light` and `lumina-dark`.
- Use DaisyUI semantic tokens for color decisions.
- Use DaisyUI theme CSS variables for radius, field size, selector size, border, depth, and noise.
- Convert useful values from `ui-specs.json` into CSS theme definitions and local tokens as needed.

Nested themed regions are deferred. The first release should avoid component-specific theme overrides unless a component has a concrete accessibility or contrast bug.

### 4.6 Next.js App Router Model

Start with a single shared root layout and global `AppShell`.

Use `src/app/layout.tsx` for:

- `<html lang="en" data-theme="lumina-light">`
- global CSS import
- metadata
- global app shell wrapper
- global client providers only when required, such as a toast region or theme switcher

Do not introduce multiple root layouts in v1. If the product later needs clearly different shells, introduce route groups with dedicated layouts then, such as:

- marketing
- auth
- dashboard
- admin
- embedded views

The app can later use Next.js App Router features such as route groups, nested layouts, loading UI, and cache-aware server data loading after the component foundation is stable.

## 5. Architecture Decisions

### 5.1 Tailwind v4 And DaisyUI v5 CSS-First Setup

Decision: target Tailwind CSS v4 and DaisyUI v5 with CSS-first configuration.

Recommended future `src/app/globals.css` shape:

```css
@import "tailwindcss";
@plugin "daisyui";

@plugin "daisyui/theme" {
  name: "lumina-light";
  default: true;
  prefersdark: false;
  color-scheme: light;
  --color-base-100: #ffffff;
  --color-base-200: #f7f8fb;
  --color-base-300: #e6e8eb;
  --color-base-content: #1f2328;
  --color-primary: #3a5a6b;
  --color-primary-content: #ffffff;
  --radius-field: 0.625rem;
  --radius-box: 0.875rem;
  --size-field: 0.21875rem;
  --border: 1px;
  --depth: 0;
  --noise: 0;
}
```

The exact theme values should be finalized during implementation. The generated `ui-specs.json` values are a starting point, not a contract.

Rejected for v1:

- Creating `tailwind.config.ts` immediately. It adds configuration surface before there is a demonstrated need.
- Treating the generated Tailwind config example in `ui-specs.json` as authoritative. It is not aligned with DaisyUI v5/Tailwind v4 CSS-first configuration.

### 5.2 DaisyUI Wrapper Boundary

Decision: DaisyUI classes should be wrapped by local components.

Application code should call:

- `<Button variant="primary" size="sm">`
- `<Panel tone="base" padding="md">`
- `<Text variant="body">`
- `<Topbar />`
- `<Sidebar />`
- `<MobileDock />`

Application code should not call:

- `<button className="btn btn-sm btn-primary">`
- `<div className="card card-compact">`
- `<nav className="menu menu-sm">`

This makes DaisyUI replaceable or adjustable without editing every route.

### 5.3 Route Files As Composition Boundaries

Decision: route files should not author visual layout directly.

`src/app/page.tsx` and future route files should compose `Page` and domain components. Raw HTML is allowed only as framework-required or tiny unstyled semantic glue. Any repeated structure should move into `src/components/ui/**` or a domain component.

This is strict by design. It keeps future pages readable and prevents route files from becoming a mix of data loading, semantic markup, DaisyUI classes, and one-off Tailwind utilities.

### 5.4 Typography Through Text And Heading

Decision: pages use `Text`, not raw `h1`, `p`, `span`, or Tailwind typography classes.

The UI library should provide:

- `Text`: general public typography component for app usage.
- `Heading`: optional lower-level component when document hierarchy must be explicit.

`Text` should support heading variants and render semantic tags by default:

- `variant="h1"` renders `h1` by default.
- `variant="h2"` renders `h2` by default.
- `variant="body"` renders `p` by default.
- `variant="caption"` renders a suitable inline or block element based on the component contract.

`as` may be allowed when visual hierarchy and document hierarchy differ:

```tsx
<Text variant="h1" as="h2">Recently Added</Text>
```

This keeps route files semantic without requiring them to write raw heading tags.

### 5.5 Two-Layer Layout Component Model

Decision: use both small layout primitives and page-level primitives.

Small primitives keep implementation flexible. Page primitives create a clean public writing experience for routes. Do not choose between them.

The first-release app should bias route files toward page-level primitives. Small primitives are still useful in reusable components and local composition.

### 5.6 Token Props Instead Of Raw Classes

Decision: token props are the styling API.

Examples:

```tsx
<Stack gap="sm" padding="md">
<Grid columns="sidebar" gap="lg">
<Panel tone="base" padding="sm">
<Inline align="center" justify="between">
```

Rejected for normal app usage:

```tsx
<Stack className="gap-6 p-4">
<Panel className="rounded-xl border border-base-300">
```

Use `unstable_className` only as a temporary or exceptional escape hatch.

### 5.7 Server-Safe Buttons And Semantic Links

Decision: buttons and links stay semantically distinct.

Components:

- `Button`: renders native `button`; server-safe by default; supports visual variants and standard button props.
- `LinkButton`: renders a navigation link styled through the same visual style system.
- `AriaButton`: client-only React Aria button for `onPress`, pending state, normalized interactions, and advanced accessibility behavior.

Do not use a button for navigation. Do not use a link for an action.

### 5.8 React Aria For Client Behavior

Decision: use React Aria Components for complex client interactions.

Use React Aria for:

- `Menu`
- `Popover`
- `Toast`
- `Select`
- `ComboBox`
- `SearchField`
- modal/dialog behavior if needed later
- keyboard-navigable composite widgets

Style these components with DaisyUI semantic classes and Tailwind utilities inside wrappers. React Aria owns behavior and accessibility state; DaisyUI/Tailwind own visual expression.

Rejected for v1:

- Reimplementing menu, toast, select, or popover keyboard behavior manually.
- Using DaisyUI-only dropdowns for all menus where keyboard behavior, focus management, or screen reader behavior matters.

### 5.9 Global Light And Dark Themes

Decision: support exactly two global themes in v1.

Themes:

- `lumina-light`
- `lumina-dark`

The initial layout can set `data-theme="lumina-light"` on `<html>`. A future theme switcher can update that attribute with a tiny client boundary.

Rejected for v1:

- Many built-in DaisyUI themes.
- Nested themed regions.
- Per-component theme overrides.

### 5.10 Direct Lucide Imports In v1

Decision: use `lucide-react` direct imports in v1.

Do:

```tsx
import { Search } from "lucide-react";
```

Component rules:

- Decorative icons use `aria-hidden`.
- Icon-only buttons and links require an accessible label.
- Components standardize icon sizing locally, usually matching `size-4`, `size-5`, or DaisyUI compact button rhythm.

Rejected for v1:

- Generic `Icon name="search"` registry. It is unnecessary until icon usage becomes large or dynamic.

### 5.11 Single Root Layout And Global AppShell In v1

Decision: start with one root layout and one global shell.

The first implementation should not introduce route groups or multiple root layouts. The current product direction is still open, and a single shell keeps the initial architecture easier to revise.

Future route groups are acceptable when real product surfaces require different shells.

### 5.12 Deferred Enforcement Skill And ESLint Rules

Decision: document strict composition rules now, enforce later.

Do not add custom ESLint rules in v1. Do not create a Codex skill in this document. A later request may create a skill that teaches future agents to follow this UI architecture.

The document should be the first enforcement mechanism. Code review should reject repeated raw HTML, raw Tailwind classes, and unreviewed `unstable_className` in route files.

## 6. Proposed File Model

Recommended first-release file tree:

```txt
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    app-shell/
      AppShell.tsx
      Topbar.tsx
      Sidebar.tsx
      MobileDock.tsx
      navigation.ts
      index.ts
    ui/
      actions/
        Button.tsx
        LinkButton.tsx
        AriaButton.tsx
        index.ts
      feedback/
        Toast.tsx
        index.ts
      forms/
        SearchField.tsx
        TextField.tsx
        Select.tsx
        index.ts
      layout/
        Stack.tsx
        Inline.tsx
        Grid.tsx
        Columns.tsx
        Container.tsx
        Panel.tsx
        Spacer.tsx
        index.ts
      navigation/
        Menu.tsx
        Popover.tsx
        index.ts
      page/
        Page.tsx
        PageHeader.tsx
        PageBody.tsx
        PageSection.tsx
        index.ts
      theme/
        ThemeScript.tsx
        index.ts
      typography/
        Text.tsx
        Heading.tsx
        index.ts
      index.ts
  lib/
    ui/
      classes.ts
      tokens.ts
      variants.ts
```

Notes:

- `src/lib/ui/tokens.ts` should hold token maps and TypeScript unions.
- `src/lib/ui/classes.ts` should hold minimal class composition helpers.
- Components may use DaisyUI class strings internally.
- Client files must include `"use client"` only when required.
- Barrel exports should not accidentally import client components into server-only components if that causes bundle or boundary issues. If needed, split `client.ts` and `server.ts` exports later.

## 7. Implementation Strategy

Recommended sequence:

1. Add dependencies and global CSS.
2. Add DaisyUI themes and import CSS from the root layout.
3. Add token maps and class composition helpers.
4. Add server-safe typography, layout, panel, button, and link components.
5. Add narrow client-only React Aria wrappers for overlays, menu, toast, and interactive controls.
6. Add AppShell, Topbar, Sidebar, and MobileDock using the compact Lumina shell spec.
7. Convert `src/app/layout.tsx` to use global theme and AppShell.
8. Convert `src/app/page.tsx` from raw `<h1>` to page composition.
9. Add focused tests and manual smoke checks.

This order prevents the shell from forcing ad hoc components before the core primitives exist.

## 8. Detailed Implementation Plan

### 8.1 Styling Foundation

Current problem:

- There is no Tailwind or DaisyUI setup.
- There is no `src/app/globals.css`.
- DaisyUI theme values exist only in generated JSON.

Target behavior:

- `src/app/globals.css` imports Tailwind and DaisyUI using Tailwind v4 CSS-first syntax.
- `lumina-light` and `lumina-dark` are defined through `@plugin "daisyui/theme"`.
- `src/app/layout.tsx` imports `./globals.css` and sets the initial global theme.

Implementation tasks:

- [ ] Install `tailwindcss`, `@tailwindcss/postcss` if required by the Next.js setup, `daisyui`, `react-aria-components`, and `lucide-react`.
- [ ] Add `src/app/globals.css`.
- [ ] Define `lumina-light` and `lumina-dark`.
- [ ] Add global body defaults only when they cannot be handled by DaisyUI theme classes.
- [ ] Keep any Tailwind config file out of v1 unless the implementation proves it is required.

Tests:

- `pnpm lint`
- `pnpm test`
- `pnpm build`
- Manual browser check that DaisyUI classes render and `data-theme` applies.

### 8.2 Tokens And Class Composition

Current problem:

- There is no typed token layer for spacing, size, tone, variant, or layout.

Target behavior:

- Components share token maps instead of duplicating class strings.
- Token props are typed and intentionally limited.

Implementation tasks:

- [ ] Add `src/lib/ui/tokens.ts` with token unions such as `SpacingToken`, `SizeToken`, `ToneToken`, `AlignToken`, `JustifyToken`, and `WidthToken`.
- [ ] Add `src/lib/ui/classes.ts` with a small `cx` helper or use a small dependency if the project prefers one later.
- [ ] Add `src/lib/ui/variants.ts` for reusable DaisyUI class maps such as button variants, panel tones, text variants, and layout spacing.
- [ ] Do not expose raw `className` as the normal component customization API.

Tests:

- TypeScript coverage through `pnpm lint`.
- Component tests should verify important class outputs only where the contract matters.

### 8.3 Typography Components

Current problem:

- `src/app/page.tsx` uses raw `<h1>`.
- There is no typography contract.

Target behavior:

- Pages use `Text` for typography.
- `Text` and `Heading` render semantic tags internally.

Implementation tasks:

- [ ] Add `src/components/ui/typography/Text.tsx`.
- [ ] Add `src/components/ui/typography/Heading.tsx` if explicit heading-level control needs to be separate from `Text`.
- [ ] Support variants: `h1`, `h2`, `h3`, `body`, `caption`, `label`, `sectionLabel`, and `brand`.
- [ ] Support `as` for semantic override.
- [ ] Internally map typography to DaisyUI/Tailwind classes from the Lumina spec.

Tests:

- Render `Text variant="h1"` and assert it renders an `h1` by default.
- Render `Text variant="h1" as="h2"` and assert it renders an `h2`.
- Verify no route test relies on raw heading implementation details except accessible names.

### 8.4 Layout Primitives

Current problem:

- There are no layout primitives.
- Route files would need raw layout HTML and classes if development began now.

Target behavior:

- Layout structure is expressed through components with token props.

Implementation tasks:

- [ ] Add `Stack`, `Inline`, `Grid`, `Columns`, `Container`, `Panel`, and `Spacer`.
- [ ] Support token props such as `gap`, `padding`, `align`, `justify`, `columns`, `width`, and `tone`.
- [ ] Add `unstable_className` only on low-level primitives.
- [ ] Keep DaisyUI and Tailwind classes inside these components.
- [ ] Avoid nested card visual patterns unless a repeated item, modal, or framed tool requires a card.

Tests:

- Render each primitive with representative token props.
- Verify unsupported arbitrary class APIs are not present on normal public props.
- Manual viewport smoke for compact spacing and no text overlap.

### 8.5 Action Components

Current problem:

- No server-safe action components exist.

Target behavior:

- `Button` renders a native button.
- `LinkButton` renders a navigation link.
- Both share visual variant maps.
- Client-only normalized press behavior lives in `AriaButton`.

Implementation tasks:

- [ ] Add `src/components/ui/actions/Button.tsx`.
- [ ] Add `src/components/ui/actions/LinkButton.tsx`.
- [ ] Add `src/components/ui/actions/AriaButton.tsx` with `"use client"`.
- [ ] Use DaisyUI classes such as `btn`, `btn-sm`, `btn-primary`, `btn-ghost`, `btn-square`, and `btn-circle` internally.
- [ ] Require accessible labels for icon-only buttons through prop design or runtime development checks.

Tests:

- Verify `Button` renders `button`.
- Verify `LinkButton` renders link semantics.
- Verify `AriaButton` supports `onPress` in a client test.

### 8.6 React Aria Client Components

Current problem:

- There is no accessible client behavior layer.

Target behavior:

- Menus, popovers, toasts, selects, and search behavior use React Aria wrappers when interaction complexity requires it.

Implementation tasks:

- [ ] Add `Menu`, `MenuItem`, `MenuSection`, `MenuTrigger`, and `MenuSeparator`.
- [ ] Add shared `Popover`.
- [ ] Add `ToastRegion`, `toastQueue`, and toast item styling.
- [ ] Add `SearchField` only if the shell search needs clear button, keyboard handling, or suggestions.
- [ ] Style React Aria states with DaisyUI semantic classes and Tailwind data attribute modifiers.
- [ ] Keep client wrappers narrow and do not convert page-level components to client components unless required.

Tests:

- Use Testing Library user interactions for menu opening, item action, and keyboard navigation where practical.
- Verify toast region renders with close button sibling to content.
- Manual keyboard checks: tab, escape, arrow keys, focus visible.

### 8.7 App Shell Components

Current problem:

- The root layout has no shell.
- `ui-specs.json` shell guidance is not implemented.

Target behavior:

- App shell follows compact Lumina DaisyUI rhythm.
- Desktop uses DaisyUI `drawer lg:drawer-open`.
- Topbar uses compact `navbar`.
- Sidebar uses `menu menu-sm`.
- Mobile uses `dock dock-sm`.

Implementation tasks:

- [ ] Add `src/components/app-shell/AppShell.tsx`.
- [ ] Add `Topbar.tsx`, `Sidebar.tsx`, `MobileDock.tsx`, and `navigation.ts`.
- [ ] Keep topbar height compact: desktop `h-14`, mobile `h-16`.
- [ ] Keep desktop sidebar width near `17rem`.
- [ ] Keep icon-only actions as compact square buttons with accessible labels.
- [ ] Render shell landmarks: `header`, `nav`, and `main` inside components.
- [ ] Ensure active nav items set `aria-current="page"`.

Tests:

- Render layout and verify landmarks.
- Verify mobile dock items have accessible names.
- Manual desktop/mobile viewport smoke.

### 8.8 Route Composition

Current problem:

- The home route uses raw `<h1>`.

Target behavior:

- `src/app/page.tsx` composes page-level primitives and mock content.
- No raw visual layout HTML or Tailwind classes appear in the route file.

Implementation tasks:

- [ ] Replace raw `<h1>` with `Page`, `PageHeader`, `Text`, `PageBody`, and mock content components.
- [ ] Keep any repeated mock content structure in a named component rather than inline raw layout.
- [ ] Update tests to assert user-visible behavior rather than raw tags where possible.

Tests:

- `tests/app/page.test.tsx`
- `pnpm test`

### 8.9 Tests And Documentation

Current problem:

- No UI-system tests or usage docs exist.

Target behavior:

- Tests protect core semantics and basic rendering.
- Documentation explains page composition rules.

Implementation tasks:

- [ ] Update `README.md` or add a short `docs/002_ui_usage_examples.md` later if examples grow.
- [ ] Add component tests for typography, layout primitives, actions, and shell landmarks.
- [ ] Keep this document as the architecture source until a future skill or lint rules exist.

Tests:

- `pnpm lint`
- `pnpm test`
- `pnpm build`

## 9. Migration And Rollout

No data migration is required.

Rollout order:

1. Foundation dependencies and CSS.
2. Theme definitions.
3. UI primitives.
4. Client interaction wrappers.
5. App shell.
6. Route conversion.
7. Tests and smoke checks.

Rollback:

- Since the project is fresh, rollback is mainly git revert of the implementation commits.
- Keep changes staged or committed by workstream so visual foundation, primitives, shell, and page conversion can be reviewed separately.

Deployment considerations:

- The project has OpenNext Cloudflare scripts. Run `pnpm build` before any deployment-oriented work.
- Avoid browser-only code in server components because Cloudflare/Next server execution will fail if client APIs leak into server modules.

## 10. Edge Cases And Failure Modes

- Tailwind v4 plugin setup fails: verify whether the project needs `@tailwindcss/postcss` or framework-specific PostCSS configuration, then add only the minimum required file.
- DaisyUI theme values produce poor contrast: adjust theme tokens, not individual component colors, unless the bug is isolated to one component state.
- Route files start using raw Tailwind classes: reject in code review and promote repeated needs into token props or components.
- `unstable_className` spreads across the app: convert repeated classes into a token, variant, or dedicated component.
- A component needs client behavior but is imported by a server component: split server and client exports, or move the client boundary lower.
- React Aria component styling conflicts with DaisyUI defaults: keep React Aria behavior, then tune wrapper classes and state selectors.
- Button/link semantics are blurred: use `Button` for actions, `LinkButton` for navigation, and `AriaButton` for client press behavior.
- Icon-only action lacks label: component API should require `aria-label` or `label` for icon-only variants.
- Mobile bottom dock overlaps content: `AppShell` or `PageBody` must reserve bottom padding on mobile.
- Sidebar drawer traps or loses focus incorrectly: prefer React Aria for complex focus behavior if DaisyUI checkbox drawer is insufficient.
- Toast auto-dismiss is too fast: React Aria docs recommend at least 5 seconds and avoiding auto-dismiss for critical information.
- Multiple themes become hard to test: keep v1 to two global themes.
- Page heading hierarchy differs from visual hierarchy: use `Text variant="h1" as="h2"` or `Heading` with explicit level.
- DaisyUI `dock` availability or API changes: verify installed DaisyUI version during implementation; fall back to the documented DaisyUI mobile nav pattern only if required.

## 11. Test And Verification Plan

Automated checks:

- `pnpm lint`
- `pnpm test`
- `pnpm build`

Component tests:

- Typography renders expected semantics and text.
- Layout primitives apply tokenized class contracts.
- `Button` and `LinkButton` preserve correct semantics.
- `AriaButton` supports React Aria press behavior.
- App shell exposes expected landmarks and accessible nav labels.
- Active navigation items use `aria-current="page"`.

Manual checks:

- Desktop viewport: sidebar visible, topbar compact, content starts below topbar, no oversized shell spacing.
- Tablet viewport: drawer behavior does not break layout.
- Mobile viewport: topbar compact, dock visible, content not hidden behind dock.
- Keyboard: tab order reaches nav, search, actions, content, and dock in a logical order.
- Escape closes menu/popover/toast where applicable.
- Focus-visible styles are visible and use theme tokens.
- Theme: `lumina-light` and `lumina-dark` both render readable text, controls, borders, and focus states.

## 12. Implementation Backlog

### R1-A. Install Styling And Interaction Dependencies

Scope:

- `package.json`
- `pnpm-lock.yaml`

Tasks:

- [ ] Install Tailwind CSS v4, DaisyUI v5, React Aria Components, and Lucide React.
- [ ] Add the minimum PostCSS integration required by Next.js and Tailwind v4, if needed.
- [ ] Do not add a Tailwind config file unless implementation proves it is necessary.

Acceptance criteria:

- Dependencies are present and lockfile is updated.
- `pnpm lint` still runs.

Tests:

- `pnpm lint`

### R1-B. Add Global CSS And DaisyUI Themes

Scope:

- `src/app/globals.css`
- `src/app/layout.tsx`

Tasks:

- [ ] Add global CSS with Tailwind and DaisyUI plugin directives.
- [ ] Define `lumina-light` and `lumina-dark` DaisyUI themes.
- [ ] Import global CSS in the root layout.
- [ ] Set initial global `data-theme` on `<html>`.

Acceptance criteria:

- DaisyUI classes work in the app.
- The root document carries a global Lumina theme.
- No Tailwind config file exists unless justified.

Tests:

- `pnpm build`
- Manual browser theme smoke.

### R1-C. Add Token And Class Utilities

Scope:

- `src/lib/ui/tokens.ts`
- `src/lib/ui/classes.ts`
- `src/lib/ui/variants.ts`

Tasks:

- [ ] Add typed token unions.
- [ ] Add class composition helper.
- [ ] Add reusable variant maps for typography, layout, panels, and actions.

Acceptance criteria:

- Components can be built with typed tokens rather than raw app-level class strings.
- Token maps cover the first AppShell and page primitive needs.

Tests:

- `pnpm lint`

### R1-D. Add Typography Components

Scope:

- `src/components/ui/typography/Text.tsx`
- `src/components/ui/typography/Heading.tsx`
- `src/components/ui/typography/index.ts`

Tasks:

- [ ] Implement `Text`.
- [ ] Implement `Heading` if separate heading-level control is useful.
- [ ] Support semantic default tags and `as` override.
- [ ] Map variants to Lumina typography.

Acceptance criteria:

- Route files can express headings and body copy without raw `h1`, `p`, or `span`.

Tests:

- Typography component tests.
- `pnpm test`

### R1-E. Add Layout Primitives

Scope:

- `src/components/ui/layout/**`

Tasks:

- [ ] Implement `Stack`, `Inline`, `Grid`, `Columns`, `Container`, `Panel`, and `Spacer`.
- [ ] Use tokenized props.
- [ ] Expose `unstable_className` only where deliberately useful.

Acceptance criteria:

- Route files can compose page layout without raw `div`, `main`, `section`, Tailwind classes, or DaisyUI classes.

Tests:

- Layout primitive component tests.
- Manual responsive smoke.

### R1-F. Add Button And LinkButton

Scope:

- `src/components/ui/actions/Button.tsx`
- `src/components/ui/actions/LinkButton.tsx`
- `src/components/ui/actions/index.ts`

Tasks:

- [ ] Implement server-safe `Button`.
- [ ] Implement server-safe `LinkButton`.
- [ ] Share visual variants.
- [ ] Keep action and navigation semantics distinct.

Acceptance criteria:

- Actions use `Button`.
- Navigation styled like a button uses `LinkButton`.
- Neither requires React Aria by default.

Tests:

- Action component tests.

### R1-G. Add React Aria Interactive Components

Scope:

- `src/components/ui/actions/AriaButton.tsx`
- `src/components/ui/navigation/Menu.tsx`
- `src/components/ui/navigation/Popover.tsx`
- `src/components/ui/feedback/Toast.tsx`
- `src/components/ui/forms/SearchField.tsx`

Tasks:

- [ ] Implement client-only `AriaButton`.
- [ ] Implement `Menu` and `Popover` wrappers.
- [ ] Implement root `ToastRegion` and exported queue.
- [ ] Implement `SearchField` only if needed for shell search behavior.
- [ ] Style state with DaisyUI/Tailwind classes.

Acceptance criteria:

- Interactive components use React Aria behavior and local DaisyUI-compatible styling.
- Client boundaries are narrow and explicit.

Tests:

- Interaction tests for menu/button/toast where practical.
- Keyboard manual smoke.

### R1-H. Add AppShell, Topbar, Sidebar, And Mobile Dock

Scope:

- `src/components/app-shell/**`

Tasks:

- [ ] Implement `AppShell`.
- [ ] Implement `Topbar`.
- [ ] Implement `Sidebar`.
- [ ] Implement `MobileDock`.
- [ ] Add navigation model in `navigation.ts`.
- [ ] Use compact DaisyUI shell classes internally.

Acceptance criteria:

- Desktop shell has persistent sidebar and compact topbar.
- Mobile shell has compact topbar and bottom dock.
- Shell landmarks and accessible labels exist.

Tests:

- Shell rendering tests.
- Manual desktop/tablet/mobile smoke.

### R1-I. Convert Root Layout And Home Page To Composition

Scope:

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `tests/app/page.test.tsx`

Tasks:

- [ ] Wrap app content with `AppShell`.
- [ ] Convert home page to `Page`, `PageHeader`, `PageBody`, `Text`, and componentized mock content.
- [ ] Remove raw route-level typography and visual layout markup.
- [ ] Update tests.

Acceptance criteria:

- `src/app/page.tsx` is a composition boundary.
- No raw visual Tailwind or DaisyUI classes appear in the route file.
- Raw HTML in route files is absent or limited to unstyled framework glue.

Tests:

- `pnpm test`
- `pnpm lint`

### R1-J. Add Focused Tests And Manual Smoke Checks

Scope:

- `tests/**`
- component tests as needed

Tasks:

- [ ] Add tests for typography, layout, actions, shell, and key React Aria interactions.
- [ ] Run build and test commands.
- [ ] Manually verify compact shell in desktop and mobile viewports.

Acceptance criteria:

- Core semantics and shell behavior are covered.
- Manual smoke confirms no obvious layout overlap or inaccessible shell controls.

Tests:

- `pnpm lint`
- `pnpm test`
- `pnpm build`

## 13. Future Backlog

- Create a Codex skill that enforces this UI architecture for future agent work.
- Add custom ESLint rules or repository checks for no raw visual HTML/classes in route files.
- Add Storybook or a local component preview route once the component library grows.
- Add a theme switcher and persisted user theme preference.
- Add route groups and multiple root layouts only after real product surfaces require different shells.
- Add a generic icon registry only if direct Lucide imports become repetitive or dynamic.
- Add more React Aria wrappers such as `Dialog`, `Tabs`, `ComboBox`, `Table`, and `ListBox` when product use cases appear.
- Add visual regression tests after the shell stabilizes.
- Add accessibility automation with axe or Playwright if the UI surface becomes large.
- Revisit nested themes if embedded or branded sections become a real requirement.

## 14. Definition Of Done

The v1 UI foundation is done when:

- Tailwind v4 and DaisyUI v5 are configured through CSS-first setup.
- `lumina-light` and `lumina-dark` are defined and globally applied.
- Route files use composition boundaries and no longer author visual layout directly.
- `Text` handles route-level typography.
- Layout primitives expose token props and hide raw layout classes.
- `Button`, `LinkButton`, and `AriaButton` preserve semantic distinctions.
- React Aria wrappers exist for the first required interactive components.
- `AppShell`, `Topbar`, `Sidebar`, and `MobileDock` implement the compact Lumina shell.
- `src/app/page.tsx` demonstrates the intended app-writing model.
- `pnpm lint`, `pnpm test`, and `pnpm build` pass.
- Desktop and mobile manual smoke checks pass.
- Any use of `unstable_className` is rare, explained, and absent from route files unless unavoidable.

## 15. Final Model

The intended Lumina UI architecture is a local application library.

DaisyUI provides semantic visual primitives and themes. Tailwind provides utility-level implementation detail inside the library. React Aria provides accessible behavior for client-only interactive components. Next.js App Router provides server-first composition, root layout, app shell structure, and future route-level performance features.

Application routes should read as product composition, not as visual markup. Future pages should assemble `Page`, `PageHeader`, `PageBody`, `Text`, layout primitives, shell-aware components, and domain components. They should not draw rectangles, set spacing, choose DaisyUI classes, or hand-author headings unless a documented exception applies.
