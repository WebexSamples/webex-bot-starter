//Webex Bot Starter - featuring the webex-node-bot-framework - https://www.npmjs.com/package/webex-node-bot-framework

var framework = require('webex-node-bot-framework');
var webhook = require('webex-node-bot-framework/webhook');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(express.static('images'));
const config = require("./config.json");

// init framework
var framework = new framework(config);
framework.start();
console.log("Starting framework, please wait...");

framework.on("initialized", function () {
  console.log("framework is all fired up! [Press CTRL-C to quit]");
});

// A spawn event is generated when the framework finds a space with your bot in it
// If actorId is set, it means that user has just added your bot to a new space
// If not, the framework has discovered your bot in an existing space
framework.on('spawn', (bot, id, actorId) => {
  if (!actorId) {
    // don't say anything here or your bot's spaces will get
    // spammed every time your server is restarted
    console.log(`While starting up, the framework found our bot in a space called: ${bot.room.title}`);
  } else {
    // When actorId is present it means someone added your bot got added to a new space
    // Lets find out more about them..
    var msg = 'You can say `help` to get the list of words I am able to respond to.';
    bot.webex.people.get(actorId).then((user) => {
      msg = `Hello there ${user.displayName}. ${msg}`; 
    }).catch((e) => {
      console.error(`Failed to lookup user details in framwork.on("spawn"): ${e.message}`);
      msg = `Hello there. ${msg}`;  
    }).finally(() => {
      // Say hello, and tell users what you do!
      if (bot.isDirect) {
        bot.say('markdown', msg);
      } else {
        let botName = bot.person.displayName;
        msg += `\n\nDon't forget, in order for me to see your messages in this group space, be sure to *@mention* ${botName}.`;
        bot.say('markdown', msg);
      }
    });
  }
});


//Process incoming messages

let responded = false;
/* On mention with command
ex User enters @botname help, the bot will write back in markdown
*/
framework.hears(/help|what can i (do|say)|what (can|do) you do/i, function (bot, trigger) {
  console.log(`someone needs help! They asked ${trigger.text}`);
  responded = true;
  bot.say(`Hello ${trigger.person.displayName}.`)
    .then(() => sendHelp(bot))
    .catch((e) => console.error(`Problem in help hander: ${e.message}`));
});

/* On mention with command
ex User enters @botname framework, the bot will write back in markdown
*/
framework.hears('framework', function (bot) {
  console.log("framework command received");
  responded = true;
  bot.say("markdown", "The primary purpose for the [webex-node-bot-framework](https://github.com/jpjpjp/webex-node-bot-framework) was to create a framework based on the [webex-jssdk](https://webex.github.io/webex-js-sdk) which continues to be supported as new features and functionality are added to Webex. This version of the proejct was designed with two themes in mind: \n\n\n * Mimimize Webex API Calls. The original flint could be quite slow as it attempted to provide bot developers rich details about the space, membership, message and message author. This version eliminates some of that data in the interests of efficiency, (but provides convenience methods to enable bot developers to get this information if it is required)\n * Leverage native Webex data types. The original flint would copy details from the webex objects such as message and person into various flint objects. This version simply attaches the native Webex objects. This increases the framework's efficiency and makes it future proof as new attributes are added to the various webex DTOs ");
});

/* On mention with command, using other trigger data, can use lite markdown formatting
ex User enters @botname 'info' phrase, the bot will provide personal details
*/
framework.hears('info', function (bot, trigger) {
  console.log("info command received");
  responded = true;
  //the "trigger" parameter gives you access to data about the user who entered the command
  let personAvatar = trigger.person.avatar;
  let personEmail = trigger.person.emails[0];
  let personDisplayName = trigger.person.displayName;
  let outputString = `Here is your personal information: \n\n\n **Name:** ${personDisplayName}  \n\n\n **Email:** ${personEmail} \n\n\n **Avatar URL:** ${personAvatar}`;
  bot.say("markdown", outputString);
});

/* On mention with bot data 
ex User enters @botname 'space' phrase, the bot will provide details about that particular space
*/
framework.hears('space', function (bot) {
  console.log("space. the final frontier");
  responded = true;
  let roomTitle = bot.room.title;
  let spaceID = bot.room.id;
  let roomType = bot.room.type;

  let outputString = `The title of this space: ${roomTitle} \n\n The roomID of this space: ${spaceID} \n\n The type of this space: ${roomType}`;

  console.log(outputString);
  bot.say("markdown", outputString)
    .catch((e) => console.error(`bot.say failed: ${e.message}`));

});

/* 
   Say hi to every member in the space
   This demonstrates how developers can access the webex
   sdk to call any Webex API.  API Doc: https://webex.github.io/webex-js-sdk/api/
*/
framework.hears("say hi to everyone", function (bot) {
  console.log("say hi to everyone.  Its a party");
  responded = true;
  // Use the webex SDK to get the list of users in this space
  bot.webex.memberships.list({roomId: bot.room.id})
    .then((memberships) => {
      for (const member of memberships.items) {
        if (member.personId === bot.person.id) {
          // Skip myself!
          continue;
        }
        let displayName = (member.personDisplayName) ? member.personDisplayName : member.personEmail;
        bot.say(`Hello ${displayName}`);
      }
    })
    .catch((e) => {
      console.error(`Call to sdk.memberships.get() failed: ${e.messages}`);
      bot.say('Hello everybody!');
    });
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
              horizontalAlignment: "Center",
              style: 'person'
            },
            {
              type: 'TextBlock',
              text: 'Your name will be here!',
              size: 'medium',
              horizontalAlignment: "Center",
              weight: 'Bolder'
            },
            {
              type: 'TextBlock',
              text: 'And your email goes here!',
              size: 'small',
              horizontalAlignment: "Center",
              isSubtle: true,
              wrap: false
            }]
        }]
    }]
};

let rpsJSON =
{
  $schema : "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.0",
  type : "AdaptiveCard",
  body: [
      {
          type: "ColumnSet",
          columns: [
              {
                  type: "Column",
                  items: [
                      {
                          type: "Image",
                          style: "Person",
                          url: "https://developer.webex.com/images/webex-teams-logo.png",
                          size: "Medium",
                          height: "50px"
                      }
                  ],
                  width: "auto"
              },
              {
                  type: "Column",
                  items: [
                      {
                          type: "TextBlock",
                          text: "UW Game Bot",
                          weight: "Lighter",
                          color: "Accent"
                      },
                      {
                          type: "TextBlock",
                          weight: "Bolder",
                          text: "Rock Paper Scissors",
                          wrap: true,
                          color: "Light",
                          size: "Large",
                          spacing: "Small"
                      }
                  ],
                  width: "stretch"
              }
          ]
      },
      {
          type: "TextBlock",
          text: "Make your choice!",
          wrap: true,
          horizontalAlignment: "Center"
      },
      {
          type: "ActionSet",
          actions: [
              {
                  type: "Action.Submit",
                  title: "Jan",
                  data: {
                      "rock": true
                  },
                  style: "destructive"
              },
              {
                  type: "Action.Submit",
                  title: "Ken",
                  data: {
                      "paper": true
                  }
              },
              {
                  type: "Action.Submit",
                  title: "Pon",
                  data: {
                      "scissors": true
                  },
                  style: "positive"
              }
          ],
          spacing: "None",
          horizontalAlignment: "Center"
      }
  ],
};

/* On mention with card example
ex User enters @botname 'card me' phrase, the bot will produce a personalized card - https://developer.webex.com/docs/api/guides/cards
*/
framework.hears('card me', function (bot, trigger) {
  console.log("someone asked for a card");
  responded = true;
  let avatar = trigger.person.avatar;

  cardJSON.body[0].columns[0].items[0].url = (avatar) ? avatar : `${config.webhookUrl}/missing-avatar.jpg`;
  cardJSON.body[0].columns[0].items[1].text = trigger.person.displayName;
  cardJSON.body[0].columns[0].items[2].text = trigger.person.emails[0];
  bot.sendCard(cardJSON, 'This is customizable fallback text for clients that do not support buttons & cards');
});

/*
Rock Paper Scissors code
code to dm specific people:
bot.dmCard(email,rpsJSON, 'this is the RPS card').then((value)=>{
     console.log(value);
 });
*/
let user1_id = null;
let user2_id = null;
let username1 = null;
let username2 = null;
let user1_choice = null;
let user2_choice = null;

let webex = framework.getWebexSDK();

framework.hears('RPS', function( bot, trigger){
  console.log("Rock Paper Scissors was called");
  bot.say("Rock Paper Scissors was called");
  // bot.say(`message= ${JSON.stringify(trigger.message, null, 2)}`);
  responded = true;

  let email = framework.getPersonEmail(trigger.person);
  user1_id = trigger.message.personId;
  user2_id = trigger.message.mentionedPeople[1];
  console.log(typeof webex);
  webex.people.get(user1_id).then(person =>{
    username1 = person.displayName;
  })
  webex.people.get(user2_id).then(person =>{
    username2 = person.displayName;
  })

  
  
  bot.sendCard(rpsJSON, 'this is the RPS card');
});

function process_choice(choice){
  if('rock' in choice){
    return 'r';
  }
  else if('paper' in choice){
    return 'p';
  }
  else if('scissors' in choice){
    return 's';
  }
}

function process_win(bot){
  if(user1_choice == user2_choice){
    bot.say('The match ended in a draw!');
  }
  else if((user1_choice == 'r' && user2_choice == 's') ||
          (user1_choice == 'p' && user2_choice == 'r') ||
          (user1_choice == 's' && user2_choice == 'p')){
    bot.say(`${username1} Wins!`)
  }
  else{
    bot.say(`${username2} Wins!`)
  }
}

function reset_rps(){
  user1_choice = null;
  user2_choice = null;
  user1_id = null;
  user2_id = null;
  username1 = null;
  username2 = null;
}

// Process a submitted card
framework.on('attachmentAction', function (bot, trigger) {
  // bot.say(`Got an attachmentAction:\n${JSON.stringify(trigger.attachmentAction, null, 2)}`);
  let json = trigger.attachmentAction;
  if(json.personId == user1_id ){
    user1_choice = process_choice(json.inputs);
    // bot.say(`User 1 chose ${user1_choice}`)
  }
  else if(json.personId == user2_id ){
    user2_choice = process_choice(json.inputs);
  }

  if(user1_choice != null && user2_choice != null){
    //compute who won
    process_win(bot);
    reset_rps();
  }
});

/* On mention reply example
ex User enters @botname 'reply' phrase, the bot will post a threaded reply
*/
framework.hears('reply', function (bot, trigger) {
  console.log("someone asked for a reply.  We will give them two.");
  responded = true;
  bot.reply(trigger.message, 
    'This is threaded reply sent using the `bot.reply()` method.',
    'markdown');
  var msg_attach = {
    text: "hmpf",
    file: 'https://media.giphy.com/media/IcpapB2BMfiihmKBQM/giphy.gif'
  };
  bot.reply(trigger.message, msg_attach);
});

/* On mention with unexpected bot command
   Its a good practice is to gracefully handle unexpected input
*/
framework.hears(/.*/, function (bot, trigger) {
  // This will fire for any input so only respond if we haven't already
  if (!responded) {
    console.log(`catch-all handler fired for user input: ${trigger.text}`);
    bot.say(`Sorry, I don't know how to respond to "${trigger.text}"`)
      .then(() => sendHelp(bot))
      .catch((e) => console.error(`Problem in the unexepected command hander: ${e.message}`));
  }
  responded = false;
});

function sendHelp(bot) {
  bot.say("markdown", 'These are the commands I can respond to:', '\n\n ' +
    '1. **framework**   (learn more about the Webex Bot Framework) \n' +
    '2. **info**  (get your personal details) \n' +
    '3. **space**  (get details about this space) \n' +
    '4. **card me** (a cool card!) \n' +
    '5. **say hi to everyone** (everyone gets a greeting using a call to the Webex SDK) \n' +
    '6. **reply** (have bot reply to your message) \n' +
    '7. **help** (what you are reading now)');
}


//Server config & housekeeping
// Health Check
app.get('/', function (req, res) {
  res.send(`I'm alive.`);
});

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
