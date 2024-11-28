import { Sequelize } from "sequelize";
import banco from "../banco.js";

export default banco.define("mesa", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    },
    status: {
        type: Sequelize.ENUM("livre", "ocupada"),
        defaultValue: "livre",
        allowNull: false,
    },
});
