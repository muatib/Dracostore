const itemsData = [];

/**
 * Get database in json with fetch 
 */
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

/**
 * Update total silver and gold money with quantity present in json array
 * @returns {number} - quantity in json array
 */
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

    const silverToGoldRate = 100;
    const totalSilverToGold = totalSilver / silverToGoldRate;
    const totalInGoldAndSilver = totalGold + totalSilverToGold;

    const totalCartElement = document.getElementById('total-cart');
    totalCartElement.classList.add('total-cart-item');
    totalCartElement.innerHTML = '';

    const tvaRate = 0.13;
    const tva = totalInGoldAndSilver * tvaRate;
    const tvaSilverRest = totalSilver * tvaRate;
    const totalSilverWithTva = totalSilver * tvaRate;
    const totalWithTVA = totalInGoldAndSilver + tva;

    const goldImg = document.createElement("img");
    goldImg.src = "img/or.png";
    goldImg.alt = "Pièce d'Or, donnez-moi des tunes !!!";
    goldImg.classList.add('total-gold-img');

    const silverImg = document.createElement("img");
    silverImg.src = "img/silver.png";
    silverImg.alt = "Pièce d'argent";
    silverImg.classList.add('total-silver-img');

    const totalCartText = document.createElement("span");
    totalCartText.textContent = `TOTAL ECU `;
    totalCartElement.appendChild(totalCartText);

    const totalCartTextGold = document.createElement("span");
    totalCartTextGold.textContent = `${totalWithTVA.toFixed(0)}`;
    totalCartTextGold.classList.add('total-ecu-rigth');
    totalCartElement.appendChild(totalCartTextGold);
    totalCartElement.appendChild(goldImg);

    const totalCartTextsilver = document.createElement("span");
    totalCartTextsilver.textContent = `${totalSilverWithTva.toFixed(0)}`;
    totalCartTextsilver.classList.add('total-ecu-rigth');
    totalCartElement.appendChild(totalCartTextsilver);
    totalCartElement.appendChild(silverImg);

    const tvaElement = document.getElementById('total-taxe');
    tvaElement.innerHTML = '';
///
const goldImgTva = document.createElement("img");
goldImgTva.src = "img/or.png";
goldImgTva.alt = "Pièce d'Or, donnez-moi des tunes !!!";
goldImgTva.classList.add('total-gold-img');

const silverImgTva = document.createElement("img");
silverImgTva.src = "img/silver.png";
silverImgTva.alt = "Pièce d'argent";
silverImgTva.classList.add('total-silver-img');
////
    const tvaText = document.createElement("span");
    tvaText.textContent = `TVA (13%) : ${tva.toFixed(0)}`;
    tvaText.appendChild(goldImgTva);
    tvaElement.appendChild(tvaText);

    const tvaSilver = document.createElement("span");
    tvaSilver.textContent = `${tvaSilverRest.toFixed(0)} `;
    tvaSilver.appendChild(silverImgTva);
    tvaElement.appendChild(tvaSilver);

    totalCartElement.insertAdjacentElement('afterend', tvaElement);

    const totalArticleElement = document.getElementById('total-article');
    if (totalArticleElement) {
        totalArticleElement.textContent = `${totalQuantity} Article(s)`;
    }
}

/**
 * Get quantity and value in json array
 * @param {*} article In json array
 */
function addPanier(article) {
    const cartList = document.getElementById('cart-list');

    const existingItem = cartList.querySelector(`[data-id="${article._id}"]`);
    if (existingItem) {

        const quantityDisplay = existingItem.querySelector('.quantity');
        const quantity = parseInt(quantityDisplay.textContent);
        const availableQuantity = parseInt(article.quantité);
        if (quantity < availableQuantity) {
            quantityDisplay.textContent = quantity + 1;

            const remainingElement = document.querySelector(`.remaining[data-id="${article._id}"]`);
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
    } else {
        const listItem = document.createElement('li');
        listItem.classList.add('article-li');
        listItem.setAttribute('data-id', article._id);

        const itemName = document.createElement('span');
        itemName.classList.add('article-name');
        itemName.textContent = article.name;

        const coinMoney = document.getElementById('coinTemplate');
        const itemPrice = document.importNode(coinMoney.content, true);

        itemPrice.querySelector('.js-coin-gold').textContent = article.gold;
        itemPrice.querySelector('.js-coin-gold-img').src = 'img/or.png';
        itemPrice.querySelector('.js-coin-silver').textContent = article.silver;
        itemPrice.querySelector('.js-coin-silver-img').src = 'img/silver.png';

        listItem.setAttribute('data-gold', article.gold);
        listItem.setAttribute('data-silver', article.silver);

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

document.getElementById('clear-cart-button').addEventListener('click', function () {
    clearCart();
});

/**
 * Decrease quantity in listitem in array json
 * @param {*} listItem array json
 */
function decrease(listItem) {
    const quantityDisplay = listItem.querySelector('.quantity');
    const quantity = parseInt(quantityDisplay.textContent);
    const articleId = listItem.getAttribute('data-id');
    const article = itemsData.find(item => item._id === articleId);
    const availableQuantity = parseInt(article.quantité);

    if (quantity > 1) {
        quantityDisplay.textContent = quantity - 1;

        const remainingElement = document.querySelector(`.remaining[data-id="${articleId}"]`);
        remainingElement.textContent = availableQuantity + (quantity - 1);

        if (remainingElement.textContent <= 5) {
            remainingElement.classList.add('low-stock');
        } else {
            remainingElement.classList.remove('low-stock');
        }

        UpdateTotalCart();
    } else {

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
 /**
  * Remove item list
  */
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
/**
 * Remove item
 * @param {*} itemToRemove no comment
 */
function removeItemFromCart(itemToRemove) {
    itemToRemove.remove();
    UpdateTotalCart();
}

window.onload = loadItems;
