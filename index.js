/*
Heavily based off Nick Marus' node-flint framework helloworld example: https://github.com/nmarus/flint
*/

var Flint = require('node-flint');
var webhook = require('node-flint/webhook');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
const config = require("./config.json");

// init flint
var flint = new Flint(config);
flint.start();
console.log("Starting flint, please wait...");

flint.on("initialized", function() {
  console.log("Flint initialized successfully! [Press CTRL-C to quit]");
});

/****
## Process incoming messages
****/


/* On mention with command
ex User enters @botname /hello, the bot will write back
*/
flint.hears('/hello', function(bot, trigger) {
  console.log("/hello fired");
  bot.say('%s, you said hello to me!', trigger.personDisplayName);
});


/* On mention with command, using other trigger data, can use lite markdown formatting
ex "@botname /whoami"
*/
flint.hears('/whoami', function(bot, trigger) {
  console.log("/whoami fired");
  //the "trigger" parameter gives you access to data about the user who entered the command
  let roomId = "*" + trigger.roomId + "*";
  let roomTitle = "**" + trigger.roomTitle + "**";
  let personEmail = trigger.personEmail;
  let personDisplayName = trigger.personDisplayName;
  let outputString = `${personDisplayName} here is some of your information: \n\n\n **Room:** you are in "${roomTitle}" \n\n\n **Room id:** ${roomId} \n\n\n **Email:** your email on file is *${personEmail}*`;
  bot.say("markdown", outputString);
});

/* On mention with command arguments
ex User enters @botname /echo phrase, the bot will take the arguments and echo them back
*/
flint.hears('/echo', function(bot, trigger) {
  console.log("/echo fired");
  let phrase = trigger.args.slice(1).join(" ");
  let outputString = `Ok, I'll say it: "${phrase}"`;
  bot.say(outputString);
});

/****
## Server config & housekeeping
****/

app.post('/', webhook(flint));

var server = app.listen(config.port, function () {
  flint.debug('Flint listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function() {
  flint.debug('stoppping...');
  server.close();
  flint.stop().then(function() {
    process.exit();
  });
});
