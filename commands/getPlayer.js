const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { makeRequest } = require('../create-signature');

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

    const playerlist = await makeRequest('searchplayers', [playername]);
    console.log(playerlist);

    let arrOfPlayers = playerlist.map((x) => ({
      label:
        x.Name +
        ' (Hi-Rez: ' +
        (x.hz_player_name === null ? 'N/A' : x.hz_player_name) +
        ')',
      value: x.player_id,
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
