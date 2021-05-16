import { Component, Input, OnInit } from '@angular/core';
import { Globals } from 'src/app/globals';
import { PlaidAccount, PlaidTransaction } from 'src/app/models/plaid';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-bank-institutions-view',
  templateUrl: './bank-institutions-view.component.html',
  styleUrls: ['./bank-institutions-view.component.scss'],
})
export class BankInstitutionsViewComponent implements OnInit {
  @Input("accounts") accounts: PlaidAccount[];

  public plaidInstitutions: { [id: string]: PlaidAccount[] } = {};
  public plaidInstitutionSums: { [id: string]: number } = {};
  public plaidTransactionsDict: { [id: string]: PlaidTransaction[] } = {};

  constructor(private globals: Globals, 
    private restApiService: RestApiService,
    private foundationService: FoundationService) { }

  ngOnInit() {
    this.accounts.forEach(
      (account: PlaidAccount) => {
        if (this.plaidInstitutions[account.institutionId] == null) {
          this.plaidInstitutions[account.institutionId] = [];
        }
        if (this.plaidInstitutionSums[account.institutionId] == null) {
          this.plaidInstitutionSums[account.institutionId] = 0;
        }
        this.plaidInstitutions[account.institutionId].push(account);
        this.plaidInstitutionSums[account.institutionId] += account.availableBalance;
      }
    );
  }

  getPreferredNameOfSubType(subType: string) {
    if (subType === 'checking') { return 'Checking'; }
    if (subType === 'savings') { return 'Savings'; }
    if (subType === 'credit card') { return 'Credit Card'; }
  }

}
