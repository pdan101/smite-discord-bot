const { SlashCommandBuilder } = require('@discordjs/builders');
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require('discord.js');
const { makeRequest } = require('../create-signature');

function splitString(str, limit = 11) {
  if (str.indexOf(' ') == -1 || str.length < limit) return str;
  const arr = str.split(' ');
  let combine = '';
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (i > 0 && arr[i].length > limit * 1.5) {
      combine += '\n';
    }
    combine += arr[i] + ' ';
    if (count < Math.floor(combine.length / limit)) {
      //console.log(`Count: ${count}, Combine:\n${combine}`);
      count = Math.floor(combine.length / limit);
      combine += '\n';
    }
  }
  return combine;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getgod') // can only have command as lowercase letters
    .setDescription('Replies with relevant god information.')
    .addStringOption((option) =>
      option
        .setName('godname')
        .setDescription('God name to search for')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const godname = interaction.options.get('godname').value;

    const godlist = await makeRequest('getgods', ['1']);
    const godInfo = godlist.find(
      (element) => element.Name.toLowerCase() === godname.toLowerCase()
    );
    console.log(godInfo);
    let content = '';
    if (godInfo === undefined) {
      content = 'God not found.';
      interaction.editReply({
        content: content,
      });
      return;
    } else {
      content = `God: ${godInfo.Name} (${godInfo.Pantheon})\n`;
      content += `Role: ${godInfo.Roles} - ${godInfo.Type}`;
    }
    const width = 1500;
    const height = 1000;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    const godImg = await loadImage(godInfo.godCard_URL);
    context.drawImage(godImg, 0, 0, 150, 250);
    context.font = '25px sans-serif';
    context.fillStyle = '#ffffff';
    for (let i = 1; i <= 4; i++) {
      const abilityData = godInfo[`Ability_${i}`];
      //console.log(abilityData);
      const abilityImg = await loadImage(abilityData.URL);
      const description = splitString(
        abilityData.Description.itemDescription.description,
        100
      )
        .split('\n')
        .filter((element) => element.length > 0)
        .join('\n');
      context.drawImage(
        abilityImg,
        0,
        ((i - 1) * (height - 250)) / 4 + 250,
        100,
        100
      );
      context.fillText(
        '\n' + splitString(abilityData.Summary),
        0,
        ((i - 1) * (height - 250)) / 4 + 350
      );
      context.fillText(description, 250, ((i - 1) * (height - 250)) / 4 + 275);
    }
    const abilityData = godInfo[`Ability_${5}`];
    const description = splitString(
      'Passive: ' + abilityData.Description.itemDescription.description,
      100
    )
      .split('\n')
      .filter((element) => element.length > 0)
      .join('\n');
    context.fillText(description, 250, 75);
    const attachment = new MessageAttachment(canvas.toBuffer(), 'god-image.png');

    //edit reply here
    interaction.editReply({
      content: content,
      ephemeral: false,
      files: [attachment],
    });
  },
};
