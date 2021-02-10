import {AxiosInstance, default as axios} from 'axios';
import Response from "./response";
import {ClientConfig} from "./models/client-config.interface";
import {convertKeys} from "./response-keys-converter/data-keys-converter";
import {KeyValue} from "./models/key-value.type";

const PATHS = {
    AUTH_API: "/api/Auth/Authenticate",
    HOLDINGS_API: "/api/Account/GetHoldings",
    HOLDINGS_SUMMARY_API: "/api/Account/GetHoldingsSummery",
    STATIC_DATA: "/api/DataProvider/GetStaticData",
    TRANSACTIONS: "/api/Account/GetAccountTransactions",
    SECURITIES: "/api/Account/GetAccountSecurities",
}

const USER_AGENT =
    "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 OPR/65.0.3467.48";

export default class SparkClient {
    private httpClient: AxiosInstance;
    private username;
    private password;
    private accountKey;
    private logger;

    constructor(config: ClientConfig) {
        this.httpClient = axios.create({
            baseURL: config.sparkHost,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8',
                'Referer': config.sparkHost,
                'User-Agent': USER_AGENT,
                'Sec-Fetch-Mode': 'cors',
            },

            // validateStatus: (status: number ) => true,
        });

        this.username = config.userId;
        this.password = config.password;
        this.accountKey = config.accountKey || '';
        this.logger = config.logger || console;
    }

    async auth(): Promise<KeyValue> {
        return this.httpClient.post<any, any>(PATHS.AUTH_API,
            {
                username: this.username,
                password: this.password,
            },
        )
            .then(res => res.data)
            .then( convertKeys )
            .then( data => {
                const {LoginStatus, Token} = data;
                if (LoginStatus !== 'Success') {
                    throw new Error(`Spark server failed to connect: ${LoginStatus}`);
                }
                const bearer = Token as string;
                this.setClientBearerToken(bearer);
                return data;
            });
    }

    async getAccountKey(): Promise<string> {
        return this.httpClient.get<any, any>(PATHS.STATIC_DATA)
            .then(res => res.data)
            .then(data => {
                const accountObject = data.find(entry => entry.b === 'ACC');
                const accountKey = accountObject.a[0]._k;
                return accountKey;
            })
            .catch(err => {
                this.logger.error(['failed to retrieve account key', err.message].join(' '));

                return new Response(false, err.message);
            })
    }

    /**
     * Get transactions between date interval.
     * It seem to be that 'from' and 'to' dates should be in the same year
     * for the API to reply with proper response
     * @param from
     * @param to
     */
    async getTransactions(from: Date, to: Date = new Date(Date.now())): Promise<KeyValue[]> {
        this.validateAccountKey();
        return this.httpClient.get(PATHS.TRANSACTIONS, {
            params: {
                accountKey: this.accountKey,
                startDate: from.toISOString(),//2018-01-01T00:00:00.000Z
                endDate: to.toISOString(), //2018-11-19T00:00:00.000Z&
            }
        })
            .then(res => res.data)
            .then( data => data.map(convertKeys) )
    }

    async getHoldings(): Promise<KeyValue[]> {
        this.validateAccountKey();
        return this.httpClient.get(PATHS.HOLDINGS_API,
            {
                params: {accountKey: this.accountKey},
            }
        )
            .then((res: any) => res.data)
            .then( data => data.map(convertKeys) )
    }

    async getHoldingsSummary(): Promise<KeyValue> {
        this.validateAccountKey();
        return this.httpClient.get(PATHS.HOLDINGS_SUMMARY_API,
            {
                params: {accountKey: this.accountKey},
            }
        )
            .then((res: any) => res.data)
            .then( convertKeys )
    }

    async getSecurities(): Promise<KeyValue> {
        this.validateAccountKey();
        return this.httpClient.get(PATHS.SECURITIES,
            {
                params: {accountKey: this.accountKey},
            }
        )
            .then((res: any) => res.data)
            .then( convertKeys )
            .then( data => ({...data, Totals: convertKeys(data.Totals as KeyValue)}))
    }

    setClientBearerToken(bearerToken: string): void {
        this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${bearerToken}`;
    }

    setSparkAccountKey(accountKey: string): void {
        this.accountKey = accountKey;
    }

    private validateAccountKey(): void {
        if (!this.accountKey || this.accountKey === '')
            throw new Error('accountKey was not set!')
    }

}
