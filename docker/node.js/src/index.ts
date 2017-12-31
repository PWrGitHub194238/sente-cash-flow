'use strict';

import app from './App'

const PORT = process.env.PORT || 8081
const HOST = '0.0.0.0';

app.listen(PORT, HOST, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`Running on http://${HOST}:${PORT}`);
})