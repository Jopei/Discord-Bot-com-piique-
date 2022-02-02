// discord invite link: https://discord.com/oauth2/authorize?client_id=812482585162416128&scope=bot&permissions=2147483647

const { Client, Intents } = require('discord.js');
const schedule = require('node-schedule');
const ytdl = require('ytdl-core');
const google = require('googleapis');
const fs = require('fs');
const motivacionalApi = require('./motivacional/motivacionalApi.js');
const taskService = require('./services/TaskService.js');
require('dotenv').config();


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const youtube = new google.youtube_v3.Youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

const fuso = process.env.FUSO ? process.env.FUSO : 0;

const onVocation = true;

const prefix = '!';

// connection: null,
// dispatcher: null,
// voiceChannel: null,
// queue: [],
// playing: false,

const servers = [];
// const servers = {
//   server: {
//     connection: null,
//     dispatcher: null,
//     voiceChannel: null,
//     queue: [],
//     playing: false,
//   },
// };

const ytdlOptions = {
  filter: 'audioonly',
};

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
  1: 'Bom? \nInicio de semana ',
  2: 'Bom? \nJá é terça-feira! Descanso? Nada disso, vai estutar a optativa.',
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

const playMusics = (message) => {
  if (servers[message.guild.id].playing) {
    return;
  }

  const playing = servers[message.guild.id].queue[0];
  // console.log(`Tocando isso aqui: ${playing}`);
  servers[message.guild.id].playing = true;
  servers[message.guild.id].dispatcher = servers[message.guild.id].connection.play(ytdl(playing, ytdlOptions));

  servers[message.guild.id].dispatcher.on('finish', () => {
    servers[message.guild.id].queue.shift();
    servers[message.guild.id].playing = false;
    if (servers[message.guild.id].queue.length > 0) {
      playMusics(message);
    } else {
      servers[message.guild.id].dispatcher = null;
      servers[message.guild.id].connection.disconnect();
    }
  });
};

const saveServer = (id) => {
  const file = './src/servers.json';
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error('Ocorreu um erro ao salvar informações dos servidores');
      console.error(err);
      return;
    }

    const json = JSON.parse(data);
    json.servers.push(id);
    fs.writeFile(file, JSON.stringify(json), (err2) => {
      if (err2) {
        console.error(err2);
        return;
      }
    });
  });
};

const loadServers = () => {
  const file = './src/servers.json';
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error('Ocorreu um erro ao carregar informações dos servidores');
      console.error(err);
      return;
    }

    const json = JSON.parse(data);

    json.servers.forEach((id) => {
      servers[id] = {
        connection: null,
        dispatcher: null,
        voiceChannel: null,
        queue: [],
        playing: false,
      };
    });
  });
};

client.on('guildCreate', (guild) => {
  servers[guild.id] = {
    connection: null,
    dispatcher: null,
    voiceChannel: null,
    queue: [],
    playing: false,
  };

  saveServer(guild.id);
});

// run one time, when the server starts
client.once('ready', () => {
  console.log('Ready!');

  loadServers();

  // schedule PUC
  /*
  const rulePuc = new schedule.RecurrenceRule();
  rulePuc.dayOfWeek = [new schedule.Range(1, 5)]; // segunda a sexta
  rulePuc.hour = 18 - fuso;
  rulePuc.minute = 20;
  const jobPuc = schedule.scheduleJob(rulePuc, () => {
    if (!onVocation) {
      const date = new Date(new Date() - (-fuso * 3600000));
      // client.channels.cache.get(idChannels.privado).send(`Horário de ${daysWeek[date.getDay()]}: \n`, {
      //   files: [`./src/img/${daysWeek[date.getDay()]}.png`],
      // });

      client.channels.cache.get(idChannels.roleplay).send(`@everyone \nHorário de ${daysWeek[date.getDay()]}: \n`, {
        files: [`./src/img/${daysWeek[date.getDay()]}.png`],
      });
    }
  });
  */

  // schedule Motivacional
  /*
  const ruleMotivacional = new schedule.RecurrenceRule();
  ruleMotivacional.dayOfWeek = [new schedule.Range(0, 6)]; // todos os dias da semana
  ruleMotivacional.hour = 9 - fuso;
  ruleMotivacional.minute = 0;
  const jobMotivacional = schedule.scheduleJob(ruleMotivacional, () => {
    const date = new Date(new Date() - (-fuso * 3600000));
    motivacionalApi('pt').then((response) => {
      const msg = `Mensagem do dia:\n- ${response.originalText}\n- ${response.translatedText} \n~ ${response.author ?? 'desconhecido'}`;
      client.channels.cache.get(idChannels.roleplay).send(msg);
    });
    motivacionalApi('pt').then((response) => {
      const msg = `Mensagem do dia:\n- ${response.originalText}\n- ${response.translatedText} \n~ ${response.author ?? 'desconhecido'}`;
      client.channels.cache.get(idChannels.noPuedoMotivacional).send(msg);
    });
  });
  */
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
      const msg = `- ${resultado.originalText}\n- ${resultado.translatedText} \n~ ${resultado.author && 'desconhecido'}`;
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
            // console.warn(error);
          });
        }
        return;
      });
    } catch (error) {
      console.error(error);
      return;
    }
    // message.channel.send('Nenhum usuário cadastrado para o bot!');
  },

  play: async (message) => {
    servers[message.guild.id].voiceChannel = message.member.voice.channel;
    console.log(message.guild.id);
    if (!servers[message.guild.id].voiceChannel) {
      return message.channel.send('Você precisa estar em um canal de voz para usar esse comando!');
    }

    if (!message.content.match(/(?<=(!\w+\s)).+/g)) {
      return message.channel.send('Não foi possível identificar a musica ou o link do vídeo!');
    }

    if (servers[message.guild.id].connection === null) {
      try {
        servers[message.guild.id].connection = await servers[message.guild.id].voiceChannel.join();
      } catch (error) {
        console.error(error);
        return message.channel.send('Erro! Não foi possível tocar a música!');
      }
    }

    const linkOrMusic = message.content.match(/(?<=(!\w+\s)).+/g)[0];

    if (ytdl.validateURL(linkOrMusic)) {
      // link
      servers[message.guild.id].queue.push(linkOrMusic);
      playMusics(message);
    } else {
      // youtube search and play the first result
      youtube.search.list({
        q: linkOrMusic,
        part: 'snippet',
        maxResults: 1,
        fields: 'items(id,snippet(title,description,thumbnails(default)))',
        type: 'video',
      }).then((response) => {
        const videoId = response.data.items[0].id.videoId;
        servers[message.guild.id].queue.push(`https://youtu.be/${videoId}`);
        playMusics(message);
        // console.log(JSON.stringify(servers[message.guild.id].queue));
        // console.log(`Adicionado: https://youtu.be/${videoId}`);
      }).catch((err) => {
        message.channel.send('Não foi possível identificar a musica ou o link do vídeo!');
        console.error(err);
      });
    }

    return;
  },

  stop: (message) => {
    if (!servers[message.guild.id].dispatcher) {
      return message.channel.send('Não há nenhuma música tocando!');
    }
    servers[message.guild.id].dispatcher.pause();
    // message.channel.send('Música pausada!');
  },

  start: (message) => {
    if (!servers[message.guild.id].dispatcher) {
      return message.channel.send('Não há nenhuma música tocando!');
    }
    servers[message.guild.id].dispatcher.resume();
    // message.channel.send('Música iniciada!');
  },

  leave: (message) => {
    servers[message.guild.id].voiceChannel = message.member.voice.channel;
    if (!message.member.voice.channel) {
      return message.channel.send('Você precisa estar em um canal de voz para usar esse comando!');
    }
    servers[message.guild.id].voiceChannel.leave();
    servers[message.guild.id].connection = null;
    servers[message.guild.id].dispatcher = null;
    servers[message.guild.id].playing = false;
    servers[message.guild.id].queue = [];
    // message.channel.send('Saindo do canal de voz!');
  },

  // 'teste': (message) => {
  //   message.channel.send('Mensagem de teste')
  // }
};

client.on('ready', () => {
  const guildId = '301120403776995339';
  const guild = client.guilds.cache.get(guildId);

  let commands;

  // uncomment to final deploy
  // if (guild) {
  //   commands = guild.commands;
  // } else {
  //   commands = client.application?.commands;
  // }
  commands = guild.commands;


  commands?.create({
    name: 'ping',
    description: 'Retorna o ping do bot',
  })
})

client.on('interactionCreate', (interaction) => {
  console.log(interaction);
  if (!interaction.isCommand()) return;

  const { commandName, option } = interaction;
  console.log(commandName)
  if (commandName === 'ping') {
    interaction.reply({
      content: 'pong',
      ephemeral: true,
    });
  }
});


client.on('messageCreate', async (message) => {
  console.log(message.content);

  if (message.content.startsWith(prefix)) {
    const command = message.content.match(/(?<=.)\w+/g)[0]; // get only the command without the prefix
    if (commands[command]) {
      message.react('🤖'); // react every time the bot is called
      commands[command](message);
    }
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

client.login(process.env.DISCORD_TOKEN);
