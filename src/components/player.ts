import ytdl from 'ytdl-core';
import { Readable } from 'stream';
import { Message, VoiceBroadcast } from 'discord.js';
import { ICommand, IMetadataProvider } from '../../main';
import { Observable } from "../util/observable";

interface ISong {
  title: string;
  url: string;
}

interface IPlaylist {
  songs: ISong[];
}

interface IPlayer {
  songIndex: number;
  currentSong: Observable<Readable | VoiceBroadcast>;
}

export abstract class ICommandModule {
  static getCommands(): ICommand[] {
    return [];
  };
}

type Playlist = IPlaylist & IPlayer;


export class Player extends ICommandModule {
  constructor(metadata: IMetadataProvider) {
    super();
    this.metadataProvider = metadata;
  }
  private metadataProvider: IMetadataProvider;
  private playlist: Playlist = {
    songs: [],
    songIndex: 0,
    currentSong: new Observable(null as any),
  };
  async play(message: Message, args: string[]) {
    const guildId = this.metadataProvider.getGuildId();
    const voiceConnections = this.metadataProvider.getVoiceConnections();
    console.log("======")
    console.log(voiceConnections[0]?.channel.guild)
    console.log("======")
    console.log(voiceConnections[0]?.channel.id)
    console.log("======")
    console.log(guildId)
    console.log("======")
    const voiceConnection = voiceConnections.find(voiceConnection => {
      voiceConnection.channel.guild.id === guildId
    });
    
    const userVoiceChannel = message.member.voiceChannel;
    if (!userVoiceChannel) return message.channel.send(
      "You need to be in a voice channel to use this command."
    )
    
    const songInfo = await ytdl.getInfo(args[0]);
    console.log("======")
    console.log(voiceConnection)
    console.log("======")

    if (voiceConnection) {
      return this.playlist.songs.push({ title: songInfo.title, url: songInfo.video_url });
    }

    const newVoiceConnection = await userVoiceChannel.join();

    this.playlist.songs.push({ title: songInfo.title, url: songInfo.video_url });
    message.channel.send(`Now playing: "${this.playlist.songs[0].title}".`);

    this.playlist.currentSong.subscribe((stream: Readable | VoiceBroadcast) => {
      stream.addListener("end", () => {
        message.channel.send(`"${this.playlist.songs[this.playlist.songIndex].title}" has finished.`);
        this.playlist.currentSong.value.removeAllListeners();
        if (this.playlist.songIndex === this.playlist.songs.length - 1) {
          newVoiceConnection.disconnect();
          this.playlist.songs = [];
          this.playlist.songIndex = 0;
        } else {
          this.playlist.songIndex = this.playlist.songIndex + 1
          this.playlist.currentSong.value = newVoiceConnection.playStream(ytdl(this.playlist.songs[this.playlist.songIndex].url)).stream;
          message.channel.send(`Now playing: "${this.playlist.songs[this.playlist.songIndex].title}".`);
        }
      })
    })
    this.playlist.currentSong.value = newVoiceConnection.playStream(ytdl(this.playlist.songs[0].url)).stream;
  }
  static getCommands(): ICommand[] {
    return [{shortVerb: "p", verb: "play", action: (instance: Player) => (message: Message, args: string[]) => { instance.play(message, args) }}];
  }
}
