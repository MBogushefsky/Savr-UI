export class UserPreferenceType {
    public id: string;
    public medium: string;
    public dataType: string;
    public referencedOff: string;
    public category: string;
    public sectionEnabler: boolean;
    public immutable: boolean;
    public name: string;
    public description: string;
    public order: number;
}

export class UserPreference {
    public typeId: string;
    public userId: string;
    public preferredTime: Date;
    public value: string;
}