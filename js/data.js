const itemsData = [];

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

    // Convertir la valeur d'argent en valeur d'or (1 or = 100 argent)
    const totalSilverToGold = totalSilver / 100;
    const totalAmount = totalGold + totalSilverToGold;

    // Mettre à jour l'affichage du total
    const totalCartElement = document.getElementById('total-cart');
    totalCartElement.innerHTML = ''; // Vider l'élément

    const totalCartText = document.createElement("span");
    totalCartText.textContent = `TOTAL : ${totalAmount.toFixed(2)} `;
    totalCartElement.appendChild(totalCartText);

    const goldImg = document.createElement("img");
    goldImg.src = "img/or.png";
    goldImg.alt = "Or";
    goldImg.classList.add('total-gold-img'); // Ajouter une classe CSS pour positionner l'image
    totalCartElement.appendChild(goldImg);

    const silverImg = document.createElement("img");
    silverImg.src = "img/silver.png";
    silverImg.alt = "Ar";
    totalCartElement.appendChild(silverImg);

    // Calcul de la TVA
    const tva = totalAmount * 0.13;
    const totalWithTVA = totalAmount + tva;

    // Création de la div pour afficher la TVA
    const tvaElement = document.getElementById('total-taxe');
    tvaElement.innerHTML = ''; // Vider l'élément

    const tvaText = document.createElement("span");
    tvaText.textContent = `TVA (13%) : ${tva.toFixed(2)} `;
    tvaElement.appendChild(tvaText);

    const goldImgTva = document.createElement("img");
    goldImgTva.src = "img/or.png";
    goldImgTva.alt = "Or";
    goldImgTva.classList.add('total-gold-img'); // Ajouter une classe CSS pour positionner l'image
    tvaElement.appendChild(goldImgTva);

    // Insertion de la div après le total
    totalCartElement.insertAdjacentElement('afterend', tvaElement);

    // Mettre à jour l'affichage du nombre total d'articles
    const totalArticleElement = document.getElementById('total-article');
    if (totalArticleElement) {
        totalArticleElement.textContent = `${totalQuantity} Article(s)`;
    }
}


function addPanier(article) {
    const cartList = document.getElementById('cart-list');

    // Vérifier si l'article est déjà dans le panier
    const existingItem = cartList.querySelector(`[data-id="${article._id}"]`);
    if (existingItem) {
        // Mettre à jour la quantité de l'article existant
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
        // Créer un nouvel élément de liste pour l'article
        const listItem = document.createElement('li');
        listItem.classList.add('article-li');
        listItem.setAttribute('data-id', article._id);

        //Article template
        const ArticleMoney = document.getElementById('articleTemplate');
        const productArticle = document.importNode(ArticleMoney.content, true);

        // Créer un élément pour le nom de l'article
        const itemName = document.createElement('span');
        itemName.classList.add('article-name');
        itemName.textContent = article.name;

        // Créer un élément pour le prix de l'article
        const coinMoney = document.getElementById('coinTemplate');
        const itemPrice = document.importNode(coinMoney.content, true);

        itemPrice.querySelector('.js-coin-gold').textContent = article.gold;
        itemPrice.querySelector('.js-coin-gold-img').src = 'img/or.png';
        itemPrice.querySelector('.js-coin-silver').textContent = article.silver;
        itemPrice.querySelector('.js-coin-silver-img').src = 'img/silver.png';

        // Ajouter les attributs data-gold et data-silver à l'élément de liste
        listItem.setAttribute('data-gold', article.gold);
        listItem.setAttribute('data-silver', article.silver);

        const recycleButton = productArticle.querySelector('.js-recyble-button');
        recycleButton.addEventListener('click', function () {
            removeItemFromCart(listItem, article.quantité, article.gold, article.silver);
        });


        // Créer des éléments pour les boutons de quantité
        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = "-";
        decreaseButton.classList.add('ico-moins');
        decreaseButton.addEventListener('click', function () {
            decrease(listItem);
        });

        const quantityDisplay = document.createElement('span');
        quantityDisplay.classList.add('quantity');
        quantityDisplay.textContent = "1"; // Init à 1

        const increaseButton = document.createElement('button');
        increaseButton.textContent = "+";
        increaseButton.classList.add('ico-plus');
        increaseButton.addEventListener('click', function () {
            increaseQuantity(listItem, article.quantité);
        });

        // Ajouter les éléments créés à l'élément de liste
        listItem.appendChild(itemName);
        listItem.appendChild(itemPrice);
        listItem.appendChild(decreaseButton);
        listItem.appendChild(quantityDisplay);
        listItem.appendChild(increaseButton);
        listItem.appendChild(recycleButton);

        // Ajouter l'élément de liste à la liste du panier
        cartList.appendChild(listItem);

        // Mettre à jour le total du panier
        UpdateTotalCart();
    }
}

function decrease(listItem) {
    const quantityDisplay = listItem.querySelector('.quantity');
    const quantity = parseInt(quantityDisplay.textContent);
    if (quantity > 1) {
        quantityDisplay.textContent = quantity - 1;
        UpdateTotalCart();
    } else {
        // Supprimer la ligne d'article lorsque la quantité atteint zéro
        listItem.parentNode.removeChild(listItem);
        UpdateTotalCart();
    }
}

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

// Fonction pour supprimer un article du panier
function removeItemFromCart(itemToRemove) {
    itemToRemove.remove();
    UpdateTotalCart();
}

window.onload = loadItems;