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
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
  }
  
  const darkToggle = document.getElementById("darkToggle");
  if (darkToggle) {
    darkToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    darkToggle.onclick = () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      darkToggle.textContent = isDark ? "☀️" : "🌙";
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

document.addEventListener("DOMContentLoaded", () => {
  updateCart();
  renderCart();
  initTheme();
  highlightActiveMenu();
});
