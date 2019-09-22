const program = require('commander');
const { deploy } = require('./modules/zeit');

program
  .option('-n, --name', 'Name of deployment service')
  .parse(process.argv);

const { args } = program;

deploy(args[0]);