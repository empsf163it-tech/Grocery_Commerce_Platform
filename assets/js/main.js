const KEY = "freshcart_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function setCart(c) {
  localStorage.setItem(KEY, JSON.stringify(c));
  updateCart();
  renderCart();
}

function updateCart() {
  document.querySelectorAll(".cart-count").forEach(e => e.textContent = getCart().length);
}

function addItem(name, price) {
  let c = getCart();
  c.push({ name, price });
  setCart(c);
  // Show brief feedback toast or animation on basket button
  const cartBtn = document.querySelector(".cart");
  if (cartBtn) {
    cartBtn.style.transform = "scale(1.1)";
    setTimeout(() => cartBtn.style.transform = "none", 200);
  }
}

function money(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function renderCart() {
  const box = document.querySelector("#cartList");
  if (!box) return;
  let c = getCart();
  box.innerHTML = c.length 
    ? c.map((x, i) => `<div class="cart-item"><span>${x.name}</span><strong>${money(x.price)}</strong></div>`).join("") 
    : "<p style='color:var(--muted)'>Your basket is empty.</p>";
  
  let total = c.reduce((a, x) => a + Number(x.price), 0);
  const t = document.querySelector("#cartTotal");
  if (t) t.textContent = money(total);
  const sub = document.querySelector("#cartSubtotal");
  if (sub) sub.textContent = money(total);
}

function filterProducts(cat, btn) {
  document.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
  if (btn) btn.classList.add("active");
  document.querySelectorAll("#productGrid .product, .grid .product").forEach((x, i) => {
    const show = cat === "all" || x.dataset.cat === cat;
    x.style.display = show ? "block" : "none";
    if (show) {
      x.animate([
        { opacity: .3, transform: "translateY(10px) scale(.98)" },
        { opacity: 1, transform: "none" }
      ], { duration: 350, delay: i * 45, fill: "both" });
    }
  });
}

function initTheme() {
  const sunSVG = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>';
  const moonSVG = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>';
  
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
  }
  
  const darkToggle = document.getElementById("darkToggle");
  if (darkToggle) {
    darkToggle.innerHTML = document.body.classList.contains("dark") ? sunSVG : moonSVG;
    darkToggle.onclick = () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      darkToggle.innerHTML = isDark ? sunSVG : moonSVG;
    };
  }
}

function highlightActiveMenu() {
  let currentPath = window.location.pathname.split("/").pop();
  if (!currentPath || currentPath === "/") currentPath = "index.html";
  
  // Map sub-pages to main menu items
  let targetMenuPath = currentPath;
  if (currentPath === "product.html") {
    targetMenuPath = "shop.html";
  } else if (currentPath === "checkout.html") {
    targetMenuPath = "delivery.html";
  }
  
  document.querySelectorAll(".menu a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === targetMenuPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function initMobileMenu() {
  const toggle = document.getElementById("mobileMenuToggle");
  const menu = document.querySelector(".menu");
  if (!toggle || !menu) return;
  
  const iconHamburger = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';
  const iconClose = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
  
  toggle.onclick = (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle("open");
    toggle.innerHTML = isOpen ? iconClose : iconHamburger;
  };

  document.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove("open");
      toggle.innerHTML = iconHamburger;
    }
  });
}

function initBackToTop() {
  let btn = document.querySelector(".back-to-top");
  if (!btn) {
    btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.setAttribute("title", "Back to top");
    btn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>';
    document.body.appendChild(btn);
  }

  const toggleVisible = () => {
    if (window.scrollY > 300) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", toggleVisible, { passive: true });
  toggleVisible();

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCart();
  renderCart();
  initTheme();
  initMobileMenu();
  highlightActiveMenu();
  initBackToTop();
});

