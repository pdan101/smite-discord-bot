const { makeRequest } = require('../create-signature');
const { MessageEmbed } = require('discord.js');

module.exports = {
  getPlayerAchievements: async function getPlayerAchievements(playerId) {
    const achievements = await makeRequest('getplayerachievements', [playerId]);

    // console.log(achievements);

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Achievements for ${achievements['Name']}`)
      .addFields(
        {
          name: 'Kills',
          value: achievements['PlayerKills'].toString(),
          inline: true,
        },
        { name: 'Deaths', value: achievements['Deaths'].toString(), inline: true },
        {
          name: 'Assists',
          value: achievements['AssistedKills'].toString(),
          inline: true,
        },
        {
          name: 'First Bloods',
          value: achievements['FirstBloods'].toString(),
          inline: true,
        },
        {
          name: 'Shutdowns',
          value: achievements['ShutdownSpree'].toString(),
          inline: true,
        },
        {
          name: 'Double Kills',
          value: achievements['DoubleKills'].toString(),
          inline: true,
        },
        {
          name: 'Triple Kills',
          value: achievements['TripleKills'].toString(),
          inline: true,
        },
        {
          name: 'Quadra Kills',
          value: achievements['QuadraKills'].toString(),
          inline: true,
        },
        {
          name: 'Penta Kills',
          value: achievements['PentaKills'].toString(),
          inline: true,
        },
        { name: '\u200B', value: '\u200B' },
        { name: 'Killing Sprees', value: '\u200B' },
        {
          name: 'Killing Sprees',
          value: achievements['KillingSpree'].toString(),
          inline: true,
        },
        {
          name: 'Rampages',
          value: achievements['RampageSpree'].toString(),
          inline: true,
        },
        {
          name: 'Unstoppables',
          value: achievements['UnstoppableSpree'].toString(),
          inline: true,
        },
        {
          name: 'Divines',
          value: achievements['DivineSpree'].toString(),
          inline: true,
        },
        {
          name: 'Immortals',
          value: achievements['ImmortalSpree'].toString(),
          inline: true,
        },
        {
          name: 'Godlikes',
          value: achievements['GodLikeSpree'].toString(),
          inline: true,
        },
        { name: '\u200B', value: '\u200B' },
        { name: 'Objective Kills', value: '\u200B' },
        {
          name: 'Gold Fury',
          value: achievements['GoldFuryKills'].toString(),
          inline: true,
        },
        {
          name: 'Fire Giant',
          value: achievements['FireGiantKills'].toString(),
          inline: true,
        },
        {
          name: 'Tower Kill',
          value: achievements['TowerKills'].toString(),
          inline: true,
        },
        {
          name: 'Phoenix Kill',
          value: achievements['PhoenixKills'].toString(),
          inline: true,
        },
        {
          name: 'Siege Juggernaut',
          value: achievements['SiegeJuggernautKills'].toString(),
          inline: true,
        },
        {
          name: 'Wild Juggernaut',
          value: achievements['WildJuggernautKills'].toString(),
          inline: true,
        }
      );

    let dataToSend = {
      embeds: [embed],
    };

    return dataToSend;
  },
};
