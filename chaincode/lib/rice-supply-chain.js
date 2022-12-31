'use strict';

const { Contract } = require('fabric-contract-api');
const collect = require('collect.js');

class RiceSupplyChain extends Contract {
    async initLedger(ctx) {
        const rice = [
            {
                owner: 'farmer1',
                amount: '300 kg',
                variant: 'Aush',
            },
            {
                owner: 'farmer2',
                amount: '200 kg',
                variant: 'Aman',
            },
            {
                owner: 'importer1',
                amount: '400 kg',
                variant: 'Boro',
            },
            {
                prevRiceNumber: 'RICE0',
                owner: 'middleman1',
                amount: '100 kg',
                price: '20 Taka',
                date: '10/12/2022',
            },
            {
                prevRiceNumber: 'RICE0',
                owner: 'middleman2',
                amount: '120 kg',
                price: '20 Taka',
                date: '11/12/2022',
            },
            {
                prevRiceNumber: 'RICE1',
                owner: 'middleman3',
                amount: '200 kg',
                price: '21 Taka',
                date: '11/12/2022',
            },
            {
                prevRiceNumber: 'RICE3',
                owner: 'wholesaler1',
                amount: '80 kg',
                price: '22 Taka',
                date: '11/12/2022',
            },
            {
                prevRiceNumber: 'RICE4',
                owner: 'wholesaler2',
                amount: '120 kg',
                price: '23 Taka',
                date: '13/12/2022',
            },
            {
                prevRiceNumber: 'RICE5',
                owner: 'wholesaler2',
                amount: '150 kg',
                price: '23 Taka',
                date: '13/12/2022',
            },
            {
                prevRiceNumber: 'RICE2',
                owner: 'wholesaler3',
                amount: '400 kg',
                price: '23 Taka',
                date: '13/12/2022',
            },
            {
                prevRiceNumber: 'RICE6',
                owner: 'retailer1',
                amount: '50 kg',
                price: '24 Taka',
                date: '13/12/2022',
            },
            {
                prevRiceNumber: 'RICE7',
                owner: 'retailer2',
                amount: '120 kg',
                price: '23 Taka',
                date: '13/12/2022',
            },
            {
                prevRiceNumber: 'RICE8',
                owner: 'retailer3',
                amount: '150 kg',
                price: '23 Taka',
                date: '13/12/2022',
            },
            {
                prevRiceNumber: 'RICE10',
                owner: 'consumer1',
                amount: '5 kg',
                price: '30 Taka',
                date: '16/12/2022',
            },
            {
                prevRiceNumber: 'RICE10',
                owner: 'consumer2',
                amount: '3 kg',
                price: '31 Taka',
                date: '16/12/2022',
            },
            {
                prevRiceNumber: 'RICE11',
                owner: 'consumer3',
                amount: '10 kg',
                price: '31 Taka',
                date: '16/12/2022',
            },
            {
                prevRiceNumber: 'RICE12',
                owner: 'consumer4',
                amount: '6 kg',
                price: '32 Taka',
                date: '16/12/2022',
            },
        ];

        for (let i = 0; i < rice.length; i++) {
            rice[i].docType = 'rice';
            await ctx.stub.putState('RICE' + i, Buffer.from(JSON.stringify(rice[i])));
            console.info('Added <--> ', rice[i]);
        }
    }
    // produce transfer
    async produceRice(ctx, riceNumber, owner, amount, variant) {
        const rice = {
            docType: 'rice',
            owner,
            amount,
            variant,
        };
        await ctx.stub.putState(riceNumber, Buffer.from(JSON.stringify(rice)));
    }

    async importRice(ctx, riceNumber, owner, amount, variant) {
        const rice = {
            docType: 'rice',
            owner,
            amount,
            variant,
        };
        await ctx.stub.putState(riceNumber, Buffer.from(JSON.stringify(rice)));
    }

    async transferRice(ctx, riceNumber, prevRiceNumber, owner, amount, price, date) {
        const rice = {
            docType: 'rice',
            prevRiceNumber,
            owner,
            amount,
            price,
            date,
        };
        await ctx.stub.putState(riceNumber, Buffer.from(JSON.stringify(rice)));
    }

    // searching
    async searchRice(ctx, riceNumber) {
        const riceAsBytes = await ctx.stub.getState(riceNumber);
        if (!riceAsBytes || riceAsBytes.length === 0) {
            throw new Error(`${riceNumber} does not exist`);
        }
        console.log(riceAsBytes.toString());
        return riceAsBytes.toString();
    }

    async searchRiceByOwner(ctx, ownerName) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                if (record.owner == ownerName) {
                    allResults.push({ Key: key, Record: record });
                } else {
                    continue;
                }
            } catch (err) {
                console.log(err);
                record = strValue;
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async searchAllRice(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async searchRiceByActor(ctx, actorName) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record, owner;
            try {
                record = JSON.parse(strValue);
                owner = String(record.owner);
                if (owner.includes(actorName)) {
                    allResults.push({ Key: key, Record: record });
                } else {
                    continue;
                }
            } catch (err) {
                console.log(err);
                record = strValue;
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async totalProducedRice(ctx) {
        const startKey = '';
        const endKey = '';
        var f_sum = 0;
        var i_sum = 0;
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record, owner;
            try {
                record = JSON.parse(strValue);
                owner = String(record.owner);
                if (owner.includes('farmer')) {
                    let amount = String(record.amount).split(" ")[0];
                    f_sum = f_sum + Number(amount);
                } else if (owner.includes('importer')) {
                    let amount = String(record.amount).split(" ")[0];
                    i_sum = i_sum + Number(amount);
                }
                else {
                    continue;
                }
            } catch (err) {
                console.log(err);
                record = strValue;
            }
        }
        // console.info(sum);
        return JSON.stringify({ 'By_Farmers': f_sum, 'By_Import': i_sum });
    }

    async totalConsumedRice(ctx) {
        const startKey = '';
        const endKey = '';
        var sum = 0;
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record, owner;
            try {
                record = JSON.parse(strValue);
                owner = String(record.owner);
                if (owner.includes('consumer')) {
                    let amount = String(record.amount).split(" ")[0];
                    sum = sum + Number(amount);
                } else {
                    continue;
                }
            } catch (err) {
                console.log(err);
                record = strValue;
            }
        }
        console.info(sum);
        return JSON.stringify(sum);
    }




    async searchStockedRice(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        const allPrevRiceID = []
        const allPrev = {}
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let prevID, record, amount = 0;
            try {
                record = JSON.parse(strValue);
                if (record.prevRiceNumber) {
                    prevID = String(record.prevRiceNumber);
                    allPrev[prevID] ? amount = allPrev[prevID]['totalAmount'] : amount = 0
                    amount += Number((record.amount).split(" ")[0]);
                    allPrevRiceID.push(prevID)
                    allPrev[prevID] = { IDP: prevID, totalAmount: amount }
                }
            } catch (err) {
                console.log(err);
                record = strValue;
            }
        }
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record, RiceID, owner, stocked_rice;
            try {
                record = JSON.parse(strValue);
                RiceID = String(key);
                owner = String(record.owner);
                const collection = collect(allPrevRiceID);

                if (!owner.includes('consumer')) {
                    if (collection.contains(RiceID)) {
                        stocked_rice = Number((record.amount).split(" ")[0]) - Number(allPrev[RiceID]['totalAmount'])
                        if (stocked_rice !== 0) {
                            record['stcoked_rice'] = stocked_rice + ' KG'
                            allResults.push({ Key: RiceID, Record: record });
                        }

                    } else {
                        record['stcoked_rice'] = Number((record.amount).split(" ")[0]) + ' KG'
                        allResults.push({ Key: RiceID, Record: record });
                    }
                }
            } catch (err) {
                console.log(err);
                record = strValue;
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async searchStockedRiceByActor(ctx, actorName) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        const allPrevRiceID = []
        const allPrev = {}
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let prevID, record, amount = 0;
            try {
                record = JSON.parse(strValue);
                if (record.prevRiceNumber) {
                    prevID = String(record.prevRiceNumber);
                    allPrev[prevID] ? amount = allPrev[prevID]['totalAmount'] : amount = 0
                    amount += Number((record.amount).split(" ")[0]);
                    allPrevRiceID.push(prevID)
                    allPrev[prevID] = { IDP: prevID, totalAmount: amount }
                }
            } catch (err) {
                console.log(err);
                record = strValue;
            }
        }
        const collection = collect(allPrevRiceID);
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record, RiceID, owner, stocked_rice;
            try {
                record = JSON.parse(strValue);
                RiceID = String(key);
                owner = String(record.owner);
                if (owner.includes(actorName) && !owner.includes('consumer')) {
                    if (collection.contains(RiceID)) {
                        stocked_rice = Number((record.amount).split(" ")[0]) - Number(allPrev[RiceID]['totalAmount'])
                        if (stocked_rice !== 0) {
                            record['stcoked_rice'] = stocked_rice + ' KG'
                            allResults.push({ Key: RiceID, Record: record });
                        }

                    } else {
                        record['stcoked_rice'] = Number((record.amount).split(" ")[0]) + ' KG'
                        allResults.push({ Key: RiceID, Record: record });
                    }
                }
            } catch (err) {
                console.log(err);
                record = strValue;
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
    async searchStockedRiceByOwner(ctx, ownerName) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        const allPrevRiceID = []
        const allPrev = {}
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let prevID, record, amount = 0;
            try {
                record = JSON.parse(strValue);
                if (record.prevRiceNumber) {
                    prevID = String(record.prevRiceNumber);
                    allPrev[prevID] ? amount = allPrev[prevID]['totalAmount'] : amount = 0
                    amount += Number((record.amount).split(" ")[0]);
                    allPrevRiceID.push(prevID)
                    allPrev[prevID] = { IDP: prevID, totalAmount: amount }
                }
            } catch (err) {
                console.log(err);
                record = strValue;
            }
        }
        const collection = collect(allPrevRiceID);
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record, RiceID, owner, stocked_rice;
            try {
                record = JSON.parse(strValue);
                RiceID = String(key);
                owner = String(record.owner);
                if (record.owner == ownerName) {
                    if (collection.contains(RiceID)) {
                        stocked_rice = Number((record.amount).split(" ")[0]) - Number(allPrev[RiceID]['totalAmount'])
                        if (stocked_rice !== 0) {
                            record['stcoked_rice'] = stocked_rice + ' KG'
                            allResults.push({ Key: RiceID, Record: record });
                        }

                    } else {
                        record['stcoked_rice'] = Number((record.amount).split(" ")[0]) + ' KG'
                        allResults.push({ Key: RiceID, Record: record });
                    }
                }
            } catch (err) {
                console.log(err);
                record = strValue;
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
}

module.exports = RiceSupplyChain;
