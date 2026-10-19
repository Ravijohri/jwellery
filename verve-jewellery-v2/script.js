
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
  installSliderStyles();
  renderProducts();
  updateCartCount();
  setupMobileMenu();
  setupNewsletter();
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
    heroImage.src,
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=2000&q=85",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=85"
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
