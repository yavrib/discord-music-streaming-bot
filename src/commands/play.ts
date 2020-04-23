import ytdl from 'ytdl-core';
import { Message } from 'discord.js';

const play = async (message: Message, args: string[]) => {
  try {
    const voiceChannel = message.member.voiceChannel;
    const songInfo = await ytdl.getInfo(args[0]);
    
    const song = {
      title: songInfo.title,
      url: songInfo.video_url
    };
    if (!voiceChannel) return message.channel.send(
      "You need to be in a voice channel to use this command."
    );
    
    const connection = await voiceChannel.join();
    const currentSong = connection.playStream(ytdl(song.url)).stream;
    
    currentSong.addListener("end", () => {
      message.channel.send(`${song.title} has finished.`)
      connection.disconnect();
    })
  } catch (err) {
    console.log(err);
  }
}

export {
  play,
}
