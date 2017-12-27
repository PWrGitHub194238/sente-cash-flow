'use strict';

import * as express from 'express'


class App {
  public express;
  public static resPath = __dirname + "/client/";

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router()

    this.express.use('/', express.static(App.resPath + '/'));
    router.get('/', (req, res) => {
      res.sendFile(App.resPath + "index.html");
    });

    this.express.use('/createorder/', express.static(App.resPath + '/createorder/'));
    router.get('/createorder', (req, res) => {
      res.sendFile(App.resPath + "/createorder/index.html");
    });

    this.express.use('/', router);
  }
}

export default new App().express;