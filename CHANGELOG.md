# Changelog

Все заметные изменения документируются в этом файле. Проект следует [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed

- Added TypeScript path mapping for the playground source alias.
- Made npm child-process scripts reliable on Windows by invoking the active npm CLI through Node.js.
- Made `UiSelect` close synchronously after a keyboard selection while restoring focus on the next tick.
- Added explicit build-output validation and defensive `npm pack --json` parsing.

### Changed

- Unicode-символы очистки, раскрытия и выбора заменены на внутренние SVG-иконки.
- Размеры контролов настраиваются через font-size и padding-токены без density API.

### Planned

- Positioning adapter для select menu без изменения public API.

## [0.1.0] - 2026-07-22

### Added

- `UiButton`, `UiInput`, `UiTextarea`, `UiSelect`.
- Светлая, тёмная и системная темы.
- Root/direct exports, CSS entry и TypeScript declarations.
- Unit tests, playground, packed-package consumer test.
- Bundle budgets, package validation, CI и OIDC publish workflow.
