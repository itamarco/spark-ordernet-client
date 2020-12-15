# spark-ordernet-client
[![npm version](https://badge.fury.io/js/spark-ordernet-client.svg)](https://badge.fury.io/js/spark-ordernet-client)

Simple REST client for Spark-Ordernet API


Tested with
- `sparknesua.ordernet.co.il`
- `sparkpsagot.ordernet.co.il`

## Usage
```typescript
import SparkClient from './spark-client';

const client = new SparkClient({
    sparkHost: 'https://sparkpsagot.ordernet.co.il',
    userId: '<your account id>', 
    password: '<yorr password>',
    
    //Optional
    accountKey: '<your account key e.g. ACC_060-030002>',
    logger: '<default is console>', 
});
```

Authenticate once
```typescript
await client.auth();
```
Optional - Get accountKey
```typescript
const accountKey: string = await client.getAccountKey();
client.setSparkAccountKey(accountKey);
```
Get transactions
```typescript
const transactions = await client.getTransactions(new Date(2018,1,1));

// transactions = 
[
    {
        Account: '***',
        Date: '2019-05-04T00:00:00',
        Bno_Number: 5760130,
        Ref: 995036,
        Sug_Bno: '10',
        Bno_Name: '7חברה לישראלאגח',
        Nv: 953.2,
        Action: 'הפקדה',
        Balance: 0,
        Comission: 0,
        Price: 130.1,
        NetCredit: 0,
        NetDebit: 0
    },
    ...
]
```

Get holdings
```typescript
const holdings = await client.getHoldings();

// holdings = 
[
    {
        Sug: '0',
        ID: '031692',
        BNO: 5121835,
        BS_BNO: '0',
        SYMBOL_NAM: 'HRL TEL-B60',
        BNO_NAME: '60 הראל תל בונד',
        SUG_ID: '10',
        SUG_BNO: '5',
        LAST_OP: '9',
        mm: 'קניה',
        PRC: 112.89,
        PRC_CHNG: '0',
        SUG_CUR: '1',
        PR_MATACH: '1',
        HON_RASHUM: 0,
        NV: 21232,
        COST: 23998.06,
        VL: 23968.8,
        EXT_MARGIN: 14381.28,
        REQ_MARGIN: 23998.06,
        SugBno: 'Kranot',
        ...
    },
    ...
]
```
