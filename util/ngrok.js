// From: https://github.com/valgaze/df-starter-kit/blob/master/util/ngrok.ts
const blessed = require("blessed");
const contrib = require("blessed-contrib");
const ngrok = require("ngrok");

// Setup
const config = require("./../config.json")
const port = config.port
const ngrokOverrides = config.ngrok ? config.ngrok : {}
let webhook = config.webhookRoute;

if (webhook.charAt(0) !== "/") {
  webhook = `/${webhook}`
}

main(port, webhook, ngrokOverrides)

/**
 * Helpers
 * 
 */

const ngrokMsg = ({ url, webhook }) => `
>>  ${url}${webhook}
 
Inspect/replay traffic requests on http://localhost:4040

1. Add the address above to "webhookUrl" in config.json
2. In another terminal, start the server with $ npm run server
2a. Use $ npm run dev for live code-reload`;

const buildHero = (content = "", opts) => {
  const screen = blessed.screen();
  const grid = new contrib.grid({
    rows: 12,
    cols: 12,
    screen: screen,
  });
  
  grid.set(0, 0, 12, 12, contrib.log, {
    fg: "red",
    selectedFg: "green",
    // label: heroTitle,
    ...opts,
    content,
  });

  screen.render();
}

async function main (port, webhook, ngrokOverrides) {
  let url = await nGrokConnect(port, ngrokOverrides).catch(e => console.log(e));
  const msg = ngrokMsg({ url, webhook })
  buildHero(msg, { label: `${url}${webhook}`,});
}

async function nGrokConnect(port, ngrokOverrides={}) {
  if (!port) {
    throw new Error("No Port specified");
  }

  const nGrokConfig = {
    proto: "http", // http|tcp|tls, defaults to http
    addr: port, // port or network address, defaults to 80
    onStatusChange(status) {},
    onLogEvent(data) {},
    ...ngrokOverrides
  };

  const url = await ngrok
    .connect(nGrokConfig)
    .catch((e) => console.log("<nGrok> Catastrophic error", e));
  return url;

}

module.exports = {
  nGrokConnect
}