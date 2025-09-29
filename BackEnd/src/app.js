import express from 'express';
import { createTable, deleteProduto, editarStatus, filtrarProdutoStatus, insertProduto, updateProduto, selectProduto } from './Controller/Produto.js';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

createTable();

app.post('/api/produto', upload.single('image'), async function (req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "A imagem do produto é obrigatória." });
        }

        const imagePath = `/uploads/${req.file.filename}`;

        const produtoSalvar = {
            ...req.body,
            image: imagePath
        }
        const result = await insertProduto(produtoSalvar);
        res.status(201).json({ "message": "Produto adicionado com sucesso" });

    } catch (error) {
        return res.status(400).json({ error: err.message });
    }
});


app.put('/api/produto/:id', upload.single('image'), async function (req, res) {
    try {

        let dadosProduto = { ...req.body };

        if (req.file) {
            dadosProduto.image = `/uploads/${req.file.filename}`;
        }

        const result = await updateProduto(req.params.id, dadosProduto);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Produto não encontrado." });
        }

        res.status(200).json({ "message": "Produto atualizado com sucesso" });
    } catch (error) {
        res.status(400).json({ "error": "Dados inválidos: " + error.message });
    }
});

app.delete('/api/produto/:id', async function (req, res) {
    try {
        await deleteProduto(req.params.id);
        res.json({ "message": "Produto deletado com sucesso" });
    } catch (error) {
        res.status(400).json({ "error": "Dados inválidos:" + error.message });
    }
});

app.patch('/api/produto/:id/status', async function (req, res) {
    try {
        const { id } = req.params;

        const novoStatusTexto = await editarStatus(id);

        res.status(200).json({
            message: "Status do produto atualizado com sucesso",
            novoStatus: novoStatusTexto
        });
    } catch (error) {
        if (error.message === "Produto não encontrado.") {
            return res.status(404).json({ "error": error.message });
        }
        res.status(500).json({ "error": "Erro ao atualizar o status do produto: " + error.message });
    }
});

app.get('/api/produto', async function (req, res) {
    try {
        const produtos = await filtrarProdutoStatus(req.query);
        res.json({ produtos: produtos });
    } catch (error) {
        res.status(500).json({ "error": "Erro ao buscar produtos: " + error.message });
    }
});

app.get('/api/produto/:id', async (req, res) => {
    try {
        const produto = await selectProduto(req.params.id);
        if (produto) {
            res.json(produto);
        } else {
            res.status(404).json({ "error": "Produto não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ "error": "Erro ao buscar produto: " + error.message });
    }
});

app.listen(3000, () => console.log("Api Rodando"));