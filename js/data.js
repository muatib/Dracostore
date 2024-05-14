// Array Data JSON
const itemsData = [];

// Get items in JSON
function loadItems() {
    fetch('json/product.json')
        .then(response => response.json())
        .then(data => {
            itemsData.push(...data); // Add data to itemsData
            const container = document.getElementById('item-container');
            itemsData.forEach(item => {
                const article = document.createElement('div');
                article.classList.add('item');

                const name = document.createElement('div');
                name.classList.add('name');
                name.textContent = item.name;

                const price = document.createElement('div');
                price.classList.add('price');
                price.textContent = item.price + " po";

                const img = document.createElement('img');
                img.src = item.imageUrl;
                img.alt = item.altTxt;

                const addToCartButton = document.createElement('button');
                addToCartButton.textContent = "Ajouter au panier";
                addToCartButton.addEventListener('click', function () {
                    addPanier(item);
                });

                article.appendChild(name);
                article.appendChild(price);
                article.appendChild(img);
                article.appendChild(addToCartButton);

                container.appendChild(article);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des articles :', error));
}

// Add quantity to panier
function addPanier(article) {
    const cartList = document.getElementById('cart-list');

    // Show items in panier
    const existingItem = cartList.querySelector(`[data-id="${article._id}"]`);
    if (existingItem) {
        const quantityDisplay = existingItem.querySelector('.quantity');
        const quantity = parseInt(quantityDisplay.textContent);
        const availableQuantity = parseInt(article.quantité);
        if (quantity < availableQuantity) {
            quantityDisplay.textContent = quantity + 1;
            mettreAJourTotalPanier();
        } else {
            alert("La quantité disponible pour cet article est épuisée.");
        }
    } else {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-id', article._id);

        const itemName = document.createElement('span');
        itemName.textContent = article.name + " - " + article.price + " po";

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = "-";
        decreaseButton.addEventListener('click', function () {
            diminuerQuantite(listItem, article.price);
        });

        const quantityDisplay = document.createElement('span');
        quantityDisplay.classList.add('quantity');
        quantityDisplay.textContent = "1"; // Init to 1

        const increaseButton = document.createElement('button');
        increaseButton.textContent = "+";
        increaseButton.addEventListener('click', function () {
            augmenterQuantite(listItem, article.quantité, article.price);
        });

        listItem.appendChild(decreaseButton);
        listItem.appendChild(quantityDisplay);
        listItem.appendChild(increaseButton);
        listItem.appendChild(itemName);
        cartList.appendChild(listItem);

        mettreAJourTotalPanier(); // Total panier
    }
}

// Dicrease quantity in panier
function diminuerQuantite(listItem, price) {
    const quantityDisplay = listItem.querySelector('.quantity');
    const quantity = parseInt(quantityDisplay.textContent);
    if (quantity > 1) { // Not quantity negative
        quantityDisplay.textContent = quantity - 1;
        mettreAJourTotalPanier();
    }
}

// Add quantity in panier
function augmenterQuantite(listItem, availableQuantity, price) {
    const quantityDisplay = listItem.querySelector('.quantity');
    const quantity = parseInt(quantityDisplay.textContent);
    if (quantity < availableQuantity) {
        quantityDisplay.textContent = quantity + 1;
        mettreAJourTotalPanier();
    } else {
        alert("La quantité disponible pour cet article est épuisée.");
    }
}

window.onload = loadItems;