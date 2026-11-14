(() => {
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];

  // EDIT THESE FOUR OBJECTS: venue, address, time and mapUrl for each event.
  const EVENTS = {
    engagement: { venue:"Venue details coming soon", address:"Add engagement address here", time:"Time to be announced", mapUrl:"" },
    haldi:      { venue:"Venue details coming soon", address:"Add Haldi address here", time:"Time to be announced", mapUrl:"" },
    wedding:    { venue:"Venue details coming soon", address:"Add wedding address here", time:"Time to be announced", mapUrl:"" },
    reception:  { venue:"Venue details coming soon", address:"Add reception address here", time:"Time to be announced", mapUrl:"" }
  };
  // Optional: add your WhatsApp number with country code, digits only, e.g. 9198XXXXXXXX.
  const WHATSAPP_NUMBER = "";

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

  const openLetter = $("#openLetter"), message = $("#letterMessage");
  openLetter.addEventListener("click", () => {
    const opening = message.hidden;
    message.hidden = !opening;
    openLetter.textContent = opening ? "Close our little note ↑" : "Open our little note ♡";
    if (opening) message.scrollIntoView({behavior:"smooth",block:"nearest"});
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
})();
