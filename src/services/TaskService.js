import dotenv from 'dotenv';
import api from './api.js';

const TaskService = {
  getTasks: async ({ matricula, nextDays = 15 }) => {
    const retorno = await api.post('/api/bot/tasks', { matricula, nextDays });
    return retorno;
  },
};

export default TaskService;
