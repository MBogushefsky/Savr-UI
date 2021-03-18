export class PlaidAccount {
    public Id: string;
    public userId: string;
    public accountId: string;
    public name: string;
    public type: string;
    public subType: string;
    public availableBalance: number;
    public currentBalance: number;
}

export class PlaidTransaction {
    public Id: string;
    public userId: string;
    public accountId: string;
    public amount: number;
    public merchantName: string;
    public name: string;
    public date: Date;
}