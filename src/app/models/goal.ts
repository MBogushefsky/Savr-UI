export class Goal {
    public Id: string;
    public typeId: string;
    public name: string;
    public values: { [name: string]: any }
}

export class GoalType {
    public Id: string;
    public name: string;
}