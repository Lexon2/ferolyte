# @artifex/common

Shared utilities and content foundation for the Artifex framework.

This package provides TypeScript types, content validation, diagnostic reporting, object utilities, and small data structures used by `@artifex/pack` and `@artifex/cli`.

## Installation

```bash
npm install @artifex/common
```

This package is usually installed as a transitive dependency of `@artifex/pack` or `@artifex/cli`. Install it directly when building custom tooling on top of Artifex.

**Requirements:** Node.js >= 18

## Feature scope

### Types

| Export              | Path                                                | Description                                            |
| ------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| `Identifier`        | `@artifex/common/types/core/identifier`             | Typed `namespace:id` string for Minecraft content IDs  |
| `RequireAtLeastOne` | `@artifex/common/types/object/require-at-least-one` | Utility type requiring at least one key from an object |
| `OneOfRecord`       | `@artifex/common/types/core/one-of-record`          | Discriminated union of single-key records              |
| `IntRange`          | `@artifex/common/types/number/int-range`            | Compile-time integer range type                        |

### Content foundation

| Export             | Path                                                 | Description                                                                   |
| ------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| `ContentBuilder`   | `@artifex/common/content/interfaces/content-builder` | Contract for Artifex content modules (`metadata`, `cloneConfig()`, `build()`) |
| `CONTENT_METADATA` | `@artifex/common/content/metadata`                   | Tags for item, block, server-entity, client-entity content types              |

### Diagnostics

Structured validation error reporting with file links, field paths, and content-type labels.

| Export                                                        | Path                                                     |
| ------------------------------------------------------------- | -------------------------------------------------------- |
| `ContentDiagnosticContext`, `ContentType`, `ContentSection`   | `@artifex/common/content/diagnostics/content-diagnostic` |
| `buildFieldPath`, `createFileLink`, `logContentError`         | `@artifex/common/content/diagnostics/content-diagnostic` |
| `withFieldPath`, `withComponentContext`, `withSectionContext` | `@artifex/common/content/diagnostics/content-diagnostic` |

### Validation

Type-guard validators that log via `logContentError` on failure:

- `validateBooleanValue`, `validateNonEmptyString`, `validateString`
- `validatePositiveNumber`, `validateNonNegativeNumber`, `validateNumber`
- `validateIntegerRange`, `validateNumberRange`, `validateAllowedValue`
- `validateNonEmptyArray`, `validateNonEmptyStringArray`
- `validateDamageSourceArray`, `validateVector3`, `validateCustomComponentIds`

Import from `@artifex/common/content/validation/content-validation`.

### Content tools

| Export  | Path                                  | Description                                        |
| ------- | ------------------------------------- | -------------------------------------------------- |
| `Float` | `@artifex/common/content/tools/float` | Serializes floats for JSON round-trip during build |

### Minecraft types

| Export              | Path                                                 | Description                         |
| ------------------- | ---------------------------------------------------- | ----------------------------------- |
| `MinecraftPackType` | `@artifex/common/content/types/minecraft-pack-types` | `'BP' \| 'RP'` pack type            |
| `DamageSourceType`  | `@artifex/common/content/types/damage-source`        | Union of 37 Minecraft damage causes |

### Object utilities

| Export           | Path                                     | Description                         |
| ---------------- | ---------------------------------------- | ----------------------------------- |
| `deepMerge`      | `@artifex/common/object/deep-merge`      | Recursive merge; arrays concatenate |
| `cartesianMerge` | `@artifex/common/object/cartesian-merge` | Cartesian product of option objects |

### Data structures

| Export                                     | Path                                                | Description                |
| ------------------------------------------ | --------------------------------------------------- | -------------------------- |
| `ArrayQueue`, `createArrayQueue`           | `@artifex/common/data-structures/array-queue`       | Simple array-backed queue  |
| `RingBufferQueue`, `createRingBufferQueue` | `@artifex/common/data-structures/ring-buffer-queue` | Fixed-capacity ring buffer |

### Shapes

| Export                   | Path                                             | Description                                               |
| ------------------------ | ------------------------------------------------ | --------------------------------------------------------- |
| `createDiamondLocations` | `@artifex/common/shape/create-diamond-locations` | Horizontal diamond of `Vector3` positions around a center |

## License

MIT — Copyright (c) 2024 Lexon2. See [LICENSE](../../LICENSE) for the full text.
