import SparkClient from './spark-client';

jest.setTimeout(18000); // for 'getAccountKey

describe('Integration Tests', () => {
   const client = new SparkClient({
      sparkHost: 'https://sparkpsagot.ordernet.co.il',
      userId: process.env.SPARK_USER_ID as string,
      password: process.env.SPARK_PASSWORD as string,
   });

   const accountKey = process.env.SPARK_ACCOUNT_KEY as string;

   it('should have env variables defined', () => {
      expect(process.env.SPARK_USER_ID).toBeDefined();
      expect(process.env.SPARK_PASSWORD).toBeDefined();
      expect(process.env.SPARK_ACCOUNT_KEY).toBeDefined();
   });

   it('should login', async () => {
      const res = await client.auth();
      expect(res).toHaveProperty('Token');
      console.log(res.Token);
   })

   // it('should get account key', async () => {
   //    const accountKey = await client.getAccountKey();
   //    console.log({accountKey});
   // })

   it('get transactions', async () => {
      client.setSparkAccountKey(accountKey);
      const res = await client.getTransactions(new Date(2019, 1, 1));

      console.log(res)
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

   it('should get chart data', async () => {
      const res = await client.getChartData('KRN_5109889');

      expect(res).toBeInstanceOf(Array);
      expect(res.length).toBeGreaterThan(0);
      expect(res[0]).toHaveProperty('close')
      expect(res[0]).toHaveProperty('time')
   })
});
