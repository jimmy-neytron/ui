# Changelog

Все заметные изменения документируются в этом файле. Проект следует [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Added automatically generated source panels and clipboard actions to every documentation example.
- Added UiAlert, UiCard, UiProgress, and UiSpinner with typed direct exports.
- Expanded the suite to 150 unit tests covering public props, slots, events, accessibility, protected states, and edge cases.
- Enforced coverage thresholds in local checks and CI: 100% statements/lines/functions and 99% branches.

### Fixed

- Anchored the UiSelect dropdown to its control so hint and error rows no longer push the menu downward.
- Added TypeScript path mapping for the playground source alias.
- Made npm child-process scripts reliable on Windows by invoking the active npm CLI through Node.js.
- Made `UiSelect` close synchronously after a keyboard selection while restoring focus on the next tick.
- Added explicit build-output validation and defensive `npm pack --json` parsing.

### Changed

- Unicode-символы очистки, раскрытия и выбора заменены на внутренние SVG-иконки.
- Размеры контролов настраиваются через font-size и padding-токены без density API.

### Planned

- Positioning adapter для select menu без изменения public API.


## [0.2.1] - 2026-07-23

### Added

- `UiCheckbox` with controlled, indeterminate, disabled, required, description, and size states.
- `UiRadio` with typed string/number values and native group semantics.
- `UiSwitch` with native checkbox behavior and the accessible switch role.
- `UiBadge` with tones, variants, sizes, dot, and leading content.
- Direct package exports and bundle budgets for every new component.
- Unit tests and searchable documentation pages for the new public API.
- Interactive documentation for local theme and component-token overrides.

### Changed

- Expanded the public CSS token hierarchy for choices, switches, and badges.
- Updated the package and documentation version to `0.2.1`.

## [0.1.0] - 2026-07-22

### Added

- Added automatically generated source panels and clipboard actions to every documentation example.
- `UiButton`, `UiInput`, `UiTextarea`, `UiSelect`.
- Светлая, тёмная и системная темы.
- Root/direct exports, CSS entry и TypeScript declarations.
- Unit tests, playground, packed-package consumer test.
- Bundle budgets, package validation, CI и OIDC publish workflow.
