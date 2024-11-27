import itemCardapio from "../model/ItemCardapio.js";

/**
 * @swagger
 * /itens-cardapio:
 *   get:
 *     summary: Lista todos os itens do cardápio.
 *     description: Retorna todos os itens cadastrados no cardápio.
 *     tags: [Itens do Cardápio]
 *     responses:
 *       200:
 *         description: Lista de itens do cardápio.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do item do cardápio.
 *                   nome:
 *                     type: string
 *                     description: Nome do item do cardápio.
 *                   categoria:
 *                     type: string
 *                     description: Categoria do item (por exemplo, prato ou bebida).
 *                   preco:
 *                     type: number
 *                     format: float
 *                     description: Preço do item.
 *       500:
 *         description: Erro ao listar os itens do cardápio.
 */
async function listar(req, res) {
    try {
        const itens = await itemCardapio.findAll();
        res.status(200).json(itens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /itens-cardapio:
 *   post:
 *     summary: Cria um novo item no cardápio.
 *     description: Adiciona um novo item no cardápio com nome, categoria e preço.
 *     tags: [Itens do Cardápio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do item do cardápio.
 *                 example: "Cachorro Quente"
 *               categoria:
 *                 type: string
 *                 description: Categoria do item, prato ou bebida.
 *                 example: "prato"
 *               preco:
 *                 type: number
 *                 format: float
 *                 description: Preço do item.
 *                 example: 15.90
 *     responses:
 *       201:
 *         description: Item do cardápio criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do item criado.
 *                 nome:
 *                   type: string
 *                   description: Nome do item.
 *                 categoria:
 *                   type: string
 *                   description: Categoria do item.
 *                 preco:
 *                   type: number
 *                   format: float
 *                   description: Preço do item.
 *       400:
 *         description: Todos os campos são obrigatórios.
 *       500:
 *         description: Erro ao criar o item.
 */
async function criar(req, res) {
    try {
        const { nome, categoria, preco } = req.body;
        if (!nome || !categoria || !preco) {
            return res.status(400).send("Todos os campos são obrigatórios.");
        }
        const novoItem = await itemCardapio.create({ nome, categoria, preco });
        res.status(201).json(novoItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /itens-cardapio/{id}:
 *   delete:
 *     summary: Remove um item do cardápio.
 *     description: Remove um item do cardápio com base no ID fornecido.
 *     tags: [Itens do Cardápio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do item a ser removido.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item do cardápio removido com sucesso.
 *       404:
 *         description: Item não encontrado.
 *       500:
 *         description: Erro ao remover o item.
 */
async function remover(req, res) {
    try {
        const { id } = req.params;

        const item = await itemCardapio.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: "Item não encontrado." });
        }

        await itemCardapio.destroy({ where: { id } });
        res.status(200).json({ message: "Item removido com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default { listar, criar, remover };
