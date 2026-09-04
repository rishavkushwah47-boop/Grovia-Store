const firebaseConfig = {
    apiKey: "AIzaSyAkqa8imtJgr9Cz3jTOB0c9PIzzs...",
    authDomain: "grovia-store-19d42.firebaseapp.com",
    projectId: "grovia-store-19d42",
    storageBucket: "grovia-store-19d42.firebasestorage.app",
    messagingSenderId: "866549682795",
    appId: "1:866549682795:web:c2b9cdf4b3f414ec7572e",
    measurementId: "G-TT7L0JPDPQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let recaptchaVerifier = null;
let confirmationResultGlobal = null;

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
    
    try {
        recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible'
        });
        recaptchaVerifier.render();
    } catch (e) {
        console.log("reCAPTCHA init note:", e);
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

// Mandatory login only when user clicks ADD to cart
function addToCart(productId) {
    if (!isLoggedIn) {
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
    alert("Order successfully placed with Grovia Store! Thank you for shopping.");
    cart = {};
    updateCartUI();
    closeCartModal();
}

function filterProducts() {
    let query = document.getElementById("searchInput").value.toLowerCase();
    let filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderHotDeals(filtered);
}

// --- Firebase Phone Authentication Logic ---
function openProfileModal() {
    let modal = document.getElementById("profileModal");
    if (modal) {
        modal.style.display = "flex";
        updateProfileView();
    }
}

function closeProfileModal() {
    if (!isLoggedIn) {
        alert("Please login / sign up to continue shopping!");
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
        alert("Please enter a valid 10-digit mobile number!");
        return;
    }

    let fullPhoneNumber = "+91" + phone;

    firebase.auth().signInWithPhoneNumber(fullPhoneNumber, recaptchaVerifier)
        .then(function (confirmationResult) {
            confirmationResultGlobal = confirmationResult;
            document.getElementById("loginPhoneStep").style.display = "none";
            document.getElementById("loginOtpStep").style.display = "block";
            document.getElementById("displaySentPhone").innerText = fullPhoneNumber;
            alert("Real SMS OTP sent successfully to your mobile number!");
        })
        .catch(function (error) {
            console.error("SMS Error:", error);
            alert("Error sending OTP: " + error.message);
        });
}

function verifyOtp() {
    let otpInput = document.getElementById("otpCodeInput");
    if (!otpInput) return;

    let otpCode = otpInput.value;
    if (otpCode.length < 6) {
        alert("Please enter the complete 6-digit OTP!");
        return;
    }

    confirmationResultGlobal.confirm(otpCode).then(function (result) {
        let user = result.user;
        isLoggedIn = true;
        localStorage.setItem("groviaUser", user.phoneNumber);
        
        alert("Login Successful!");
        closeProfileModal();
        updateProfileView();
        updateCartUI();
    }).catch(function (error) {
        alert("Invalid OTP! Please check and try again.");
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
        cart = {};
        updateCartUI();
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
