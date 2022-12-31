'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();

async function main() {
    try {
        // network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check user.
        const identity = await wallet.get('appUser');
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

        // connect smart contract
        const contract = network.getContract('rsc');


        var loop = true;
        while (loop) {
            console.log(`\n\nSelect an option-\n1.Produce Rice\n2.Import Rice \n3.Transfer Rice\n4.Exit`)
            const option = prompt();
            switch (option) {
                case '1':
                    console.log('Rice ID: ')
                    var riceNumber = prompt();
                    console.log('Owner: ')
                    var owner = prompt();
                    console.log('Amount: ')
                    var amount = prompt();
                    console.log('Variant: ')
                    var variant = prompt();
                    await contract.submitTransaction('produceRice', riceNumber, owner, amount, variant);
                    console.log('\nTransaction has been submitted');
                    break;
                case '2':
                    console.log('Rice ID: ')
                    var riceNumber = prompt();
                    console.log('Owner: ')
                    var owner = prompt();
                    console.log('Amount: ')
                    var amount = prompt();
                    console.log('Variant: ')
                    var variant = prompt();
                    await contract.submitTransaction('produceRice', riceNumber, owner, amount, variant);
                    console.log('\nTransaction has been submitted');
                    break;
                case '3': {
                    console.log('Rice ID: ')
                    const riceNumber = prompt();
                    console.log('Rice ID(transferred from): ')
                    const prevRiceNumber = prompt();
                    console.log('Owner: ')
                    const owner = prompt();
                    console.log('Amount: ')
                    const amount = prompt();
                    console.log('Price(per KG): ')
                    const price = prompt();
                    console.log('Date: ')
                    const date = prompt();
                    await contract.submitTransaction('transferRice', riceNumber, prevRiceNumber, owner, amount, price, date);
                    console.log('\nTransaction has been submitted');
                    break;
                }

                case '4':
                    loop = false
                default:
                    break;
            }
        }

        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
