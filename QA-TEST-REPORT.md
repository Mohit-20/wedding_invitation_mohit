# V15 QA report — Open Invitation fix

## Correction to V14
V14 still contained the original declaration-order bug. The attempted edit had not moved `PHOTO_ALBUM_URL` ahead of its first use in the packaged `script.js`. The earlier claim that this was fixed was incorrect. Sorry.

## Root cause
The photo-album setup read `PHOTO_ALBUM_URL` before its `const` declaration. This triggers a JavaScript `ReferenceError` (temporal dead zone) and aborts the main script before the Open Invitation and Skip Intro click handlers are registered.

## V15 fix
The `PHOTO_ALBUM_URL` declaration is now physically located before the first use in the packaged `script.js`. There is exactly one declaration.

## Checks performed
- `node --check script.js`: PASS
- `node --check immersive-world.js`: PASS
- Declaration-order assertion (declaration occurs before first `.trim()` use): PASS
- Exactly one `PHOTO_ALBUM_URL` declaration: PASS
- Open Invitation click handler exists after initialization: PASS (source verification)
- Skip Intro click handler exists: PASS (source verification)
- ZIP integrity: PASS

## Not claimed as passed
A live Chromium click-through test could not run in this environment because browser navigation was blocked by the execution environment. Please test the extracted V15 project on the Windows laptop using `py -m http.server 8000`.
