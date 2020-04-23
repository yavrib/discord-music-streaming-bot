import { Message } from "discord.js";

const showHelp = (message: Message) => {
    return message.channel.send('I don\'t have any commands to show right now.');
}

export {
    showHelp
}
