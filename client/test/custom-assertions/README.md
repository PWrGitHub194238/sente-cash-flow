Custom assertions are not recognize by TypeScript compiler by the time it compiles *.ts to *.js so instead of using e.g.
  browser.assert.elementCount("#orders-container", 2);
we will be using:
  browser.assert['elementCount']("#orders-container", 2).
This array-style function calling prevents tsc from throwing error because it assumes that browser.assert may contains a elementCount element  which might be a function, we want to call.
