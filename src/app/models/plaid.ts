export class PlaidAccount {
    private Id: string;
    private userId: string;
    private accountId: string;
    private name: string;
    private type: string;
    private subType: string;
    private availableBalance: number;
    private currentBalance: number;
}

export class PlaidTransaction {
    private Id: string;
    private userId: string;
    private accountId: string;
    private amount: number;
    private merchantName: string;
    private name: string;
    private date: Date;
}