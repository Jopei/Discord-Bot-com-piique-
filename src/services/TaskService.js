const dotenv = require('dotenv');
const api = require('./api.js');

const TaskService = {
  getTasks: async ({ matricula, nextDays = 15 }) => {
    const retorno = await api.post('/api/bot/tasks', { matricula, nextDays });
    return retorno;
  },
};

module.exports = TaskService;
