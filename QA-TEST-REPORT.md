# V21 QA report

- Corrected the actual scrapbook tile selectors (`.memory-tile`) rather than the separate `.journey-stop` map controls.
- Explicitly sets `color` and `-webkit-text-fill-color`, visibility and opacity for dates, captions, doodles and chat bubble text.
- Chat bubbles use dark high-contrast text on light backgrounds.
- Updated tile captions to OUR FAMILIES, MATHERAN, and A PROMISE MADE · KACCHE PAKKE; chat caption identifies KAISA AAHE?
- Preserved the separate animated journey map and its clickable stops.
- Static validation: HTML contains all five intended scrapbook tiles and CSS contains explicit target selectors.
- Limitation: live visual browser verification was not completed in this environment. Please verify at 400px and desktop before publishing.
