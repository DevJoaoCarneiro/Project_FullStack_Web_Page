import 'dotenv/config';
import express from 'express';
import { createTable, deleteProduto, editarStatus, filtrarProdutoStatus, insertProduto, updateProduto, selectProduto, buscarUsuario } from './Controller/Produto.js';
import cors from 'cors';
import session from 'express-session';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';

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
app.use(cors({
    origin: process.env.LOCAL_HOST,
    credentials: true
}));
app.use('/uploads', express.static('uploads'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 8
    }
}));

createTable();

const checarAutenticacao = (req, res, next) => {
    if (req.session.user) {
        console.log(`Usuário autenticado: ${req.session.user.username}. Acesso permitido à rota: ${req.originalUrl}`);
        next();
    } else {
        console.warn(`Tentativa de acesso não autorizado à rota: ${req.originalUrl}`);
        res.status(401).json({ error: 'Acesso não autorizado. Por favor, faça o login.' });
    }
}

app.post('/api/produto', checarAutenticacao, upload.single('image'), async function (req, res) {
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


app.put('/api/produto/:id', checarAutenticacao, upload.single('image'), async function (req, res) {
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

app.delete('/api/produto/:id', checarAutenticacao, async function (req, res) {
    try {
        await deleteProduto(req.params.id);
        res.json({ "message": "Produto deletado com sucesso" });
    } catch (error) {
        res.status(400).json({ "error": "Dados inválidos:" + error.message });
    }
});

app.patch('/api/produto/:id/status',checarAutenticacao,  async function (req, res) {
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

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await buscarUsuario(username);

    if (user) {
        const senhaCorreta = await bcrypt.compare(password, user.password_hash);

        if (senhaCorreta) {
            req.session.user = {
                id: user.id,
                username: user.username,
            }
            return res.json({
                success: true,
                redirectUrl: '../FrontEnd/listaItem.html'
            })
        }
        return res.status(401).json({ success: false, message: "Credenciais inválidas." });
    } else {
        return res.status(401).json({ sucess: false, message: "Credenciais Invalidas" });
    }
})

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Não foi possível fazer logout.' });
        }
        res.clearCookie('connect.sid');
        return res.json({ success: true, message: 'Logout realizado com sucesso.' });
    });
});

app.listen(process.env.PORT, '127.0.0.1', () => {
    console.log("API rodando em :"+process.env.LOCAL_HOST);
});