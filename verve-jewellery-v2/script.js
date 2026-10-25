
const products = [
  {
    id: "p1",
    name: "The Sol Pendant",
    category: "Gold Jewellery",
    price: 12900,
    tag: "Bestseller",
    image: "images/1.jpeg"
  },
  {
    id: "p2",
    name: "Éclat Diamond Ring",
    category: "Diamond Jewellery",
    price: 18500,
    tag: "New Arrival",
    image: "images/4.jpeg"
  },
  {
    id: "p3",
    name: "Signature Necklace",
    category: "Gold Jewellery",
    price: 24900,
    tag: "Signature",
    image: "images/8.jpeg"
  },
  {
    id: "p4",
    name: "Celeste Earrings",
    category: "Fine Jewellery",
    price: 8900,
    tag: "Favourite",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: "p5",
    name: "Golden Heirloom",
    category: "Bridal Jewellery",
    price: 32900,
    tag: "Bridal Edit",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: "p6",
    name: "Diamond Glow",
    category: "Diamond Jewellery",
    price: 15900,
    tag: "Elegant Pick",
    image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=85"
  }
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("aurelle-cart") || "[]");
  } catch {
    return [];
  }
}

function updateCartCount() {
  const total = getCart().reduce((sum, item) => sum + item.qty, 0);
  const count = document.getElementById("cartCount");

  if (count) count.textContent = total;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.aurelleToastTimer);

  window.aurelleToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function addToBag(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  localStorage.setItem("aurelle-cart", JSON.stringify(cart));
  updateCartCount();

  const product = products.find((item) => item.id === productId);

  if (product) {
    showToast(`${product.name} added to your bag`);
  }
}

function installSliderStyles() {
  const oldStyles = document.getElementById("aurelle-slider-styles");
  if (oldStyles) oldStyles.remove();

  const style = document.createElement("style");
  style.id = "aurelle-slider-styles";

  style.textContent = `
    .featured-section {
      display: block;
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      padding-left: 4%;
      padding-right: 4%;
      box-sizing: border-box;
    }

    #productGrid {
      position: relative;
      display: block !important;
      width: 100%;
      min-width: 0;
      height: 470px;
      box-sizing: border-box;
      perspective: 1300px;
      transform-style: preserve-3d;
      overflow: hidden;
      margin: 20px auto 35px;
      animation: none !important;
    }

    #productGrid .product-card {
      position: absolute;
      left: 50%;
      top: 50%;
      flex: none !important;
      width: clamp(175px, 19vw, 235px) !important;
      min-width: 0;
      transform-style: preserve-3d;
      transform-origin: center center;
      transition: transform 0.7s ease, opacity 0.7s ease;
      will-change: transform;
    }

    #productGrid .product-image-wrap {
      width: 100%;
      aspect-ratio: 4 / 5;
      overflow: hidden;
      position: relative;
      background: var(--cream, #f8f3ed);
      border-radius: 12px;
    }

    #productGrid .product-image-wrap > a {
      display: block;
      width: 100%;
      height: 100%;
    }

    #productGrid .product-image-wrap > a > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    #productGrid .product-tag {
      z-index: 2;
    }

    #productGrid .product-info {
      text-align: center;
    }

    @media (max-width: 650px) {
      #productGrid {
        height: 370px;
        perspective: 900px;
      }

      #productGrid .product-card {
        width: 155px !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #productGrid .product-card {
        transition: none;
      }
    }
  `;

  document.head.appendChild(style);
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = products.map((product, index) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <a
          href="pages/collections.html"
          aria-label="View ${product.name}"
          tabindex="${index >= products.length ? "-1" : "0"}"
        >
          <img
            src="${product.image}"
            alt="${product.name}"
            loading="${index < 4 ? "eager" : "lazy"}"
          >
          <span class="product-tag">${product.tag}</span>
        </a>

        <button
          class="quick-add"
          type="button"
          data-add="${product.id}"
        >
          ADD TO BAG +
        </button>
      </div>

      <div class="product-info">
        <h3>
          <a href="pages/collections.html">${product.name}</a>
        </h3>
        <p>${product.category}</p>
        <p class="product-price">${formatPrice(product.price)}</p>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      addToBag(button.dataset.add);
    });
  });
}

function setupMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

    toggle.textContent = isOpen ? "✕" : "☰";
  });
}

function setupNewsletter() {
  const form = document.getElementById("newsletterForm");
  const message = document.getElementById("newsletterMessage");

  if (!form || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    message.textContent =
      "Thank you! Connect a newsletter service to activate signups.";

    form.reset();
  });
}

/* INITIALIZE MAIN PAGE FEATURES */
document.addEventListener("DOMContentLoaded", () => {
  const ringsCard = document.querySelector('.sparkle-category-card[href*="category=rings"]');
  if (ringsCard) ringsCard.href = "pages/rings.html";
  document.querySelectorAll('a[href*="category=earrings"]').forEach((link) => {
    link.href = "pages/earrings.html";
  });
  if (document.body.classList.contains("earrings-page")) {
    const categories = document.createElement("section");
    categories.className = "earring-categories";
    categories.innerHTML = '<h2>Shop Earrings By Style</h2><div class="earring-category-grid"><a href="collections.html?category=jhumkas"><strong>Jhumkas</strong><span>Traditional sparkle ↗</span></a><a href="collections.html?category=balis"><strong>Balis</strong><span>Everyday elegance ↗</span></a><a href="collections.html?category=chandbalis"><strong>Chandbalis</strong><span>Statement shine ↗</span></a><a href="collections.html?category=studs"><strong>Studs</strong><span>Minimal brilliance ↗</span></a><a href="collections.html?category=danglers"><strong>Danglers</strong><span>Move with light ↗</span></a></div>';
    document.querySelector(".earrings-content")?.after(categories);
  }
  if (document.body.classList.contains("rings-page")) {
    const mensLink = document.querySelector('.nav-left a[href*="category=mens-jewellery"]');
    if (mensLink) mensLink.href = "mens.html";
    const ringNavLinks = {
      "New Arrivals": "../index.html#new-arrivals-heading",
      "Fashion Jewellery": "fashion.html",
      "92.5 Jewellery": "925.html",
      "Men's Jewellery": "mens.html",
      "Women's Jewellery": "women.html",
      "Minimal Jewellery": "minimal.html",
      "Accessories": "accessories.html"
    };
    document.querySelectorAll(".rings-page .nav-left a").forEach((link) => {
      if (ringNavLinks[link.textContent.trim()]) link.href = ringNavLinks[link.textContent.trim()];
    });
    const ringsFilters = document.querySelector('.rings-page .mens-filters');
    if (ringsFilters) {
      ringsFilters.innerHTML = `<div class="mens-filter-heading"><strong>FILTERS</strong><button type="button">Clear All</button></div>
        <details class="mens-price-filter" open><summary class="mens-filter-item">Price <span>⌄</span></summary><div class="mens-price-options mens-filter-panel"><label><input type="checkbox"><span>Under ₹2,000</span><small>(18)</small></label><label><input type="checkbox"><span>₹2,000 - ₹5,000</span><small>(42)</small></label><label><input type="checkbox"><span>₹5,000 - ₹10,000</span><small>(26)</small></label></div></details>
        <details class="mens-price-filter" open><summary class="mens-filter-item">Color <span>⌄</span></summary><div class="mens-price-options mens-filter-panel"><label><input type="checkbox"><span>Silver</span><small>(221)</small></label><label><input type="checkbox"><span>Gold</span><small>(56)</small></label><label><input type="checkbox"><span>Black Rhodium</span><small>(2)</small></label></div></details>
        <details class="mens-price-filter"><summary class="mens-filter-item">Size <span>⌄</span></summary><div class="mens-price-options mens-filter-panel"><label><input type="checkbox"><span>Small</span><small>(18)</small></label><label><input type="checkbox"><span>Medium</span><small>(42)</small></label><label><input type="checkbox"><span>Large</span><small>(26)</small></label></div></details>
        <details class="mens-price-filter"><summary class="mens-filter-item">Material <span>⌄</span></summary><div class="mens-price-options mens-filter-panel"><label><input type="checkbox"><span>925 Silver</span><small>(54)</small></label><label><input type="checkbox"><span>Gold Plated</span><small>(28)</small></label></div></details>
        <details class="mens-price-filter"><summary class="mens-filter-item">Occasion <span>⌄</span></summary><div class="mens-price-options mens-filter-panel"><label><input type="checkbox"><span>Everyday</span><small>(86)</small></label><label><input type="checkbox"><span>Party</span><small>(42)</small></label></div></details>
        <details class="mens-price-filter"><summary class="mens-filter-item">Polish <span>⌄</span></summary><div class="mens-price-options mens-filter-panel"><label><input type="checkbox"><span>High Polish</span><small>(74)</small></label><label><input type="checkbox"><span>Matte</span><small>(31)</small></label></div></details>
        <details class="mens-price-filter"><summary class="mens-filter-item">Stone Type <span>⌄</span></summary><div class="mens-price-options mens-filter-panel"><label><input type="checkbox"><span>Diamond</span><small>(29)</small></label><label><input type="checkbox"><span>Onyx</span><small>(14)</small></label></div></details>
        <details class="mens-price-filter"><summary class="mens-filter-item">Design Shape <span>⌄</span></summary><div class="mens-price-options mens-filter-panel"><label><input type="checkbox"><span>Classic</span><small>(52)</small></label><label><input type="checkbox"><span>Geometric</span><small>(34)</small></label></div></details>`;
    }
  }

  document.querySelectorAll('.mens-filters > button.mens-filter-item').forEach((button) => {
    const panel = document.createElement("div");
    panel.className = "mens-dynamic-filter-panel";
    panel.innerHTML = '<label><input type="checkbox"><span>Classic</span><small>(42)</small></label><label><input type="checkbox"><span>Popular choices</span><small>(28)</small></label><label><input type="checkbox"><span>New styles</span><small>(16)</small></label>';
    button.after(panel);
    button.addEventListener("click", () => {
      panel.classList.toggle("is-expanded");
      button.classList.toggle("is-open", panel.classList.contains("is-expanded"));
    });
  });

  document.querySelectorAll('.mens-filters details.mens-price-filter').forEach((filter) => {
    const summary = filter.querySelector('summary');
    const panel = filter.querySelector('.mens-filter-panel');
    if (!summary || !panel) return;
    if (filter.open) {
      panel.classList.add('is-expanded');
      summary.classList.add('is-expanded');
    }
    summary.addEventListener('click', (event) => {
      event.preventDefault();
      const expanding = !filter.open;
      if (expanding) {
        filter.open = true;
        requestAnimationFrame(() => {
          panel.classList.add('is-expanded');
          summary.classList.add('is-expanded');
        });
      } else {
        panel.classList.remove('is-expanded');
        summary.classList.remove('is-expanded');
        window.setTimeout(() => { filter.open = false; }, 450);
      }
    });
  });

  installSliderStyles();
  renderProducts();
  updateCartCount();
  setupMobileMenu();
  setupNewsletter();

  const arrivalsTrack = document.querySelector(".new-arrivals-track");
  const arrivalsPrev = document.querySelector(".new-arrivals-prev");
  const arrivalsNext = document.querySelector(".new-arrivals-next");
  if (arrivalsTrack && arrivalsPrev && arrivalsNext) {
    const getArrivalStep = () => {
      const card = arrivalsTrack.querySelector(".new-arrivals-card, .new-arrivals-box");
      return card ? card.getBoundingClientRect().width + 18 : 308;
    };

    let arrivalAnimationFrame;
    const smoothArrivalScroll = (target) => {
      cancelAnimationFrame(arrivalAnimationFrame);
      const start = arrivalsTrack.scrollLeft;
      const distance = target - start;
      const duration = 720;
      const startedAt = performance.now();
      const easeInOut = (value) => value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;

      const animate = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        arrivalsTrack.scrollLeft = start + distance * easeInOut(progress);
        if (progress < 1) arrivalAnimationFrame = requestAnimationFrame(animate);
      };

      arrivalAnimationFrame = requestAnimationFrame(animate);
    };

    const updateArrivalControls = () => {
      const maxScroll = arrivalsTrack.scrollWidth - arrivalsTrack.clientWidth;
      arrivalsPrev.hidden = arrivalsTrack.scrollLeft <= 4;
      arrivalsNext.hidden = maxScroll <= 4 || arrivalsTrack.scrollLeft >= maxScroll - 4;
    };

    arrivalsPrev.addEventListener("click", () => {
      smoothArrivalScroll(Math.max(0, arrivalsTrack.scrollLeft - getArrivalStep()));
    });

    arrivalsNext.addEventListener("click", () => {
      smoothArrivalScroll(Math.min(
        arrivalsTrack.scrollWidth - arrivalsTrack.clientWidth,
        arrivalsTrack.scrollLeft + getArrivalStep(),
      ));
    });

    arrivalsTrack.addEventListener("scroll", updateArrivalControls, { passive: true });
    window.addEventListener("resize", updateArrivalControls);
    updateArrivalControls();
  }
});

/* OUR COLLECTIONS — OVERLAPPING 3D CAROUSEL */
document.addEventListener("DOMContentLoaded", () => {
  const lovedSection = document.querySelector(".most-loved-section");
  if (lovedSection) {
    const filterButtons = lovedSection.querySelectorAll(".most-loved-filters button");
    const lovedTrack = lovedSection.querySelector(".most-loved-grid");
    const lovedCards = lovedSection.querySelectorAll(".most-loved-card");
    const lovedPrev = lovedSection.querySelector(".most-loved-prev");
    const lovedNext = lovedSection.querySelector(".most-loved-next");
    const updateLovedArrows = () => {
      const hasOverflow = lovedTrack.scrollWidth > lovedTrack.clientWidth + 2;
      lovedPrev.classList.toggle("is-visible", hasOverflow && lovedTrack.scrollLeft > 2);
      lovedNext.classList.toggle("is-visible", hasOverflow && lovedTrack.scrollLeft < lovedTrack.scrollWidth - lovedTrack.clientWidth - 2);
    };
    const lovedStep = () => lovedTrack.clientWidth * .82;

    lovedPrev.addEventListener("click", () => lovedTrack.scrollBy({ left: -lovedStep(), behavior: "smooth" }));
    lovedNext.addEventListener("click", () => lovedTrack.scrollBy({ left: lovedStep(), behavior: "smooth" }));
    lovedTrack.addEventListener("scroll", updateLovedArrows, { passive: true });
    window.addEventListener("resize", updateLovedArrows);
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
        lovedCards.forEach((card) => {
          const category = new URL(card.href, window.location.href).searchParams.get("category");
          card.hidden = filter !== "all" && category !== filter;
        });
          lovedTrack.scrollTo({ left: 0, behavior: "smooth" });
          requestAnimationFrame(updateLovedArrows);
      });
    });
    updateLovedArrows();
  }

  const section = document.querySelector(".new-arrivals-collections");
  const track = section?.querySelector(".new-arrivals-collections-track");
  const cards = track ? Array.from(track.querySelectorAll("a")) : [];
  const dots = section?.querySelector(".collections-carousel-dots");
  const previous = section?.querySelector(".collections-carousel-prev");
  const next = section?.querySelector(".collections-carousel-next");
  if (!section || !track || cards.length !== 5 || !dots || !previous || !next) return;

  let active = 0;
  let timer;
  let touchStart = 0;

  cards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.ariaLabel = `Show collection ${index + 1}`;
    dot.addEventListener("click", () => { active = index; render(); restart(); });
    dots.appendChild(dot);
  });

  function render() {
    // Let the browser paint the current state before applying the next one.
    // This keeps the CSS transitions visible when the carousel advances.
    track.classList.add("is-animating");
    cards.forEach((card, index) => {
      let offset = index - active;
      if (offset > 2) offset -= cards.length;
      if (offset < -2) offset += cards.length;
      card.dataset.position = offset;
      card.classList.toggle("is-active", offset === 0);
      card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
    });
    dots.querySelectorAll("button").forEach((dot, index) => dot.classList.toggle("is-active", index === active));
    window.setTimeout(() => track.classList.remove("is-animating"), 720);
  }

  function move(direction) {
    active = (active + direction + cards.length) % cards.length;
    render();
    restart();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => move(1), 3500);
  }

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  section.addEventListener("mouseenter", () => clearInterval(timer));
  section.addEventListener("mouseleave", restart);
  track.addEventListener("touchstart", (event) => { touchStart = event.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1);
  }, { passive: true });

  render();
  restart();
});

/* INFINITE JEWELLERY VIDEO LOOP */
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".jewellery-video-track");

  if (!track || track.dataset.loopReady === "true") return;

  track.dataset.loopReady = "true";

  const originalCards = Array.from(track.children);

  originalCards.forEach(function (card) {
    const clone = card.cloneNode(true);

    clone.querySelectorAll("video").forEach(function (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;

      video.play().catch(function () {});
    });

    track.appendChild(clone);
  });
});

/* JEWELLERY VIDEO CAROUSEL CONTROLS */
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".jewellery-carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".jewellery-video-track");
  const prev = carousel.querySelector(".jewellery-prev");
  const next = carousel.querySelector(".jewellery-next");

  if (!track || !prev || !next) return;

  function getStep() {
    const card = track.querySelector(".jewellery-video-card");
    if (!card) return 0;

    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  prev.addEventListener("click", function () {
    track.scrollBy({
      left: -getStep(),
      behavior: "smooth"
    });
  });

  next.addEventListener("click", function () {
    track.scrollBy({
      left: getStep(),
      behavior: "smooth"
    });
  });

  track.style.overflow = "visible";
});

/* ALL PRODUCTS — SEAMLESS INFINITE ROWS */
document.querySelectorAll(".all-products-track").forEach((track) => {
  if (track.dataset.duplicated === "true") return;

  track.dataset.duplicated = "true";

  const originalCards = Array.from(track.children);

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
});

/* HERO IMAGE AUTO SLIDER — 4 SECONDS */
document.addEventListener("DOMContentLoaded", function () {
  const heroImage = document.querySelector(".hero-image");
  if (!heroImage) return;

  const heroImages = [
    "images/Emerald Elegance Bridal Collection.png",
    "images/Everyday Luxury Bridal Jewelry Banner.png",
    "images/Red Solitare_ Happily Ever After.png",
    "images/Royal Blue Diamond Bridal Collection.png",
    "images/Velvet Luxe Jewelry Collection.png"
  ];

  let currentIndex = 0;

  setInterval(function () {
    currentIndex = (currentIndex + 1) % heroImages.length;

    heroImage.classList.add("slide-fade");

    setTimeout(function () {
      heroImage.src = heroImages[currentIndex];

      heroImage.onload = function () {
        heroImage.classList.remove("slide-fade");
      };
    }, 700);
  }, 4000);
});

/* CUSTOMER REVIEWS — CONTINUOUS SLIDER */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".reviews-row .reviews-track").forEach(function (track) {
    if (track.dataset.duplicated === "true") return;

    track.dataset.duplicated = "true";

    Array.from(track.children).forEach(function (card) {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  });
});

/* RED SOLITARE — FINAL 3D CURVED CAROUSEL
   Auto rotate + mouse drag + mobile swipe
*/

function initRedSolitareCarousel() {
  const grid = document.getElementById("productGrid");
  if (!grid || grid.dataset.redSolitareReady === "true") return;

  const cards = Array.from(
    grid.querySelectorAll(".product-card")
  ).slice(0, 6);

  // Wait if the products have not rendered yet.
  if (!cards.length) {
    requestAnimationFrame(initRedSolitareCarousel);
    return;
  }

  grid.dataset.redSolitareReady = "true";

  let rotation = 0;
  let lastTime = 0;
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startRotation = 0;
  let resumeAt = 0;

  const isMobile = () => window.innerWidth <= 650;

  function arrangeCards() {
    const mobile = isMobile();
    const radiusX = mobile ? 155 : 310;
    const radiusZ = mobile ? 55 : 100;
    const step = (Math.PI * 2) / cards.length;

    cards.forEach((card, index) => {
      const angle = index * step + rotation;
      const x = Math.sin(angle) * radiusX;
      const z = Math.cos(angle) * radiusZ;
      const depth = (z + radiusZ) / (2 * radiusZ);
      const scale = 0.72 + depth * 0.28;

      card.style.position = "absolute";
      card.style.left = "50%";
      card.style.top = "45%";
      card.style.width = mobile ? "145px" : "205px";
      card.style.margin = "0";
      card.style.zIndex = String(Math.round(depth * 100));
      card.style.opacity = String(0.48 + depth * 0.52);
      card.style.transition = "none";

      card.style.setProperty(
        "transform",
        `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${-Math.sin(angle) * 30}deg) scale(${scale})`,
        "important"
      );

      card.querySelectorAll("img").forEach((img) => {
        img.draggable = false;
      });
    });
  }

  grid.style.position = "relative";
  grid.style.display = "block";
  grid.style.width = "100%";
  grid.style.height = isMobile() ? "390px" : "480px";
  grid.style.overflow = "hidden";
  grid.style.perspective = "1400px";
  grid.style.transformStyle = "preserve-3d";
  grid.style.touchAction = "pan-y";
  grid.style.cursor = "grab";
  grid.style.userSelect = "none";

  function onPointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest("button")) return;

    dragging = true;
    moved = false;
    startX = event.clientX;
    startRotation = rotation;
    grid.style.cursor = "grabbing";
  }

  function onPointerMove(event) {
    if (!dragging) return;

    const delta = event.clientX - startX;

    if (Math.abs(delta) > 4) moved = true;

    if (moved) {
      rotation = startRotation + delta * 0.004;
      arrangeCards();
    }
  }

  function onPointerUp() {
    if (!dragging) return;

    dragging = false;
    grid.style.cursor = "grab";

    if (moved) resumeAt = performance.now() + 700;
  }

  grid.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  grid.addEventListener("click", (event) => {
    if (!moved) return;
    event.preventDefault();
    event.stopPropagation();
    moved = false;
  }, true);

  window.addEventListener("resize", () => {
    grid.style.height = isMobile() ? "390px" : "480px";
    arrangeCards();
  });

  function animate(time) {
    if (!lastTime) lastTime = time;

    const delta = Math.min(time - lastTime, 40);
    lastTime = time;

    if (!dragging && time >= resumeAt) {
      rotation += delta * 0.000055;
      arrangeCards();
    }

    requestAnimationFrame(animate);
  }

  arrangeCards();
  requestAnimationFrame(animate);
}

function startRedSolitareCarousel() {
  initRedSolitareCarousel();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    startRedSolitareCarousel,
    { once: true }
  );
} else {
  startRedSolitareCarousel();
}

function initSearchPlaceholder() {
  const searchInput = document.querySelector('.header-search input');
  if (!searchInput) return;

  const searchTerms = ['bangles', 'necklace', 'earrings', 'rings', 'chains'];
  let termIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  setTimeout(() => {
    function typeSearchTerm() {
      const term = searchTerms[termIndex];

      if (!deleting) {
        characterIndex++;
        searchInput.placeholder = `Search for ${term.slice(0, characterIndex)}`;
        if (characterIndex === term.length) {
          deleting = true;
          setTimeout(typeSearchTerm, 1200);
          return;
        }
      } else {
        characterIndex--;
        searchInput.placeholder = `Search for ${term.slice(0, characterIndex)}`;
        if (characterIndex === 0) {
          deleting = false;
          termIndex = (termIndex + 1) % searchTerms.length;
        }
      }

      setTimeout(typeSearchTerm, deleting ? 55 : 95);
    }

    typeSearchTerm();
  }, 3000);
}

function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle('nav-scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

/* SMOOTH HEADER NAVIGATION */
function initSmoothSectionLinks() {
  document.querySelectorAll('a[href="#new-arrivals-heading"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.getElementById("new-arrivals-heading");
      if (!target) return;

      event.preventDefault();
      window.scrollTo({
        top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - 180),
        behavior: "smooth",
      });
      history.pushState(null, "", "#new-arrivals-heading");
    });
  });
}

/* ESSENTIALS — scroll-linked cinematic split */
function initEssentialsReveal() {
  const reveal = document.querySelector('[data-essentials-reveal]');
  if (!reveal) return;

  const panels = [...reveal.querySelectorAll('.essentials-panel')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  // Essentials now uses a calm static banner followed by the category row.
  reveal.classList.add('is-static');
  return;

  function render() {
    frame = 0;
    if (reduced.matches || window.innerWidth <= 650) {
      reveal.classList.add('is-static');
      return;
    }

    const bounds = reveal.getBoundingClientRect();
    const travel = Math.max(1, bounds.height - window.innerHeight);
    const progress = Math.max(0, Math.min(1, -bounds.top / travel));
    const split = Math.max(0, Math.min(1, (progress - .08) / .62));
    const eased = 1 - Math.pow(1 - split, 3);
    const offsets = [-28, 0, 28];

    panels.forEach((panel, index) => {
      const x = offsets[index] * (1 - eased);
      const y = 12 * (1 - eased);
      const scale = .94 + eased * .06;
      panel.style.transform = `translate(${x}%, ${y}%) scale(${scale})`;
      const clip = `${50 * (1 - eased)}%`;
      panel.style.clipPath = `inset(0 ${clip} 0 ${clip})`;
      panel.style.webkitClipPath = `inset(0 ${clip} 0 ${clip})`;
      panel.style.opacity = String(eased);
    });
    reveal.classList.toggle('is-revealed', split > .82);
  }

  function requestRender() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender);
  reduced.addEventListener?.('change', requestRender);
  render();
}

function initSculptedPromos() {
  const promos = document.querySelectorAll('.sculpted-promo');
  if (!promos.length) return;
  if (!('IntersectionObserver' in window)) {
    promos.forEach((promo) => promo.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  promos.forEach((promo) => observer.observe(promo));
}

function initNewArrivalsReveal() {
  const section = document.querySelector('.new-arrivals-section');
  if (!section) return;
  if (!('IntersectionObserver' in window)) {
    section.classList.add('is-visible');
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    if (entries[0].isIntersecting) {
      section.classList.add('is-visible');
      currentObserver.disconnect();
    }
  }, { threshold: 0.2 });
  observer.observe(section);
}

document.querySelectorAll('.curated-wishlist').forEach((button) => {
  button.addEventListener('click', () => {
    const saved = button.classList.toggle('is-saved');
    button.textContent = saved ? '♥' : '♡';
    button.setAttribute('aria-pressed', String(saved));
  });
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNewArrivalsReveal, { once: true });
} else {
  initNewArrivalsReveal();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSculptedPromos, { once: true });
} else {
  initSculptedPromos();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSearchPlaceholder, { once: true });
} else {
  initSearchPlaceholder();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStickyHeader, { once: true });
} else {
  initStickyHeader();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSmoothSectionLinks, { once: true });
} else {
  initSmoothSectionLinks();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEssentialsReveal, { once: true });
} else {
  initEssentialsReveal();
}
