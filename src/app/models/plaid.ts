export class PlaidInstitution {
    public institutionId: string;
    public accounts: PlaidAccount[];
}

export class PlaidAccount {
    public Id: string;
    public userId: string;
    public accountId: string;
    public institutionId: string;
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
    public merchantName: string;
    public name: string;
    public amount: number;
    public categories: string[];
    public date: string;
}