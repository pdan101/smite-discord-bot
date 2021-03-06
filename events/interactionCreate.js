const { Collection } = require('discord.js');
const fs = require('fs');
const { getPlayerGodRanks } = require('../selections/playerGodRanks');
const { getPlayerAchievements } = require('../selections/playerAchievements');
const { getPlayerMatchHistory } = require('../selections/playerMatchHistory');
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

      // for the getplayer command (will soon change so it would be for getting gods)
      if (interaction.customId === 'getplayer') {
        const data = await getPlayerGodRanks(interaction.values[0]);
        interaction.reply(data);
      } else if (interaction.customId === 'getachievements') {
        const data = await getPlayerAchievements(interaction.values[0]);
        interaction.reply(data);
      } else if (interaction.customId === 'getmatchhistory') {
        await interaction.deferReply();
        const data = await getPlayerMatchHistory(interaction.values[0]);
        interaction.editReply(data);
      }
    }
    // if interaction does not match, return out of this function
    else return;
  },
};
