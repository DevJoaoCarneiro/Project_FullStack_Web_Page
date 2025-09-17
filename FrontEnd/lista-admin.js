document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('lista-produtos');
    const botaoExcluir = document.getElementById("botao_excluir");
    const botaoAtualizarStatus = document.getElementById("botao_atualizar_status");
    const filtroNome = document.getElementById('filtro-nome');
    const filtroStatus = document.getElementById('filtro-status');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const botaoLimparFiltros = document.getElementById('botao-limpar-filtros');
    const botaoEditar = document.getElementById("botao_editar");


    async function carregarProdutos(queryString = '') {
        try {
            const response = await fetch(`http://localhost:3000/api/produto?${queryString}`);

            if (!response.ok) {
                throw new Error("Erro ao buscar produtos:" + response.statusText);
            }

            const data = await response.json();
            const produtos = data.produtos;

            tbody.innerHTML = '';

            produtos.forEach(produto => {
                const tr = document.createElement('tr');

                tr.dataset.id = produto.id;
                tr.dataset.name = produto.name;

                const precoFormatado = produto.preco.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                const statusClass = produto.status === 'Ativo' ? 'status-ativo' : 'status-inativo';

                tr.innerHTML = `
                    <td>${produto.name}</td>
                    <td>
                        <span class="status-badge status ${statusClass}">${produto.status}</span>
                    </td>
                    <td>${precoFormatado}</td>
                    <td>${produto.categoria}</td>
                `;

                tbody.appendChild(tr);
            })
        } catch (error) {
            console.error('Falha na requisição:', error);
            tbody.innerHTML = '<tr><td colspan="4">Não foi possível carregar os produtos.</td></tr>';
        }
    }

        function debounce(func, delay) {
            let timeoutId;
            return function (...args) {

                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        }

        function aplicarFiltros() {

            const nome = filtroNome.value;
            const status = filtroStatus.value;
            const categoria = filtroCategoria.value;

            if (nome || status || categoria) {
                botaoLimparFiltros.classList.add('filtros-ativos');
            }

            const params = new URLSearchParams();

            if (nome) {
                params.append('name', nome);
            }
            if (status) {
                params.append('status', status);
            }
            if (categoria) {
                params.append('categoria', categoria);
            }
            carregarProdutos(params.toString());
        }

        filtroNome.addEventListener('input', debounce(aplicarFiltros, 300));
        filtroStatus.addEventListener('change', aplicarFiltros);
        filtroCategoria.addEventListener('change', aplicarFiltros);
        botaoLimparFiltros.addEventListener('click', () => {

            filtroNome.value = '';
            filtroStatus.selectedIndex = 0;
            filtroCategoria.selectedIndex = 0;
            botaoLimparFiltros.classList.remove('filtros-ativos');
            carregarProdutos();
        });

        let linhaSelecionada = null;

        tbody.addEventListener('click', (event) => {
            const linhaClicada = event.target.closest('tr');

            if (!linhaClicada) {
                return;
            }

            if (linhaSelecionada) {
                linhaSelecionada.classList.remove('selecionado');
            }

            if (linhaSelecionada === linhaClicada) {
                linhaSelecionada = null;
                return;
            }

            linhaClicada.classList.add('selecionado');
            linhaSelecionada = linhaClicada;

            const produtoId = linhaClicada.dataset.id;
            console.log(`Produto selecionado com ID: ${produtoId}`);
        })



        botaoExcluir.addEventListener('click', async (event) => {


            if (!linhaSelecionada) {
                alert('Por Favor, Selecione um item da lista para excluir');
                return;
            }


            const produtoId = linhaSelecionada.dataset.id;
            const nomeProduto = linhaSelecionada.querySelector('td:first-child').textContent;


            const confirmacao = confirm(`Tem certeza que deseja excluir o produto ${nomeProduto}? Esta ação não pode ser desfeita.`);

            if (!confirmacao) {
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/produto/${produtoId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {

                    alert('Produto excluído com sucesso!');

                    linhaSelecionada.remove();

                    linhaSelecionada = null;
                } else {
                    const errorData = await response.json();
                    alert(`Erro ao excluir produto: ${errorData.error || response.statusText}`);
                }
            } catch (error) {
                console.error('Falha na conexão:', error);
                alert('Não foi possível conectar ao servidor para excluir o item.');
            }
        });

        botaoAtualizarStatus.addEventListener('click', async (event) => {
            if (!linhaSelecionada) {
                alert("Por Favor, Selecione um item da lista para excluir");
            }

            const produtoId = linhaSelecionada.dataset.id;

            try {
                const response = await fetch(`http://localhost:3000/api/produto/${produtoId}/status`, {
                    method: 'PATCH'
                });

                if (response.ok) {

                    alert('Status atualizado com sucesso!');
                } else {
                    const errorData = await response.json();
                    alert(`Erro ao excluir produto: ${errorData.error || response.statusText}`);
                }
            } catch (error) {
                console.error('Falha na conexão:', error);
                alert('Não foi possível conectar ao servidor para excluir o item.');
            }
        });

        botaoEditar.addEventListener('click', ()=> {
            if(!linhaSelecionada){
                alert("Por favor, selecione um item da lista para editar");
                return;
            }

            const produtoId = linhaSelecionada.dataset.id;

            window.location.href = `cadastroItem.html?id=${produtoId}`;
        })
    
    carregarProdutos();
});
