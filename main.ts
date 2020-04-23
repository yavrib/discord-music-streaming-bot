import * as Discord from 'discord.js';
import TOKEN from './TOKEN.json';

import { showHelp } from './src/commands/help';
import { play } from './src/commands/play';

const prefix = "--";
const client = new Discord.Client();

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
            showHelp(message);
            break;
        default:
            showHelp(message);
            break;
    }
});

client.login(`${TOKEN}`);
