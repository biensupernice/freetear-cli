const program = require('commander');
const { list } = require('./modules/zeit');

program
  .parse(process.argv);

list();