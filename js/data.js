const itemsData = [];

function UpdateTotalCart() {
    const cartList = document.getElementById('cart-list');
    const items = cartList.getElementsByClassName('article-li');
    let totalGold = 0;
    let totalSilver = 0;
    let totalQuantity = 0;
    for (let item of items) {
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        const gold = parseInt(item.getAttribute('data-gold'));
        const silver = parseInt(item.getAttribute('data-silver'));
        totalGold += gold * quantity;
        totalSilver += silver * quantity;
        totalQuantity += quantity;
    }

    // Convert silver to gold (1 or = 100 argent)
    const totalSilverToGold = totalSilver / 100;
    const totalAmount = totalGold + totalSilverToGold;

    // Update total 
    const totalCartElement = document.getElementById('total-cart');
    totalCartElement.innerHTML = '';

    
    ////////////////
    ///Correction///
    ////////////////
    const tva = totalAmount * 0.13;
    const totalWithTVA = totalAmount + tva;

    const totalCartText = document.createElement("span");
    totalCartText.textContent = `TOTAL : ${totalWithTVA.toFixed(2)} `;
    totalCartElement.appendChild(totalCartText);
    ////////////////

    const goldImg = document.createElement("img");
    goldImg.src = "img/or.png";
    goldImg.alt = "Or";
    goldImg.classList.add('total-gold-img');
    totalCartElement.appendChild(goldImg);

    const silverImg = document.createElement("img");
    silverImg.src = "img/silver.png";
    silverImg.alt = "Ar";
    totalCartElement.appendChild(silverImg);


    const tvaElement = document.getElementById('total-taxe');
    tvaElement.innerHTML = '';

    const tvaText = document.createElement("span");
    tvaText.textContent = `TVA (13%) : ${tva.toFixed(2)} `;
    tvaElement.appendChild(tvaText);

    const goldImgTva = document.createElement("img");
    goldImgTva.src = "img/or.png";
    goldImgTva.alt = "Or";
    goldImgTva.classList.add('total-gold-img');
    tvaElement.appendChild(goldImgTva);

    totalCartElement.insertAdjacentElement('afterend', tvaElement);

    // Update Total items in list
    const totalArticleElement = document.getElementById('total-article');
    if (totalArticleElement) {
        totalArticleElement.textContent = `${totalQuantity} Article(s)`;
    }
}

function addPanier(article) {
    const cartList = document.getElementById('cart-list');

    // Check if the item is already in the cart
    const existingItem = cartList.querySelector(`[data-id="${article._id}"]`);
    if (existingItem) {
        // Update quantity of existing item
        const quantityDisplay = existingItem.querySelector('.quantity');
        const quantity = parseInt(quantityDisplay.textContent);
        const availableQuantity = parseInt(article.quantité);
        if (quantity < availableQuantity) {
            quantityDisplay.textContent = quantity + 1;

            // Update the “remaining” quantity
            const remainingElement = document.querySelector(`.remaining[data-id="${article._id}"]`);
            remainingElement.textContent = availableQuantity - (quantity + 1);

            // Check stock quantity and update CSS class
            if (remainingElement.textContent <= 5) {
                remainingElement.classList.add('low-stock');
            } else {
                remainingElement.classList.remove('low-stock');
            }

            UpdateTotalCart();
        } else {
            alert("La quantité disponible pour cet article est épuisée.");
        }
    } else {
        // Create a new list item for the item
        const listItem = document.createElement('li');
        listItem.classList.add('article-li');
        listItem.setAttribute('data-id', article._id);

        // Create an element for the article name
        const itemName = document.createElement('span');
        itemName.classList.add('article-name');
        itemName.textContent = article.name;

        // Create item for item price
        const coinMoney = document.getElementById('coinTemplate');
        const itemPrice = document.importNode(coinMoney.content, true);

        itemPrice.querySelector('.js-coin-gold').textContent = article.gold;
        itemPrice.querySelector('.js-coin-gold-img').src = 'img/or.png';
        itemPrice.querySelector('.js-coin-silver').textContent = article.silver;
        itemPrice.querySelector('.js-coin-silver-img').src = 'img/silver.png';

        // Add data-gold and data-silver attributes to list item
        listItem.setAttribute('data-gold', article.gold);
        listItem.setAttribute('data-silver', article.silver);

        // Create elements for quantity buttons
        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = "-";
        decreaseButton.classList.add('ico-moins');
        decreaseButton.addEventListener('click', function () {
            decrease(listItem);
        });

        const quantityDisplay = document.createElement('span');
        quantityDisplay.classList.add('quantity');
        quantityDisplay.textContent = "1";

        const increaseButton = document.createElement('button');
        increaseButton.textContent = "+";
        increaseButton.classList.add('ico-plus');
        increaseButton.addEventListener('click', function () {
            increaseQuantity(listItem, article.quantité);
        });

        //Article template
        const ArticleMoney = document.getElementById('articleTemplate');
        const productArticle = document.importNode(ArticleMoney.content, true);
        const recycleButton = productArticle.querySelector('.js-recyble-button');
        recycleButton.addEventListener('click', function () {
            removeItemFromCart(listItem, article.quantité, article.gold, article.silver);
        });

        listItem.appendChild(itemName);
        listItem.appendChild(itemPrice);
        listItem.appendChild(decreaseButton);
        listItem.appendChild(quantityDisplay);
        listItem.appendChild(increaseButton);
        listItem.appendChild(recycleButton);
        cartList.appendChild(listItem);

        UpdateTotalCart();
    }
}

///////NOUVEAU////////
document.getElementById('clear-cart-button').addEventListener('click', function () {
    clearCart();
});


function decrease(listItem) {
    const quantityDisplay = listItem.querySelector('.quantity');
    const quantity = parseInt(quantityDisplay.textContent);
    const articleId = listItem.getAttribute('data-id');
    const article = itemsData.find(item => item._id === articleId);
    const availableQuantity = parseInt(article.quantité);

    if (quantity > 1) {
        quantityDisplay.textContent = quantity - 1;

        // Update the “remaining” quantity
        const remainingElement = document.querySelector(`.remaining[data-id="${articleId}"]`);
        remainingElement.textContent = availableQuantity + (quantity - 1);

        if (remainingElement.textContent <= 5) {
            remainingElement.classList.add('low-stock');
        } else {
            remainingElement.classList.remove('low-stock');
        }

        UpdateTotalCart();
    } else {
        // Delete item line when quantity reaches zero
        listItem.parentNode.removeChild(listItem);

        const remainingElement = document.querySelector(`.remaining[data-id="${articleId}"]`);
        remainingElement.textContent = availableQuantity;

        if (remainingElement.textContent <= 5) {
            remainingElement.classList.add('low-stock');
        } else {
            remainingElement.classList.remove('low-stock');
        }

        UpdateTotalCart();
    }
}
///////NOUVEAU////////
function clearCart() {
    const cartList = document.getElementById('cart-list');
    while (cartList.firstChild) {
        cartList.removeChild(cartList.firstChild);
    }
    UpdateTotalCart();
}

function increaseQuantity(listItem, availableQuantity) {
    const quantityDisplay = listItem.querySelector('.quantity');
    const quantity = parseInt(quantityDisplay.textContent);
    const articleId = listItem.getAttribute('data-id');

    if (quantity < availableQuantity) {
        quantityDisplay.textContent = quantity + 1;

        const remainingElement = document.querySelector(`.remaining[data-id="${articleId}"]`);
        remainingElement.textContent = availableQuantity - (quantity + 1);

        if (remainingElement.textContent <= 5) {
            remainingElement.classList.add('low-stock');
        } else {
            remainingElement.classList.remove('low-stock');
        }

        UpdateTotalCart();
    } else {
        alert("La quantité disponible pour cet article est épuisée.");
    }
}

function loadItems() {
    fetch('json/product.json')
        .then(response => response.json())
        .then(data => {
            itemsData.push(...data);
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

                remaining.setAttribute('data-id', item._id);

                if (item.quantité <= 5) {
                    remaining.classList.add('low-stock');
                }

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

function removeItemFromCart(itemToRemove) {
    itemToRemove.remove();
    UpdateTotalCart();
}

window.onload = loadItems;