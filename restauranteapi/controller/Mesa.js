import mesa from "../models/Mesa.js";

/**
 * @swagger
 * /mesas:
 *   get:
 *     summary: Lista todas as mesas.
 *     description: Retorna todas as mesas cadastradas.
 *     tags: [Mesas]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: Categoria ('livre' ou 'ocupada').
 *         schema:
 *           type: string
 *           enum: [livre, ocupada]
 *     responses:
 *       200:
 *         description: Lista de mesas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   numero:
 *                     type: integer
 *                   status:
 *                     type: string
 *       500:
 *         description: Erro ao listar as mesas.
 */
async function listar(req, res) {
    try {
        const { status } = req.query;

        if (!status) {
            const mesas = await mesa.findAll();
            return res.status(200).json(mesas);
        }

        if (!["livre", "ocupada"].includes(status)) {
            return res.status(400).send("Status inválido. Use 'livre' ou 'ocupada'.");
        }

        const mesas = await mesa.findAll({
            where: { status },
        });

        res.status(200).json(mesas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /mesas:
 *   post:
 *     summary: Adiciona uma nova mesa.
 *     description: Cria uma nova mesa com número e status.
 *     tags: [Mesas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero:
 *                 type: integer
 *               status:
 *                 type: string
 *                 example: "livre"
 *     responses:
 *       201:
 *         description: Mesa adicionada com sucesso.
 *       400:
 *         description: Número e status são obrigatórios.
 *       500:
 *         description: Erro ao adicionar a mesa.
 */
async function adicionar(req, res) {
    try {
        const { numero, status } = req.body;

        if (!numero || !status) {
            return res.status(400).send("Número e status são obrigatórios.");
        }

        const novaMesa = await mesa.create({ numero, status });
        res.status(201).json(novaMesa);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /mesas/{id}:
 *   delete:
 *     summary: Remove uma mesa.
 *     description: Remove uma mesa do sistema com base no ID.
 *     tags: [Mesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da mesa a ser removida.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mesa removida com sucesso.
 *       404:
 *         description: Mesa não encontrada.
 *       500:
 *         description: Erro ao remover a mesa.
 */
async function remover(req, res) {
    try {
        const { id } = req.params;

        const mesaExistente = await mesa.findByPk(id);
        if (!mesaExistente) {
            return res.status(404).json({ error: "Mesa não encontrada." });
        }

        await mesa.destroy({ where: { id } });
        res.status(200).json({ message: "Mesa removida com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /mesas/{id}/status:
 *   put:
 *     summary: Atualiza o status de uma mesa.
 *     description: Atualiza o status da mesa com base no ID.
 *     tags: [Mesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da mesa.
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
 *                 example: "ocupada"
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso.
 *       400:
 *         description: O status é obrigatório.
 *       404:
 *         description: Mesa não encontrada.
 *       500:
 *         description: Erro ao atualizar o status.
 */
async function atualizarStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).send("O status é obrigatório.");
        }

        const mesaExistente = await mesa.findByPk(id);
        if (!mesaExistente) {
            return res.status(404).json({ error: "Mesa não encontrada." });
        }

        mesaExistente.status = status;
        await mesaExistente.save();

        res.status(200).json(mesaExistente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default { adicionar, listar, remover, atualizarStatus };
