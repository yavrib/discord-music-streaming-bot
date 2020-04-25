import * as Discord from 'discord.js';
import TOKEN from './TOKEN.json';

import { showHelp } from './src/commands/help';
import { Player } from './src/components/player';

const prefix = "--";
const client = new Discord.Client();

export interface ICommand {
  verb: string;
  shortVerb: string;
  action: Function;
}

export interface IMetadataProvider {
  getGuildId: () => string;
  getVoiceConnections: () => Discord.VoiceConnection[];
}

class MessageInjector<T> {
  private _message: T = null as any;
  set message(message: T) {
    this._message = message;
  }
  get message() {
    return this._message;
  }
};

const initialize = () => {
  const messageInjector = new MessageInjector<Discord.Message>();

  const player = new Player({ 
    getGuildId: getGuildId(messageInjector), 
    getVoiceConnections: getVoiceChannels(client) 
  });
  const commands = {
    ...Player.getCommands().reduce((acc, command) => {
      acc[command.verb] = command.action(player);
      acc[command.shortVerb] = command.action(player);
      return acc;
    }, {} as any),
  }
  return { commands, injector: messageInjector };
}

let features: Record<string, Function>;
let discordMessageInjector: MessageInjector<Discord.Message>;

client.on('ready', () => {
    console.log(`${client.user.tag} is now running`);
    const { commands, injector: inject0r } = initialize();
    features = commands;
    discordMessageInjector = inject0r;
});

client.on('message', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    discordMessageInjector.message = message;

    const msg = message.content.substr(prefix.length);
    const command = msg.split(" ")[0];
    const commandArguments = msg.split(" ").slice(1);

    if (features[command]) return features[command](message, commandArguments);

    switch (command) {
        case "help":
            showHelp(message, prefix);
            break;
        case "h":
            showHelp(message, prefix);
            break;
        default:
            showHelp(message, prefix);
            break;
    }
});

function getGuildId(injector: MessageInjector<Discord.Message>) {
  return () => {
    return injector.message.guild.id
  }
}

function getVoiceChannels(client: Discord.Client) {
  return () => {
    return client.voiceConnections as any;
  }
}

client.login(`${TOKEN}`);
