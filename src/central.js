#!/usr/bin/env node

const argv = require('yargs').argv;
const args = argv._;
const fs = require('fs');

const command = args[0]
const param1 = args[1]
const param2 = args[2]
const param3 = args[3]
const param4 = args[4]
const param5 = args[5]

const Web3 = require('web3')
//const web3 = new Web3("http://demo-dev.froso.de:8545")
//const web3 = new Web3("http://localhost:8545")
const web3 = new Web3("http://192.168.1.2:8545")

var lastUsedRegistry

if (fs.existsSync('dist/lastRegistry.txt')) {
    lastUsedRegistry = fs.readFileSync('dist/lastRegistry.txt').toString()
}

//console.log('lastUsedRegistry', lastUsedRegistry)
const api = require('./api')

web3.eth.getAccounts().then((accounts) => {

    switch (command) {
        case 'addregistry':
            api.doAddCentralRegistry(web3, accounts, param1, param2).then((address) => {
                fs.writeFileSync('dist/lastRegistry.txt', address)
            })
            break;

        case 'addcompany':
            var name = param1 || 'Factory';
            var registryAccount = param2 || lastUsedRegistry;
            api.doAddCompany(web3, accounts, registryAccount, name, param3)
            break;

        case 'addtwin':
            if (!param1) {
                throw new Exception('company needed')
            }
            var owner = param1
            var name = param2 || 'twin' + Math.floor(Math.random() * 1000);
            var serialId = param3 || '2017623221';
            var data = param4 || '{"a":"b"}';
            var registryAccount = param5 || lastUsedRegistry;
            api.doAddDigitalTwin(web3, accounts, registryAccount, serialId, name, data, owner)
            break;


        case 'demo':
            var filename = param1 || 'src/siemens.json';
            var registryId = param2 || lastUsedRegistry;
            api.doDemo(web3, accounts, registryId, filename)
            break;

        case 'history':
            var serialId = param1 || '2017623221';
            var registryId = param2 || lastUsedRegistry;

            api.doGetHistory(web3, accounts, registryId, serialId).then((result) => {
                fs.writeFileSync('dist/out.json', result)
                console.log('dist/out.json written')
            })

            break;
        case 'company':
            var companyName = param1 || 'Factory';
            var registryId = param2 || lastUsedRegistry;
            api.doGetCompanyFromRegistry(web3, accounts, registryId, companyName)

            break;

        case 'twin':
            var serialId = param1 || '2017623221';
            var registryId = param2 || lastUsedRegistry;
            api.doGetTwinFromRegistry(web3, accounts, registryId, serialId)
            break;

        case 'addhistory':
            var serialId = param1
            var companyAddress = param2;
            var data = param3 || '{"scrap": "true", "likeit": "true"}'
            var registryAddress = param4 || lastUsedRegistry;

            api.addHistoryEntry(web3, accounts, registryAddress, serialId, companyAddress, data)


    }

});









