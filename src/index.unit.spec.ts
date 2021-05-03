import SparkClient from "./";

function createClient(): SparkClient{
    return new SparkClient({
        userId: 'uid',
        password: 'password',
        sparkHost: 'host'
    });
}

describe('unit tests - client', () => {
    it('SparkClient should be defined', () => {
       expect(SparkClient).toBeDefined();
    });

    it('SparkClient should be defined', () => {
        const client = createClient();

        expect(client).toHaveProperty('auth');
        expect(client).toHaveProperty('getAccountKey');
        expect(client).toHaveProperty('getTransactions');
    });

    it('Throw error when accountKey is not set when calling getHoldings()', async () => {
        const client = createClient();

       try {
           await client.getHoldings();
           throw new Error('should fail due to missing accountKey');
       } catch (e) {
           expect(e).toBeInstanceOf(Error);
           expect(e.message).toBe('accountKey was not set!');
       }
    })

    it('Throw error when accountKey is not set when calling getTransactions()', async () => {
        const client = createClient();

        try {
            await client.getTransactions(new Date());
            throw new Error('should fail due to missing accountKey');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe('accountKey was not set!');
        }
    })


})

