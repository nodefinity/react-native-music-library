## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for `nodefinity/react-native-music-library`. See `docs/agents/issue-tracker.md`.

### Triage labels

The repo uses the default triage label vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo: use root `CONTEXT.md` and root `docs/adr/` when they exist. See `docs/agents/domain.md`.

## Repository layout

- `src/` — TypeScript public interface, TurboModule spec, option normalization, web fallback, and JS-level tests.
- `ios/` — iOS native implementation. `MusicLibrary.mm` is the Objective-C++ TurboModule bridge; Swift files under `tracks/`, `albums/`, `artists/`, `models/`, and `utils/` implement MediaPlayer/AVFoundation access and data conversion.
- `android/` — Android native implementation. Kotlin modules under `tracks/`, `albums/`, `artists/`, `models/`, and `utils/` implement MediaStore access, metadata reading, permissions, and React Native conversion.
- `example/` — React Native example app used for manual verification of library behavior across screens such as track lists, player, and lyrics.
- `docs/` — Docusaurus documentation site for public usage docs.
- `docs/agents/` — Agent setup notes for issue tracking, triage labels, and domain-doc consumption.
