const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const { makeRequest } = require('../create-signature');

const portal_id_map = {
  1: 'Hi-Rez',
  5: 'Steam',
  9: 'PS4',
  10: 'Xbox',
  22: 'Switch',
  25: 'Discord',
  28: 'Epic',
};

function takeValidString(str) {
  if (str.length <= 23) {
    return str;
  } else if (str.length == 0) {
    return 'Empty Name';
  } else {
    return str.substring(0, 24);
  }
}

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

    const playerlist = await makeRequest('searchplayers', [playername]);

    let arrOfPlayers = playerlist.map((x) => ({
      label: takeValidString(x.Name + ` (${portal_id_map[x.portal_id]})`),
      value: x.player_id,
    }));

    if (arrOfPlayers.length > 24) {
      arrOfPlayers = arrOfPlayers.slice(0, 25);
    }
    console.log(arrOfPlayers);
    console.log(arrOfPlayers.length);

    const dropdown =
      arrOfPlayers.length > 0
        ? new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId('getplayer')
              .setPlaceholder('No player selected')
              .addOptions(arrOfPlayers)
          )
        : new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId('primary')
              .setLabel('No Players Found.')
              .setStyle('PRIMARY')
              .setDisabled(true)
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
