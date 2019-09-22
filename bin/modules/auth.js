#! /usr/bin/env node
var puppeteer = require('puppeteer');
var inquirer = require('inquirer');
var dockerNames = require('docker-names');
const editJsonFile = require("edit-json-file");

let file = editJsonFile(`${__dirname}/credientials.json`);

dockerNames.surnames = Array('tear', 'tears')

module.exports = (() => async () => {
  console.log('logging in')
  let getCurrentTime = () => {
    let toDigit = (number) => {
        return number.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    }
  
    var today = new Date();
    return toDigit(today.getHours()) + ":" + toDigit(today.getMinutes()) + ":" + toDigit(today.getSeconds());
  }

  const username = await inquirer.prompt([{
      type: 'input',
      message: 'Enter your github username',
      name: 'username'
  }])

  const password = await inquirer.prompt([{
      type: 'password',
      message: 'Enter your github password',
      name: 'password'
  }])


  const browser = await puppeteer.launch({
      headless: false,
      args: ["--incognito"]
  });

  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  await page.goto('https://customer.cloudamqp.com/signup');
  await page.click('[class="social"]');
  
  const username_selector = '#login_field';
  const password_selector = '#password';
  const mfa = '#otp';
  
  await page.waitForSelector(username_selector);

  await page.type(username_selector, username.username);
  await page.type(password_selector, password.password);
  await page.click('[name="commit"]');

  //check for 2FA prompt
  if (await page.$(mfa) !== null) {
    const otp = await inquirer.prompt([{
      type: 'input',
      message: 'Enter your Two Factor Authentication Code',
      name: 'otp'
    }]);

    await page.type(mfa, otp.otp);
    await page.click('[type=submit]');
  }
  
  await page.waitFor(500);
  try {
    const isError = await page.$('.flash-error');
    if (isError) {
      console.error(`[X] ${getCurrentTime()} Failed to login`);
      process.exit();
    }
  } catch(e) {
    console.log(`[X] ${getCurrentTime()} Successfully logged in`)
  }
  // two things could happen here.
  // A: The user already has an account on cloudAMPQ
  // B: The user has not set-up cloudAMPQ
  // We will assume option A and try to catch a promise exception, in which case we assume B has occured

  const instances_name_selector = '#instance-name';
  const instance_creation_selector = '[href="https://customer.cloudamqp.com/instance/create"]';

  try {
      await page.waitFor(500);
      if (await page.$(instance_creation_selector) !== null) {
          console.error(`[X] ${getCurrentTime()} User already has account`);
      }
      console.log(`[X] ${getCurrentTime()} Creating new queue instance`);
      await page.goto("https://customer.cloudamqp.com/instance/create"); // instance name timed out, make a new instance
  } catch (e) {
      console.log(`[X] ${getCurrentTime()} Creating queue instance`);
  }
  
  const page_confirmation_selector = '#wizardNext';
  const application_deployment_name = 'tear-' + dockerNames.getRandomName();

  await page.waitForSelector(instances_name_selector)
  await page.type(instances_name_selector, application_deployment_name)

  await page.click(page_confirmation_selector)

  const host = await inquirer.prompt([
      {
        type: 'list',
        name: 'host',
        message: 'Which cloud provider would you like to use for AMPQ services?',
        choices: [
          'Amazon Web Services',
          'Google Compute Engine',
          'Azure',
        ]
      }])
  
  const region_selector = `#region > [label="${host.host}"] > option:enabled`;

  async function getValue(selector) {
      let value = await page.evaluate((sel) => {
        let selectionList = [];
        Array.from(document.querySelectorAll(sel)).forEach((ele) => selectionList.push(ele.innerText));
        return selectionList
      }, selector)
      return value
  }
  async function setValue(selector, host, region) {
      let value = await page.evaluate((sel) => {
          return document.querySelector(sel[0]).value = `${sel[1].host.toLocaleLowerCase().split(' ').join('-')}::${sel[2].region.split(' ')[0].toLowerCase()}`
      }, [selector, host, region]);
      return value;
  }

  await page.waitFor(500);
  
  let selections = await getValue(region_selector);
  
  const region = await inquirer.prompt([
      {
        type: 'list',
        name: 'region',
        message: `Which region would you like to select for ${host.host}`,
        choices: selections
      }])

  if (host.host === 'Azure'){
      host.host = 'Azure Arm'
      region.region = region.region.replace(' ', '')
  }
  
  const selection = await setValue('select', host, region);
  
  if (typeof selection === 'undefined') {
      console.error(`[X] ${getCurrentTime()} Failed to select region`);
      process.exit();
  }
  if (selection && selection !== `${host.host.toLocaleLowerCase().split(' ').join('-')}::${region.region.split(' ')[0].toLowerCase()}` ) {
      console.error(`[X] ${getCurrentTime()} Failed to set region`);
      process.exit();
  }

  console.log(`[X] ${getCurrentTime()} Region is set to ${region.region}`);

  await page.click(page_confirmation_selector);
  
  await page.waitFor(500);

  await page.click(page_confirmation_selector);

  console.log(`[X] ${getCurrentTime()} Successfully created`);

  const crediential_selector = `[data-value="${application_deployment_name}"]`;

  await page.waitFor(500);
  await page.click(crediential_selector);
  
  console.log(`[X] ${getCurrentTime()} Acquiring credientials`);

  var amqp_selector = '//td[text()="AMQP URL"]';
  await page.waitFor(500);
  let credientials = await page.evaluate((sel) => {
      console.log(sel)
      var result = document.evaluate(sel, document, null, XPathResult.ANY_TYPE, null );
      var element = result.iterateNext();
      var crediental = element.nextSibling.nextSibling;
      var hidden = crediental.children[0];
      hidden.click();

      return element.nextSibling.nextSibling.textContent;
  }, amqp_selector)

  file.set("RABBIT_MQ_CONNECTION_URL", credientials);
  file.save();
  process.exit(0);
})()