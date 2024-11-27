module.exports = {
    up: async (queryInterface, Sequelize) => {

        const tableExists = await queryInterface
            .describeTable('comanda')
            .then(() => true)
            .catch(() => false);

        if (!tableExists) {
            await queryInterface.createTable('comanda', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                mesa_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'mesa',
                        key: 'id',
                    },
                    allowNull: false,
                },
                usuario_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'usuario',
                        key: 'id',
                    },
                    allowNull: true,
                },
                status: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    validate: {
                        isIn: [['aberta', 'fechada']],
                    },
                },
                criado_em: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                fechado_em: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('comanda');
    }
};
