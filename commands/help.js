const _ = require("discord.js");

module.exports = {
    desiredArgs: 0,
    execute: (message) => {
      message.channel.send("I don't have any commands to show right now.");
   }
}
