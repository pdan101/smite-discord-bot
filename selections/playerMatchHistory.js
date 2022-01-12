const { makeRequest } = require('../create-signature');
const { MessageEmbed } = require('discord.js');

function checkUnknown(role) {
  if (role === 'Unknown') {
    return '';
  } else {
    return role;
  }
}

// converts the match information to a discord embed
function convertMatchToEmbed(match) {
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(
      `${match.Queue} ${match.Win_Status.toUpperCase()}: ${match.God.replace(
        /_/g,
        ' '
      )} ${checkUnknown(match.Role)}`
    )
    //.setURL(`https://smite.fandom.com/wiki/${god.god.replace(/ /g, '_')}`)
    .setDescription(`Level ${match.Level} (${match.Minutes} Minutes)`)
    .setThumbnail(
      `https://webcdn.hirezstudios.com/smite/god-skins/${match.God.toLowerCase()}_standard-${match.God.toLowerCase().replace(
        /_/g,
        '-'
      )}.jpg`
    )
    .addFields(
      // remove inline for no field value
      {
        name: 'K/D/A',
        value: `${match.Kills}-${match.Deaths}-${match.Assists}`,
        inline: true,
      },
      {
        name: 'Damage Dealt to Enemies',
        value: `${match.Damage}`,
        inline: true,
      },
      {
        name: 'Relics',
        value: `#1: ${match.Active_1}, #2: ${match.Active_2}`,
        inline: true,
      }
    );
  return embed;
}

module.exports = {
  getPlayerMatchHistory: async function getPlayerMatchHistory(playerId) {
    // console.log(playerId);
    const matchData = await makeRequest('getmatchhistory', [playerId]);
    console.log(matchData.slice(0, 10));

    const embedArray = matchData.slice(0, 10).map(convertMatchToEmbed);
    let dataToSend = { embeds: embedArray };
    if (embedArray.length == 0) {
      dataToSend.content = 'No match history found.';
    }

    return dataToSend;
  },
};
