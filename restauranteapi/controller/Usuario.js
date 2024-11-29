import usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário.
 *     description: Verifica as credenciais do usuário e retorna um token JWT válido por 2 horas.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário.
 *                 example: "usuario@exemplo.com"
 *               senha:
 *                 type: string
 *                 description: Senha do usuário.
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT gerado.
 *                 nome:
 *                   type: string
 *                   description: Nome do usuário.
 *                 usuario:
 *                   type: integer
 *                   description: Id do usuário.
 *       401:
 *         description: Credenciais inválidas (email ou senha incorretos).
 *       500:
 *         description: Erro ao autenticar o usuário.
 */
async function autenticar(req, res) {
    try {
        const { email, senha } = req.body;

        const user = await usuario.findOne({ where: { email } });
        if (!user) return res.status(401).send("Usuário não encontrado.");

        const senhaValida = await bcrypt.compare(senha, user.senha_hash);
        if (!senhaValida) return res.status(401).send("Senha inválida.");

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "7d" });
        res.status(200).json({ "user": user.id, "nome": user.nome, "token": token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário.
 *     description: Cria um novo usuário no sistema com nome, email e senha.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário.
 *                 example: "João da Silva"
 *               email:
 *                 type: string
 *                 description: Email do usuário.
 *                 example: "joao.silva@exemplo.com"
 *               senha:
 *                 type: string
 *                 description: Senha do usuário.
 *                 example: "senha123"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do usuário criado.
 *                 nome:
 *                   type: string
 *                   description: Nome do usuário.
 *                 email:
 *                   type: string
 *                   description: Email do usuário.
 *       500:
 *         description: Erro ao registrar o usuário.
 */
async function registrar(req, res) {
    try {
        const { nome, email, senha } = req.body;

        const senhaHash = await bcrypt.hash(senha, 10);
        const novoUsuario = await usuario.create({ nome, email, senha_hash: senhaHash });

        res.status(201).json(novoUsuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default { autenticar, registrar };
