'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        const tableExists = await queryInterface
            .describeTable('mesa')
            .then(() => true)
            .catch(() => false);

        if (!tableExists) {
            await queryInterface.createTable('mesa', {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
                numero: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    unique: true,
                },
                status: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    validate: {
                        isIn: [['livre', 'ocupada']],
                    },
                },
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('mesa');
    },
};
