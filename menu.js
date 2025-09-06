document.addEventListener('DOMContentLoaded', () => {

    const menuItems = [
        {
            image: 'img/brunch1.jpg',
            name: 'Brunch Guava',
            description: 'Ovo pochet, salada ceaser e um antepasto de beringela.',
            price: 15.99,
            category: 'brunch'
        },
        {
            image: 'img/brunch2.jpg', 
            name: 'Torrada com Abacate e Bacon',
            description: 'Fatia de pão tostado coberta com abacate, ovo frito e fatias de bacon crocante.',
            price: 18.50,
            category: 'brunch'
        },
        {
            image: 'img/Plate.jpg', 
            name: 'Massa com Burrata',
            description: 'Massa tipo rigatoni ao molho de tomate, finalizada com burrata cremosa e folhas de manjericão.',
            price: 14.00,
            category: 'bebidas-geladas'
        },
        {
            image: 'img/brunch3.jpg', 
            name: 'Croissant com Ovos e Bacon',
            description: 'ECroissant recheado com ovos mexidos, fatias de bacon e queijo',
            price: 12.00,
            category: 'bebidas-quentes'
        },
        {
            image: 'img/Danish.jpg', 
            name: 'Trança Folhada com Frutas',
            description: 'Massa folhada com creme e cobertura de morangos e mirtilos.',
            price: 22.00,
            category: 'sobremesas'
  
        },
        {
            image: 'img/capuccino.jpg', 
            name: 'Cappuccino Italiano',
            description: 'Espresso duplo e leite vaporizado',
            price: 22.00,
            category: 'bebidas-quentes'
  
        },
        {
            image: 'img/coffeIced.jpg', 
            name: 'Iced Latte Classico',
            description: 'Bebida para os puristas. Espresso e leite e gelo',
            price: 22.00,
            category: 'bebidas-geladas'
  
        },

    ];

    const menuGrid = document.getElementById('menu-grid');
    const filterButtons = document.querySelectorAll('#menu-filters .button_style');

    function displayMenuItems(items) {
        menuGrid.innerHTML = '';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'box'; 

            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="box_items">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <span>R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
            `;
            menuGrid.appendChild(card);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.dataset.category;

            const filteredItems = category === 'all'
                ? menuItems
                : menuItems.filter(item => item.category === category);
            
            displayMenuItems(filteredItems);
        });
    });

    displayMenuItems(menuItems);
});