'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const prompt = require('prompt-sync')();

async function main() {
    try {
        // network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));


        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check user
        const identity = await wallet.get('appUser');
        // console.log(await wallet.get(all))
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // connect gateway
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // connect channel
        const network = await gateway.getNetwork('channel1');

        // connect smart contact
        const contract = network.getContract('rsc');

        // select option
        var loop = true;
        while (loop) {
            let result;
            console.log(`\n\nSelect a Search option-\n1.Search All Rice \n2.Search Rice By Owner\n3.Search Rice By ID\n4.Search Rice By Actor\n5.Total Produced Rice\n6.Search Stocked Rice\n7.Search Stocked Rice By Actor\n8.Search Stocked Rice By Owner\n9.Total Consumed Rice\n10.Exit`)
            const option = prompt();
            switch (option) {
                case '1':
                    result = await contract.evaluateTransaction('searchAllRice');
                    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                    break;
                case '2':
                    console.log('Write owner Name: ')
                    const name = prompt();
                    result = await contract.evaluateTransaction('searchRiceByOwner', name.toString());
                    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                    break;
                case '3':
                    console.log('Write Rice ID: ')
                    const id = prompt();
                    result = await contract.evaluateTransaction('searchRice', id.toString());
                    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                    break;
                case '4':
                    console.log('Write actor name(farmer,middleman,wholesaler,retailer): ')
                    var actorName = prompt();
                    result = await contract.evaluateTransaction('searchRiceByActor', actorName);
                    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                    break;
                case '5':
                    result = await contract.evaluateTransaction('totalProducedRice');
                    console.log(`Transaction has been evaluated, result is: ${result.toString()} KG`);
                    break;
                case '6':
                    result = await contract.evaluateTransaction('searchStockedRice');
                    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                    break;
                case '7':
                    console.log('Write actor name(farmer,middleman,wholesaler,retailer): ')
                    let actorNam = prompt();
                    result = await contract.evaluateTransaction('searchStockedRiceByActor', actorNam);
                    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                    break;
                case '8':
                    console.log('Write owner name: ')
                    let ownerNam = prompt();
                    result = await contract.evaluateTransaction('searchStockedRiceByOwner', ownerNam);
                    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                    break;
                case '9':
                    result = await contract.evaluateTransaction('totalConsumedRice');
                    console.log(`Transaction has been evaluated, result is: ${result.toString()} KG`);
                    break;
                case '10':
                    loop = false
                default:
                    break;
            }

        }

        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
