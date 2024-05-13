let selectedItems = [];

fetch('json/product.json')
    .then(response => response.json())
    .then(data => {
        const itemList = document.getElementById('itemList');
        console.log(data);

        // data.forEach(hero => {
        //     const itemDiv = document.createElement('div');
        //     itemDiv.classList.add('item');

        //     itemDiv.innerHTML = `
        //         <img src="${hero.name}" alt="${hero.name}">
        //         <button id=" ${hero.id}">Select:${hero.name}</button>
        //     `;
        //     itemList.appendChild(itemDiv);

            
        //     const heroButton = itemDiv.querySelector('button');
        //     heroButton.addEventListener('click', function () {
        //         console.log('Le bouton', hero.name, 'a été cliqué !');
        //     });
        // });
    })
    .catch(error => {
        console.error('Error fetching superheroes:', error);
    });
