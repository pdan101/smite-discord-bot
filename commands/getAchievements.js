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
  } else if (str.length === 0) {
    return 'Empty Name';
  } else {
    return str.substring(0, 24);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getachievements') // can only have command as lowercase letters
    .setDescription("Replies with specified player's in-game achievements.")
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

    const dropdown =
      arrOfPlayers.length > 0
        ? new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId('getachievements')
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

    //edit reply here
    await interaction.reply({
      content: `Here are the found players for search "${playername}":`,
      ephemeral: false,
      components: [dropdown],
    });
  },
};