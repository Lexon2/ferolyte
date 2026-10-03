---
'@ferolyte/cli': minor
---

Game hub and plugin API 1.2.0 (additive; plugins declaring `1.1.0` keep working):

- `minecraft.onReload` (`{ trigger, clientId, ok, message, at, seq }`), `GET /status` `lastReload`/`connected`, and the `afterScriptBuild({ profile, ok })` plugin hook.
- HTTP routes: prefix routes (`/api/*`, exact wins), `request.headers` and an abort `request.signal`, the explicit `httpResponse(status, body?)` envelope (exported from `@ferolyte/cli/plugin`), `/subscribe` accepts `event`, `/events?limit`. `route()` replacing an existing route is documented and logged once per path (`--verbose`).
- Every frame the hub sends carries `messageType: 'commandRequest'`; `--verbose` logs the raw body of the first `PlayerMessage` per connection and unmatched `commandResponse` frames.
- `server.clientPolicy` (`'newest'` | `'oldest'`) and `minecraft.primaryClientId`. **Behaviour change:** commands without a `clientId` now go to the newest connection by default (set `clientPolicy: 'oldest'` for the previous behaviour).
- `MinecraftCommandResult.body` (raw response body) and `minecraft.onCommand` for every command, including the internal reload.
- `server` (effective port, HTTP address, `reloadOnPackChange`, `clientPolicy`) on `AfterLoadEvent` / `WatchReadyEvent`, undefined outside `watch`.
- `minecraft.onChat`: normalised chat lines (`{ clientId, sender, type, text }`) sharing the `PlayerMessage` subscription.
