/*
Webex Bot Starter - featuring the webex-node-bot-framework - https://www.npmjs.com/package/webex-node-bot-framework
*/

var framework = require('webex-node-bot-framework');
var webhook = require('webex-node-bot-framework/webhook');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
const config = require("./config.json");

// init framework
var framework = new framework(config);
framework.start();
console.log("Striking framework, please wait...");

framework.on("initialized", function () {
  console.log("framework is all fired up! [Press CTRL-C to quit]");
});

// A spawn event is generated when the framework finds a space with your bot in it
framework.on('spawn', function (bot) {
  if (!framework.initialized) {
    // don't say anything here or your bot's spaces will get 
    // spammed every time your server is restarted
    console.log (`While starting up framework found our bot in a space called: ${bot.room.title}`);
  } else {
    // After initialization, a spawn event means your bot got added to 
    // a new space.   Say hello, and tell users what you do!
    let botName = bot.person.displayName;
    bot.say("markdown", 'Hello there. You can say `help` to get the list of words I am able to respond to. \n\n\n Don\'t forget, in order for me to see your messages in a groups space, be sure to *@mention* `',botName,'`.');
  }
});

/****
## Process incoming messages
****/


/* On mention with command
ex User enters @botname help, the bot will write back in markdown
*/
framework.hears('help', function (bot, trigger) {
  console.log("someone needs help!");
  bot.say("markdown", 'Hello, ', trigger.person.displayName, '- these are the commands I can respond to:', '\n\n 1. **framework**   (learn more about the Webex Bot Framework) \n 2. **info**  (get your personal details) \n 3. **space**  (get details about this space) \n 4. **card me** (a cool card!) \n 5. **help** (what you are reading now)');
});

/* On mention with command
ex User enters @botname framework, the bot will write back in markdown
*/
framework.hears('framework', function (bot) {
  console.log("framework command received");
  bot.say("markdown", "The primary purpose for the [webex-node-bot-framework](https://github.com/jpjpjp/webex-node-bot-framework) was to create a framework based on the [webex-jssdk](https://webex.github.io/webex-js-sdk) which continues to be supported as new features and functionality are added to Webex. This version of the proejct was designed with two themes in mind: \n\n\n * Mimimize Webex API Calls. The original flint could be quite slow as it attempted to provide bot developers rich details about the space, membership, message and message author. This version eliminates some of that data in the interests of efficiency, (but provides convenience methods to enable bot developers to get this information if it is required)\n * Leverage native Webex data types. The original flint would copy details from the webex objects such as message and person into various flint objects. This version simply attaches the native Webex objects. This increases the framework's efficiency and makes it future proof as new attributes are added to the various webex DTOs " );
});

/* On mention with command, using other trigger data, can use lite markdown formatting
ex "@botname info"
*/
framework.hears('info', function (bot, trigger) {
  console.log("info command received");
  //the "trigger" parameter gives you access to data about the user who entered the command
  let personAvatar = trigger.person.avatar;
  let personEmail = trigger.person.emails[0];
  let personDisplayName = trigger.person.displayName;
  let outputString = `Here is your personal information: \n\n\n **Name:** ${personDisplayName}  \n\n\n **Email:** ${personEmail} \n\n\n **Avatar URL:** ${personAvatar}`;
  bot.say("markdown", outputString);
});

/* On mention with bot data 
ex User enters @botname space phrase, the bot will provide details about that particular space
*/
framework.hears('space', function (bot, trigger) {
  console.log("space. the final frontier");
  let roomTitle =  bot.room.title;
  let spaceID = bot.room.id;
  let roomType = bot.room.type;

  let outputString = `The title of this space: ${roomTitle} \n\n The roomID of this space: ${spaceID} \n\n The type of this space: ${roomType}`;
  
  console.log(outputString);
  bot.say("markdown", outputString)
  .catch((e) => console.error(`bot.say failed: ${e.message}`));

});

// Buttons & Cards data
let cardJSON = 
{
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  type: 'AdaptiveCard',
  version: '1.0',
  body:
    [{
      type: 'ColumnSet',
      columns:
        [{
          type: 'Column',
          width: '5',
          items:
            [{
              type: 'Image',
              url: 'Your avatar appears here!',
              size: 'large',
              horizontalAlignment : "Center",
              style: 'person'
            },
            {
              type: 'TextBlock',
              text: 'Your name will be here!',
              size: 'medium',
              horizontalAlignment : "Center",
              weight: 'Bolder'
            },
            {
              type: 'TextBlock',
              text: 'And your email goes here!',
              size: 'small',
              horizontalAlignment : "Center",
              isSubtle: true,
              wrap: false
            }]
        }
        ]
    }
    ]
}

/* On mention with card example
ex User enters @botname card me phrase, the bot will produce a personalized card - https://developer.webex.com/docs/api/guides/cards
*/
framework.hears('card me', function (bot, trigger) {
  
  console.log("someone found the easter egg");
    console.log(trigger.person.avatar);
    let avatar = trigger.person.avatar;

      cardJSON.body[0].columns[0].items[0].url = avatar;
      cardJSON.body[0].columns[0].items[1].text = trigger.person.displayName;
      cardJSON.body[0].columns[0].items[2].text = trigger.person.emails[0];
  bot.sendCard(cardJSON, 'This is customizable fallback text for clients that do not support buttons & cards');

});

/****
## Server config & housekeeping
****/

app.post('/', webhook(framework));

var server = app.listen(config.port, function () {
  framework.debug('framework listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function () {
  framework.debug('stoppping...');
  server.close();
  framework.stop().then(function () {
    process.exit();
  });
});
