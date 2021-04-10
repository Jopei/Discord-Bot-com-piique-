import Discord from 'discord.js';
import schedule from 'node-schedule';
import dotenv from 'dotenv';
import motivacionalApi from './motivacional/motivacionalApi.js';

const client = new Discord.Client();

dotenv.config();

const fuso = process.env.FUSO ?? 0;

const idChannels = {
  privado: '738149680894050305', // urgod
  roleplay: '723342931242778729', // brabos
  'call-do-bot': '812503441049911316', // brabos
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
    client.channels.cache.get(idChannels.roleplay).send(`@everyone \nHorário de ${daysWeek[date.getDay()]}: \n`, {
      files: [`./src/img/${daysWeek[date.getDay()]}.png`],
    });
  });

  // schedule Motivacional
  const ruleMotivacional = new schedule.RecurrenceRule();
  ruleMotivacional.dayOfWeek = [new schedule.Range(0, 6)]; // todos os dias da semana
  ruleMotivacional.hour = 9 - fuso;
  ruleMotivacional.minute = 0;
  const jobMotivacional = schedule.scheduleJob(ruleMotivacional, () => {
    const date = new Date(new Date() - (-fuso * 3600000));
    motivacionalApi('pt').then((resultado) => {
      console.log(resultado);
      const msg = `@everyone Mensagem do dia:\n- ${resultado.originalText}\n- ${resultado.translatedText} \n~ ${resultado.author ?? 'desconhecido'}`;
      client.channels.cache.get(idChannels.privado).send(msg);
      client.channels.cache.get(idChannels.roleplay).send(msg);
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
      console.log(resultado);
      const msg = `- ${resultado.originalText}\n- ${resultado.translatedText} \n~ ${resultado.author ?? 'desconhecido'}`;
      message.channel.send(msg);
    });
  },
  help: (message) => {
    const commandsList = Object.entries(commands).map((e) => `-\t!${e[0]}`).join('\n');
    message.channel.send(`Lista de comandos do BOT: \n${commandsList}`);
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
