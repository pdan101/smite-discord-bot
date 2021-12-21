const { Collection } = require('discord.js')
const fs = require('fs')
const commands = new Collection()
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`../commands/${file}`)
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  commands.set(command.data.name, command)
}

module.exports = {
  name: 'interactionCreate',
  execute: async (interaction) => {
    console.log(
      `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`
    )
    if (!interaction.isCommand()) return

    const command = commands.get(interaction.commandName)

    if (!command) return

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      return interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  },
}
