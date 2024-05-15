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

                const coinMoney = document.getElementById('coinTemplate');
                const productMoney = document.importNode(coinMoney.content, true);

                productMoney.querySelector('.js-coin-gold').textContent = item.gold;
                productMoney.querySelector('.js-coin-gold-img').src = 'img/or.png';
                productMoney.querySelector('.js-coin-silver').textContent = item.silver;
                productMoney.querySelector('.js-coin-silver-img').src = 'img/silver.png';

                const price = document.createElement('div');
                price.classList.add('price');
                price.append(productMoney);

                const img = document.createElement('img');
                img.src = item.imageUrl;
                img.alt = item.altTxt;

                img.addEventListener('click', function () {
                    addPanier(item);
                });

                const remaining = document.createElement('div');
                remaining.classList.add('remaining');
                remaining.textContent = item.quantité;

                article.appendChild(name);
                article.appendChild(price);
                article.appendChild(remaining);
                article.appendChild(img);
                article.appendChild(productMoney);

                container.appendChild(article);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des articles :', error));
}


// Update total cart
function UpdateTotalCart() {
    const cartList = document.getElementById('cart-list');
    const items = cartList.getElementsByClassName('article-li');
    let totalGold = 0;
    let totalSilver = 0;
    let totalQuantity = 0; // Variable pour stocker le nombre total d'articles
    for (let item of items) {
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        const gold = parseInt(item.getAttribute('data-gold'));
        const silver = parseInt(item.getAttribute('data-silver'));
        totalGold += gold * quantity;
        totalSilver += silver * quantity;
        totalQuantity += quantity; // Ajouter la quantité de chaque article au total
    }

    // Convertir la valeur d'argent en valeur d'or (1 or = 100 argent)
    const totalSilverToGold = totalSilver / 100;
    const totalAmount = totalGold + totalSilverToGold;

    const gold = Math.floor(totalAmount);
    const silver = Math.round((totalAmount - gold) * 100);

    const totalCartElement = document.getElementById('total-cart');
    totalCartElement.textContent = `TOTAL : ${gold} Or et ${silver} Ar`; // Afficher le total en or et argent

    // Calcul de la TVA
    const tva = totalAmount * 0.13;
    const totalWithTVA = totalAmount + tva;

    // Création de la div pour afficher la TVA
    const tvaElement = document.getElementById('total-taxe');
    tvaElement.textContent = `TVA (13%) : ${tva.toFixed(2)} po`; // Affichage de la TVA avec 2 décimales

    // Insertion de la div après le total
    totalCartElement.insertAdjacentElement('afterend', tvaElement);

    // Afficher le nombre total d'articles
    const totalArticleElement = document.getElementById('total-article');
    totalArticleElement.textContent = `Nombre total d'articles : ${totalQuantity}`;
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
        itemName.textContent = article.name + " - " + article.gold + " Or et " + article.silver + " Ar";

        // Adding data-gold and data-silver attributes to the list item
        listItem.setAttribute('data-gold', article.gold);
        listItem.setAttribute('data-silver', article.silver);

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
            increaseQuantity(listItem, article.quantité, article.gold, article.silver);
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
function decrease(listItem) {
    const quantityDisplay = listItem.querySelector('.quantity');
    const quantity = parseInt(quantityDisplay.textContent);
    if (quantity > 1) { // Not quantity negative
        quantityDisplay.textContent = quantity - 1;
        UpdateTotalCart();
    }
}

// Add quantity in panier
function increaseQuantity(listItem, availableQuantity) {
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