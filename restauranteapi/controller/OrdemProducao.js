import ordemProducao from "../models/OrdemProducao.js";
import itemCardapio from "../models/ItemCardapio.js";

/**
 * @swagger
 * /ordens/{setor}:
 *   get:
 *     summary: Lista as ordens de produção de um setor específico.
 *     description: Retorna as ordens de produção do setor 'copa' ou 'cozinha'.
 *     tags: [Ordens de Produção]
 *     parameters:
 *       - in: path
 *         name: setor
 *         required: true
 *         description: O setor da produção ('copa' ou 'cozinha').
 *         schema:
 *           type: string
 *           enum: [copa, cozinha]
 *     responses:
 *       200:
 *         description: Lista de ordens de produção do setor especificado.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID da ordem de produção.
 *                   setor:
 *                     type: string
 *                     description: Setor da ordem de produção.
 *                   status:
 *                     type: string
 *                     description: Status da ordem de produção.
 *                   comanda:
 *                     type: object
 *                     description: Detalhes do comanda associado à ordem.
 *                   item_cardapio:
 *                     type: object
 *                     description: Detalhes do item do cardápio associado à ordem.
 *       400:
 *         description: Setor inválido. Use 'copa' ou 'cozinha'.
 *       500:
 *         description: Erro ao listar as ordens de produção.
 */
async function listarOrdens(req, res) {
    try {
        const { setor } = req.params;
        if (!["copa", "cozinha"].includes(setor)) {
            return res.status(400).send("Setor inválido. Use 'copa' ou 'cozinha'.");
        }

        const ordens = await ordemProducao.findAll({
            where: { setor },
            include: ["comanda", "item_cardapio"],
            order: [["id", "DESC"]],
        });
        res.status(200).json(ordens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /ordens/{id}/status:
 *   put:
 *     summary: Atualiza o status de uma ordem de produção.
 *     description: Atualiza o status de uma ordem de produção. São pendente, em_producao, pronto, entregue.
 *     tags: [Ordens de Produção]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da ordem de produção.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Novo status da ordem de produção.
 *                 enum: [pendente, em_producao, pronto, entregue]
 *     responses:
 *       200:
 *         description: Ordem de produção atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da ordem de produção.
 *                 status:
 *                   type: string
 *                   description: Status da ordem de produção.
 *       400:
 *         description: Status inválido.
 *       404:
 *         description: Ordem não encontrada.
 *       500:
 *         description: Erro ao atualizar o status da ordem.
 */
async function atualizarStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pendente", "em_producao", "pronto", "entregue"].includes(status)) {
            return res.status(400).send("Status inválido.");
        }

        const ordem = await ordemProducao.findByPk(id);
        if (!ordem) return res.status(404).send("Ordem não encontrada.");

        ordem.status = status;
        await ordem.save();
        res.status(200).json(ordem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /comandas/{id}/adicionar-item:
 *   put:
 *     summary: Adiciona um item à comanda.
 *     description: Permite adicionar um item a uma comanda específica, enviando ordens para a Copa ou Cozinha com base na categoria do item.
 *     tags: [Comandas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da comanda à qual o item será adicionado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_cardapio_id:
 *                 type: integer
 *                 description: ID do item do cardápio.
 *                 example: 2
 *               quantidade:
 *                 type: integer
 *                 description: Quantidade do item a ser adicionada.
 *                 example: 3
 *     responses:
 *       201:
 *         description: Item adicionado à comanda com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da ordem criado.
 *                 item_cardapio_id:
 *                   type: integer
 *                   description: ID do item do cardápio.
 *                 quantidade:
 *                   type: integer
 *                   description: Quantidade do item.
 *       400:
 *         description: Todos os campos são obrigatórios.
 *       500:
 *         description: Erro ao adicionar o item à comanda.
 */
async function adicionarItem(req, res) {
    try {
        const comanda_id = req.params.id;
        const { item_cardapio_id, quantidade } = req.body;

        if (!comanda_id || !item_cardapio_id || !quantidade) {
            return res.status(400).send("Todos os campos são obrigatórios.");
        }

        const item = await itemCardapio.findByPk(item_cardapio_id);
        if (!item) {
            return res.status(404).send("Item de cardápio não encontrado.");
        }

        let setor;
        if (item.categoria === "bebida") {
            setor = "copa";
        } else if (item.categoria === "prato") {
            setor = "cozinha";
        } else {
            return res.status(400).send("Categoria do item não reconhecida.");
        }

        const novaOrdem = await ordemProducao.create({ comanda_id, item_cardapio_id, quantidade, setor });
        res.status(201).json(novaOrdem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default { listarOrdens, atualizarStatus, adicionarItem };
