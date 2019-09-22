#!/usr/bin/env node

const program = require('commander');

const description = `A free tiered platform empowering you to freely tear up your bills, while enablling tear-free delivery.
Because Fuck DEBT!`;

program.version('0.1.0')
  .description(description)
  .command('',)
  .command('auth', 'Log in to FreeTear with Github')
  .command('deploy', 'Perform zero config zeploy of your service')
  .command('resources <resource>', 'List all resources').alias('r')
  .command('services', 'List all deployed services')
  .command('logs', 'Render service logs').alias('l');

program.parse(process.argv);