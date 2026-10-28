const safeStorage = (() => {
    const memory = new Map();
    try {
        const nativeStorage = window.localStorage;
        const testKey = "__grovia_storage_test__";
        nativeStorage.setItem(testKey, "1");
        nativeStorage.removeItem(testKey);
        return nativeStorage;
    }
    catch (error) {
        return {
            getItem: key => memory.has(key) ? memory.get(key) : null,
            setItem: (key, value) => memory.set(key, String(value)),
            removeItem: key => memory.delete(key),
            clear: () => memory.clear()
        };
    }
})();
const productsData = [
    { id: 'p1', name: 'Farm Fresh Milk', aliases: ['milk', 'doodh', 'dudh', 'full cream', 'toned milk'], category: 'Dairy & Eggs', unit: '500 ml', price: 32, old: 36, emoji: '🥛', tone: 'blue', tag: 'Daily essential' },
    { id: 'p2', name: 'Whole Wheat Atta', aliases: ['atta', 'aata', 'wheat flour', 'gehun ka atta', 'flour'], category: 'Staples', unit: '5 kg', price: 235, old: 260, emoji: '🌾', tone: 'yellow', tag: 'Value pack' },
    { id: 'p3', name: 'Fresh Potatoes', aliases: ['potato', 'potatoes', 'aloo', 'alu'], category: 'Vegetables', unit: '1 kg', price: 30, old: 36, emoji: '🥔', tone: 'yellow', tag: 'Fresh today' },
    { id: 'p4', name: 'Red Tomatoes', aliases: ['tomato', 'tomatoes', 'tamatar', 'tamaatar', 'tamatr'], category: 'Vegetables', unit: '500 g', price: 24, old: 30, emoji: '🍅', tone: 'peach', tag: 'Fresh today' },
    { id: 'p5', name: 'Bananas', aliases: ['banana', 'kela', 'kele'], category: 'Fruits', unit: '6 pcs', price: 42, old: 48, emoji: '🍌', tone: 'yellow', tag: 'Popular' },
    { id: 'p6', name: 'Farm Eggs', aliases: ['egg', 'eggs', 'anda', 'ande'], category: 'Dairy & Eggs', unit: '6 pcs', price: 48, old: 54, emoji: '🥚', tone: 'peach', tag: 'Protein pick' },
    { id: 'p7', name: 'Basmati Rice', aliases: ['rice', 'chawal', 'basmati', 'chaval'], category: 'Staples', unit: '1 kg', price: 89, old: 99, emoji: '🍚', tone: 'green', tag: 'Pantry' },
    { id: 'p8', name: 'Toor Dal', aliases: ['dal', 'daal', 'arhar', 'lentils', 'pulses'], category: 'Staples', unit: '1 kg', price: 145, old: 159, emoji: '🫘', tone: 'peach', tag: 'Pantry' },
    { id: 'p9', name: 'Fresh Spinach', aliases: ['spinach', 'palak', 'saag'], category: 'Vegetables', unit: '1 bunch', price: 22, old: 28, emoji: '🥬', tone: 'green', tag: 'Fresh today' },
    { id: 'p10', name: 'Apples', aliases: ['apple', 'seb', 'saib'], category: 'Fruits', unit: '4 pcs', price: 110, old: 125, emoji: '🍎', tone: 'peach', tag: 'Seasonal' },
    { id: 'p11', name: 'Cooking Oil', aliases: ['oil', 'tel', 'tail', 'sunflower oil', 'mustard oil'], category: 'Staples', unit: '1 L', price: 145, old: 160, emoji: '🫗', tone: 'yellow', tag: 'Kitchen' },
    { id: 'p12', name: 'Dishwash Liquid', aliases: ['dishwash', 'dish soap', 'bartan', 'cleaner'], category: 'Home essentials', unit: '500 ml', price: 79, old: 89, emoji: '🧴', tone: 'blue', tag: 'Home care' },
    { id: 'p13', name: 'Red Onions', aliases: ['onion', 'onions', 'pyaz', 'pyaaz'], category: 'Vegetables', unit: '1 kg', price: 38, old: 45, emoji: '🧅', tone: 'peach', tag: 'Daily essential' },
    { id: 'p14', name: 'Crisp Cucumbers', aliases: ['cucumber', 'kheera', 'kakdi'], category: 'Vegetables', unit: '500 g', price: 25, old: 32, emoji: '🥒', tone: 'green', tag: 'Fresh today' },
    { id: 'p15', name: 'Sweet Oranges', aliases: ['orange', 'oranges', 'santra', 'santara'], category: 'Fruits', unit: '4 pcs', price: 65, old: 75, emoji: '🍊', tone: 'peach', tag: 'Vitamin C' },
    { id: 'p16', name: 'Curd', aliases: ['curd', 'dahi', 'yogurt', 'yoghurt'], category: 'Dairy & Eggs', unit: '400 g', price: 38, old: 42, emoji: '🥣', tone: 'blue', tag: 'Chilled' },
    { id: 'p17', name: 'Daily Bread', aliases: ['bread', 'pav', 'bun', 'loaf'], category: 'Dairy & Eggs', unit: '400 g', price: 40, old: 45, emoji: '🍞', tone: 'yellow', tag: 'Bakery' },
    { id: 'p18', name: 'Classic Potato Chips', aliases: ['chips', 'crisps', 'lays', 'namkeen chips'], category: 'Snacks & Namkeen', unit: '52 g', price: 20, old: 25, emoji: '🥔', tone: 'yellow', tag: 'Snack time' },
    { id: 'p19', name: 'Masala Namkeen', aliases: ['namkeen', 'mixture', 'bhujia', 'sev', 'chanachur'], category: 'Snacks & Namkeen', unit: '150 g', price: 45, old: 50, emoji: '🥨', tone: 'peach', tag: 'Tea-time pick' },
    { id: 'p20', name: 'Butter Biscuits', aliases: ['biscuit', 'biscuits', 'cookies', 'parle', 'marie'], category: 'Snacks & Namkeen', unit: '200 g', price: 35, old: 40, emoji: '🍪', tone: 'yellow', tag: 'Family pack' },
    { id: 'p21', name: 'Mango Fruit Drink', aliases: ['juice', 'drink', 'mango juice', 'aam drink', 'beverage'], category: 'Drinks & Juices', unit: '1 L', price: 95, old: 110, emoji: '🧃', tone: 'yellow', tag: 'Refresh' },
    { id: 'p22', name: 'Tea Leaves', aliases: ['tea', 'chai', 'chay', 'chai patti'], category: 'Drinks & Juices', unit: '250 g', price: 115, old: 130, emoji: '🍵', tone: 'green', tag: 'Chai essential' },
    { id: 'p23', name: 'Milk Chocolate Bar', aliases: ['chocolate', 'chocolates', 'dairy milk', 'kitkat', 'sweet'], category: 'Sweets & Chocolates', unit: '40 g', price: 35, old: 40, emoji: '🍫', tone: 'peach', tag: 'Little treat' },
    { id: 'p24', name: 'Vanilla Ice Cream', aliases: ['ice cream', 'icecream', 'kulfi', 'frozen dessert'], category: 'Sweets & Chocolates', unit: '500 ml', price: 125, old: 145, emoji: '🍨', tone: 'blue', tag: 'Dessert' },
    { id: 'p25', name: 'Bathing Soap', aliases: ['soap', 'sabun', 'bath soap'], category: 'Personal care', unit: '100 g', price: 35, old: 40, emoji: '🧼', tone: 'blue', tag: 'Daily care' },
    { id: 'p26', name: 'Shampoo', aliases: ['shampoo', 'hair wash'], category: 'Personal care', unit: '180 ml', price: 99, old: 115, emoji: '🧴', tone: 'peach', tag: 'Personal care' },
    { id: 'p27', name: 'Laundry Detergent', aliases: ['detergent', 'washing powder', 'surf', 'kapde dhone ka powder'], category: 'Home essentials', unit: '1 kg', price: 115, old: 130, emoji: '🫧', tone: 'blue', tag: 'Home care' },
    { id: 'p28', name: 'Winter Moisturising Cream', aliases: ['moisturiser', 'moisturizer', 'cream', 'lotion', 'winter cream'], category: 'Personal care', unit: '100 ml', price: 89, old: 105, emoji: '🧴', tone: 'green', tag: 'Winter care' },
    { id: 'p29', name: 'Peanuts', aliases: ['peanut', 'peanuts', 'moongfali', 'mungfali'], category: 'Snacks & Namkeen', unit: '200 g', price: 55, old: 65, emoji: '🥜', tone: 'yellow', tag: 'Snack time' },
    { id: 'p30', name: 'Jaggery', aliases: ['jaggery', 'gur', 'gud'], category: 'Staples', unit: '500 g', price: 48, old: 55, emoji: '🍯', tone: 'peach', tag: 'Winter pantry' }
];
const categoriesData = [
    { name: 'Fresh produce', filter: 'Vegetables', emoji: '🥬', desc: 'Mandi-fresh vegetables', examples: ['🥬', '🍅', '🥔', '🧅'] },
    { name: 'Fruits', emoji: '🍎', desc: 'Everyday fruit picks', examples: ['🍎', '🍌', '🍊', '🍇'] },
    { name: 'Dairy & Eggs', emoji: '🥛', desc: 'Milk, bread, eggs & more', examples: ['🥛', '🥚', '🍞', '🥣'] },
    { name: 'Staples', emoji: '🌾', desc: 'Atta, rice, dal & grains', examples: ['🌾', '🍚', '🫘', '🍯'] },
    { name: 'Snacks & Namkeen', emoji: '🥨', desc: 'Tea-time and family packs', examples: ['🥔', '🥨', '🍪', '🥜'] },
    { name: 'Drinks & Juices', emoji: '🧃', desc: 'Chai, juices and refreshers', examples: ['🧃', '🍵', '🥤', '🫖'] },
    { name: 'Sweets & Chocolates', emoji: '🍫', desc: 'Small treats and desserts', examples: ['🍫', '🍨', '🍬', '🍪'] },
    { name: 'Personal care', emoji: '🧴', desc: 'Daily and winter care', examples: ['🧼', '🧴', '🫧', '🪥'] },
    { name: 'Home essentials', filter: 'Home essentials', emoji: '🧽', desc: 'Keep your home sorted', examples: ['🧴', '🫧', '🧹', '🧺'] }
];
const couponData = { GROVIA10: { type: 'percent', value: 10, min: 199, max: 50, label: '10% off up to ₹50 on ₹199+' }, WELCOME20: { type: 'flat', value: 20, min: 299, max: 20, label: '₹20 off on ₹299+' }, FRESH5: { type: 'percent', value: 5, min: 99, max: 25, label: '5% off up to ₹25 on ₹99+' } };
let cart = JSON.parse(safeStorage.getItem('groviaCartV4') || '{}'), user = JSON.parse(safeStorage.getItem('groviaUserV4') || 'null'), addresses = JSON.parse(safeStorage.getItem('groviaAddressesV4') || '[]'), favs = JSON.parse(safeStorage.getItem('groviaFavsV4') || '[]'), orders = JSON.parse(safeStorage.getItem('groviaOrdersV4') || '[]'), coupon = null, currentCategory = 'All', query = '', currentView = 'store', toastTimer;
const $ = id => document.getElementById(id);
const money = n => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
function save() { safeStorage.setItem('groviaCartV4', JSON.stringify(cart)); safeStorage.setItem('groviaUserV4', JSON.stringify(user)); safeStorage.setItem('groviaAddressesV4', JSON.stringify(addresses)); safeStorage.setItem('groviaFavsV4', JSON.stringify(favs)); safeStorage.setItem('groviaOrdersV4', JSON.stringify(orders)); }
function toast(msg) { const el = $('toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2800); }
function normal(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim(); }
function levenshtein(a, b) { let prev = Array.from({ length: b.length + 1 }, (_, i) => i); for (let i = 1; i <= a.length; i++) {
    let cur = [i];
    for (let j = 1; j <= b.length; j++)
        cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
} return prev[b.length]; }
function scoreProduct(p, q) { const terms = [p.name, p.category, ...p.aliases].map(normal), tokens = q.split(' '); let best = 0; for (const t of terms) {
    if (t === q)
        best = Math.max(best, 100);
    else if (t.startsWith(q))
        best = Math.max(best, 82);
    else if (t.includes(q))
        best = Math.max(best, 70);
    for (const tok of tokens) {
        if (t.split(' ').some(w => w === tok))
            best = Math.max(best, 75);
        else if (tok.length >= 3 && t.split(' ').some(w => levenshtein(w, tok) <= 1))
            best = Math.max(best, 55);
    }
} const all = terms.join(' '); if (tokens.every(tok => all.includes(tok)))
    best = Math.max(best, 60); return best; }
function productCard(p) { return `<article class="product"><div class="product-art ${p.tone}"><span class="product-tag">${p.tag}</span><span>${p.emoji}</span></div><div class="product-body"><h3>${p.name}</h3><div class="muted">${p.unit} · ${p.category}</div><div class="product-foot"><div><div class="price">${money(p.price)}</div><div class="muted" style="text-decoration:line-through;font-size:.75rem">${money(p.old)}</div></div><button class="add" onclick="addToCart('${p.id}')" aria-label="Add ${p.name} to cart">+</button></div><button class="linkbtn" style="padding:8px 0 0" onclick="toggleFav('${p.id}')">${favs.includes(p.id) ? '♥ Saved' : '♡ Save'}</button></div></article>`; }
function renderCategories() { $('categories').innerHTML = categoriesData.map(c => `<button class="category" onclick="selectCategory('${c.name}')"><span class="cat-emoji">${c.emoji}</span><span><strong>${c.name}</strong><br><span class="muted small">${c.desc}</span></span></button>`).join(''); }
function renderProducts() { let list = productsData.map(p => ({ ...p, _score: query ? scoreProduct(p, normal(query)) : 1 })); if (query)
    list = list.filter(p => p._score >= 40).sort((a, b) => b._score - a._score);
else if (currentCategory !== 'All')
    list = list.filter(p => p.category === currentCategory); const isSearch = !!query; $('categoryArea').classList.toggle('hidden', isSearch || currentCategory !== 'All'); $('resultsBar').classList.toggle('hidden', !isSearch); $('resultsText').textContent = `${list.length} product${list.length === 1 ? '' : 's'} found for “${query}”`; $('shopTitle').textContent = isSearch ? 'Search results' : currentCategory === 'All' ? 'What do you need today?' : currentCategory; $('shopEyebrow').textContent = isSearch ? 'Matched products' : currentCategory === 'All' ? 'Shop the everyday' : 'Browse category'; $('shopSub').textContent = isSearch ? 'Relevant products first — no banners or extra sections in your way.' : 'Fresh picks for your home.'; $('products').innerHTML = list.map(productCard).join(''); $('products').classList.toggle('hidden', list.length === 0); $('noResults').classList.toggle('hidden', list.length !== 0); }
function handleSearch(v) { query = v; currentCategory = 'All'; $('searchDesktop').value = v; $('searchMobile').value = v; renderProducts(); }
function clearSearch() { query = ''; $('searchDesktop').value = ''; $('searchMobile').value = ''; currentCategory = 'All'; renderProducts(); }
function focusResults() { $('shop').scrollIntoView({ behavior: 'smooth' }); $('products').focus?.(); }
function selectCategory(c) { query = ''; $('searchDesktop').value = ''; $('searchMobile').value = ''; currentCategory = c; renderProducts(); $('shop').scrollIntoView({ behavior: 'smooth' }); }
function addToCart(id) { cart[id] = (cart[id] || 0) + 1; save(); renderCounts(); toast('Added to cart'); if (query)
    renderProducts(); }
function changeQty(id, d) { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0)
    delete cart[id]; save(); renderCounts(); openCart(); }
function renderCounts() { let n = Object.values(cart).reduce((a, b) => a + b, 0); ['cartCount', 'cartCount2', 'navCartCount'].forEach(id => { if ($(id))
    $(id).textContent = n; }); $('accountLabel').textContent = user ? user.name.split(' ')[0] : 'Sign in'; }
function modal(title, body, opts = {}) { $('overlayRoot').innerHTML = `<div class="modal-backdrop" onclick="if(event.target===this)closeModal()"><section class="modal ${opts.wide ? 'wide-modal' : ''}" role="dialog" aria-modal="true" aria-label="${title}"><div class="modal-top"><div><div class="eyebrow">Grovia Store</div><h2>${title}</h2></div><button class="close" onclick="closeModal()" aria-label="Close">×</button></div>${body}</section></div>`; document.body.style.overflow = 'hidden'; setTimeout(() => { $('overlayRoot').querySelector('input,button,select')?.focus(); }, 80); }
function closeModal() { $('overlayRoot').innerHTML = ''; document.body.style.overflow = ''; }
function openAuth(mode = 'signup') { if (user) {
    openProfile();
    return;
} let isSignup = mode === 'signup'; modal(isSignup ? 'Create your account' : 'Customer sign-in', `<p class="muted">${isSignup ? 'Create an account first. Your account is saved in this demo browser.' : 'Only previously registered accounts can sign in. New customers must sign up first.'}</p><form onsubmit="submitAuth(event,'${mode}')">${isSignup ? `<div class="field"><label>Full name</label><input name="name" required autocomplete="name" placeholder="Full name"></div>` : ''}<div class="field"><label>Mobile number</label><div style="display:flex;gap:8px"><input id="authPhone" name="phone" inputmode="numeric" pattern="[6-9][0-9]{9}" maxlength="10" required placeholder="Mobile number" style="flex:1;min-width:0"><button class="btn soft" type="button" onclick="sendCustomerOtp()">Send OTP</button></div></div><div class="field"><label>6-digit OTP</label><input id="authOtp" name="otp" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required placeholder="6-digit code"></div>${isSignup ? `<div class="field"><label>Email (optional)</label><input name="email" type="email" placeholder="you@example.com"></div>` : ''}<button class="btn primary wide" type="submit">${isSignup ? 'Create account' : 'Continue to sign in'}</button></form><div class="notice">${isSignup ? 'Demo OTP is 123456 after tapping Send OTP. This does not send a real SMS. Real OTP verification requires a backend/SMS provider.' : 'Demo OTP is 123456 after tapping Send OTP. This does not send a real SMS. Login is allowed only for an account already signed up in this browser.'}</div><p style="text-align:center;margin-bottom:0">${isSignup ? 'Already registered?' : 'New to Grovia?'} <button class="linkbtn" onclick="openAuth('${isSignup ? 'login' : 'signup'}')">${isSignup ? 'Sign in' : 'Sign up first'}</button></p>`); }
function sendCustomerOtp() { const phone = $('authPhone')?.value.trim(); if (!/^[6-9][0-9]{9}$/.test(phone || '')) {
    toast('Enter a valid 10-digit mobile number first');
    return;
} const isRegistered = JSON.parse(safeStorage.getItem('groviaRegisteredPhoneV4') || '[]').includes(phone); const form = $('authPhone').closest('form'); const mode = form?.getAttribute('onsubmit')?.includes('signup') ? 'signup' : 'login'; if (mode === 'login' && !isRegistered) {
    toast('Account not found. Sign up first, then log in.');
    return;
} window.groviaDemoOtpSent = { phone, mode }; toast('Demo OTP ready: 123456 (no SMS sent)'); }
function submitAuth(e, mode) { e.preventDefault(); const fd = new FormData(e.target), phone = String(fd.get('phone')).trim(); if (mode === 'signup') {
    user = { name: String(fd.get('name')).trim(), phone, email: String(fd.get('email') || ''), createdAt: new Date().toISOString() };
    save();
    closeModal();
    renderCounts();
    toast('Demo account created. Real OTP verification is not connected.');
    return;
} const existing = JSON.parse(safeStorage.getItem('groviaRegisteredPhoneV4') || '[]'); if (!existing.includes(phone)) {
    toast('Account not found. Please sign up first.');
    return;
} user = JSON.parse(safeStorage.getItem('groviaUserV4') || 'null'); if (!user || user.phone !== phone) {
    toast('This demo only recognises the current browser account. Backend login is required for real accounts.');
    return;
} closeModal(); renderCounts(); toast('Signed in in this demo'); }
function openCart() { const rows = Object.entries(cart).map(([id, q]) => ({ p: productsData.find(p => p.id === id), q })).filter(x => x.p); let subtotal = rows.reduce((s, x) => s + x.p.price * x.q, 0), discount = coupon ? couponDiscount(subtotal) : 0; modal('Your cart', rows.length ? `${rows.map(({ p, q }) => `<div class="cart-row"><div class="mini-art">${p.emoji}</div><div><strong>${p.name}</strong><div class="muted small">${p.unit} · ${money(p.price)}</div><div class="qty" style="margin-top:7px"><button onclick="changeQty('${p.id}',-1)">−</button><strong>${q}</strong><button onclick="changeQty('${p.id}',1)">+</button></div></div><strong>${money(p.price * q)}</strong></div>`).join('')}<div style="margin-top:18px"><div class="field"><label>Coupon code</label><div style="display:flex;gap:8px"><input id="couponInput" placeholder="GROVIA10 / WELCOME20" value="${coupon?.code || ''}"><button class="btn soft" onclick="applyCoupon()">Apply</button></div><div class="muted small">Demo coupons: GROVIA10, WELCOME20, FRESH5. Conditions apply.</div></div><div class="total-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="total-row"><span>Coupon discount</span><strong>−${money(discount)}</strong></div><div class="total-row"><span>Delivery fee</span><span>Calculated after serviceability is configured</span></div><div class="total-row" style="font-size:1.1rem;border-top:1px solid var(--line);padding-top:12px"><strong>Items total</strong><strong>${money(Math.max(0, subtotal - discount))}</strong></div><button class="btn primary wide" onclick="startCheckout()">Continue to checkout →</button></div>` : `<div class="empty"><div style="font-size:2.5rem">▣</div><h3>Your cart is waiting</h3><p class="muted">Add a few everyday essentials to get started.</p><button class="btn primary" onclick="closeModal();document.getElementById('shop').scrollIntoView({behavior:'smooth'})">Explore products</button></div>`); }
function couponDiscount(subtotal) { if (!coupon || subtotal < coupon.min)
    return 0; return coupon.type === 'flat' ? coupon.value : Math.min(subtotal * coupon.value / 100, coupon.max); }
function applyCoupon() { let code = String($('couponInput')?.value || '').trim().toUpperCase()
