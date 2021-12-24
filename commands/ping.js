const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
} = require('discord.js');

module.exports = {
  //creates the new command
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  //defines the execution function for the ping interaction
  async execute(interaction) {
    //makes a button and select menu
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('primary')
        .setLabel('Primary')
        .setStyle('PRIMARY')
    );
    const dropdown = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('select')
        .setPlaceholder('Nothing selected')
        .addOptions([
          {
            label: 'Select me',
            description: 'This is a description',
            value: 'first_option',
          },
          {
            label: 'You can select me too',
            description: 'This is also a description',
            value: 'second_option',
          },
        ])
    );
    //adds message embeds
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Some title')
      .setURL('https://discord.js.org')
      .setDescription('Some description here');
    //replies to interaction
    await interaction.reply({
      content: 'Pong!',
      ephemeral: false,
      components: [row, dropdown],
      embeds: [embed],
    });
  },
};
