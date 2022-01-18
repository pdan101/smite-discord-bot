const { SlashCommandBuilder } = require('@discordjs/builders');
const { makeRequest } = require('../create-signature');
const { MessageEmbed } = require('discord.js');

function convertItemToEmbed(item) {
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(item.DeviceName)
    .setURL(`https://smite.fandom.com/wiki/${item.DeviceName.replace(/ /g, '_')}`)
    .setDescription(
      item.ItemDescription.Description +
        '\n' +
        item.ItemDescription.SecondaryDescription
    )
    .setThumbnail(item.itemIcon_URL)
    .addFields(
      // remove inline for no field value
      {
        name: 'Price',
        value: `${item.Price}`,
        inline: true,
      },
      {
        name: 'Item Tier',
        value: `${item.ItemTier}`,
        inline: true,
      },
      {
        name: 'Restricted Roles',
        value: `${
          item.RestrictedRoles.substring(0, 1).toUpperCase() +
          item.RestrictedRoles.substring(1)
        }`,
        inline: true,
      }
    )
    .setTimestamp();
  return embed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getitem') // can only have command as lowercase letters
    .setDescription('Replies with relevant item information.')
    .addStringOption((option) =>
      option
        .setName('itemname')
        .setDescription('Item name to search for')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const itemname = interaction.options.get('itemname').value;

    const itemlist = await makeRequest('getitems', ['1']);
    const itemInfo = itemlist.find(
      (element) => element.DeviceName.toLowerCase() === itemname.toLowerCase()
    );
    console.log(itemInfo);
    if (itemInfo === undefined) {
      let content = 'Item not found.\n';
      const recommended = itemlist.filter(
        (element) =>
          element.DeviceName.toLowerCase().indexOf(
            itemname.substring(0, 3).toLowerCase()
          ) != -1
      );
      content += `Did you mean: ${recommended
        .map((element) => element.DeviceName)
        .join(', ')}`;
      interaction.editReply({
        content: content,
      });
      return;
    } else {
      const embed = convertItemToEmbed(itemInfo);
      //edit reply here
      interaction.editReply({
        ephemeral: false,
        embeds: [embed],
      });
    }
  },
};
