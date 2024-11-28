import { Sequelize } from "sequelize";
import banco from "../banco.js";

export default banco.define("usuario", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    senha_hash: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
