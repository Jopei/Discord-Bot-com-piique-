const Discord = require('discord.js');
const client = new Discord.Client();
const schedule = require('node-schedule');
const dotenv = require('dotenv');
const pensador = require('pensador');
dotenv.config();

const fuso = process.env.FUSO ?? 0;

const id_channel = {
  'privado': '738149680894050305', // urgod
  'roleplay': '723342931242778729', // brabos
}

const daysWeek = {
  0: 'domingo',
  1: 'segunda',
  2: 'terca',
  3: 'quarta',
  4: 'quinta',
  5: 'sexta',
  6: 'sabado',
}

client.once('ready', () => {
  console.log('Ready!');  
  
  // schedule PUC
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [new schedule.Range(1, 5)]; // segunda a sexta
  rule.hour = 18 - fuso;
  rule.minute = 50;
  console.log(rule.hour)
  const jobPuc = schedule.scheduleJob(rule, function(date){
    client.channels.cache.get(id_channel['privado']).send(`Horário de ${daysWeek[date.getDay()]}: \n`, {
      files: [`./src/img/${daysWeek[date.getDay()]}.png`]
    })
    client.channels.cache.get(id_channel['roleplay']).send(`@everyone \nHorário de ${daysWeek[date.getDay()]}: \n`, {
      files: [`./src/img/${daysWeek[date.getDay()]}.png`]
    })
  });

  // schedule Motivacional
  rule.dayOfWeek = [new schedule.Range(0, 6)]; // todos os dias da semana
  rule.hour = 09 - fuso;
  rule.minute = 00;
  const jobMotivacional = schedule.scheduleJob(rule, function(date){
    pensador.getFromMotivacionais().then(result => {
      console.log(result);
      const msg = `MENSAGEM DO DIA @everyone\n\n ${result.message}\n~ ${result.author}`;
      client.channels.cache.get(id_channel['privado']).send(msg)
      client.channels.cache.get(id_channel['roleplay']).send(msg)
    });
  });

});

// commands to bot
const commands = {
  'calendario': (message) => {
    message.channel.send('Aulas da semana: \n', {
      files: [
        './src/img/calendario.png'
      ]
    });
  },
  'aula': (message) => {
    const date = new Date();
    message.channel.send(`Horário de ${daysWeek[date.getDay()]}: \n`, {
      files: [`./src/img/${daysWeek[date.getDay()]}.png`]
    })
  },
  'motivacional': (message) => {
    pensador.getFromMotivacionais().then(result => {
      const msg = `\n${result.message}\n~ ${result.author}`;
      message.channel.send(msg);
    });
  },
  'help': (message) => {
    const commandsList = Object.entries(commands).map((e) => '-\t!' + e[0]).join('\n');
    message.channel.send('Lista de comandos do BOT: \n' + commandsList);
  },
  // 'teste': (message) => {
  //   message.channel.send('Mensagem de teste')
  // }
};

client.on('message', message => {
  console.log(message.content)
  // if to verify and call commands
  if(message.content[0] === '!' && commands[message.content.substr(1)]){
    // message.react('🤖'); // react every time the bot is called
    commands[message.content.substr(1)](message);
  }

  // react to Jopeina Bot messages
  if(message.author.username === 'Jopeina Bot'){
    message.react('🤖');
  }
  if(message.content === '!time') {
    const date = new Date(new Date() - 10800000)
    message.channel.send(date + '');
  }
});

client.login(process.env.TOKEN);