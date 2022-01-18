const { SlashCommandBuilder } = require('@discordjs/builders');
// const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
// const { makeRequest } = require('../create-signature');
const { searchPlayer } = require('../search-player');

// const portal_id_map = {
//   1: 'Hi-Rez',
//   5: 'Steam',
//   9: 'PS4',
//   10: 'Xbox',
//   22: 'Switch',
//   25: 'Discord',
//   28: 'Epic',
// };

// function takeValidString(str) {
//   if (str.length <= 23) {
//     return str;
//   } else if (str.length === 0) {
//     return 'Empty Name';
//   } else {
//     return str.substring(0, 24);
//   }
// }

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getachievements')
    .setDescription("Replies with specified player's in-game achievements.")
    .addStringOption((option) =>
      option
        .setName('playername')
        .setDescription('Player name to search for')
        .setRequired(true)
    ),
  async execute(interaction) {
    searchPlayer(interaction);
  },
};
