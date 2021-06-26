import Discord from 'discord.js';
import schedule from 'node-schedule';
import dotenv from 'dotenv';
import motivacionalApi from './motivacional/motivacionalApi.js';
import taskService from './services/TaskService.js';

const client = new Discord.Client();

dotenv.config();

const fuso = process.env.FUSO ?? 0;

const discordInfo = [
  { user: 'piique', id: '301116055911399435', matricula: '704421' },
  { user: 'namaria', id: '690341408200327229', matricula: '696829' },
  { user: 'matheus', id: '487601326360887296', matricula: '704843' },
  { user: 'jopei', id: '658879812324294676', matricula: '701455' },
  { user: 'maidog', id: '694329529195298956', matricula: '695785' },
  { user: 'paulindo', id: '286560019741278209', matricula: '690575' },
  { user: 'annacorna', id: '547582806876749859', matricula: '724062' },
  { user: 'waltinhocorno', id: '226761310501732352', matricula: '666666' },
];

const idChannels = {
  privado: '738149680894050305', // urgod
  roleplay: '723342931242778729', // brabos
  'call-do-bot': '812503441049911316', // brabos
  noPuedoMotivacional: '836599706494173244', // no puedo
};

const daysWeek = {
  0: 'domingo',
  1: 'segunda',
  2: 'terca',
  3: 'quarta',
  4: 'quinta',
  5: 'sexta',
  6: 'sabado',
};

const daysPhrase = {
  0: 'Vai rezar crente!!',
  1: 'Bom ? \nInicio de semana ',
  2: 'Bom ? \nJá é terça-feira em quase no meio da semana',
  3: 'Continua bom ?kk \nPra hoje, meio da semana,temos só uma aulinha',
  4: 'Urfa é quase sexta!!!',
  5: 'Sextou amor!!!',
  6: 'Mano é sabado kkkkkk me deixa em paz, folga do bot, até segunda!!',
};

const getFormattedDate = (data) => {
  const dia = data.getDate().toString();
  const diaF = (dia.length === 1) ? `0${dia}` : dia;
  const mes = (data.getMonth() + 1).toString(); // +1 pois no getMonth Janeiro começa com zero.
  const mesF = (mes.length === 1) ? `0${mes}` : mes;
  const anoF = data.getFullYear();
  // return `${diaF}/${mesF}/${anoF}`;
  return `${diaF}/${mesF}`;
};

// run one time, when the server starts
client.once('ready', () => {
  console.log('Ready!');

  // schedule PUC
  const rulePuc = new schedule.RecurrenceRule();
  rulePuc.dayOfWeek = [new schedule.Range(1, 5)]; // segunda a sexta
  rulePuc.hour = 18 - fuso;
  rulePuc.minute = 20;
  const jobPuc = schedule.scheduleJob(rulePuc, () => {
    const date = new Date(new Date() - (-fuso * 3600000));
    // client.channels.cache.get(idChannels.privado).send(`Horário de ${daysWeek[date.getDay()]}: \n`, {
    //   files: [`./src/img/${daysWeek[date.getDay()]}.png`],
    // });

    // client.channels.cache.get(idChannels.roleplay).send(`@everyone \nHorário de ${daysWeek[date.getDay()]}: \n`, {
    //   files: [`./src/img/${daysWeek[date.getDay()]}.png`],
    // });
  });

  // schedule Motivacional
  const ruleMotivacional = new schedule.RecurrenceRule();
  ruleMotivacional.dayOfWeek = [new schedule.Range(0, 6)]; // todos os dias da semana
  ruleMotivacional.hour = 9 - fuso;
  ruleMotivacional.minute = 0;
  const jobMotivacional = schedule.scheduleJob(ruleMotivacional, () => {
    const date = new Date(new Date() - (-fuso * 3600000));
    motivacionalApi('pt').then((response) => {
      // console.log(response);
      const msg = `@everyone Mensagem do dia:\n- ${response.originalText}\n- ${response.translatedText} \n~ ${response.author ?? 'desconhecido'}`;
      client.channels.cache.get(idChannels.roleplay).send(msg);
    });
    motivacionalApi('pt').then((response) => {
      // console.log(response);
      const msg = `Mensagem do dia:\n- ${response.originalText}\n- ${response.translatedText} \n~ ${response.author ?? 'desconhecido'}`;
      client.channels.cache.get(idChannels.noPuedoMotivacional).send(msg);
    });
  });
});

// commands to bot
const commands = {
  calendario: (message) => {
    message.channel.send('Aulas da semana: \n', {
      files: [
        './src/img/calendario.png',
      ],
    });
  },
  aula: (message) => {
    const date = new Date(new Date() - (-fuso * 3600000));
    message.channel.send(`${daysPhrase[date.getDay()]} \nHorário de ${daysWeek[date.getDay()]}: \n`, {
      files: [`./src/img/${daysWeek[date.getDay()]}.png`],
    });
  },
  motivacional: (message) => {
    motivacionalApi('pt').then((resultado) => {
      // console.log(resultado);
      const msg = `- ${resultado.originalText}\n- ${resultado.translatedText} \n~ ${resultado.author ?? 'desconhecido'}`;
      message.channel.send(msg);
    });
  },
  help: (message) => {
    const commandsList = Object.entries(commands).map((e) => `-\t!${e[0]}`).join('\n');
    message.channel.send(`Lista de comandos do BOT: \n${commandsList}`);
  },
  tasks: (message) => {
    try {
      discordInfo.forEach((discord) => {
        // console.log(message.author.id);
        if (discord.id === message.author.id) {
          taskService.getTasks({ matricula: discord.matricula }).then((response) => {
            const msg = response.data.map((row) => {
              const date = getFormattedDate(new Date(row.date));
              return `${date} - ${row.materia}`;
            }).join('\n');

            if (msg) {
              message.channel.send(`TAREFAS\nPróximos 15 dias: \n\n${msg}\n\nMais info: https://atividadespuc.pedrovilaca.com/tarefas`);
            } else {
              message.channel.send('Nenhuma tarefa cadastrada!');
            }
          }).catch((error) => {
            // console.log('Deu erro caraio');
            // console.warn(error);
          });
        }
        return;
      });
    } catch (error) {
      // console.log(error);
      return;
    }
    // message.channel.send('Nenhum usuário cadastrado para o bot!');
  },
  // 'teste': (message) => {
  //   message.channel.send('Mensagem de teste')
  // }
};

client.on('message', (message) => {
  console.log(message.content);
  // if to verify and call commands
  if (message.content[0] === '!' && commands[message.content.substr(1)]) {
    // message.react('🤖'); // react every time the bot is called
    commands[message.content.substr(1)](message);
  }

  // react to Jopeina Bot messages
  if (message.author.username === 'Jopeina Bot') {
    message.react('🤖');
  }

  if (message.content === '!time') {
    const date = new Date(new Date() - (-fuso * 3600000));
    message.channel.send(`${date}`);
  }
});

client.login(process.env.TOKEN);
