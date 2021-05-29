import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlaidAccount, PlaidTransaction } from 'src/app/models/plaid';
import { UserPreferenceType } from 'src/app/models/user-preference';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-user-preference-control',
  templateUrl: './user-preference-control.component.html',
  styleUrls: ['./user-preference-control.component.scss'],
})
export class UserPreferenceControlComponent implements OnInit {
  @Input('userPreferenceTypes') userPreferenceTypes: UserPreferenceType[];
  @Input('userPreferenceValues') userPreferenceValues: { [id: string]: any };
  @Input('bankAccounts') bankAccounts: PlaidAccount[] = [];
  @Output('onValueChanged') onValueChanged = new EventEmitter();
  
  currentDate: Date = new Date();
  calendarYearRange: string = this.currentDate.getFullYear() + ':2100';

  bankAccountTransactions: PlaidTransaction[];

  bankAccountTransactionCategories: string[];

  sectionEnablerTypeId: string;
  sectionEnabled: boolean = true;

  constructor(private restApiService: RestApiService,
    private foundationService: FoundationService) { }

  ngOnInit() {
    this.bankAccountTransactionCategories = [
      'Shops',
      'Food and Drink',
      'Recreation',
      'Service'
    ];
    let foundSectionEnabler = this.userPreferenceTypes.find((type) => type.sectionEnabler == true);
    this.sectionEnablerTypeId = foundSectionEnabler.id;
    this.sectionEnabled = this.userPreferenceValues[foundSectionEnabler.id];
    let foundReferenceOff = this.userPreferenceTypes.find((type) => type.referencedOff != null);
    if (foundReferenceOff != null && this.userPreferenceValues[foundReferenceOff.referencedOff] != null) {
      this.getBankAccountTransactions(this.userPreferenceValues[foundReferenceOff.referencedOff]);
    }
  }

  checkboxChanged(event: any, typeId: string) {
    if (typeId == this.sectionEnablerTypeId) {
      this.sectionEnabled = event.checked;
    }
    this.valueChanged(null);
  }

  valueChanged(event: any) {
    if (event != null) {
      this.getBankAccountTransactions(event.value);
    }
    this.onValueChanged.emit(this.userPreferenceValues);
  }

  getBankAccountTransactions(accountId: string) {
    let startDate = new Date();
    let endDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    this.restApiService.getTransactionsByAccountIdsInTimeRangeUngrouped([accountId], startDate, endDate).subscribe(
      (returnedTransactions) => {
        this.foundationService.randomDataValuesIfPresentationMode('PlaidTransaction', returnedTransactions);
        this.bankAccountTransactions = returnedTransactions;
      }
    );
  }

  getOptionsByType() {

  }
}
