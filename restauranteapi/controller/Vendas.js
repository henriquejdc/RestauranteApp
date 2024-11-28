import { Op } from "sequelize";
import comanda from "../model/Comanda.js";
import ordemProducao from "../model/OrdemProducao.js";
import itemCardapio from "../model/ItemCardapio.js";

/**
 * @swagger
 * /relatorio-vendas:
 *   get:
 *     summary: Gera o relatório de vendas diárias.
 *     description: Retorna o total de vendas do dia atual e o detalhamento por comanda.
 *     tags: [Relatórios]
 *     responses:
 *       200:
 *         description: Relatório de vendas gerado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalVendas:
 *                   type: number
 *                   description: Valor total das vendas do dia.
 *                   example: 1500.50
 *                 detalhes:
 *                   type: array
 *                   description: Lista de detalhes das comandas fechadas no dia.
 *                   items:
 *                     type: object
 *                     properties:
 *                       comanda_id:
 *                         type: integer
 *                         description: ID da comanda.
 *                         example: 1
 *                       total:
 *                         type: number
 *                         description: Valor total da comanda.
 *                         example: 250.75
 *       500:
 *         description: Erro ao gerar o relatório de vendas.
 */
async function relatorioVendas(req, res) {
    try {
        const inicio = new Date();
        inicio.setHours(0, 0, 0, 0);
        const fim = new Date();
        fim.setHours(23, 59, 59, 999);

        const comandasFechadas = await comanda.findAll({
            where: {
                fechado_em: {
                    [Op.gte]: inicio,
                    [Op.lte]: fim,
                },
            },
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

        let totalVendas = 0;
        const detalhes = comandasFechadas.map((comanda) => {
            const totalComanda = comanda.ordem_producaos.reduce((acc, ordem) => {
                return acc + ordem.quantidade * ordem.item_cardapio.preco;
            }, 0);

            totalVendas += totalComanda;
            return { comanda_id: comanda.id, total: totalComanda };
        });

        res.status(200).json({ totalVendas, detalhes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default { relatorioVendas };
