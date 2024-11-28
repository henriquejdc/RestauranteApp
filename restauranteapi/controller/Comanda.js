import comanda from "../models/Comanda.js";
import ordemProducao from "../models/OrdemProducao.js";
import itemCardapio from "../models/ItemCardapio.js";
import mesa from "../models/Mesa.js";
import { Sequelize } from "sequelize";

/**
 * @swagger
 * /comandas:
 *   post:
 *     summary: Abre uma nova comanda.
 *     description: Cria uma nova comanda para uma mesa específica.
 *     tags: [Comandas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mesa_id:
 *                 type: integer
 *                 description: ID da mesa associada à comanda.
 *                 example: 1
 *               usuario_id:
 *                 type: integer
 *                 description: ID do usuário associado à comanda.
 *                 example: 1
 *     responses:
 *       201:
 *         description: Comanda criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da comanda criada.
 *                 mesa_id:
 *                   type: integer
 *                   description: ID da mesa associada.
 *                 status:
 *                   type: string
 *                   description: Status atual da comanda.
 *       400:
 *         description: Sem mesa_id.
 *       500:
 *         description: Erro ao criar a comanda.
 */
async function abrir(req, res) {
    try {
        const { mesa_id, usuario_id } = req.body;

        if (!mesa_id || !usuario_id) {
            return res.status(400).json({ error: "O campo 'mesa_id' e 'usuario_id' é obrigatório." });
        }
        const novaComanda = await comanda.create({ 
            mesa_id: mesa_id, 
            usuario_id: usuario_id
        });
        res.status(201).json(novaComanda);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /comandas/{id}/fechar:
 *   put:
 *     summary: Fecha uma comanda.
 *     description: Atualiza o status da comanda para "fechada".
 *     tags: [Comandas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da comanda a ser fechada.
 *     responses:
 *       200:
 *         description: Comanda fechada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status atualizado da comanda.
 *                 fechado_em:
 *                   type: string
 *                   format: date-time
 *                   description: Data e hora em que a comanda foi fechada.
 *       500:
 *         description: Erro ao fechar a comanda.
 */
async function fechar(req, res) {
    try {
        const id = req.params.id;

        const ordensPendentes = await ordemProducao.findAll({
            where: { comanda_id: id, status: { [Sequelize.Op.ne]: "entregue" } },
        });

        if (ordensPendentes.length > 0) {
            return res.status(400).json({ error: "Não é possível fechar a comanda. Existem ordens não entregues." });
        }

        const comandaFechada = await comanda.update(
            { status: "fechada", fechado_em: new Date() },
            { where: { id } }
        );

        if (comandaFechada[0] === 0) {
            return res.status(404).json({ error: "Comanda não encontrada." });
        }

        res.status(200).json({ message: "Comanda fechada com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /comandas:
 *   get:
 *     summary: Lista todas as comandas.
 *     description: Retorna uma lista de todas as comandas cadastradas.
 *     tags: [Comandas]
 *     responses:
 *       200:
 *         description: Lista de comandas retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID da comanda.
 *                   mesa_id:
 *                     type: integer
 *                     description: ID da mesa associada.
 *                   status:
 *                     type: string
 *                     description: Status atual da comanda.
 *                   aberto_em:
 *                     type: string
 *                     format: date-time
 *                     description: Data e hora de abertura da comanda.
 *                   fechado_em:
 *                     type: string
 *                     format: date-time
 *                     description: Data e hora de fechamento da comanda.
 *       500:
 *         description: Erro ao buscar as comandas.
 */
async function buscarTodas(req, res) {
    try {
        const comandas = await comanda.findAll();
        res.status(200).json(comandas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /comandas/{id}:
 *   get:
 *     summary: Busca uma comanda pelo ID.
 *     description: Retorna os detalhes de uma comanda específica.
 *     tags: [Comandas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da comanda a ser buscada.
 *     responses:
 *       200:
 *         description: Detalhes da comanda retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da comanda.
 *                 mesa_id:
 *                   type: integer
 *                   description: ID da mesa associada.
 *                 status:
 *                   type: string
 *                   description: Status atual da comanda.
 *                 aberto_em:
 *                   type: string
 *                   format: date-time
 *                   description: Data e hora de abertura da comanda.
 *                 fechado_em:
 *                   type: string
 *                   format: date-time
 *                   description: Data e hora de fechamento da comanda.
 *                 total_comanda:
 *                   type: number
 *                   description: Total da comanda (valor total de todos os itens consumidos).
 *                   example: 350.75
 *                 detalhes_itens:
 *                   type: array
 *                   description: Lista de detalhes dos itens consumidos na comanda.
 *                   items:
 *                     type: object
 *                     properties:
 *                       item_id:
 *                         type: integer
 *                         description: ID do item consumido.
 *                         example: 101
 *                       nome_item:
 *                         type: string
 *                         description: Nome do item consumido.
 *                         example: "Café"
 *                       quantidade:
 *                         type: integer
 *                         description: Quantidade consumida do item.
 *                         example: 2
 *                       preco_unitario:
 *                         type: number
 *                         description: Preço unitário do item.
 *                         example: 10.50
 *                       total_item:
 *                         type: number
 *                         description: Total do item consumido (quantidade * preço unitário).
 *                         example: 21.00
 *       404:
 *         description: Comanda não encontrada.
 *       500:
 *         description: Erro ao buscar a comanda.
 */
async function buscarPorId(req, res) {
    try {
        const id = req.params.id;

        const comandaEncontrada = await comanda.findByPk(id, {
            include: [
                {
                    model: ordemProducao,
                    as: "ordem_producaos",
                    include: [
                        {
                            model: itemCardapio,
                            as: "item_cardapio",
                        },
                    ],
                },
            ],
        });

        if (!comandaEncontrada) {
            return res.status(404).json({ error: "Comanda não encontrada." });
        }

        let totalComanda = 0;
        const detalhesItens = comandaEncontrada.ordem_producaos.map((ordem) => {
            const totalItem = ordem.quantidade * ordem.item_cardapio.preco;
            totalComanda += totalItem;

            return {
                id: ordem.id,
                item_id: ordem.item_cardapio.id,
                nome_item: ordem.item_cardapio.nome,
                quantidade: ordem.quantidade,
                preco_unitario: ordem.item_cardapio.preco,
                total_item: totalItem,
            };
        });

        const mesaEncontrada = await mesa.findByPk(comandaEncontrada.mesa_id);

        res.status(200).json({
            id: comandaEncontrada.id,
            mesa_id: mesaEncontrada.numero,
            status: comandaEncontrada.status,
            aberto_em: comandaEncontrada.aberto_em,
            fechado_em: comandaEncontrada.fechado_em,
            total_comanda: totalComanda,
            detalhes_itens: detalhesItens,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default { abrir, fechar, buscarTodas, buscarPorId };
