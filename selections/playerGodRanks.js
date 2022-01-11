const { makeRequest } = require('../create-signature');
const { MessageEmbed } = require('discord.js');

// converts the god information to a discord embed
function convertGodToEmbed(god) {
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(god.god)
    .setURL(`https://smite.fandom.com/wiki/${god.god.replace(/ /g, '_')}`)
    // .setDescription('Some description here')
    .setThumbnail(
      `https://webcdn.hirezstudios.com/smite/god-skins/${god.god
        .toLowerCase()
        .replace(/ /g, '_')}_standard-${god.god
          .toLowerCase()
          .replace(/ /g, '-')}.jpg`
    )
    .addFields(
      // remove inline for no field value
      {
        name: 'Mastery Rank',
        value: `${god.Rank}\n(${god.Worshippers} Worshippers)`,
        inline: true,
      },
      {
        name: 'K/D/A',
        value: `${god.Kills}-${god.Deaths}-${god.Assists}`,
        inline: true,
      },
      {
        name: 'Wins/Losses',
        value: `${god.Wins}-${god.Losses}`,
        inline: true,
      }
    )
    .setTimestamp();
  return embed;
}

module.exports = {
  getPlayerGodRanks: async function getPlayerGodRanks(playerId) {
    // console.log(playerId);
    const playerData = await makeRequest('getgodranks', [playerId]);
    // console.log(playerData);
    const sortedData = playerData
      .sort((e1, e2) => e2.Worshippers - e1.Worshippers)
      .slice(0, 10);

    const embedArray = sortedData.map(convertGodToEmbed);
    let dataToSend = { embeds: embedArray };
    if (embedArray.length == 0) {
      dataToSend.content = 'No god data found.';
    }

    return dataToSend
  }
}

// function convertGodToString(godObject) {
//   let str = 'God: ' + godObject.god + '\n';
//   str += `Mastery Rank: ${godObject.Rank} (${godObject.Worshippers} Worshippers)\n`;
//   str +=
//     'Kills/Deaths/Assists: ' +
//     godObject.Kills +
//     '-' +
//     godObject.Deaths +
//     '-' +
//     godObject.Assists +
//     '\n';
//   str += `Wins/Losses: ${godObject.Wins}-${godObject.Losses}\n`;
//   return str;
// }