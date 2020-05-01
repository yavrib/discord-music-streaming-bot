import { Message } from 'discord.js';

const showHelp = (message: Message, prefix: string) => {
    return message.channel.send(`\`\`\`Usable commands:
${prefix}play / ${prefix}p: Takes your input(Youtube URL currently) and adds it to the queue.\`\`\``);
}

export {
    showHelp
}
