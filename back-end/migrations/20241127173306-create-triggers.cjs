'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.sequelize.query(`
        DROP TRIGGER IF EXISTS trigger_comanda_create ON comanda;
    `);

    await queryInterface.sequelize.query(`
        DROP TRIGGER IF EXISTS trigger_comanda_close ON comanda;
    `);
  

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION marcar_mesa_ocupada()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE mesa
        SET status = 'ocupada'
        WHERE id = NEW.mesa_id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_comanda_create
      AFTER INSERT ON comanda
      FOR EACH ROW
      EXECUTE FUNCTION marcar_mesa_ocupada();
    `);

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION marcar_mesa_livre()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.status = 'fechada' AND OLD.status != 'fechada' THEN
          UPDATE mesa
          SET status = 'livre'
          WHERE id = NEW.mesa_id;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_comanda_close
      AFTER UPDATE ON comanda
      FOR EACH ROW
      EXECUTE FUNCTION marcar_mesa_livre();
    `);

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE PROCEDURE atualizar_status_mesas()
        LANGUAGE plpgsql
        AS $$
        BEGIN
            UPDATE mesa
            SET status = 'livre'
            WHERE id IN (
                SELECT c.mesa_id
                FROM comanda c
                WHERE c.status = 'fechada'
                AND (c.fechado_em IS NOT NULL)
                AND c.mesa_id IS NOT NULL
            )
            AND status = 'ocupada';
        END;
        $$;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_comanda_create ON comanda;
      DROP FUNCTION IF EXISTS marcar_mesa_ocupada;
    `);

    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_comanda_close ON comanda;
      DROP FUNCTION IF EXISTS marcar_mesa_livre;
    `);

    await queryInterface.sequelize.query(`
      DROP PROCEDURE IF EXISTS atualizar_status_mesas
    `);
  }
};
