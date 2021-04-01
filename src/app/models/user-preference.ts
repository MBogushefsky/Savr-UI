export class UserPreferenceType {
    public id: string;
    public dataType: string;
    public category: string;
    public name: string;
}

export class UserPreference {
    public typeId: string;
    public userId: string;
    public value: string;
}