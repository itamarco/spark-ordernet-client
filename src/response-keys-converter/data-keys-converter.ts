import { KeyValue } from "../models/key-value.type";
import {
    AuthResult,
    RMType, 
    StructAccountTransaction, 
    RMTotalType, 
    SecuritiesData, 
    SecuritiesTotalType
} from "./response-maps";

const RESPONSE_TYPES = {
    AuthResult: AuthResult,
    StructAccountTransaction: StructAccountTransaction,
    RMType: RMType,
    RMTotalType: RMTotalType,
    SecuritiesData: SecuritiesData,
    SecuritiesTotalType: SecuritiesTotalType,
}

export function convertKeys(data: KeyValue): KeyValue {
    const responseType = data._t as keyof typeof RESPONSE_TYPES;
    const keysMap = RESPONSE_TYPES[responseType] || {};

    const res = Object.keys(data).reduce((acc, curKey) => {
        const newKey = keysMap[curKey] as string || curKey;
        acc[newKey] = data[curKey]
        return acc;
    }, {} as KeyValue);

    return res;
}
// export function dataConvertorFactory(dataType: string) {
//     const keysMap = DATA_TYPES[dataType] as KeyValue;
//     return (data: KeyValue) => {
//         const res = Object.keys(data).reduce((acc, curKey) => {
//             const newKey = keysMap[curKey] || curKey;
//             acc[newKey] = data[curKey]
//             return acc;
//         }, {} as KeyValue);
//         return res;
//     }
// }
