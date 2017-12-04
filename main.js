const Discord = require('discord.js')
const snoowrap = require('snoowrap')
const secret = require('./secret.json')
const config = require('./config.json')


let reposts = []

// REDDIT
const r = new snoowrap({
  userAgent: secret.userAgent,
  clientId: secret.clientId,
  clientSecret: secret.clientSecret,
  username: secret.username,
  password: secret.password
})

// Create an instance of a Discord client
const client = new Discord.Client()

client.on('ready', () => {
  console.log('bot_irl is now ready')
  client.user.setGame(config.game)
})

client.on('message', message => {
  if (message.content === '!meme') {
    message.channel.startTyping()
    r.getSubreddit('me_irl').getTop({ time: 'hour' })
      .then(data => {
        // Make sure this isn't a recent repost
        let post = data[0]
        for (var i = 1; i < (data.length - 1); i++) {
          if (reposts.indexOf(post.id) > -1) {
            post = data[i]
          } else break
        }
        reposts.push(post.id)
        // Use a random response
        let text = config.replies[Math.floor(Math.random() * config.replies.length)]
        // Send
        message.channel.send(text + post.url)
        message.channel.stopTyping()
      })
  }
})

// Log our bots in
client.login(secret.token)
