const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { default: axios } = require('axios');

// dummy player data
/*
const playerData = [
  {
    player_id: 'Shinecune101',
  },
  {
    player_id: 'puchka',
  },
  {
    gamer_tag: 'gamer',
  },
];
*/

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getplayer') // can only have command as lowercase letters
    .setDescription('Replies with relevant player information.')
    .addStringOption((option) =>
      option
        .setName('playername')
        .setDescription('Player name to search for')
        .setRequired(true)
    ),
  async execute(interaction) {
    const playername = interaction.options.get('playername').value;
    console.log(playername);

    const bozoshows = await axios
      .get('https://prithwishjoyceshowtracker2.herokuapp.com/api/watchlist/1/')
      .then((response) => response.data.shows);

    let arrOfPlayers = bozoshows
      .map((x) => x.name) //replace (x.player_id ? x.player_id : x.gamer_tag)
      .map((x) => ({
        label: x,
        value: x,
      }));

    const dropdown = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('getplayer')
        .setPlaceholder('No player selected')
        .addOptions(arrOfPlayers)
    );

    //replies to interaction (not needed anymore when making this request?)
    // await interaction.reply({
    //   content: 'Here are the found players:',
    //   ephemeral: false,
    //   components: [dropdown],
    // });

    //do stuff here

    //edit reply here
    await interaction.reply({
      content: 'Here are the found players:',
      ephemeral: false,
      components: [dropdown],
    });
  },
};
