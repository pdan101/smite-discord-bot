const fs = require('fs')
const { Client, Intents } = require('discord.js')
const { token } = require('./config.json')

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

// Login to Discord with your client's token.
client.login(token)
