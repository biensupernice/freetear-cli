#! /usr/bin/env node

const ora = require('ora');
const boxen = require('boxen');
const shell = require("shelljs");
const { prompt } = require('inquirer');

exports.deploy = (name="''") => 
  shell.exec(`now -n ${name}`);

exports.list = () => {
  const spinner = ora('Loading services').start();
  shell.exec(`now ls`, {silent: true}, (code, out, err) => {
    const services = out.split('\n')
      .map(line => line.split(/\s+/g)
        .splice(0, 3).filter(x => x))
      .filter(row => row.length)
      .map((r,i) => `${i+1}) ${r[0]}`).join('\n');
    console.log(boxen(services, { padding: 1}));
  });
  spinner.stop();
}

exports.secrets = (slug, value) =>
  shell.exec(`now secrets add ${slug} "${value}"`);


exports.logs = () => {
  //capture service
  shell.exec(`now ls`, {silent: true}, async (code, out, err) => {
    const services = out.split('\n')
      .map(line => line.split(/\s+/g)
        .splice(0, 3).filter(x => x))
      .filter(row => row.length);

    const service = await prompt([{
      type: 'list',
      name: 'service',
      message: 'Which service would you like to inspect?',
      choices: services.map(r =>r[0])
    }])

    const [slug, id] = services.filter(s => service.service == s[0])[0];
    console.log('checking', id, service);
    shell.exec(`now logs ${id}`, {silent: true}, (code, logs, err) => {
      console.log(logs);
    });
  });
  //propmts which service 
}
