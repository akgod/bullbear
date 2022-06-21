require("./sdk/global");
const config = require("config");
const _ = require("lodash");
const moment = require("moment");
const binance = require('./binance');

class Runner {
  constructor() {
    this.count = 0;
  }
  async run() {
    await binance.uFuture();
  }

  async start() {
    while (true) {
      this.count++;
      try {
        await this.run();
      } catch (e) {
        console.error(e);
      }
      await sleep(config.app.mainsleep);
    }
  }
}
new Runner().start();
