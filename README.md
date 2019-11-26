# webexbotstarter
Starter kit template for a simple Webex Teams bot

(For a more detailed explanation, see the companion blog post here: https://example.com/@pbellant/from-zero-to-webex-teams-bot-nodejs.com)


![What we're making](https://cdn-images-1.example.com/640/screenshot.gif)


## Checklist (bare minimum to get this simple bot working)

Prerequisites:

- [ ] node.js (minimum supported v8.0.0 & npm 2.14.12 and up)

- [ ] Sign up for Webex Teams (logged in with your web browser)

----

- [ ] Create a Webex Teams Bot (save the API key): https://developer.webex.com/my-apps/new/bot

- [ ] Sign up for nGrok (save API key) and start it on your machine (save the port number and public web address): https://ngrok.com/download

- [ ] Join a space in Webex Teams

- [ ] Add the bot to the space in Webex Teams

- [ ] Obtain the roomId from an authenticated GET using the Webex Teams API: https://developer.webex.com/docs/api/v1/rooms/list-rooms

- [ ] Create a webhook with the roomId and using your nGrok address, roomId, by POSTing to Webex Teams API: https://developer.webex.com/docs/api/v1/webhooks/create-a-webhook

- [ ] Add the port/nGrok address and API bot key to your bot server config-template.json

- [ ] Re-name the config-template.json file as config.json

- [ ] Turn on your bot server with ```npm start```
