const fs = require('fs');

const readContract = (name) => {
    return {
        abi: JSON.parse(fs.readFileSync('./dist/UfpCentral_sol_' + name + '.abi').toString()),
        byteCode: fs.readFileSync('./dist/UfpCentral_sol_' + name + '.bin').toString()
    }
}


const deployContract = (web3, accounts, contract, contractByteCode, comment, arguments) => {
    var transactionDeployOuter = contract.deploy({data: '0x' + contractByteCode, arguments: arguments})
    var transactionDeploy = {from: accounts[0], gas: 3000000}
    return transactionDeployOuter.send(transactionDeploy).then((newContractInstance) => {
        var contractAddress = newContractInstance.options.address
        //  console.log(comment, contractAddress)
        return contractAddress;
    })
}

const ufpCentralRegistry = readContract('UfpCentralRegistry')
const ufpSupplyChainCompany = readContract('UfpSupplyChainCompany')
const ufpSupplyChainDigitalTwin = readContract('UfpSupplyChainDigitalTwin')

var API = {

    doAddCentralRegistry: (web3, accounts, param1, param2) => {
        var myRegistry = new web3.eth.Contract(ufpCentralRegistry.abi)
        return deployContract(web3, accounts, myRegistry, ufpCentralRegistry.byteCode, 'registry added').then((address) => {
            console.log(address)
        })
    },

    doAddCompany: (web3, accounts, registryAddress, companyName, param2) => {
        var myCompany = new web3.eth.Contract(ufpSupplyChainCompany.abi)
        companyName = companyName || 'company' + Math.floor(Math.random() * 10000);
        return deployContract(web3, accounts, myCompany, ufpSupplyChainCompany.byteCode, 'company "' + companyName + '" added', [companyName]).then((address) => {
            console.log('company', companyName, 'deployed at', address)

            return address;
        }).then((address) => {
            var myRegistry = new web3.eth.Contract(ufpCentralRegistry.abi)
            myRegistry.options.address = registryAddress;
            return myRegistry.methods.addCompany(companyName, address).send({from: accounts[0]})
                .then((result) => {
                    console.log('registry addCompany', result)
                    return address
                })
        })
    },

    doAddDigitalTwin: (web3, accounts, registryAddress, digitalTwinSerialId, digitalTwinName, digitalTwinData) => {
        var myDigitalTwin = new web3.eth.Contract(ufpSupplyChainDigitalTwin.abi)
        digitalTwinData = digitalTwinData || 'randomHash' + Math.floor(Math.random() * 10000);
        digitalTwinSerialId = digitalTwinSerialId || 'digitalTwin' + Math.floor(Math.random() * 10000);
        digitalTwinName = digitalTwinName || 'noname';
        return deployContract(web3, accounts, myDigitalTwin, ufpSupplyChainDigitalTwin.byteCode, 'digitalTwin (' + digitalTwinName + ') added', [digitalTwinSerialId, digitalTwinName, digitalTwinData]).then((address) => {
            console.log('digitalTwin', digitalTwinSerialId, digitalTwinName, digitalTwinData.substring(0, 10) + '...', 'deployed at', address)
            return address;
        }).then((address) => {
            var myRegistry = new web3.eth.Contract(ufpCentralRegistry.abi)
            myRegistry.options.address = registryAddress;
            return myRegistry.methods.addDigitalTwin(digitalTwinSerialId, address).send({from: accounts[0]})
                .then((result) => {
                    //console.log('registry addDigitalTwin', result.to)
                    return address
                })
        })
    },

    /*
    doRegistryAddDigitalTwin: (web3, accounts, registryAddress, param1, param2) => {
        var digitalTwinContractAddress = param1;
        var registryAddress = param2;
        var myRegistry = new web3.eth.Contract(ufpCentralRegistry.abi)
        myRegistry.options.address = registryAddress;

        myRegistry.methods.addDigitalTwin('ERROR').send({from: accs[0]})
            .then(function (receipt) {
                console.log('contractMethod', receipt)
            });


    },
    */

    doDemo: (web3, accounts, registryAccount, filename) => {
        var definition = JSON.parse(fs.readFileSync(filename).toString());
        var companyNames = Array.from(new Set(definition.stations.map((entry) => entry.name)));
        var stations = definition.stations; // "stations":  [{"name": "Factory", "data": {}}]


        var digitalTwins = [
            {
                serialId: definition.digitalTwin.id,
                name: definition.digitalTwin.name,
                data: JSON.stringify(stations[0].data)
            }]


        var createCompanies = Promise.all(companyNames.map((companyName) => {
            return API.doAddCompany(web3, accounts, registryAccount, companyName).then((address) => {
                return {name: companyName, address: address}
            })
        })).then((companyNameAndAddresses) => {
            //console.log(companyNameAndAddresses)
            return companyNameAndAddresses;
        })

        var createTwins = Promise.all(digitalTwins.map((digitalTwin) => {
            return API.doAddDigitalTwin(web3, accounts, registryAccount, digitalTwin.serialId, digitalTwin.name, digitalTwin.data).then((address) => {
                return {
                    serialId: digitalTwin.serialId,
                    name: digitalTwin.name,
                    data: digitalTwin.data,
                    address: address
                }
            })
        }))


        Promise.all([createCompanies, createTwins]).then(([companyNameAndAddresses, digitalTwinsWithAddress]) => {
            //console.log(digitalTwinsWithAddress)
            API.fillHistory(web3, accounts, digitalTwinsWithAddress, stations.slice(1), companyNameAndAddresses)
            return digitalTwinsWithAddress;
        })


        //console.log(digitalTwinName, digitalTwinId, companyNames);

        /*
        api.doAddCompany(web3, accounts, 'Siemens', param1)
        api.doAddCompany(web3, accounts, 'Factory', param1)
        api.doAddCompany(web3, accounts, 'Customer', param1)
        api.doAddCompany(web3, accounts, 'Repairshop', param1)

        api.doAddDigitalTwin(web3, accounts, 'Blade 1', param1)
        api.doAddDigitalTwin(web3, accounts, 'Blade 2', param1)
        api.doAddDigitalTwin(web3, accounts, 'Blade 3', param1)*/

    },

    fillHistory: (web3, accounts, digitalTwinsWithAddress, stations, companyNameAndAddresses) => {
        digitalTwinsWithAddress.map((digitalTwinWithAddress) => {
            stations.map((station) => {
                var companyNameAndAddress = companyNameAndAddresses.find((company) => {
                    return (company.name === station.name)
                })


                console.log('adding station', station.name, JSON.stringify(station.data).substring(0, 10), '...',
                    companyNameAndAddress.address)
            })
        })
    },

    doGetHistory: (web3, accounts, registryAddress, digitalTwinSerialId) => {

        console.log('history', registryAddress, digitalTwinSerialId)
        var myRegistry = new web3.eth.Contract(ufpCentralRegistry.abi)
        myRegistry.options.address = registryAddress;
        myRegistry.methods.getDigitalTwinAddressBySerialId({digitalTwinSerialId: digitalTwinSerialId}).call({from: accounts[0]})
            .then((address) => {
                console.log('registry-entry-digital-twin', address)
            })

    }

}

module.exports = API;