const { makeRequest } = require('../create-signature');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

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
    const MATCHES = 5;
    const matchData = await makeRequest('getmatchhistory', [playerId]);
    let imageArray = [];
    let embedArray = [];
    console.log(matchData.slice(0, MATCHES));
    if (matchData[0].ret_msg == null) {
      embedArray = matchData.slice(0, MATCHES).map(convertMatchToEmbed);
      for (let i = 0; i < MATCHES; i++) {
        const defaultImage =
          'https://discordjs.guide/assets/canvas-preview.30c4fe9e.png';
        const width = 600;
        const canvas = createCanvas(width, width / 6);
        const context = canvas.getContext('2d');
        for (let j = 1; j <= 6; j++) {
          let imgURL =
            matchData[i][`Item_${j}`] === ''
              ? defaultImage
              : `https://webcdn.hirezstudios.com/smite/item-icons/${matchData[i][
                  `Item_${j}`
                ]
                  .toLowerCase()
                  .replace(/ /g, '-')
                  .replace(/'/g, '')}.jpg`;
          const item1 = await loadImage(imgURL);
          context.drawImage(
            item1,
            ((j - 1) * canvas.width) / 6,
            0,
            canvas.width / 6,
            canvas.height
          );
        }
        let attachment = new MessageAttachment(canvas.toBuffer(), `items${i}.png`);
        imageArray[i] = attachment;
        embedArray[i].image = { url: `attachment://items${i}.png` };
      }
    }
    let dataToSend = { embeds: embedArray, files: imageArray };
    if (embedArray.length == 0) {
      dataToSend.content = 'No match history found.';
    }

    return dataToSend;
  },
};
