# React Native Music Library

This context describes the language for a React Native library that exposes a user's local music collection to app code. It exists so product-facing concepts stay distinct from platform implementation details.

## Language

**Local Music Library**:
The user's on-device or platform-managed collection of playable audio items.
_Avoid_: file system, storage, playlist

**Track**:
A playable audio item in the **Local Music Library**.
_Avoid_: song, file, media item

**Album**:
A named release grouping one or more **Tracks**.
_Avoid_: collection, folder

**Artist**:
A credited performer used to group **Tracks** and **Albums**.
_Avoid_: author, creator

**Track Metadata**:
Detailed descriptive and technical information for one **Track**.
_Avoid_: full metadata, tag dump

**Library Metadata**:
Metadata supplied by the **Local Music Library** catalog for a **Track**, **Album**, or **Artist**.
_Avoid_: database metadata

**Embedded Metadata**:
Metadata stored inside a **Track**'s audio resource.
_Avoid_: raw tags, file metadata

**Lyrics**:
Text associated with a **Track**, either from **Embedded Metadata** or from the **Local Music Library**.
_Avoid_: subtitles, transcript

**Artwork Reference**:
A string reference that app code can use to locate artwork for a **Track** or **Album**.
_Avoid_: image, cover data

**Cursor**:
The identifier used to continue a paginated list after a specific **Track**, **Album**, or **Artist**.
_Avoid_: offset, page number

## Relationships

- A **Local Music Library** contains zero or more **Tracks**
- A **Track** may belong to zero or one **Album**
- An **Album** contains one or more **Tracks**
- An **Artist** may be credited on zero or more **Tracks**
- A **Track** has **Library Metadata** and may have **Embedded Metadata**
- **Track Metadata** may combine **Library Metadata** and **Embedded Metadata**
- A **Track** or **Album** may have zero or one **Artwork Reference**
- A **Cursor** points to one **Track**, **Album**, or **Artist** in a paginated list

## Example dialogue

> **Dev:** "When app code asks for **Track Metadata**, should **Lyrics** come from the library catalog or the audio resource?"
> **Domain expert:** "Both are valid sources. Prefer the best available **Library Metadata**, then fill gaps from **Embedded Metadata** when the platform exposes the resource."

## Flagged ambiguities

- "metadata" is ambiguous: use **Library Metadata** for catalog-provided values, **Embedded Metadata** for audio-resource values, and **Track Metadata** for the public result that may combine both.
- "song" is user-facing shorthand, but the project term is **Track** because not every playable audio item is necessarily a song.
