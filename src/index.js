const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
  if (message.content.toUpperCase().indexOf('PEDRO') >= 0) {
    message.channel.send('Sem tempo irmão!');
  }

  if (message.content.toUpperCase().indexOf('<@!301116055911399435>') >= 0) {
    message.channel.send('Chama no zap: (31) 99568-4012');
  }

  if (message.content.toUpperCase().indexOf('CARALHO') >= 0) {
    if(message.author.username === 'Batatinha'){
      message.channel.send('linda');
    }else if (message.author.username === 'maicon_gomes'){
      message.channel.send('corninho');
    }else if (message.author.username === 'Jopeina'){
      message.channel.send('viadinho');
    }else if (message.author.username === 'bhaskara'){
      message.channel.send('putinha');
    }else if (message.author.username === 'VRAUterWhite'){
      message.channel.send('para de falar palavrão Waltin!');
    }else {
      message.channel.send('puta');
    }
  }

	console.log(message.author.username + ': ' + message.content);
});

// console.log(process.env);
client.login(process.env.TOKEN);