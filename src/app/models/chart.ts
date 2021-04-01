export class ActiveCharts {
    public spots: { [spot: string]: ShowingChart }
}

export class ShowingChart {
    public type: AvailableCharts;
    public properties?: any;
    public previous?: AvailableCharts;
}

export enum AvailableCharts {
    SpendingByCategory,
    SingleCategorySpending
};