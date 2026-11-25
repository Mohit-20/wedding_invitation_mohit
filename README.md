# Mohit & Akanksha — Wedding Invitation

A mobile-first, reference-led wedding invitation experience. The opening sequence uses a red velvet/glitter atmosphere, gold name reveal, opening curtains, a stylised rani-pink bridal silhouette on an illuminated circular platform, and a satin transition into parchment invitation sections. The rest of the site preserves the storybook love story, milestones, venue directions, calendar downloads, and encrypted private letter.

## Run locally (Windows)

From this folder run:

```cmd
py -m http.server 8000
```

Open http://localhost:8000. Keep the terminal open while testing.

## Publish

Upload the contents of this folder to the GitHub Pages repository. No Python packages or build step are required. Google Fonts and the Three.js story scene use internet access; the core HTML/CSS invitation still loads without the optional 3D layer.

## Important

- The intro bride is a CSS-stylised silhouette, not a photorealistic rigged 3D character.
- The rotating platform and curtain choreography are CSS animations.
- Venue map destinations use the coordinates supplied by Mohit.
- RSVP currently links to the event section; configure a WhatsApp number in `script.js` if a direct WhatsApp RSVP is wanted.
- The private letter remains encrypted in `private/letter.enc`; do not publish any plaintext version.


### V10 desktop layout fix
The desktop hero portrait now fills the full hero height without the empty top band; the original portrait aspect ratio is preserved and the text column is aligned beside it.


## Wedding photo album link

When the photographer shares the Google Drive folder, open `script.js` and set:

```js
const PHOTO_ALBUM_URL = "https://drive.google.com/drive/folders/YOUR_FOLDER_ID";
```

Keep the Drive folder shared as **Anyone with the link — Viewer**. The Photos section will automatically change from “Coming soon” to “View & download the photos” when a valid Drive folder/file URL is supplied.
