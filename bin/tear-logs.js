const program = require('commander');
const {logs} = require('./modules/zeit');

program
  .parse(process.argv);

logs();