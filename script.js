/* =========================================
   DATA
   ========================================= */
const PRODUCTS = [
  { id: '1', name: 'Amul Taaza Toned Milk', unit: '500 ml', price: 27, mrp: 30, emoji: '🥛', cat: 'Dairy' },
  { id: '2', name: 'Britannia Brown Bread', unit: '400 g', price: 45, mrp: 55, emoji: '🍞', cat: 'Bakery' },
  { id: '3', name: 'Farm Fresh Eggs', unit: '6 pcs', price: 59, mrp: 75, emoji: '🥚', cat: 'Dairy' },
  { id: '4', name: 'Amul Butter', unit: '100 g', price: 58, mrp: 62, emoji: '🧈', cat: 'Dairy' },
  { id: '5', name: 'Robusta Banana', unit: '6 pcs', price: 42, mrp: 60, emoji: '🍌', cat: 'Fruits' },
  { id: '6', name: 'Hybrid Tomato', unit: '500 g', price: 24, mrp: 35, emoji: '🍅', cat: 'Vegetables' },
  { id: '7', name: 'Alphonso Mango', unit: '1 kg', price: 249, mrp: 320, emoji: '🥭', cat: 'Fruits' },
  { id: '8', name: 'Nashik Onion', unit: '1 kg', price: 35, mrp: 48, emoji: '🧅', cat: 'Vegetables' },
  { id: '9', name: "Lay's Magic Masala", unit: '52 g', price: 20, mrp: 20, emoji: '🍟', cat: 'Snacks' },
  { id: '10', name: 'Kurkure Masala Munch', unit: '90 g', price: 20, mrp: 20, emoji: '🥨', cat: 'Snacks' },
  { id: '11', name: 'Oreo Chocolate', unit: '120 g', price: 30, mrp: 40, emoji: '🍪', cat: 'Snacks' },
  { id: '12', name: 'Coca-Cola', unit: '750 ml', price: 40, mrp: 45, emoji: '🥤', cat: 'Drinks' },
  { id: '13', name: 'Red Bull Energy', unit: '250 ml', price: 115, mrp: 125, emoji: '⚡', cat: 'Drinks' },
  { id: '14', name: 'Maggi Noodles', unit: '70 g', price: 14, mrp: 15, emoji: '🍜', cat: 'Instant' }
];

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🛍️' },
  { id: 'Fruits', name: 'Fruits', icon: '🍎' },
  { id: 'Vegetables', name: 'Veggies', icon: '🥦' },
  { id: 'Dairy', name: 'Dairy', icon: '🥛' },
  { id: 'Snacks', name: 'Snacks', icon: '🍟' },
  { id: 'Drinks', name: 'Drinks', icon: '🥤' },
  { id: 'Instant', name: 'Instant', icon: '🍜' }
];

/* =========================================
   STATE
   ========================================= */
let cart = {}; // { productId: qty }
let activeCategory = 'all';
let searchQuery = '';

/* =========================================
   DOM ELEMENTS
   ========================================= */
const catContainer = document.getElementById('categories');
const gridContainer = document.getElementById('productGrid');
const sectionTitle = document.getElementById('sectionTitle');
const searchInput = document.getElementById('searchInput');

const floatingCart = document.getElementById('floatingCart');
const cartItemCount = document.getElementById('cartItemCount');
const cartTotalPrice = document.getElementById('cartTotalPrice');

const overlay = document.getElementById('overlay');
const cartDrawer = document.getElementById('cartDrawer');
const closeDrawer = document.getElementById('closeDrawer');
const cartItemsList = document.getElementById('cartItemsList');
const drawerTotal = document.getElementById('drawerTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

const toastEl = document.getElementById('toast');

/* =========================================
   FUNCTIONS
   ========================================= */
function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getCartCount() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function getCartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => sum + (getProduct(id).price * qty), 0);
}

let toastTimer;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2000);
}

/* =========================================
   RENDER: Categories
   ========================================= */
function renderCategories() {
  catContainer.innerHTML = CATEGORIES.map(c => `
    <div class="cat-item ${c.id === activeCategory ? 'active' : ''}" onclick="setCategory('${c.id}', '${c.name}')">
      <div class="cat-icon">${c.icon}</div>
      <span class="cat-name">${c.name}</span>
    </div>
  `).join('');
}

function setCategory(id, name) {
  activeCategory = id;
  sectionTitle.textContent = id === 'all' ? 'Daily Essentials ⚡' : `${name} ⚡`;
  renderCategories();
  renderProducts();
}

/* =========================================
   RENDER: Products
   ========================================= */
function renderProducts() {
  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'all' || p.cat === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    gridContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#777; padding:30px;">No products found 🥲</p>`;
    return;
  }

  gridContainer.innerHTML = filtered.map(p => {
    const qty = cart[p.id] || 0;
    
    return `
      <div class="card">
        <div class="time-tag">⚡ 10 MINS</div>
        <div class="thumb">${p.emoji}</div>
        <div class="name">${p.name}</div>
        <div class="unit">${p.unit}</div>
        
        <div class="price-row">
          <div class="price-box">
            <div class="price">₹${p.price}</div>
            ${p.mrp > p.price ? `<div class="mrp">₹${p.mrp}</div>` : ''}
          </div>
          
          ${qty > 0 ? `
            <div class="stepper">
              <button onclick="updateQty('${p.id}', -1)">−</button>
              <span>${qty}</span>
              <button onclick="updateQty('${p.id}', 1)">+</button>
            </div>
          ` : `
            <button class="add-btn" onclick="updateQty('${p.id}', 1)">ADD</button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

/* =========================================
   CART LOGIC
   ========================================= */
function updateQty(id, change) {
  if (!cart[id]) cart[id] = 0;
  
  cart[id] += change;

  if (cart[id] <= 0) {
    delete cart[id];
  } else if (change > 0) {
    showToast(`${getProduct(id).name} added`);
  }

  renderProducts();
  updateCartUI();
}

function updateCartUI() {
  const count = getCartCount();
  const total = getCartTotal();

  // Update Floating Bar
  if (count > 0) {
    cartItemCount.textContent = `${count} item${count > 1 ? 's' : ''}`;
    cartTotalPrice.textContent = `₹${total}`;
    floatingCart.classList.add('show');
  } else {
    floatingCart.classList.remove('show');
    // Close drawer if cart becomes empty
    if (cartDrawer.classList.contains('open')) {
      closeCartDrawer();
    }
  }

  // Update Drawer
  const cartIds = Object.keys(cart);
  if (cartIds.length === 0) {
    cartItemsList.innerHTML = `<p style="text-align:center; color:#777; padding:20px 0;">Your cart is empty 🛒</p>`;
  } else {
    cartItemsList.innerHTML = cartIds.map(id => {
      const p = getProduct(id);
      return `
        <div class="cart-item">
          <div class="cart-item-icon">${p.emoji}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">₹${p.price * cart[id]}</div>
          </div>
          <div class="stepper">
            <button onclick="updateQty('${p.id}', -1)">−</button>
            <span>${cart[id]}</span>
            <button onclick="updateQty('${p.id}', 1)">+</button>
          </div>
        </div>
      `;
    }).join('');
  }

  drawerTotal.textContent = `₹${total}`;
  checkoutBtn.disabled = count === 0;
}

/* =========================================
   DRAWER TOGGLE
   ========================================= */
function openCartDrawer() {
  if (getCartCount() === 0) return;
  cartDrawer.classList.add('open');
  overlay.classList.add('show');
  floatingCart.classList.remove('show'); // Hide floating bar when drawer is open
}

function closeCartDrawer() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('show');
  if (getCartCount() > 0) {
    floatingCart.classList.add('show'); // Show floating bar again
  }
}

floatingCart.addEventListener('click', openCartDrawer);
closeDrawer.addEventListener('click', closeCartDrawer);
overlay.addEventListener('click', closeCartDrawer);

/* =========================================
   CHECKOUT
   ========================================= */
checkoutBtn.addEventListener('click', () => {
  const total = getCartTotal();
  cart = {}; // Empty cart
  renderProducts();
  updateCartUI();
  closeCartDrawer();
  showToast(`Order placed for ₹${total}! 🎉`);
});

/* =========================================
   SEARCH
   ========================================= */
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  renderProducts();
});

/* =========================================
   INIT
   ========================================= */
renderCategories();
renderProducts();
updateCartUI();
