const taskService = require('../services/TaskService.js');

const discordInfo = [
  { user: 'piique', id: 301116055911399435, matricula: 704421 },
  { user: 'namaria', id: 690341408200327229, matricula: 696829 },
  { user: 'matheus', id: 487601326360887296, matricula: 704843 },
  { user: 'jopei', id: 658879812324294676, matricula: 701455 },
  // { user: 'maidog', id: 694329529195298956, matricula: 000000 }, // falta colocar matricula correta
  // { user: 'paulindo', id: 286560019741278209, matricula: 000000 }, // falta colocar matricula correta
  { user: 'annacorna', id: 547582806876749859, matricula: 724062 },
  { user: 'waltinhocorno', id: 226761310501732352, matricula: 666666 },
];

const id = 301116055911399435;

const getFormattedDate = (data) => {
  const dia = data.getDate().toString();
  const diaF = (dia.length === 1) ? `0${dia}` : dia;
  const mes = (data.getMonth() + 1).toString(); // +1 pois no getMonth Janeiro começa com zero.
  const mesF = (mes.length === 1) ? `0${mes}` : mes;
  const anoF = data.getFullYear();
  return `${diaF}/${mesF}/${anoF}`;
};

const teste = () => {
  try {
    discordInfo.forEach((discord) => {
      // console.log(discord.id ==);
      if (discord.id === id) {
        console.log('entrou aqui');
        taskService.getTasks({ matricula: discord.matricula }).then((response) => {
          console.log(response.data);
          const msg = response.data.map((row) => {
            const date = getFormattedDate(new Date(row.date));
            return `${row.materia} - ${date}`;
          }).join('\n');

          console.log(msg);
          // if (msg) {
          // console.log(msg);
          // message.channel.send(msg);
          // } else {
          // console.log('nenhuma tarefa cadastrada!');
          // message.channel.send('Nenhuma tarefa cadastrada!');
          // }
        }).catch((error) => {
          console.log('Deu erro caraio');
          console.log(error);
        });
      }
      return;
    });
  } catch (error) {
    console.log(error);
  }
};

teste();

// message.channel.send('Nenhum usuário cadastrado para o bot!');
