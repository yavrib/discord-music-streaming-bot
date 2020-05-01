import * as Discord from 'discord.js';
import { token as TOKEN } from './TOKEN.json';

import { showHelp } from './src/commands/help';
import { Player } from './src/components/player';

const prefix = '--';
export const client = new Discord.Client();

export interface ICommand {
  verb: string;
  shortVerb: string;
  action: Function;
}

export interface IMetadataProvider {
  getGuildId: () => string;
  getVoiceConnections: () => Discord.VoiceConnection[];
}

export class MessageInjector<T> {
  private _message: T = null as any;
  set message(message: T) {
    this._message = message;
  }
  get message() {
    return this._message;
  }
};

const initialize = () => {
  const injector = new MessageInjector<Discord.Message>();
  const player = new Player({
    getGuildId: getGuildId(injector),
    getVoiceConnections: getVoiceChannels(client)
  });
  return {
    commands: {
      ...Player.getCommands().reduce((acc, command) => {
        acc[command.verb] = command.action(player);
        acc[command.shortVerb] = command.action(player);
        return acc;
      }, {} as any),
    },
    injector,
  }
}

let features: Record<string, Function>;
let discordMessageInjector: MessageInjector<Discord.Message>;

client.on('ready', () => {
  console.log(`${client.user.tag} is now running`);
  const { commands, injector } = initialize();
  features = commands;
  discordMessageInjector = injector;
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  discordMessageInjector.message = message;

  const msg = message.content.substr(prefix.length);
  const command = msg.split(' ')[0];
  const commandArguments = msg.split(' ').slice(1);

  if (features[command]) return features[command](message, commandArguments);

  switch (command) {
    case 'help':
      showHelp(message, prefix);
      break;
    case 'h':
      showHelp(message, prefix);
      break;
    default:
      showHelp(message, prefix);
      break;
  }
});

export function getGuildId(injector: MessageInjector<Discord.Message>) {
  return () => {
    return injector.message.guild.id
  }
}

export function getVoiceChannels(client: Discord.Client): () => Discord.VoiceConnection[] {
  return () => {
    return client.voiceConnections.array();
  }
}

client.login(`${TOKEN}`);
