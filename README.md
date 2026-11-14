# Mohit & Akanksha — Storybook Wedding Website

Responsive static invitation with storybook illustrations, scroll effects and Google Maps venue links.

## Event schedule
| Event | Date | Time | Venue |
|---|---|---|---|
| Engagement | 28 November 2026 | 1:00 PM onwards | Shri Gajanan Maharaj Sanskrutik Bhavan, Nagpur |
| Haldi | 2 December 2026 | 6:00 PM onwards | The Backyard (Private Party Venue), Nagpur |
| Marriage | 3 December 2026 | 11:45 AM | Mahalaxmi Celebration Hall, Nagpur |
| Reception | 4 December 2026 | 7:00 PM onwards | The Backyard (Private Party Venue), Nagpur |

The supplied Google Maps destination pins are retained.

## Files
- `index.html` — public invitation structure
- `style.css` — responsive storybook design and animations
- `script.js` — scroll effects, event configuration and encrypted-letter unlock
- `assets/` — storybook illustration
- `private/letter.txt` — local plaintext letter, excluded from Git
- `tools/encrypt-letter.html` — local encryption utility

## Private letter — already encrypted

The project includes `private/letter.enc`, which contains the personal letter encrypted with PBKDF2-SHA-256 (310,000 iterations) and AES-256-GCM. The passphrase is **not** stored in the website, HTML, JavaScript, or repository. The browser decrypts the letter only after the correct passphrase is entered. The chosen passphrase is intentionally short for this playful reveal, so this is not suitable for protecting highly sensitive information.

Keep the passphrase somewhere safe and share it with Akanksha privately. If it is lost, the letter cannot be recovered. Do not add the passphrase to any website file, README, URL, or GitHub commit.

The plaintext letter is supplied separately as a local-only file for your own records; do not upload it to GitHub. `.gitignore` excludes `private/letter.txt` if you create that file in this project folder.

## Publish with GitHub Pages
Upload the contents of this project folder to your repository root. Confirm `private/letter.enc` is present. Then open **Settings → Pages → Deploy from a branch → main → /(root)** and save. Open the published HTTPS URL.

## WhatsApp RSVP
In `script.js`, set `WHATSAPP_NUMBER` to your number with country code and digits only if you want the floating RSVP link.
