import { openDb } from "../configDB.js";
import fs from 'fs/promises';

//Criar Tabela
export async function createTable() {
    const create = await openDb();
    return create.exec(
        'CREATE TABLE IF NOT EXISTS Produto ( id INTEGER PRIMARY KEY AUTOINCREMENT, image TEXT NOT NULL, name TEXT NOT NULL, descricao TEXT, preco REAL NOT NULL, categoria TEXT NOT NULL, status BOOLEAN)');

}

//Inserir Produto
export async function insertProduto(produto) {

    const statusValue = 1
    const db = await openDb();
    return db.run(
        'INSERT INTO Produto (image, name , descricao, preco, categoria, status) VALUES (?,?,?,?,?,?)',
        [produto.image, produto.name, produto.descricao, produto.preco, produto.categoria, statusValue]);
}


//Atualizar Produto
export async function updateProduto(id, produto, novoArquivo) {
    const db = await openDb();

    const produtoAntigo = await db.get('SELECT image FROM Produto WHERE id = ?', [id]);

    if (produto.image && produtoAntigo && produtoAntigo.image !== produto.image) {
        const physicalPath = produtoAntigo.image.substring(1); 
       
        fs.unlink(physicalPath).catch(err => console.error("Falha ao deletar imagem antiga na atualização:", err));
    }

    const fields = ['name', 'descricao', 'preco', 'categoria'];
    const params = [produto.name, produto.descricao, produto.preco, produto.categoria];

    if (produto.image) {
        fields.push('image');
        params.push(produto.image);
    }

    params.push(id);

    const sql = `UPDATE Produto SET ${fields.map(f => `${f}=?`).join(', ')} WHERE id=?`;

    return db.run(sql, params);
}

//Deletar Produto
export async function deleteProduto(id) {
    const db = await openDb();

    const produto = await db.get('SELECT image FROM Produto WHERE id = ?', [id]);

    if (!produto) {
        throw new Error("Produto não encontrado.");
    }

    const result = await db.run('DELETE FROM Produto WHERE id = ?', [id]);


    if (produto.image) {

        const physicalPath = produto.image.substring(1);

        try {
            await fs.unlink(physicalPath);
            console.log(`Arquivo de imagem ${physicalPath} deletado com sucesso.`);
        } catch (fileError) {

            console.error(`Erro ao deletar o arquivo de imagem ${physicalPath}:`, fileError);
        }
    }
    return result;
}


export async function editarStatus(id) {
    const db = await openDb();
    const produto = await db.get('SELECT status FROM Produto WHERE id= ?', [id]);

    if (!produto) {
        throw new Error("Produto não encontrado.");
    }

    const novoStatusValue = produto.status === 1 ? 0 : 1;

    await db.run('UPDATE Produto SET status = ? WHERE id = ?', [novoStatusValue, id]);

    return novoStatusValue === 1 ? 'Ativo' : 'Inativo';
}

export async function selectProduto(id) {
    const db = await openDb();
    return db.get('SELECT * FROM Produto WHERE id = ?', [id]);
}
//Filtrar a lista por nomeProduto
export async function filtrarProdutoStatus(queryParams) {
    const db = await openDb();

    let sql = 'SELECT * FROM produto';
    const conditions = [];
    const params = [];


    if (queryParams.status) {
        conditions.push('status = ?');
        const statusValue = queryParams.status.toLowerCase() === 'ativo' ? 1 : 0;
        params.push(statusValue);
    }

    if (queryParams.categoria) {
        conditions.push('categoria = ?');
        params.push(queryParams.categoria);
    }


    if (queryParams.name) {
        conditions.push('name LIKE ?');
        params.push(`%${queryParams.name}%`);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    const productsFromDB = await db.all(sql, params);

    const products = productsFromDB.map(p => ({
        ...p,
        status: p.status === 1 ? 'Ativo' : 'Inativo'
    }));

    return products;
}