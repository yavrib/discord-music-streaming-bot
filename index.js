const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = require('./TOKEN.json');
const prefix = "!";

const { showHelp } = require('./commands/help.js')

client.on('ready', () => {
    console.log(`${client.user.tag} is now running`);
});

client.on('message', (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    const msg = message.content.substr(prefix.length);
    
    if (msg == "help") { message.channel.send(showHelp()) }
});

client.login(`${TOKEN}`);
