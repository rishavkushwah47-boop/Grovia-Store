const firebaseConfig = {
  apiKey: "AIzaSyAkqa81mtjgr9Cz3jTOB0c9PIZzs5R6OwE",
  authDomain: "grovia-store-19d42.firebaseapp.com",
  projectId: "grovia-store-19d42",
  storageBucket: "grovia-store-19d42.firebasestorage.app",
  messagingSenderId: "866549682795",
  appId: "1:866549682795:web:c2b9cdf4b3f4140ec7572e",
  measurementId: "G-TT7L0JPDPQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let windowRecaptchaVerifier = null;
let confirmationResultGlobal = null;

// --- Product Database ---
let products = [
    { id: 1, name: "Whole Farm Grocery Cashew", weight: "200 g", price: 213, oldPrice: 299, discount: "28% OFF", emoji: "🥜", salesCount: 45 },
    { id: 2, name: "Whole Farm Grocery Makhana", weight: "100 g", price: 140, oldPrice: 210, discount: "33% OFF", emoji: "🍿", salesCount: 82 },
    { id: 3, name: "Whole Farm Grocery Raisins", weight: "200 g", price: 118, oldPrice: 200, discount: "41% OFF", emoji: "🍇", salesCount: 30 },
    { id: 4, name: "Aashirvaad Superior MP Atta", weight: "5 kg", price: 235, oldPrice: 260, discount: "10% OFF", emoji: "🌾", salesCount: 95 },
    { id: 5, name: "Fortune Sun Lite Sunflower Oil", weight: "1 L", price: 130, oldPrice: 155, discount: "16% OFF", emoji: "🛢️", salesCount: 60 },
    { id: 6, name: "Tata Salt Vacuum Evaporated", weight: "1 kg", price: 28, oldPrice: 30, discount: "6% OFF", emoji: "🧂", salesCount: 110 }
];

let cart = {};
let isLoggedIn = false;

document.addEventListener("DOMContentLoaded", () => {
    renderHotDeals(products);
    renderTrending();
    checkLoginState();
    
    // Firebase Invisible reCAPTCHA Setup
    try {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible'
        });
    } catch (e) {
        console.log("reCAPTCHA setup note:", e);
    }
});

function renderHotDeals(items) {
    const container = document.getElementById("hotDealsContainer");
    if (!container) return;
    container.innerHTML = "";

    items.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <span class="discount-badge">${product.discount}</span>
                <div class="product-img">${product.emoji}</div>
                <div>
                    <div class="delivery-tag">🚚 1 Day Delivery</div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-weight">${product.weight}</div>
                </div>
                <div class="card-footer">
                    <div class="price-box">
                        <span class="current-price">₹${product.price}</span>
                        <span class="old-price">₹${product.oldPrice}</span>
                    </div>
                    <button class="add-btn" onclick="addToCart(${product.id})">ADD</button>
                </div>
            </div>
        `;
    });
}

function renderTrending() {
    const container = document.getElementById("trendingContainer");
    if (!container) return;
    container.innerHTML = "";

    let sortedProducts = [...products].sort((a, b) => b.salesCount - a.salesCount);

    sortedProducts.forEach(product => {
        container.innerHTML += `
            <div class="product-card" style="min-width: 155px;">
                <span class="discount-badge">${product.discount}</span>
                <div class="product-img">${product.emoji}</div>
                <div>
                    <div class="delivery-tag">🚚 1 Day Delivery</div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-weight">${product.weight}</div>
                </div>
                <div class="card-footer">
                    <div class="price-box">
                        <span class="current-price">₹${product.price}</span>
                    </div>
                    <button class="add-btn" onclick="addToCart(${product.id})">ADD</button>
                </div>
            </div>
        `;
    });
}

function addToCart(productId) {
    if (!isLoggedIn) {
        alert("Pehle Sign up / Login karein!");
        openProfileModal();
        return;
    }

    let product = products.find(p => p.id === productId);
    if (product) {
        product.salesCount += 15; 
        if (cart[productId]) {
            cart[productId].qty += 1;
        } else {
            cart[productId] = { ...product, qty: 1 };
        }
        updateCartUI();
        renderTrending();
    }
}

function updateCartUI() {
    let totalItems = 0;
    let totalPrice = 0;

    for (let id in cart) {
        totalItems += cart[id].qty;
        totalPrice += cart[id].price * cart[id].qty;
    }

    const cartBar = document.getElementById("cartBar");
    if (!cartBar) return;

    if (totalItems > 0 && isLoggedIn) {
        cartBar.style.display = "flex";
        document.getElementById("cartCount").innerText = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
        document.getElementById("cartTotal").innerText = `₹${totalPrice}`;
    } else {
        cartBar.style.display = "none";
    }
}

function openCartModal() {
    if (!isLoggedIn) {
        openProfileModal();
        return;
    }
    const modal = document.getElementById("cartModal");
    const listContainer = document.getElementById("cartItemsList");
    if (!modal || !listContainer) return;

    listContainer.innerHTML = "";
    let totalPrice = 0;

    for (let id in cart) {
        let item = cart[id];
        let itemTotal = item.price * item.qty;
        totalPrice += itemTotal;

        listContainer.innerHTML += `
            <div class="cart-item-row">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>₹${item.price} x ${item.qty}</small>
                </div>
                <div><b>₹${itemTotal}</b></div>
            </div>
        `;
    }

    document.getElementById("modalTotalPrice").innerText = `₹${totalPrice}`;
    modal.style.display = "flex";
}

function closeCartModal() {
    document.getElementById("cartModal").style.display = "none";
}

function checkoutOrder() {
    alert("Order placed successfully with Grovia Store! (1 Day Delivery)");
    cart = {};
    updateCartUI();
    closeCartModal();
}

function filterProducts() {
    let query = document.getElementById("searchInput").value.toLowerCase();
    let filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderHotDeals(filtered);
}

// --- Firebase Real SMS OTP Auth Logic ---
function openProfileModal() {
    let modal = document.getElementById("profileModal");
    if (modal) {
        modal.style.display = "flex";
        updateProfileView();
    }
}

function closeProfileModal() {
    if (!isLoggedIn) {
        alert("Saman kharidne ke liye login karna anivarya hai!");
        return;
    }
    let modal = document.getElementById("profileModal");
    if (modal) modal.style.display = "none";
}

function sendOtp() {
    let phoneInput = document.getElementById("userPhoneInput");
    if (!phoneInput) return;

    let phone = phoneInput.value;
    if (phone.length < 10) {
        alert("Kripya sahi 10 digit ka mobile number dalein!");
        return;
    }

    let fullPhoneNumber = "+91" + phone;
    let appVerifier = window.recaptchaVerifier;

    // Firebase actual SMS bhejega
    firebase.auth().signInWithPhoneNumber(fullPhoneNumber, appVerifier)
        .then(function (confirmationResult) {
            confirmationResultGlobal = confirmationResult;
            document.getElementById("loginPhoneStep").style.display = "none";
            document.getElementById("loginOtpStep").style.display = "block";
            document.getElementById("displaySentPhone").innerText = fullPhoneNumber;
            alert("Real SMS OTP aapke number par bhej diya gaya hai!");
        })
        .catch(function (error) {
            console.error("SMS Error:", error);
            alert("OTP bhejne mein error aaya: " + error.message);
        });
}

function verifyOtp() {
    let otpInputs = document.querySelectorAll(".otp-box");
    let otpCode = "";
    otpInputs.forEach(input => otpCode += input.value);

    if (otpCode.length < 4) {
        alert("Kripya poora OTP dalein!");
        return;
    }

    confirmationResultGlobal.confirm(otpCode).then(function (result) {
        let user = result.user;
        isLoggedIn = true;
        localStorage.setItem("groviaUser", user.phoneNumber);
        
        alert("Login Successful!");
        closeProfileModal();
        updateProfileView();
    }).catch(function (error) {
        alert("Galat OTP! Kripya dobara check karein.");
    });
}

function backToPhoneEdit() {
    document.getElementById("loginOtpStep").style.display = "none";
    document.getElementById("loginPhoneStep").style.display = "block";
}

function handleLogout() {
    firebase.auth().signOut().then(() => {
        isLoggedIn = false;
        localStorage.removeItem("groviaUser");
        let phoneInput = document.getElementById("userPhoneInput");
        if (phoneInput) phoneInput.value = "";
        closeProfileModal();
        checkLoginState();
    });
}

function checkLoginState() {
    let savedPhone = localStorage.getItem("groviaUser");
    if (savedPhone) {
        isLoggedIn = true;
    } else {
        isLoggedIn = false;
        openProfileModal(); // Pehli baar aane par mandatory login popup
    }
}

function updateProfileView() {
    let phoneStep = document.getElementById("loginPhoneStep");
    let otpStep = document.getElementById("loginOtpStep");
    let menuSec = document.getElementById("menuSection");
    let closeBtn = document.getElementById("closeModalBtn");

    if (!phoneStep || !otpStep || !menuSec) return;

    if (isLoggedIn) {
        phoneStep.style.display = "none";
        otpStep.style.display = "none";
        menuSec.style.display = "block";
        if (closeBtn) closeBtn.style.display = "block";
        
        let displayPhone = document.getElementById("displayUserPhone");
        if (displayPhone) {
            displayPhone.innerText = localStorage.getItem("groviaUser");
        }
    } else {
        phoneStep.style.display = "block";
        otpStep.style.display = "none";
        menuSec.style.display = "none";
        if (closeBtn) closeBtn.style.display = "none";
    }
}
