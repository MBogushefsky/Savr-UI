import { ValidatorFn } from "@angular/forms";

export class Field {
    public id: string;
    public name: string;
    public type: string;
    public initialValue: any;
    public validators: ValidatorFn[];
}