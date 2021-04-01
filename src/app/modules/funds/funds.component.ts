import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  PlaidErrorMetadata,
  PlaidErrorObject,
  PlaidEventMetadata,
  PlaidOnEventArgs,
  PlaidOnExitArgs,
  PlaidOnSuccessArgs,
  PlaidSuccessMetadata,
  PlaidConfig,
  NgxPlaidLinkService,
  PlaidLinkHandler
} from "ngx-plaid-link";
import { Globals } from 'src/app/globals';
import { PlaidAccountModalComponent } from 'src/app/modals/plaid-account-modal/plaid-account-modal.component';
import { PlaidAccount, PlaidTransaction } from 'src/app/models/plaid';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-funds',
  templateUrl: './funds.component.html',
  styleUrls: ['./funds.component.scss'],
})
export class FundsComponent implements OnInit, AfterViewInit {
  
  public plaidInstitutions: { [id: string]: PlaidAccount[] } = {};
  public plaidInstitutionSums: { [id: string]: number } = {};
  public plaidTransactionsDict: { [id: string]: PlaidTransaction[] } = {};

  constructor(private globals: Globals, 
    private restApiService: RestApiService,
    private foundationService: FoundationService,
    private modalController: ModalController) { 

  }

  ngOnInit() {
    this.restApiService.getAccounts().subscribe(
      (returnedAccounts: PlaidAccount[]) => {
        this.foundationService.randomDataValuesIfPresentationMode('PlaidAccount', returnedAccounts);
        returnedAccounts.forEach(
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
    );
  }

  getPreferredNameOfSubType(subType: string) {
    if (subType === 'checking') { return 'Checking'; }
    if (subType === 'savings') { return 'Savings'; }
    if (subType === 'credit card') { return 'Credit Card'; }
  }

  ngAfterViewInit() {
  }

  async presentPlaidAccountModal(account: PlaidAccount) {
    const modal = await this.modalController.create({
      component: PlaidAccountModalComponent,
      componentProps: { plaidAccount: account },
      cssClass: 'modal-container',
      swipeToClose: true
    });
    return await modal.present();
  }

}
