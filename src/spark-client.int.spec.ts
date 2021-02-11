import SparkClient from './spark-client';

jest.setTimeout(18000); // for 'getAccountKey

describe('client', () => {
    const client = new SparkClient({
        sparkHost: 'https://sparkpsagot.ordernet.co.il',
        userId: '',
        password: '',
    });

    const accountKey = '';

    it('should login', async () => {
        const res = await client.auth();
        expect(res).toHaveProperty('Token');
        console.log(res.Token);
    })

    // it('should get account key', async () => {
    //    const res = await client.getAccountKey();
    //    console.log(res);
    // })

    it('get transactions', async () => {
        client.setSparkAccountKey(accountKey);
        const res = await client.getTransactions(new Date(2019, 1, 1));

        expect(res).toBeInstanceOf(Array);
        expect(res.length).toBeGreaterThan(0);
        expect(res[0]).toHaveProperty('Price');
    })

    it('should get holdings', async () => {
        client.setSparkAccountKey(accountKey);
        const res = await client.getHoldings();

        expect(res).toBeInstanceOf(Array)
        expect(res.length).toBeGreaterThan(0);
        expect(res[0]).toHaveProperty('COST');
    })

    it('should get holdings summary', async () => {
        client.setSparkAccountKey(accountKey);
        const res = await client.getHoldingsSummary();

        expect(res).toBeInstanceOf(Object);
        expect(res).toHaveProperty('Cash');
    })

    it('should get securities', async () => {
        client.setSparkAccountKey(accountKey);
        const res = await client.getSecurities();

        expect(res).toBeInstanceOf(Object);
        expect(res).toHaveProperty('Totals');
        expect(res.Totals).toHaveProperty('CashCurrent');
    })
});
