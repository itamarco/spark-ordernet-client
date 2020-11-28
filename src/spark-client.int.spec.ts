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
      const res = await client.getTransactions(new Date('2018-01-01T00:00:00.000Z'));

      expect(res).toBeInstanceOf(Array);
      if( res.length > 0) {
         expect(res[0]).toHaveProperty('Price');
      }
   })

   it('should get holdings', async () => {
      client.setSparkAccountKey(accountKey);
      const res = await client.getHoldings();

      expect(res).toBeInstanceOf(Array);
      if( res.length > 0) {
         expect(res[0]).toHaveProperty('COST');
      }
   })
});
