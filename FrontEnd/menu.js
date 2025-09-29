document.addEventListener('DOMContentLoaded', () => {

    const menuGrid = document.getElementById('menu-grid');
    const filterButtons = document.querySelectorAll('#menu-filters .button_style');
    const Api_HTTP = `http://localhost:3000`;
    let allMenuItems = [];
    

    function displayMenuItems(items) {
        menuGrid.innerHTML = '';

        items.forEach(produto => {
            if (produto.status === 'Ativo') {
                const card = document.createElement('div');
                card.className = 'box';

                const imageUrl = `${Api_HTTP}${produto.image}`;
                card.innerHTML = `
                    <img src="${imageUrl}" alt="${produto.name}">
                    <div class="box_items">
                        <h3>${produto.name}</h3>
                        <p>${produto.descricao}</p>
                        <span>R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                    </div>
                `;

                menuGrid.appendChild(card);
            }
        });
    }

    async function carregarListaProduto() {
        try {
            const response = await fetch(`http://localhost:3000/api/produto`);

            if (!response.ok) {
                throw new Error("Erro ao buscar produtos:" + response.statusText);
            }

            const data = await response.json();
            allMenuItems = data.produtos;
            displayMenuItems(allMenuItems);
        } catch (error) {
            console.error('Falha na requisição:', error);
            menuGrid.innerHTML = '<p style="color: red; text-align: center;">Não foi possível carregar os produtos.</p>';
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.dataset.category;

            const filteredItems = category === 'all'
                ? allMenuItems
                : allMenuItems.filter(item => {
                    return item.categoria === category;
                });

            displayMenuItems(filteredItems);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add('show');
            } else {

            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden');

    hiddenElements.forEach((el) => observer.observe(el));

    carregarListaProduto();


});