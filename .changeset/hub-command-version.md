---
'@ferolyte/cli': minor
---

**Hub commands use the current command syntax.** The hub sent every command with `body.version: 1` (legacy syntax), so `sendCommand('execute as @p run say hi')` failed with `Syntax error: Unexpected "@p"`. The default is now the current syntax (`17039360`); the new profile option `server.commandVersion` sets another value (also reported to plugins in the effective `server` info). `commandVersion` is additive for plugins.

### Behaviour change

Plugins and scripts that send commands in the legacy syntax (`execute @p ~ ~ ~ say hi`) must set `server.commandVersion: 1`. Ferolyte's own commands (`reload`, `tellraw`, `scriptevent`) are valid under both versions.
