const { SlashCommandBuilder } = require('@discordjs/builders');
const { searchPlayer } = require('../search-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getmatchhistory') // can only have command as lowercase letters
    .setDescription('Replies with relevant player match history.')
    .addStringOption((option) =>
      option
        .setName('playername')
        .setDescription('Player name to search for')
        .setRequired(true)
    ),
  async execute(interaction) {
    searchPlayer(interaction, 'getmatchhistory');
  },
};
