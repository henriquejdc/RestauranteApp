import express from "express";
import banco from "./banco.js";
import itemCardapio from "./controller/ItemCardapio.js";
import comanda from "./controller/Comanda.js";
import ordemProducao from "./controller/OrdemProducao.js";
import mesa from "./controller/Mesa.js";
import auth from "./controller/Usuario.js";
import vendas from "./controller/Vendas.js";
import autenticarJWT from "./middleware/authMiddleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig.js"; 
import "./model/Associacoes.js";
import './utils/cron.js'; 

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.post("/auth/login", auth.autenticar);
app.post("/auth/register", auth.registrar);

app.use(autenticarJWT);

app.get("/itens-cardapio", itemCardapio.listar);
app.post("/itens-cardapio", itemCardapio.criar);
app.delete("/itens-cardapio/:id", itemCardapio.remover);

app.post("/comandas", comanda.abrir);
app.get("/comandas", comanda.buscarTodas);
app.get("/comandas/:id", comanda.buscarPorId);
app.put("/comandas/:id/fechar", comanda.fechar);
app.put("/comandas/:id/adicionar-item", ordemProducao.adicionarItem);

app.get("/ordens/:setor", ordemProducao.listarOrdens);
app.put("/ordens/:id/status", ordemProducao.atualizarStatus);

app.get("/mesas", mesa.listar);
app.post("/mesas", mesa.adicionar);
app.delete("/mesas/:id", mesa.remover);
app.put("/mesas/:id/status", mesa.atualizarStatus);

app.get("/relatorio-vendas", vendas.relatorioVendas);

try {
    banco.authenticate();
    console.log("Conexão com o banco de dados bem-sucedida.");

    banco.sync();
    app.listen(3000, () => {
        console.log("Servidor rodando na porta 3000");
        console.log("Servidor rodando na porta 3000. Acesse /api-docs para ver a documentação.");
    });
} catch (error) {
    console.error("Erro ao conectar com o banco:", error);
}
