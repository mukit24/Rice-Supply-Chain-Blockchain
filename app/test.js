const collect = require('collect.js');
const rice = [
    {
        owner: 'farmer1',
        amount: '70 kg',
        variant: 'Aush',
    },
    {
        owner: 'farmer2',
        amount: '70 kg',
        variant: 'Aman',
    },
    {
        owner: 'farmer3',
        amount: '30 kg',
        variant: 'Boro',
    },
    {
        prevRiceNumber: 'RICE0',
        owner: 'middleman1',
        amount: '25 kg',
        price: '20 Taka',
        date: '10/12/2022',
    },
    {
        prevRiceNumber: 'RICE1',
        owner: 'middleman2',
        amount: '70 kg',
        price: '21 Taka',
        date: '11/12/2022',
    },
    {
        prevRiceNumber: 'RICE3',
        owner: 'wholesaler1',
        amount: '20 kg',
        price: '23 Taka',
        date: '13/12/2022',
    },
    {
        prevRiceNumber: 'RICE0',
        owner: 'middleman3',
        amount: '25 kg',
        price: '21 Taka',
        date: '11/12/2022',
    },
    {
        prevRiceNumber: 'RICE5',
        owner: 'retailer1',
        amount: '15 kg',
        price: '26 Taka',
        date: '13/12/2022',
    },
    {
        prevRiceNumber: 'RICE7',
        owner: 'consumer1',
        amount: '5 kg',
        price: '26 Taka',
        date: '13/12/2022',
    }
];
const ledger = []
for (let i = 0; i < rice.length; i++) {
    ledger.push({ 'KEY': 'RICE' + i, 'RECORD': rice[i] });
}
console.log(ledger);

function searchStockedRice() {
    const startKey = '';
    const endKey = '';
    const allResults = [];
    const allPrevRiceID = []
    const allPrev = {}
    for (let i = 0; i < ledger.length; i++) {
        const strValue = ledger[i].RECORD;
        let prevID, record, amount = 0;
        try {
            record = strValue;
            if (record.prevRiceNumber) {
                // console.info(record)
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
    for (let i = 0; i < ledger.length; i++) {
        const strValue = ledger[i].RECORD;
        let record, RiceID, owner, stocked_rice;
        try {
            record = strValue;
            RiceID = String(ledger[i].KEY);
            owner = String(record.owner);
            if (!owner.includes('consumer')) {
                if (collection.contains(RiceID)) {
                    // console.info(RiceID)
                    // console.info(allPrev[RiceID])
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
    // console.info(allPrev)
}

function searchStockedRiceByActor(actorName) {
    const startKey = '';
    const endKey = '';
    const allResults = [];
    const allPrevRiceID = []
    const allPrev = {}
    for (let i = 0; i < ledger.length; i++) {
        const strValue = ledger[i].RECORD;
        let prevID, record, amount = 0;
        try {
            record = strValue;
            if (record.prevRiceNumber) {
                // console.info(record)
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
    for (let i = 0; i < ledger.length; i++) {
        const strValue = ledger[i].RECORD;
        let record, RiceID, owner, stocked_rice;
        try {
            record = strValue;
            RiceID = String(ledger[i].KEY);
            owner = String(record.owner);
            if (owner.includes(actorName) && !owner.includes('consumer')) {
                if (collection.contains(RiceID)) {
                    // console.info(RiceID)
                    // console.info(allPrev[RiceID])
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
    // console.info(allPrev)
}

function totalConsumedRice() {
    const startKey = '';
    const endKey = '';
    var sum = 0;
    for(let i = 0; i < ledger.length; i++) {
        const strValue = ledger[i].RECORD;
        let record,owner;
        try {
            record = strValue;
            owner = String(record.owner);
            if (owner.includes('consumer')){
                let amount = String(record.amount).split(" ")[0];
                sum = sum + Number(amount);
            }else{
                continue;
            }
        } catch (err) {
            console.log(err);
            record = strValue;
        }
    }
    console.info(sum);
}

// searchStockedRiceByActor('middleman');
// searchStockedRice();
totalConsumedRice();

