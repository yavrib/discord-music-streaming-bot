const fs = require("fs");
const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = require('./TOKEN.json');
const prefix = "!";

let commands = new Map();
const files = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (_ of files) {
  const command = _.substring(0, _.length - 3);
  commands.set(command, require(`./commands/${_}`));
}

client.on('ready', () => {
    console.log(`${client.user.tag} is now running`);
});

client.on('message', (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    const msg = message.content.substr(prefix.length);
    const [_, ...args] = msg.split(" ");
    const command = commands.get(msg.split(" ")[0]);
    
    if (!command) return;
    if (!args || args.length < command.desiredArgs) {
      message.channel.send(`Not enough args, see \`${prefix}help\`.`);
      return;
    }
 
    try {
    //message is the default arg for all the commands
      command.execute(message, ...args);
    } catch (error) {
      console.log(error);
      message.channel.send("Sorry, an error has occurred.");
    }    
});

client.login(`${TOKEN}`);
