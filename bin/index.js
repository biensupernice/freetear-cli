#!/usr/bin/env node

const program = require('commander');
const boxen = require('boxen');
const chalk = require('chalk');

const description = `A free tiered platform empowering you to freely tear up your bills, while enablling tear-free delivery.
Because Fuck DEBT!`;

program.version('0.1.0')
  .description(chalk(boxen(description, {padding: 1, borderStyle: 'round'})))
  .command('init', 'Initialize a boilerplate service to deploy.')
  .command('login', 'Log in to FreeTear with Github.') //send to freetear oauth page
  .command('deploy', 'Perform zero config zeploy of your service.').alias('d')
  .command('resources <resource>', 'List all resources.').alias('r')
  .command('services', 'List all deployed services.').alias('s')
  .command('logs', 'Render service logs.').alias('l');

program.parse(process.argv);