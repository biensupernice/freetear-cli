#! /usr/bin/env node
var puppeteer = require('puppeteer');
var inquirer = require('inquirer');

let getCurrentTime = () => {
  let toDigit = (number) => {
    return number.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  }

  var today = new Date();
  return toDigit(today.getHours()) + ":" + toDigit(today.getMinutes()) + ":" + toDigit(today.getSeconds());
}

(
  async () => {
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

    const selector_for_signin = '[class="social"]';

    await page.click(selector_for_signin);
    

    const username_selector = '#login_field';
    const password_selector = '#password';
    
    await page.waitForSelector(username_selector);

    await page.type(username_selector, username.username);
    await page.type(password_selector, password.password);

    const signin_selector = '[name="commit"]';

    await page.click(signin_selector);
    var faliure = '.flash-error';
    await page.waitFor(500);
    try{
        if (await page.$(faliure) !== null) {
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
    
    const page_confirmation_selector = '#wizardNext'

    await page.waitForSelector(instances_name_selector)
    await page.type(instances_name_selector, 'freeTier')

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
    console.log(region_selector)

    async function getValue(selector) {
        let value = await page.evaluate((sel) => {
          let selectionList = [];
          Array.from(document.querySelectorAll(sel)).forEach((ele) => selectionList.push(ele.innerText));
          return selectionList
        }, selector)
        return value
    }
    await page.waitFor(500);
    
    let selections = await getValue(region_selector);
    
    console.log(selections)
    const region = await inquirer.prompt([
        {
          type: 'list',
          name: 'region',
          message: `Which region would you like to select for ${host.host}`,
          choices: selections
        }])

    console.log(region);
  }
)();