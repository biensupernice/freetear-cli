#! /usr/bin/env node

var inquirer = require('inquirer');
var shell = require('shelljs')

let getCurrentTime = () => {
    let toDigit = (number) => {
        return number.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    }

    var today = new Date();
    return toDigit(today.getHours()) + ":" + toDigit(today.getMinutes()) + ":" + toDigit(today.getSeconds());
}

(
    async() => {
        const app = await inquirer.prompt([
            {
              type: 'list',
              name: 'type',
              message: 'What type of app would you like to deploy?',
              choices: [
                'Python Flask App',
                'Node.Js App'
              ]
            }])
        
        if (app.type === 'Python Flask App') {
            console.log(`[X] ${getCurrentTime()} Generating Boilerplate`)

            const services = await inquirer.prompt([
                {
                  type: 'checkbox',
                  name: 'resource',
                  message: 'What resources does your app need?',
                  choices: [{
                    name: "Message Broker Service"
                  }, {
                    name: 'Data Store'
                  }]
                }])

            if (services['resource'].length > 1) {
                shell.exec(`awk 'FNR==1{print ""}1' ./bin/templates/boilerplate/python/routes/* > index.py`)
                shell.exec(`awk 'FNR==1{print ""}1' ./bin/templates/boilerplate/python/requirements/* > requirements.txt`)
                shell.exec('mkdir connections')
                shell.exec(`cp -r ./bin/templates/boilerplate/python/connections/ ./connections/`)
            }
            else if (services['resource'].length == 1) {
                if (services['resource'] == 'Message Broker Service') {
                    shell.exec(`awk 'FNR==1{print ""}1' ./bin/templates/boilerplate/python/routes/flask.py ./bin/templates/boilerplate/python/routes/rabbit.py > index.py`)
                    shell.exec(`awk 'FNR==1{print ""}1' ./bin/templates/boilerplate/python/requirements/flask.txt ./bin/templates/boilerplate/python/requirements/rabbit.txt > requirements.txt`)
                    shell.exec('mkdir connections')
                    shell.exec(`cp ./bin/templates/boilerplate/python/connections/__init__.py ./connections/`)
                    shell.exec(`cp ./bin/templates/boilerplate/python/connections/rabbit.py ./connections/`)
                } else {
                    shell.exec(`awk 'FNR==1{print ""}1' ./bin/templates/boilerplate/python/routes/flask.py ./bin/templates/boilerplate/python/routes/mongo.py > index.py`)
                    shell.exec(`awk 'FNR==1{print ""}1' ./bin/templates/boilerplate/python/requirements/flask.txt ./bin/templates/boilerplate/python/requirements/mongo.txt > requirements.txt`)
                    shell.exec('mkdir connections')
                    shell.exec(`cp ./bin/templates/boilerplate/python/connections/__init__.py ./connections/`)
                    shell.exec(`cp ./bin/templates/boilerplate/python/connections/mongo.py ./connections/`)
                }
            } else {
                shell.exec(`awk 'FNR==1{print ""}1' ./bin/templates/boilerplate/python/routes/flask.py > index.py`)
                shell.exec(`awk 'FNR==1{print ""}1' ./bin/templates/boilerplate/python/requirements/flask.txt > requirements.txt`)
                shell.exec('mkdir connections')
                shell.exec(`cp ./bin/templates/boilerplate/python/connections/__init__.py ./connections/`)
            }

            shell.exec(`cp ./bin/templates/credientials.json .`)
            
        }

        if (app.type === 'Node.Js App') {
            console.log('[X] Not supported at this time');
            process.exit();
        }
        
    }
)();