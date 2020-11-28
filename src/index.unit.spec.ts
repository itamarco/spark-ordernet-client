// eslint-disable-next-line @typescript-eslint/no-var-requires
const SparkClient = require('./index')

describe('index', () => {
    it('SparkClient should be defined', () => {
       expect(SparkClient).toBeDefined();
    });

    it('SparkClient should be defined', () => {
        const client = new SparkClient({
            userId: 'uid',
            password: 'pasword',
            sparkHost: 'host'
        });

        expect(client).toHaveProperty('auth');
        expect(client).toHaveProperty('getAccountKey');
        expect(client).toHaveProperty('getTransactions');
    });
})
