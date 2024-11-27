import cron from 'node-cron';
import conexao from '../banco.js';

cron.schedule('*/5 * * * *', async () => {
  try {
    await conexao.query('CALL atualizar_status_mesas();');
    console.log('Stored procedure chamada com sucesso!');
  } catch (error) {
    console.error('Erro ao chamar a stored procedure:', error);
  }
});
