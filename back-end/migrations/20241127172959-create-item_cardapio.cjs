module.exports = {
    up: async (queryInterface, Sequelize) => {

        const tableExists = await queryInterface
            .describeTable('item_cardapio')
            .then(() => true)
            .catch(() => false);

        if (!tableExists) {
            await queryInterface.createTable('item_cardapio', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                nome: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                categoria: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    validate: {
                        isIn: [['prato', 'bebida']],
                    },
                },
                preco: {
                    type: Sequelize.DECIMAL(10, 2),
                    allowNull: false,
                },
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('item_cardapios');
    }
};
