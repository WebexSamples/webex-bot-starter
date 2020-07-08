// From: https://github.com/valgaze/df-starter-kit/blob/master/util/ngrok.ts
const blessed = require("blessed");
const contrib = require("blessed-contrib");
const ngrok = require("ngrok");

// Setup
const config = require("./../config.json")
const port = config.port
const ngrokOverrides = config.ngrok ? config.ngrok : {}
let webhook = config.webhookRoute;
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

if (webhook.charAt(0) !== "/") {
  webhook = `/${webhook}`;
}

main(port, webhook, ngrokOverrides);
/**
 * Helpers
 * 
 */

const ngrokMsg = ({
  url,
  webhook
}) => `
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
    screen: screen
  });
  grid.set(0, 0, 12, 12, contrib.log, _objectSpread(_objectSpread({
    fg: "red",
    selectedFg: "green"
  }, opts), {}, {
    content
  }));
  screen.render();
};

function main(_x, _x2, _x3) {
  return _main.apply(this, arguments);
}

function _main() {
  _main = _asyncToGenerator(function* (port, webhook, ngrokOverrides) {
    let url = yield nGrokConnect(port, ngrokOverrides).catch(e => console.log(e));
    const msg = ngrokMsg({
      url,
      webhook
    });
    buildHero(msg, {
      label: `${url}${webhook}`
    });
  });
  return _main.apply(this, arguments);
}

function nGrokConnect(_x4) {
  return _nGrokConnect.apply(this, arguments);
}

function _nGrokConnect() {
  _nGrokConnect = _asyncToGenerator(function* (port, ngrokOverrides = {}) {
    if (!port) {
      throw new Error("No Port specified");
    }

    const nGrokConfig = _objectSpread({
      proto: "http",
      // http|tcp|tls, defaults to http
      addr: port,

      // port or network address, defaults to 80
      onStatusChange(status) {},

      onLogEvent(data) {}

    }, ngrokOverrides);

    const url = yield ngrok.connect(nGrokConfig).catch(e => console.log("<nGrok> Catastrophic error", e));
    return url;
  });
  return _nGrokConnect.apply(this, arguments);
}

module.exports = {
  nGrokConnect
}