#! /usr/bin/env node

const ora = require('ora');
const boxen = require('boxen');
const shell = require("shelljs");

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


exports.logs = svc => {
  //capture service
  shell.exec(`now logs ${svc}`, {silent: true}, () => {

  });
  //propmts which service 
}
