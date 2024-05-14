
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
                price.textContent = item.gold + " Or " + item.silver + " Ar";

                const img = document.createElement('img');
                img.src = item.imageUrl;
                img.alt = item.altTxt;

                img.addEventListener('click', function () {
                    addPanier(item);
                });

                article.appendChild(name);
                article.appendChild(price);
                article.appendChild(img);

                container.appendChild(article);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des articles :', error));
}

// Add quantity to cart
function addPanier(article) {
    const cartList = document.getElementById('cart-list');

    // Show items in cart
    const existingItem = cartList.querySelector(`[data-id="${article._id}"]`);
    if (existingItem) {
        const quantityDisplay = existingItem.querySelector('.quantity');
        const quantity = parseInt(quantityDisplay.textContent);
        const availableQuantity = parseInt(article.quantité);
        if (quantity < availableQuantity) {
            quantityDisplay.textContent = quantity + 1;
            UpdateTotalCart();
        } else {
            alert("La quantité disponible pour cet article est épuisée.");
        }
    } else {
        const listItem = document.createElement('li');
        listItem.classList.add('article-li');
        listItem.setAttribute('data-id', article._id);

        const itemName = document.createElement('span');
        itemName.classList.add('article-name');
        itemName.textContent = article.name + " - " + article.gold + " Or " + " et " +  article.silver + " Ar ";

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = "-";
        decreaseButton.classList.add('ico-moins');
        decreaseButton.addEventListener('click', function () {
            decrease(listItem, article.gold, article.silver);
        });

        const quantityDisplay = document.createElement('span');
        quantityDisplay.classList.add('quantity');
        quantityDisplay.textContent = "1"; // Init to 1

        const increaseButton = document.createElement('button');
        increaseButton.textContent = "+";
        increaseButton.classList.add('ico-plus');
        increaseButton.addEventListener('click', function () {
            increaseQuantity(listItem, article.quantité, article.gold, article.sivler);
        });

        listItem.appendChild(itemName);
        listItem.appendChild(decreaseButton);
        listItem.appendChild(quantityDisplay);
        listItem.appendChild(increaseButton);
        cartList.appendChild(listItem);

        UpdateTotalCart(); // Total Cart
    }
}

// Dicrease quantity in panier
function decrease(listItem, price) {
    const quantityDisplay = listItem.querySelector('.quantity');
    const quantity = parseInt(quantityDisplay.textContent);
    if (quantity > 1) { // Not quantity negative
        quantityDisplay.textContent = quantity - 1;
        UpdateTotalCart();
    }
}

// Add quantity in panier
function increaseQuantity(listItem, availableQuantity, price) {
    const quantityDisplay = listItem.querySelector('.quantity');
    const quantity = parseInt(quantityDisplay.textContent);
    if (quantity < availableQuantity) {
        quantityDisplay.textContent = quantity + 1;
        UpdateTotalCart();
    } else {
        alert("La quantité disponible pour cet article est épuisée.");
    }
}

window.onload = loadItems;
