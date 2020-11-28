export interface ClientConfig {
    sparkHost: string;
    userId: string;
    password: string;
    accountKey?: string;
    logger?: Logger;
}

interface Logger {
    log: (line: any) => any;
    warn: (line: any) => any;
    error: (line: any) => any;
}
