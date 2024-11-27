'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        const tableExists = await queryInterface
            .describeTable('usuario')
            .then(() => true)
            .catch(() => false);

        if (!tableExists) {
            await queryInterface.createTable('usuario', {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
                nome: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                email: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                    unique: true,
                },
                senha_hash: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                criado_em: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('usuario');
    },
};
