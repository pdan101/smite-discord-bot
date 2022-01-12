const { makeRequest } = require('../create-signature');
const { MessageEmbed } = require('discord.js');

module.exports = {
  getPlayerAchievements: async function getPlayerAchievements(playerId) {
    const achievements = await makeRequest('getplayerachievements', [playerId]);

    console.log(achievements);

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Achievements for ${achievements['Name']}`)
      .addFields(
        {
          name: 'Kills',
          value: achievements['AssistedKills'].toString(),
          inline: true,
        },
        { name: 'Deaths', value: achievements['Deaths'].toString(), inline: true },
        {
          name: 'Assists',
          value: achievements['PlayerKills'].toString(),
          inline: true,
        },
        { name: '\u200B', value: '\u200B' },
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
        }
      );

    let dataToSend = {
      embeds: [embed],
    };

    return dataToSend;
  },
};
