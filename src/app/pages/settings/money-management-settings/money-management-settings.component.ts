import { Component, OnInit } from '@angular/core';
import { NgxPlaidLinkService, PlaidConfig, PlaidLinkHandler } from 'ngx-plaid-link';
import { Globals } from 'src/app/globals';
import { PlaidAccount, PlaidInstitution } from 'src/app/models/plaid';
import { UserPreference, UserPreferenceType } from 'src/app/models/user-preference';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-money-management-settings',
  templateUrl: './money-management-settings.component.html',
  styleUrls: ['./money-management-settings.component.scss'],
})
export class MoneyManagementSettingsComponent implements OnInit {

  private plaidLinkHandler: PlaidLinkHandler;
  private plaidConfig: PlaidConfig = {
    apiVersion: "v2",
    env: "development",
    selectAccount: false,
    token: null,
    product: ["auth"],
    countryCodes: ['US', 'CA', 'GB'],
    key: "ce84441114a95a4795f66b9bddb36f",
    onSuccess: this.onPlaidSuccess,
    onExit: this.onPlaidExit
  };

  public plaidLinkedInstitutions: PlaidInstitution[] = [];
  public plaidBankAccounts: PlaidAccount[];

  userPreferenceValues: { [id: string]: any } = {};

  availableUserPreferenceTypes: UserPreferenceType[] = [];

  savingsGoalCategory: string = 'Savings Goal';
  availableSavingsGoals: UserPreferenceType[];

  debtPayoffGoalCategory: string = 'Debt Payoff Goal';
  availableDebtPayoffGoals: UserPreferenceType[];

  categoryBudgetGoalCategory: string = 'Category Budget Goal';
  availableCategoryBudgetGoals: UserPreferenceType[];

  dropdownOptions: { [id: string]: any[] } = {};

  goalScope: string = 'Savings';

  constructor(private globals: Globals,
    private restApiService: RestApiService, 
    private foundationService: FoundationService,
    private plaidLinkService: NgxPlaidLinkService) { }

  ngOnInit() {
    this.restApiService.getAccounts().subscribe(
      (returnedAccounts: PlaidAccount[]) => {
        this.foundationService.randomDataValuesIfPresentationMode('PlaidAccount', returnedAccounts);
        this.plaidBankAccounts = returnedAccounts;
        this.plaidLinkedInstitutions = [];
        for (let account of returnedAccounts) {
          let foundPlaidInstitution: PlaidInstitution = this.plaidLinkedInstitutions.find((institution) => institution.institutionId === account.institutionId);
          if (foundPlaidInstitution == null) {
            this.plaidLinkedInstitutions.push(
              {
                institutionId: account.institutionId,
                accounts: [account]
              }
            );
          }
          else {
            foundPlaidInstitution.accounts.push(account);
          }
        }
        this.restApiService.getAllUserPreferenceTypes().subscribe(
          (resultUserPreferenceTypes: UserPreferenceType[]) => {
            this.availableUserPreferenceTypes = resultUserPreferenceTypes.sort((type1, type2) => {
              if (type1.order < type2.order) {
                return -1;
              }
              else if (type1.order > type2.order) {
                return 1;
              }
              else {
                return 0;
              }
            });
            this.restApiService.getAllUserPreferences().subscribe(
              (resultUserPreferences: UserPreference[]) => {
                this.availableUserPreferenceTypes.forEach(
                  (userPreferenceType) => {
                    let foundUserPreferenceForType = resultUserPreferences.filter((userPreference) => userPreference.typeId === userPreferenceType.id);
                    if (foundUserPreferenceForType.length == 1) {
                      let valueToSet: any = foundUserPreferenceForType[0].value;
                      if (userPreferenceType.dataType == 'currency') {
                        valueToSet = Number(valueToSet);
                      }
                      else if (userPreferenceType.dataType == 'date') {
                        valueToSet = new Date(valueToSet);
                      }
                      else if (userPreferenceType.dataType == 'boolean') {
                        valueToSet = valueToSet === 'true';
                      }
                      this.userPreferenceValues[userPreferenceType.id] = valueToSet;
                    }
                    else {
                      this.userPreferenceValues[userPreferenceType.id] = null;
                    }
                  }
                );
                this.availableSavingsGoals = this.availableUserPreferenceTypes.filter((type) => type.category === this.savingsGoalCategory);
                this.availableDebtPayoffGoals = this.availableUserPreferenceTypes.filter((type) => type.category === this.debtPayoffGoalCategory);
                this.availableCategoryBudgetGoals = this.availableUserPreferenceTypes.filter((type) => type.category === this.categoryBudgetGoalCategory);
              }
            );
          }
        );
      }
    );
  }

  saveUserPreferences(category: string) {
    let userPreferenceTypesToGet;
    if (category == this.savingsGoalCategory) {
      userPreferenceTypesToGet = this.availableSavingsGoals;
    }
    else if (category == this.debtPayoffGoalCategory) {
      userPreferenceTypesToGet = this.availableDebtPayoffGoals;
    }
    else if (category == this.categoryBudgetGoalCategory) {
      userPreferenceTypesToGet = this.availableCategoryBudgetGoals;
    }
    let preferencesToUpdate: UserPreference[] = [];
    for (let key in this.userPreferenceValues) {
      let foundUpdatedPreference = userPreferenceTypesToGet.filter((type) => type.id === key);
      if (foundUpdatedPreference.length !== 0) {
        preferencesToUpdate.push(
          {
            typeId: key,
            preferredTime: null,
            userId: this.globals.getCurrentUser().id,
            value: this.userPreferenceValues[key]
          }
        );
      }
    }
    this.restApiService.changeAllUserPreferences(preferencesToUpdate).subscribe(
      (resultUserPreferences: boolean) => {
      }
    );
  }

  onScopeChange(scope: string, event?: any) {
    if (scope == null && event != null) {
      scope = event.detail.value;
    }
    this.goalScope = scope;
  }

  getPreferredNameOfSubType(subType: string) {
    if (subType === 'checking') { return 'Checking'; }
    if (subType === 'savings') { return 'Savings'; }
    if (subType === 'credit card') { return 'Credit Card'; }
  }

  onPlaidSuccess(token: any, metadata: any) {
    this.restApiService.savePlaidToken(token).subscribe(
      (returned: void) => {
        console.log("SUCCESS SAVED");
      }
    );
    console.log("SUCCESS", token);
  }

  onPlaidExit(error: any, metadata: any) {
    console.log("EXIT", error);
  }

  onPlaidLoad(event: any) {
    console.log("LOAD", event);
  }

  onPlaidEvent(event: any, metadata: any) {
    console.log("EVENT", event);
  }

  onPlaidClick() {
    this.plaidLinkService
      .createPlaid(
        Object.assign({}, this.plaidConfig, {
          onSuccess: (token, metadata) => this.onPlaidSuccess(token, metadata),
          onExit: (error, metadata) => this.onPlaidExit(error, metadata),
          onEvent: (eventName, metadata) => this.onPlaidEvent(eventName, metadata)
        })
      )
      .then((handler: PlaidLinkHandler) => {
        this.plaidLinkHandler = handler;
        this.plaidLinkHandler.open();
      });
  }

}
