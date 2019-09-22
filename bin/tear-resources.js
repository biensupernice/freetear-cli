const program = require('commander');
const auth = require('./modules/auth');

program
  .parse(process.argv);

auth();