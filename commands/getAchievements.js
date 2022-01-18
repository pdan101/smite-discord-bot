const { SlashCommandBuilder } = require('@discordjs/builders');
const { searchPlayer } = require('../search-player');

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
    searchPlayer(interaction, 'getachievements');
  },
};
