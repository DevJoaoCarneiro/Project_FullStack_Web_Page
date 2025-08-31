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
            image: 'img/brunch1.jpg', // Exemplo: troque pelo caminho correto
            name: 'Avocado Toast',
            description: 'Pão artesanal, abacate fresco, ovos e temperos especiais.',
            price: 18.50,
            category: 'brunch'
        },
        {
            image: 'img/brunch1.jpg', // Exemplo: troque pelo caminho correto
            name: 'Iced Coffee',
            description: 'Café especial extraído a frio, servido com gelo.',
            price: 14.00,
            category: 'bebidas-geladas'
        },
        {
            image: 'img/brunch1.jpg', // Exemplo: troque pelo caminho correto
            name: 'Cappuccino Italiano',
            description: 'Expresso, leite vaporizado e uma cremosa espuma de leite.',
            price: 12.00,
            category: 'bebidas-quentes'
        },
        {
            image: 'img/brunch1.jpg', // Exemplo: troque pelo caminho correto
            name: 'Cheesecake de Frutas Vermelhas',
            description: 'Fatia generosa de cheesecake com calda artesanal.',
            price: 22.00,
            category: 'sobremesas'
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