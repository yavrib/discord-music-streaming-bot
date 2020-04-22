const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = require('./TOKEN.json');
const prefix = "--";

const { showHelp } = require('./commands/help.js');
const { play } = require('./commands/play.js');

client.on('ready', () => {
    console.log(`${client.user.tag} is now running`);
});

client.on('message', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    const msg = message.content.substr(prefix.length);
    const command = msg.split(" ")[0];
    const commandArguments = msg.split(" ").slice(1);

    switch (command) {
        case "play":
            play(message, commandArguments);
            break;
        case "help":
            showHelp();
            break;
        default:
            showHelp();
            break;
    }
});

client.login(`${TOKEN}`);
