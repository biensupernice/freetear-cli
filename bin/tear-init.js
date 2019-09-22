const program = require('commander');
const init = require('./modules/init');

program
  .parse(process.argv);

init();