const tmi = require('tmi.js');
const fs = require('fs')

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ],
  fail_cooldown: 30000 //Seconds
};

// Create a client with our options
const client = new tmi.client(opts);

let lastFailTime = Date.now() - opts.fail_cooldown

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!fail') {
    currentTime = Date.now()
    if(currentTime - lastFailTime > opts.fail_cooldown) {
      readFails(target)
      console.log(`* Executed ${commandName} command`);
      lastFailTime = currentTime
    } else {
      console.log("Could not execute fail command because it's on cooldown")
    }
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

function readFails(target) {
    fs.readFile('./failquotes.txt', 'utf8', (err,data)=>{
      if(err) {
        console.log(err)
        return
      }
      var lines = data.split('\n');
    
      // choose one of the quotes...
      var fail = lines[Math.floor(Math.random()*lines.length)]
      sendFail(target, fail)
    })
  
}

function sendFail(target, fail) {
  client.say(target, `${fail}`);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}