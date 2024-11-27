import { Sequelize } from "sequelize";
import banco from "../banco.js";
import Comanda from "./Comanda.js";
import ItemCardapio from "./ItemCardapio.js";

const OrdemProducao = banco.define("ordem_producao", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    comanda_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Comanda,
            key: "id",
        },
    },
    item_cardapio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: ItemCardapio,
            key: "id",
        },
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM("pendente", "em_producao", "pronto", "entregue"),
        defaultValue: "pendente",
        allowNull: false,
    },
    setor: {
        type: Sequelize.ENUM("copa", "cozinha"),
        allowNull: false,
    },
});
export default OrdemProducao;
