'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        const tableExists = await queryInterface
            .describeTable('ordem_producao')
            .then(() => true)
            .catch(() => false);

        if (!tableExists) {
            await queryInterface.createTable('ordem_producao', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                comanda_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'comanda',
                        key: 'id',
                    },
                    allowNull: false,
                },
                item_cardapio_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'item_cardapio',
                        key: 'id',
                    },
                    allowNull: false,
                },
                quantidade: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    validate: {
                        min: 1,
                    },
                },
                setor: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                    validate: {
                        isIn: [['cozinha', 'copa']],
                    },
                },
                status: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    validate: {
                        isIn: [['pendente', 'em_producao', 'pronto', 'entregue']],
                    },
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
        await queryInterface.dropTable('ordem_producao');
    }
};
