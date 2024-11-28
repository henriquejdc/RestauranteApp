import { Sequelize } from "sequelize";
import banco from "../banco.js";

const Comanda = banco.define("comanda", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    mesa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM("aberta", "fechada"),
        defaultValue: "aberta",
        allowNull: false,
    },
    fechado_em: {
        type: Sequelize.DATE,
    },
});

export default Comanda;
