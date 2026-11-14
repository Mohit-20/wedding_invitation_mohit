# Mohit & Akanksha — Our Little Story

A responsive, static storybook wedding website built with HTML, CSS and vanilla JavaScript.

## Files
- `index.html` — content and page structure
- `style.css` — responsive storybook design, animations and layout
- `script.js` — scroll reveals, navigation, letter interaction and event location configuration
- `assets/mohit-akanksha-storybook-couple.jpg` — illustrated couple hero artwork

## Add event venues and Google Maps links
Open `script.js` and edit the `EVENTS` object near the top. For each event, fill in:
- `venue`: venue name
- `address`: full address
- `time`: event time
- `mapUrl`: Google Maps directions/share URL

Example:
```js
engagement: {
  venue: "The Grand Courtyard",
  address: "Baner Road, Pune, Maharashtra",
  time: "7:00 PM onwards",
  mapUrl: "https://maps.google.com/?q=The+Grand+Courtyard+Pune"
}
```

## Enable WhatsApp RSVP
In `script.js`, set `WHATSAPP_NUMBER` to the number with country code and digits only, e.g. `9198XXXXXXXX`. This adds an RSVP link.

## Preview
Extract the ZIP and open `index.html` in a modern browser. An internet connection is needed for Google Fonts. All core interactions work without GSAP or external JavaScript libraries.

## Publish with GitHub Pages
1. Create a GitHub repository.
2. Upload the contents of this folder (not the containing folder itself).
3. In repository Settings → Pages, select Deploy from a branch, choose `main` and `/ (root)`.
4. Save and wait for the published URL.
