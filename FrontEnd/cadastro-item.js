document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById("form_item");

    const botao_limpar = document.getElementById("Limpar-Item");
    const inputTitulo = document.getElementById("name");
    const inputDescricao = document.getElementById("descricao");
    const inputPreco = document.getElementById("preco");
    const inputCategoria = document.getElementById("categoria");
    const inputImagem = document.getElementById("imagem");
    const tituloPagina = document.getElementById("titulo_pagina");
    const previewImagem = document.getElementById("preview-imagem");
    const uploadLabel = document.querySelector(".upload-label");
    const removeImage = document.getElementById("Botao_remove_imagem");
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');


    async function BuscarEpreencherFormulario(produtoId) {
        try {
            const API_BASE_URL = 'http://127.0.0.1:3000';
            const response = await fetch(`${API_BASE_URL}/api/produto/${produtoId}`, {
                credentials: 'include'
            });

            if (response.status === 401) {
                alert('Acesso não autorizado. Por favor, faça o login.');
                window.location.href = 'login.html';
                return;
            }

            const produto = await response.json();
            
            inputTitulo.value = produto.name;
            inputDescricao.value = produto.descricao;
            inputPreco.value = produto.preco;
            inputCategoria.value = produto.categoria;

            if (produto.image) {
                
                const imageUrl = `${API_BASE_URL}${produto.image}`;
                console.log("URL final construída pelo JS:", imageUrl);     
                previewImagem.src = imageUrl;
                previewImagem.style.display = 'block';
                uploadLabel.style.display = 'none';
                removeImage.style.display = 'inline-block';
            }
        } catch (error) {
            console.error('Erro ao buscar o produto:', error);
        }
    }

    if (produtoId) {
        tituloPagina.textContent = 'Editar Item';
        BuscarEpreencherFormulario(produtoId);
    }


    inputImagem.addEventListener('change', (event) => {
        const arquivo = event.target.files[0];
        if (arquivo) {
            const urlPreview = URL.createObjectURL(arquivo);
            previewImagem.src = urlPreview;
            previewImagem.style.display = 'block';
            uploadLabel.style.display = 'none';
            removeImage.style.display = 'inline-block';
        }
    });

    removeImage.addEventListener('click', () => {
        console.log('Botão REMOVER foi clicado!');
        inputImagem.value = '';

        uploadLabel.style.display = 'flex';
        previewImagem.style.display = 'none';
        previewImagem.src = '#';
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData();

        formData.append('name', inputTitulo.value);
        formData.append('descricao', inputDescricao.value);
        formData.append('preco', inputPreco.value);
        formData.append('categoria', inputCategoria.value);

        if (inputImagem.files.length > 0) {
            formData.append('image', inputImagem.files[0]);
        } else if (!produtoId) {
            alert("Por favor, selecione uma imagem.");
            return;
        }

        const method = produtoId ? 'PUT' : 'POST';
        const url = produtoId ? `http://127.0.0.1:3000/api/produto/${produtoId}` : 'http://127.0.0.1:3000/api/produto';

        try {
            const response = await fetch(url, {
                method: method,
                body: formData,
                credentials: 'include'
            });

            if (response.ok) {
                alert(`Produto ${produtoId ? 'atualizado' : 'adicionado'} com sucesso!`);
                form.reset();
            } else {
                const errorData = await response.json();
                alert(`Erro ao adicionar produto: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        }
    });
    if (botao_limpar) {
        botao_limpar.addEventListener('click', () => {
            form.reset();
            previewImagem.src = '#';
            previewImagem.style.display = 'none';
            uploadLabel.style.display = 'flex';
            botaoRemover.click();
        });
    }


})

