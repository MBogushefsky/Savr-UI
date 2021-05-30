import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MenuItem, MessageService } from 'primeng/api';
import { Goal, GoalType } from 'src/app/models/goal';
import { PlaidAccount } from 'src/app/models/plaid';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-financial-goal-wizard-modal',
  templateUrl: './financial-goal-wizard-modal.component.html',
  styleUrls: ['./financial-goal-wizard-modal.component.scss'],
})
export class FinancialGoalWizardModalComponent implements OnInit {
  @Input('goalId') goalId: string;

  edittingGoal: Goal;

  currentPageIndex: number = 0;
  previousPageIndexes = [];
  isNextComplete: boolean = false;
  previousPageIsNextComplete = [];
  isLoading: boolean = false;
  pageFormGroups = [
    new FormGroup({
      goalType: new FormControl('', Validators.required)
    }),
    new FormGroup({
      timeframe: new FormControl('1 Month'),
      category: new FormControl(''),
      budget: new FormControl(0)
    }),
    new FormGroup({
      account: new FormControl(''),
      amount: new FormControl(''),
      startDate: new FormControl(new Date()),
      endDate: new FormControl(''),
    })
  ];

  stepMenu: MenuItem[] = [
    {label: 'Goal Type'},
    {label: 'Goal Requirements'},
    {label: 'Name of Goal'}
  ];
  activeStep: number = 0;

  finalPageFormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  currentDate: Date = new Date();
  calendarYearRange: string = this.currentDate.getFullYear() + ':2100';

  goalTypes: GoalType[];
  goalToType: { [id: string]: string } = {};
  bankAccounts: PlaidAccount[];

  availableBudgetTimeframes = ['1 Week', '2 Weeks', '1 Month', '2 Months', '3 Months'];
  availableBudgetCategories = [];

  availableSavingsBankAccounts: any[];

  constructor(private modalController: ModalController, 
    private restApiService: RestApiService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.isLoading = true;
    this.restApiService.getGoalTypes().subscribe(
      (returnedData: GoalType[]) => {
        this.goalTypes = returnedData;
        for (let goalType of this.goalTypes) {
          this.goalToType[goalType.Id] = goalType.name;
        }
        this.restApiService.getAccounts().subscribe(
          (accounts: PlaidAccount[]) => {
            this.bankAccounts = accounts;
            if (this.goalId != null) {
              this.restApiService.getGoalById(this.goalId).subscribe(
                (returnedGoal: Goal) => {
                  this.edittingGoal = returnedGoal;
                  let goalTypeName = this.goalToType[this.edittingGoal.typeId];
                  this.pageFormGroups[0].get('goalType').patchValue(goalTypeName);
                  this.finalPageFormGroup.get('name').patchValue(this.edittingGoal.name);
                  if (goalTypeName == 'Category Budget') {
                    this.pageFormGroups[1].patchValue(this.edittingGoal.values);
                  }
                  else if (goalTypeName == 'Savings') {
                    this.pageFormGroups[2].patchValue(this.edittingGoal.values);
                  }
                  else if (goalTypeName == 'Debt Payoff') {
    
                  }
                  this.onNextPage(false);
                  this.isLoading = false;
                }
              );
            }
            else {
              this.isLoading = false;
            }
          }
        );
      }
    );
  }

  onTileClick(value: string) {
    this.pageFormGroups[this.currentPageIndex].get('goalType').patchValue(value);
  }

  onPreviousPage() {
    this.currentPageIndex = this.previousPageIndexes[this.previousPageIndexes.length - 1];
    this.previousPageIndexes.splice(this.previousPageIndexes.length - 1, 1);
    this.isNextComplete = this.previousPageIsNextComplete[this.previousPageIsNextComplete.length - 1];
    this.previousPageIsNextComplete.splice(this.previousPageIsNextComplete.length - 1, 1);
    this.getActiveStep();
  }

  onNextPage(breadcrumb: boolean) {
    if (this.currentPageIndex != 999 && this.pageFormGroups[this.currentPageIndex].valid) {
      if (breadcrumb == true) {
        this.previousPageIndexes.push(this.currentPageIndex);
        this.previousPageIsNextComplete.push(this.isNextComplete);
      }
      if (this.currentPageIndex == 0) {
        let goalType = this.pageFormGroups[this.currentPageIndex].get('goalType').value;
        if (goalType == 'Category Budget') {
          this.currentPageIndex = 1;
          this.isLoading = true;
          this.timeFrameChanged();
        }
        else if (goalType == 'Savings') {
          this.currentPageIndex = 2;
          this.availableSavingsBankAccounts = this.bankAccounts.map(
            (account: PlaidAccount) => { 
              let accountType = this.getPreferredNameOfSubType(account.subType);
              return {
                label: account.name + " (" + accountType + ")",
                type: account.subType,
                value: account.accountId
              };
            }
          );
          let savingsAccount = this.availableSavingsBankAccounts.find((account) => account.type == 'savings');
          if (savingsAccount != null) {
            this.pageFormGroups[this.currentPageIndex].get('account').patchValue(savingsAccount.value);
          }
        }
        else if (goalType == 'Debt Payoff') {
          this.currentPageIndex = 999;
        }
      }
      else if (this.currentPageIndex == 1 || this.currentPageIndex == 2) {
        this.currentPageIndex = 999;
        this.isNextComplete = true;
      }
    }
    else {
      this.messageService.add({severity:'error', summary:'Invalid Form'});
    }
    this.getActiveStep();
  }

  onComplete() {
    if (this.currentPageIndex == 999 && this.finalPageFormGroup.valid) {
      let goalType = this.pageFormGroups[0].get('goalType').value;
      let goalName = this.finalPageFormGroup.get('name').value;
      let goalToSave: Goal;
      if (goalType == 'Category Budget') {
        let pageFieldValues = this.pageFormGroups[1].value;
        goalToSave = {
          Id: null,
          typeId: this.goalTypes.find((type) => type.name == 'Category Budget').Id,
          name: goalName,
          values: {
            timeframe: pageFieldValues.timeframe,
            category: pageFieldValues.category,
            budget: pageFieldValues.budget,
            startDate: (new Date()).toISOString(),
          }
        };
        
      }
      else if (goalType == 'Savings') {
        let pageFieldValues = this.pageFormGroups[2].value;
        goalToSave = {
          Id: null,
          typeId: this.goalTypes.find((type) => type.name == 'Savings').Id,
          name: goalName,
          values: {
            account: pageFieldValues.account,
            amount: pageFieldValues.amount,
            startDate: pageFieldValues.startDate,
            endDate: pageFieldValues.endDate,
          }
        };
      }
      else if (goalType == 'Debt Payoff') {
  
      }
      if (this.goalId == null) {
        this.restApiService.addGoal(goalToSave).subscribe(
          (returnedData: void) => {
            this.closeModal();
          }
        );
      }
      else {
        this.restApiService.editGoal(this.goalId, goalToSave).subscribe(
          (returnedData: void) => {
            this.closeModal();
          }
        );
      }
    }
    else {
      this.messageService.add({severity:'error', summary:'Invalid Form'});
    }
  }

  getPreferredNameOfSubType(subType: string) {
    if (subType === 'checking') { return 'Checking'; }
    if (subType === 'savings') { return 'Savings'; }
    if (subType === 'credit card') { return 'Credit Card'; }
  }

  timeFrameChanged() {
    let timeframe = this.pageFormGroups[this.currentPageIndex].get('timeframe').value;
    let startDate = new Date();
    if (timeframe == '1 Week') {
      startDate.setDate(startDate.getDate() - 7);
    }
    else if (timeframe == '2 Weeks') {
      startDate.setDate(startDate.getDate() - 14);
    }
    else if (timeframe == '1 Month') {
      startDate.setMonth(startDate.getMonth() - 1);
    }
    else if (timeframe == '2 Months') {
      startDate.setMonth(startDate.getMonth() - 2);
    }
    else if (timeframe == '3 Months') {
      startDate.setMonth(startDate.getMonth() - 3);
    }
    let accountIds = this.bankAccounts.map((account) => account.accountId);
    this.restApiService.getCategoriesWithNetAmount(accountIds, startDate, new Date()).subscribe(
      (returnedData: any) => {
        let categoriesWithNetSpending = [];
        for (let key in returnedData) {
          let currencyAmount = Number(returnedData[key]);
          if (currencyAmount < 0) {
            let labelAmount = Math.abs(Number(returnedData[key])).toFixed(2);
            let label = key + " ($" + labelAmount + " spent in " + timeframe.toLowerCase() + ")";
            categoriesWithNetSpending.push({
              label: label,
              amount: currencyAmount,
              value: key
            });
          }
        }
        this.availableBudgetCategories = categoriesWithNetSpending.sort((a, b) => {
          if(a.amount < b.amount) { return -1; }
          if(a.amount > b.amount) { return 1; }
          return 0;
        });
        this.isLoading = false;
      }
    );
  }

  getActiveStep() {
    if (this.currentPageIndex == 0) {
      this.activeStep = 0;
    }
    else if (this.currentPageIndex == 1 || this.currentPageIndex == 2) {
      this.activeStep = 1;
    }
    else if (this.currentPageIndex == 999) {
      this.activeStep = 2;
    }
    else {
      this.activeStep = 0;
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
