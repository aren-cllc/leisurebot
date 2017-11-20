/*
Discord Monies
Monopoly for Discord

Ported to Leisure
*/

const Discord = require("discord.js");
var fs = require("fs");
var DiscordMonies = require('./classes/classloader.js');

module.exports = class {
  constructor(id, client, firstPlayer) {
    this.id = id;
    this.client = client;
    this.isOpen = true;
    var Game = new DiscordMonies.Game(id);
    DiscordMonies.Games[id] = Game
    var Player = new DiscordMonies.Player(firstPlayer, Game)
    DiscordMonies.Players[Player.ID] = Player
    DiscordMonies.Games[this.id].players[DiscordMonies.Games[this.id].players.length] = Player
  }
  addMember(member) {
    if (member == null) return;
    if (!this.isOpen) {
        throw new UserInputError("This game isn't available.")
    }
    if (DiscordMonies.Players[member.id]) {
        throw new Error("You're already in this game.");
    }
    var Player = new DiscordMonies.Player(member, DiscordMonies.Games[this.id])
    DiscordMonies.Players[Player.ID] = Player
    DiscordMonies.Games[this.id].players[DiscordMonies.Games[this.id].players.length] = Player
    Player.Game.announce("**" + Player.user.username + "** has joined the game!")
  }
  close() {
    DiscordMonies.Games[this.id].Started=true;
    this.isOpen=false;
    DiscordMonies.Games[this.id].announce("The game has been closed, let's go!");
    DiscordMonies.Games[this.id].advanceTurn();
  }
  processCommand(command, args, message) {
    if (fs.existsSync('commands/'+command+'.js')) {
        var command = require('./commands/'+command+'.js')
        if (command.DMOnly == true) {
          if (message.guild == null) {
            if (command.GameCommand == true) {
              if (DiscordMonies.Players[message.author.id] && DiscordMonies.Players[message.author.id].Game.Started == true) {
                command.runCommand(message.author, args.join(" "), message, DiscordMonies)
              } else {
                message.reply("You're not in a game or your game hasn't started yet.")
              }
            }
          }
        } else {
          if (command.GameCommand == true) {
            if (DiscordMonies.Players[message.author.id] && DiscordMonies.Players[message.author.id].Game.Started == true) {
              command.runCommand(message.author, args.join(" "), message, DiscordMonies)
            } else {
              msg.reply("You're not in a game or your game hasn't started yet.")
            }
          } else {
            command.runCommand(message.author, args.join(" "), message, DiscordMonies)
          }
        }
      }
    }
}
