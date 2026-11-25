(() => {
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];

  // Venue details supplied by Mohit. Map links use the exact coordinates
  // from the Google Maps embed links so directions open at the correct pin.
  const EVENTS = {
    engagement: {
      venue: "Shri Gajanan Maharaj Sanskrutik Bhavan",
      address: "Nagpur, Maharashtra",
      time: "1:00 PM onwards",
      date: "2026-11-28",
      start: "13:00",
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=21.0999093%2C79.106253"
    },
    haldi: {
      venue: "The Backyard (Private Party Venue)",
      address: "Nagpur, Maharashtra",
      time: "6:00 PM onwards",
      date: "2026-12-02",
      start: "18:00",
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=21.0746688%2C79.1180366"
    },
    wedding: {
      venue: "Mahalaxmi Celebration Hall",
      address: "Nagpur, Maharashtra",
      time: "11:45 AM",
      date: "2026-12-03",
      start: "11:45",
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=21.0933173%2C79.0980089"
    },
    reception: {
      venue: "The Backyard (Private Party Venue)",
      address: "Nagpur, Maharashtra",
      time: "7:00 PM onwards",
      date: "2026-12-04",
      start: "19:00",
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=21.0746688%2C79.1180366"
    }
  };
  // Optional: add your WhatsApp number with country code, digits only, e.g. 9198XXXXXXXX.
  const WHATSAPP_NUMBER = "";

// Add the photographer's Google Drive folder-sharing URL here when it is ready.
  // Example: https://drive.google.com/drive/folders/...
  const PHOTO_ALBUM_URL = "";


  // Photo album: keep the section visible as "coming soon" until the Drive link is added.
  const photoAlbumLink = $("#photoAlbumLink");
  const photoAlbumNote = $("#photoAlbumNote");
  if (photoAlbumLink) {
    const validAlbumUrl = /^https:\/\/drive\.google\.com\/(drive\/folders\/|file\/d\/)/i.test(PHOTO_ALBUM_URL.trim());
    if (validAlbumUrl) {
      photoAlbumLink.href = PHOTO_ALBUM_URL.trim();
      photoAlbumLink.target = "_blank";
      photoAlbumLink.rel = "noopener noreferrer";
      photoAlbumLink.removeAttribute("aria-disabled");
      photoAlbumLink.classList.remove("is-coming-soon");
      photoAlbumLink.querySelector(".photo-button-title").textContent = "VIEW & DOWNLOAD THE PHOTOS";
      if (photoAlbumNote) photoAlbumNote.textContent = "The wedding album is ready. Open the shared Google Drive folder to view and download the photos.";
    } else {
      photoAlbumLink.addEventListener("click", (event) => {
        event.preventDefault();
        if (photoAlbumNote) {
          photoAlbumNote.textContent = "The album isn't ready just yet. Please check back soon — we'll add the Google Drive link here.";
          photoAlbumNote.classList.add("photo-note-pulse");
          window.setTimeout(() => photoAlbumNote.classList.remove("photo-note-pulse"), 900);
        }
      });
    }
  }
Object.entries(EVENTS).forEach(([key, data]) => {
    const card = document.querySelector(`[data-event="${key}"]`);
    if (!card) return;
    const venue = card.querySelector("[data-venue]");
    const address = card.querySelector("[data-address]");
    const map = card.querySelector("[data-map]");
    if (venue) venue.textContent = data.venue;
    if (address) address.textContent = `${data.address}${data.time ? " · " + data.time : ""}`;
    if (map) {
      if (data.mapUrl) { map.href = data.mapUrl; map.hidden = false; }
      else { map.href = "#"; map.hidden = true; }
    }
    // Calendar buttons use the listed start time and a clearly disclosed one-hour placeholder.
    const actions = document.createElement("div");
    actions.className = "event-actions";
    const title = `${card.querySelector("h3")?.textContent || key} — Mohit & Akanksha`;
    const [year, month, day] = data.date.split("-").map(Number);
    const [hour, minute] = data.start.split(":").map(Number);
    // Event times are Nagpur local time (Asia/Kolkata, UTC+05:30), independent of the guest's device zone.
    const startUtc = new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30));
    const endUtc = new Date(startUtc.getTime() + 60 * 60 * 1000);
    const pad = n => String(n).padStart(2, "0");
    const localStamp = (date, time) => `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
    const endLocalDate = new Date(Date.UTC(year, month - 1, day, hour, minute + 60));
    const endLocalStamp = `${endLocalDate.getUTCFullYear()}${pad(endLocalDate.getUTCMonth()+1)}${pad(endLocalDate.getUTCDate())}T${pad(endLocalDate.getUTCHours())}${pad(endLocalDate.getUTCMinutes())}00`;
    const startLocalStamp = localStamp(data.date, data.start);
    const details = `${data.time}. Please check the invitation for the latest details.`;
    const location = `${data.venue}, ${data.address}`;
    const google = document.createElement("a");
    google.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startLocalStamp}/${endLocalStamp}&ctz=Asia%2FKolkata&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    google.target = "_blank"; google.rel = "noreferrer"; google.textContent = "ADD TO GOOGLE CALENDAR ↗";
    const ics = document.createElement("a");
    ics.href = "#"; ics.textContent = "DOWNLOAD .ICS ↓";
    ics.addEventListener("click", event => {
      event.preventDefault();
      const utcStamp = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const escapeICS = value => String(value).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n");
      const uid = `${key}-${data.date}@mohit-akanksha-wedding`;
      const body = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Mohit and Akanksha//Wedding Invitation//EN","CALSCALE:GREGORIAN","BEGIN:VEVENT",`UID:${uid}`,`DTSTAMP:${utcStamp(new Date())}`,`DTSTART:${utcStamp(startUtc)}`,`DTEND:${utcStamp(endUtc)}`,`SUMMARY:${escapeICS(title)}`,`DESCRIPTION:${escapeICS(details)}`,`LOCATION:${escapeICS(location)}`,"END:VEVENT","END:VCALENDAR"].join("\r\n");
      const blob = new Blob([body], {type:"text/calendar;charset=utf-8"});
      const url = URL.createObjectURL(blob);
      const download = document.createElement("a"); download.href = url; download.download = `${key}-mohit-akanksha.ics`;
      document.body.appendChild(download); download.click(); download.remove(); URL.revokeObjectURL(url);
    });
    actions.append(google, ics);
    card.appendChild(actions);
  });

  // Shared atmosphere follows India Standard Time so every guest sees the same mood.
  const timeGreeting = $("#timeGreeting");
  const updateTimeMood = () => {
    const parts = new Intl.DateTimeFormat("en-IN", {timeZone:"Asia/Kolkata", hour:"2-digit", hourCycle:"h23"}).formatToParts(new Date());
    const hour = Number(parts.find(part => part.type === "hour")?.value || 12);
    let mood = "night", greeting = "A little starlight, a lot of love.";
    if (hour >= 5 && hour < 11) { mood = "morning"; greeting = "A fresh morning, and a story full of love."; }
    else if (hour >= 11 && hour < 16) { mood = "afternoon"; greeting = "A little sunshine for our little story."; }
    else if (hour >= 16 && hour < 20) { mood = "evening"; greeting = "Golden-hour feelings, all day long."; }
    document.body.dataset.timeOfDay = mood;
    if (timeGreeting) timeGreeting.textContent = greeting;
  };
  updateTimeMood();
  setInterval(updateTimeMood, 60 * 1000);

  // Reference-led opening: glitter -> gold names -> curtains -> bride on a lit circular stage -> satin transition.
  const welcomeScreen = $("#welcomeScreen");
  const openInvitation = $("#openInvitation");
  const skipIntro = $("#skipIntro");

  // Reveal every line character-by-character, with the couple's names as the main sequence.
  if (welcomeScreen && !welcomeScreen.dataset.lettersPrepared) {
    welcomeScreen.dataset.lettersPrepared = "true";
    const splitTextNode = (node, counter, delay) => {
      const raw = node.nodeValue || "";
      if (!raw.trim()) return;
      const fragment = document.createDocumentFragment();
      for (const character of raw) {
        if (character === " ") {
          fragment.appendChild(document.createTextNode("\u00a0"));
          continue;
        }
        const letter = document.createElement("span");
        letter.className = "letter-char";
        letter.style.setProperty("--letter-index", counter.value++);
        letter.style.setProperty("--letter-delay", `${delay}ms`);
        letter.setAttribute("aria-hidden", "true");
        letter.textContent = character;
        fragment.appendChild(letter);
      }
      node.parentNode.replaceChild(fragment, node);
    };
    const animateText = (element, delay, sharedCounter = { value: 0 }) => {
      if (!element) return;
      element.setAttribute("aria-label", element.textContent.trim());
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => splitTextNode(node, sharedCounter, delay));
    };
    animateText(welcomeScreen.querySelector(".reel-intro-copy > span"), 100);
    animateText(welcomeScreen.querySelector(".reel-intro-copy > p"), 850);
    animateText(welcomeScreen.querySelector(".reel-overline"), 1550);
    animateText(welcomeScreen.querySelector(".reel-stage-title h1"), 2150);
    animateText(welcomeScreen.querySelector(".reel-stage-title small"), 3450);
    animateText(openInvitation, 4200);
  }
  const enterInvitation = () => {
    if (!welcomeScreen || welcomeScreen.classList.contains("is-opening")) return;
    welcomeScreen.classList.add("is-opening");
    document.body.classList.add("invitation-entered");
    // Keep the page isolated while the opening overlay fades away.
    window.setTimeout(() => {
      welcomeScreen.hidden = true;
      document.body.classList.remove("invitation-locked");
    }, 1250);
  };
  openInvitation?.addEventListener("click", enterInvitation);
  skipIntro?.addEventListener("click", enterInvitation);
  document.addEventListener("keydown", event => { if(event.key === "Escape" && welcomeScreen && !welcomeScreen.hidden) enterInvitation(); });

  // Reference-style interactive calendar: month pages can be turned; event days are highlighted.
  const weddingCalendar = $("#weddingCalendar");
  const calendarMonth = $("#calendarMonth");
  if (weddingCalendar && calendarMonth) {
    let viewYear = 2026, viewMonth = 10;
    const marked = new Set(["2026-10-28","2026-11-2","2026-11-3","2026-11-4"]);
    const renderCalendar = () => {
      const first = new Date(viewYear, viewMonth, 1);
      const days = new Date(viewYear, viewMonth + 1, 0).getDate();
      const offset = first.getDay();
      calendarMonth.textContent = first.toLocaleDateString("en-IN", {month:"long",year:"numeric"});
      weddingCalendar.replaceChildren();
      ["SUN","MON","TUE","WED","THU","FRI","SAT"].forEach(day => { const el=document.createElement("span"); el.className="weekday"; el.textContent=day; weddingCalendar.append(el); });
      for(let i=0;i<offset;i++){const el=document.createElement("span");el.className="muted";weddingCalendar.append(el);}
      for(let d=1;d<=days;d++){const el=document.createElement("span");el.textContent=d;const key=`${viewYear}-${viewMonth}-${d}`;if(marked.has(key))el.classList.add("event-day");weddingCalendar.append(el);}
    };
    $("#prevMonth")?.addEventListener("click",()=>{viewMonth--;if(viewMonth<0){viewMonth=11;viewYear--;}renderCalendar();});
    $("#nextMonth")?.addEventListener("click",()=>{viewMonth++;if(viewMonth>11){viewMonth=0;viewYear++;}renderCalendar();});
    renderCalendar();
  }

  // Scrapbook cards open a lightweight accessible memory viewer.
  const memoryModal = $("#memoryModal");
  const modalTitle = $("#memoryModalTitle");
  const modalCopy = $("#memoryModalCopy");
  const modalImage = $("#memoryModalImage");
  const closeMemory = $("#closeMemoryModal");
  let lastMemoryTrigger = null;
  const hideMemory = () => {
    if (!memoryModal) return;
    memoryModal.hidden = true;
    document.body.style.overflow = "";
    if (lastMemoryTrigger) lastMemoryTrigger.focus();
  };
  $$("[data-memory-title]").forEach(tile => tile.addEventListener("click", () => {
    lastMemoryTrigger = tile;
    modalTitle.textContent = tile.dataset.memoryTitle || "A little memory";
    modalCopy.textContent = tile.dataset.memoryCopy || "A little piece of our story.";
    if (tile.dataset.memoryImage) { modalImage.src = tile.dataset.memoryImage; modalImage.hidden = false; }
    else { modalImage.removeAttribute("src"); modalImage.hidden = true; }
    memoryModal.hidden = false;
    document.body.style.overflow = "hidden";
    closeMemory?.focus();
  }));
  closeMemory?.addEventListener("click", hideMemory);
  memoryModal?.addEventListener("click", event => { if (event.target === memoryModal) hideMemory(); });
  addEventListener("keydown", event => { if (event.key === "Escape" && memoryModal && !memoryModal.hidden) hideMemory(); });

  // Optional original instrumental loop. Audio only starts after a visitor taps play.
  const soundtrack = $("#weddingSoundtrack");
  const musicToggle = $("#musicToggle");
  const musicLabel = musicToggle?.querySelector(".music-label");
  musicToggle?.addEventListener("click", async () => {
    if (!soundtrack) return;
    if (soundtrack.paused) {
      try {
        await soundtrack.play();
        musicToggle.setAttribute("aria-pressed", "true");
        if (musicLabel) musicLabel.textContent = "Pause our soundtrack";
      } catch (_) {
        if (musicLabel) musicLabel.textContent = "Tap to try music again";
      }
    } else {
      soundtrack.pause();
      musicToggle.setAttribute("aria-pressed", "false");
      if (musicLabel) musicLabel.textContent = "Play our little soundtrack";
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$(".reveal").forEach(el => observer.observe(el));

  const progress = $(".scroll-progress i");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  };
  addEventListener("scroll", updateProgress, { passive:true });
  updateProgress();

  const toggle = $(".menu-toggle"), nav = $(".nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "×" : "☰";
  });
  $$(".nav a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open"); toggle.setAttribute("aria-expanded","false"); toggle.textContent="☰";
  }));

  // Akanksha's letter is AES-GCM encrypted in private/letter.enc.
  // No password or readable letter is stored in this JavaScript or HTML.
  const secretForm = $("#secretForm");
  const secretKey = $("#secretKey");
  const secretFeedback = $("#secretFeedback");
  const secretHint = $("#secretHint");
  const secretMessage = $("#letterMessage");
  let secretAttempts = 0;

  const fromBase64 = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
  const decryptPrivateLetter = async passphrase => {
    if (!window.crypto || !crypto.subtle) throw new Error("secure-crypto-unavailable");
    const response = await fetch("private/letter.enc", { cache: "no-store" });
    if (!response.ok) throw new Error("encrypted-letter-missing");
    const envelope = await response.json();
    if (envelope.version !== 1 || envelope.algorithm !== "AES-GCM" ||
        envelope.kdf !== "PBKDF2-SHA-256") throw new Error("unsupported-letter-format");
    const material = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: fromBase64(envelope.salt),
        iterations: envelope.iterations, hash: "SHA-256" },
      material, { name: "AES-GCM", length: 256 }, false, ["decrypt"]
    );
    const clearBytes = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(envelope.iv) }, key,
      fromBase64(envelope.ciphertext)
    );
    return new TextDecoder().decode(clearBytes);
  };

  const showLetter = plaintext => {
    secretMessage.replaceChildren();
    plaintext.split(/\r?\n\s*\r?\n/).filter(Boolean).forEach((paragraph, index) => {
      const p = document.createElement("p");
      p.textContent = paragraph.trim();
      if (index === 0) p.className = "letter-to";
      if (/—\s*Tujhach Mohu/i.test(paragraph)) p.className = "signature";
      secretMessage.appendChild(p);
    });
    secretMessage.hidden = false;
  };

  secretForm.addEventListener("submit", async event => {
    event.preventDefault();
    const passphrase = secretKey.value;
    const button = secretForm.querySelector("button[type='submit']");
    if (!passphrase.trim()) {
      secretFeedback.textContent = "Blank password? Itna bhi easy nahi hai! 😂";
      secretFeedback.classList.add("secret-error");
      secretKey.focus();
      return;
    }
    button.disabled = true;
    button.textContent = "Opening your little secret…";
    secretFeedback.textContent = "";
    try {
      const plaintext = await decryptPrivateLetter(passphrase);
      showLetter(plaintext);
      secretFeedback.textContent = "Aha! The right person found the right little secret. ♡";
      secretFeedback.classList.remove("secret-error");
      secretFeedback.classList.add("secret-success");
      secretHint.hidden = true;
      secretKey.disabled = true;
      button.textContent = "Letter unlocked ♡";
      secretMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (error) {
      button.disabled = false;
      button.textContent = "Unlock the letter ♡";
      secretAttempts += 1;
      secretForm.classList.remove("secret-shake");
      void secretForm.offsetWidth;
      secretForm.classList.add("secret-shake");
      secretFeedback.classList.remove("secret-success");
      secretFeedback.classList.add("secret-error");
      if (error.message === "encrypted-letter-missing") {
        secretFeedback.textContent = "The secret letter isn't available right now. Please try again later. 😉";
      } else if (error.message === "secure-crypto-unavailable") {
        secretFeedback.textContent = "This browser can't unlock the letter here. Open the website on its GitHub Pages HTTPS link.";
      } else if (secretAttempts === 1) {
        secretFeedback.textContent = "🚫 ACCESS DENIED! Even Jeevansathi was easier than this! 😂";
      } else if (secretAttempts === 2) {
        secretFeedback.textContent = "Arre detective ji, think harder… you know this one! 😜";
      } else {
        secretFeedback.textContent = "Okay, enough guessing. Your personal hint is ready…";
        secretHint.hidden = false;
      }
      secretKey.value = "";
      secretKey.setAttribute("aria-invalid", "true");
      secretKey.focus();
    }
  });

  secretKey.addEventListener("input", () => {
    secretKey.removeAttribute("aria-invalid");
    secretFeedback.classList.remove("secret-error");
  });

  secretForm.addEventListener("animationend", event => {
    if (event.animationName === "secret-wiggle") secretForm.classList.remove("secret-shake");
  });

  if (WHATSAPP_NUMBER) {
    const rsvp = document.createElement("a");
    rsvp.className = "floating-rsvp";
    rsvp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Mohit & Akanksha! We'd love to RSVP for your wedding celebrations.")}`;
    rsvp.target = "_blank"; rsvp.rel = "noreferrer";
    rsvp.textContent = "RSVP ↗";
    document.body.appendChild(rsvp);
  }

  // Multi-plane storybook parallax. Uses one RAF loop, works on touch and desktop,
  // and keeps motion deliberately restrained on smaller screens.
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion) {
    const depthLayers = $$("[data-depth]");
    const artLayers = $$(".scroll-art");
    let scheduled = false;

    const renderParallax = () => {
      scheduled = false;
      const mobile = innerWidth <= 620;
      const scale = mobile ? 0.62 : 1;
      const vh = innerHeight || 1;

      depthLayers.forEach(el => {
        const depth = Number(el.dataset.depth || 0);
        // Hero layers drift at different rates as the opening scene leaves view.
        const offset = Math.max(-150, Math.min(150, scrollY * depth * scale));
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      });

      artLayers.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -80 || rect.top > vh + 80) return;
        const centerDelta = (rect.top + rect.height / 2 - vh / 2) / vh;
        const strength = mobile ? 8 : 16;
        const y = Math.max(-strength, Math.min(strength, centerDelta * -strength));
        el.style.translate = `0 ${y.toFixed(1)}px`;
      });

    };

    const requestParallax = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(renderParallax);
      }
    };
    addEventListener("scroll", requestParallax, {passive:true});
    addEventListener("resize", requestParallax, {passive:true});
    requestParallax();

    // A little depth follows the pointer on desktops, but never fights the scroll motion.
    if (matchMedia("(pointer:fine)").matches) {
      const couple = $(".hero-couple");
      addEventListener("pointermove", e => {
        const x = (e.clientX / innerWidth - .5) * 5;
        const y = (e.clientY / innerHeight - .5) * 4;
        couple.style.setProperty("--pointer-x", `${x}px`);
        couple.style.setProperty("--pointer-y", `${y}px`);
      }, {passive:true});
    }
  }
})();


(() => {
  // This controller has its own selectors; the main site script is in a separate scope.
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Pinned scrollytelling: scroll position directly scrubs each chapter in and out.
  // No scroll hijacking; wheel, touch, keyboard and reverse scrolling stay native.
  const storyTrack = $(".story-scroll-track");
  if (storyTrack && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const stage = $(".story-stage");
    const chapters = $$(".story-chapter", stage);
    const introLockup = $(".story-intro-lockup", stage);
    const currentLabel = $("#storyCurrent");
    const progressBar = $("#storyProgress");
    let storyQueued = false;

    const clamp01 = v => Math.max(0, Math.min(1, v));
    const smooth = (a,b,v) => {
      const t = clamp01((v-a)/(b-a));
      return t*t*(3-2*t);
    };
    const paintStory = () => {
      storyQueued = false;
      const rect = storyTrack.getBoundingClientRect();
      const travel = Math.max(1, storyTrack.offsetHeight - innerHeight);
      const progress = clamp01(-rect.top / travel);
      const count = chapters.length;
      const chapterPosition = progress * count;
      stage.dataset.storyProgress = String(chapterPosition);
      const activeIndex = Math.min(count - 1, Math.floor(chapterPosition));
      const local = chapterPosition - activeIndex;

      // Opening title exits upward as the first story card takes its place.
      const introOut = smooth(.05,.28,progress);
      introLockup.style.opacity = String(1 - introOut);
      introLockup.style.setProperty("--intro-y", `${-75 * introOut}px`);
      introLockup.style.setProperty("--intro-scale", String(1 - .08 * introOut));

      chapters.forEach((chapter, index) => {
        const start = index;
        const localProgress = chapterPosition - start;
        const enter = smooth(0,.23,localProgress);
        const leave = index === count - 1 ? 0 : smooth(.72,1,localProgress);
        const opacity = Math.max(0, Math.min(1, enter * (1 - leave)));
        const y = 82 * (1 - enter) - 48 * leave;
        const x = index % 2 === 0 ? 42 * (1-enter) : -42 * (1-enter);
        const rotate = (index % 2 === 0 ? 2.4 : -2.4) * (1-enter) + (index % 2 === 0 ? -1 : 1) * leave;
        const scale = .94 + .06 * enter - .035 * leave;
        chapter.style.visibility = opacity > .015 ? "visible" : "hidden";
        if (opacity > .82) chapter.classList.add("chapter-live");
        else if (opacity < .12) chapter.classList.remove("chapter-live");
        chapter.style.opacity = opacity.toFixed(3);
        chapter.style.transform = `translate3d(${x.toFixed(1)}px,calc(-50% + ${y.toFixed(1)}px),0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        chapter.style.zIndex = String(10 + index);
      });

      const displayIndex = Math.min(count, Math.max(1, Math.floor(chapterPosition) + 1));
      if (currentLabel) currentLabel.textContent = String(displayIndex).padStart(2,"0");
      if (progressBar) progressBar.style.width = `${(progress * 100).toFixed(1)}%`;

      // The illustrated landscape moves at a different rate from the chapter cards.
      stage.style.setProperty("--halo-y", `${progress * -55}px`);
      stage.style.setProperty("--sun-y", `${progress * 90}px`);
      stage.style.setProperty("--sun-r", `${progress * 70}deg`);
      stage.style.setProperty("--hill-back-x", `${progress * -34}px`);
      stage.style.setProperty("--hill-back-y", `${progress * -24}px`);
      stage.style.setProperty("--hill-front-x", `${progress * 28}px`);
      stage.style.setProperty("--hill-front-y", `${progress * -12}px`);
      stage.style.setProperty("--couple-x", `${progress * 46}px`);
      stage.style.setProperty("--couple-y", `${progress * -18}px`);
      stage.style.setProperty("--couple-scale", String(1 + progress * .12));
      stage.style.setProperty("--flower-y", `${progress * -80}px`);
      stage.style.setProperty("--flower-r", `${progress * 120}deg`);
    };
    const queueStory = () => {
      if (!storyQueued) {
        storyQueued = true;
        requestAnimationFrame(paintStory);
      }
    };
    addEventListener("scroll", queueStory, {passive:true});
    addEventListener("resize", queueStory, {passive:true});
    paintStory();
  }

  // Cinematic journey-map navigation: jump to the matching native-scroll chapter.
  $$("[data-jump-chapter]").forEach(stop => {
    stop.addEventListener("click", () => {
      const index = Number(stop.dataset.jumpChapter);
      const track = $(".story-scroll-track");
      const chapters = $$(".story-chapter");
      if (!track || !chapters.length || !Number.isFinite(index)) return;
      const travel = Math.max(1, track.offsetHeight - innerHeight);
      const targetProgress = Math.max(0, Math.min(.98, (index + .36) / chapters.length));
      const top = track.getBoundingClientRect().top + scrollY + targetProgress * travel;
      window.scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  });

  // Kinetic headings animate once when they enter view; content remains visible without JS.
  const kineticObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("kinetic-in");
        kineticObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .25 });
  $$(".kinetic-heading").forEach(el => kineticObserver.observe(el));

  // Desktop scrapbook sorting. Touch devices keep ordinary vertical scrolling and tap-to-open.
  const scrapbook = $("#scrapbookGrid");
  if (scrapbook && matchMedia("(pointer:fine)").matches) {
    let dragged = null;
    $$(".memory-tile", scrapbook).forEach(tile => {
      tile.draggable = true;
      tile.addEventListener("dragstart", event => {
        dragged = tile;
        tile.classList.add("is-dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", tile.dataset.memoryTitle || "memory");
      });
      tile.addEventListener("dragend", () => {
        tile.classList.remove("is-dragging");
        $$(".memory-tile", scrapbook).forEach(item => item.classList.remove("drop-target"));
        dragged = null;
      });
      tile.addEventListener("dragover", event => {
        if (!dragged || dragged === tile) return;
        event.preventDefault();
        tile.classList.add("drop-target");
      });
      tile.addEventListener("dragleave", () => tile.classList.remove("drop-target"));
      tile.addEventListener("drop", event => {
        event.preventDefault();
        if (!dragged || dragged === tile) return;
        tile.classList.remove("drop-target");
        const rect = tile.getBoundingClientRect();
        const after = (event.clientY - rect.top) / rect.height > .5;
        scrapbook.insertBefore(dragged, after ? tile.nextSibling : tile);
      });
    });
    scrapbook.classList.add("is-sortable");
  }

  // A tiny, harmless Easter egg for curious guests.
  const heroFlower = $(".hero-flower");
  if (heroFlower) {
    heroFlower.setAttribute("role", "button");
    heroFlower.setAttribute("tabindex", "0");
    heroFlower.setAttribute("aria-label", "A tiny secret");
    const revealEasterEgg = () => {
      let note = $("#easterEggNote");
      if (!note) {
        note = document.createElement("div");
        note.id = "easterEggNote";
        note.className = "easter-egg-note";
        note.setAttribute("role", "status");
        note.textContent = "You found a tiny secret: Mohit still can't believe one little Hi brought him here. ♡";
        document.body.appendChild(note);
      }
      note.classList.add("show");
      clearTimeout(note._hideTimer);
      note._hideTimer = setTimeout(() => note.classList.remove("show"), 4200);
    };
    heroFlower.addEventListener("click", revealEasterEgg);
    heroFlower.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); revealEasterEgg(); }
    });
  }

})();
