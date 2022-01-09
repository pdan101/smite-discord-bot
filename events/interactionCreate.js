const { Collection } = require('discord.js');
const fs = require('fs');
const { makeRequest } = require('../create-signature');
const { MessageEmbed } = require('discord.js');
const commands = new Collection();
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  commands.set(command.data.name, command);
}
/*
function convertGodToString(godObject) {
  let str = 'God: ' + godObject.god + '\n';
  str += `Mastery Rank: ${godObject.Rank} (${godObject.Worshippers} Worshippers)\n`;
  str +=
    'Kills/Deaths/Assists: ' +
    godObject.Kills +
    '-' +
    godObject.Deaths +
    '-' +
    godObject.Assists +
    '\n';
  str += `Wins/Losses: ${godObject.Wins}-${godObject.Losses}\n`;
  return str;
}
*/
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
      // { name: 'Regular field title', value: 'Some value here' },
      // { name: '\u200B', value: '\u200B' },
      {
        name: 'Mastery Rank',
        value: `${god.Rank} (${god.Worshippers} Worshippers)     `,
        inline: true,
      },
      {
        name: 'Kills/Deaths/Assists     ',
        value: `${god.Kills}-${god.Deaths}-${god.Assists}`,
        inline: true,
      },
      {
        name: 'Wins/Losses',
        value: `${god.Wins}-${god.Losses}`,
        inline: true,
      }
    )
    // .addField('Inline field title', 'Some value here', true)
    .setTimestamp();
  return embed;
}

module.exports = {
  name: 'interactionCreate',
  execute: async (interaction) => {
    console.log(
      `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`
    );

    // handles the command interactions
    if (interaction.isCommand()) {
      const command = commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        return interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
    // handles the button interactions
    else if (interaction.isButton()) {
      console.log('button pressed');
      interaction.reply({
        content: 'button press interaction',
      });
    }
    // handles the select menu interactions
    else if (interaction.isSelectMenu()) {
      console.log('select menu option selected');

      // for the getplayer command
      if (interaction.customId === 'getplayer') {
        console.log(interaction.values[0]);
        const playerData = await makeRequest('getgodranks', [interaction.values[0]]);
        console.log(playerData);
        const sortedData = playerData
          .sort((e1, e2) => e2.Worshippers - e1.Worshippers)
          .slice(0, 10);

        const embedArray = sortedData.map(convertGodToEmbed);
        let dataToSend = { embeds: embedArray };
        if (embedArray.length == 0) {
          dataToSend.content = 'No data.';
        }

        interaction.reply(dataToSend);
      }
    }
    // if interaction does not match, return out of this function
    else return;
  },
};
