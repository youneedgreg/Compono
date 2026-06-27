# Compono — Flutter Preview (experimental)

Compono's React builder produces a list of field configs (`type`, `label`,
`placeholder`, `required`, `options`) that the web app currently renders as
HTML/JSX. This is a small standalone Flutter app that takes the same shape
of config and renders it as native widgets (`TextFormField`,
`DropdownButtonFormField`, `CheckboxListTile`, …) instead — a proof of
concept for a Flutter export target alongside the existing React/HTML one.

It's intentionally minimal: one schema, one screen, no builder UI. The
point is the renderer (`_buildField` in `lib/main.dart`), not a full app.

## Run

```bash
cd flutter_preview
flutter pub get
flutter run
```

## Why this exists

Tracked as a roadmap item for Compono: a JSON-schema-driven component model
shouldn't be locked to one rendering target. This validates that the same
field configs used by the React builder map cleanly onto Flutter widgets.
