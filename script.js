const products = [

    {
        id: 1,
        name: "Fresh Milk",
        unit: "1 L",
        price: 65,
        image: "https://via.placeholder.com/200"
    },

    {
        id: 2,
        name: "Fresh Bananas",
        unit: "1 kg",
        price: 50,
        image: "https://via.placeholder.com/200"
    },

    {
        id: 3,
        name: "Potato",
        unit: "1 kg",
        price: 40,
        image: "https://via.placeholder.com/200"
    },

    {
        id: 4,
        name: "Tomato",
        unit: "1 kg",
        price: 45,
        image: "https://via.placeholder.com/200"
    },

    {
        id: 5,
        name: "Biscuits",
        unit: "200 g",
        price: 30,
        image: "https://via.placeholder.com/200"
    },

    {
        id: 6,
        name: "Cold Drink",
        unit: "750 ml",
        price: 45,
        image: "https://via.placeholder.com/200"
    }

];


function displayProducts(productList = products) {

    const container =
        document.getElementById("productContainer");


    if (!container) return;


    container.innerHTML = "";


    productList.forEach(product => {

        const card =
            document.createElement("div");


        card.className =
            "product-card";


        card.innerHTML = `

            <img
                src="${product.image}"
                class="product-image"
                alt="${product.name}"
            >

            <div class="product-name">
                ${product.name}
            </div>

            <div class="product-unit">
                ${product.unit}
            </div>

            <div class="product-price">
                ₹${product.price}
            </div>

            <button
                class="add-cart"
                onclick="addToCart(${product.id})"
            >
                Add
            </button>

        `;


        container.appendChild(card);

    });

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        displayProducts();

    }
);
