const program = require('commander');
const keys = require('./modules/secrets');

program
  // .command('upload', 'Upload secrets to secrets store')
  .parse(process.argv);

//upload secrets to now

//generate

keys();