import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Globals } from 'src/app/globals';
import { PlaidAccount, PlaidTransaction } from 'src/app/models/plaid';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-funds',
  templateUrl: './funds.component.html',
  styleUrls: ['./funds.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundsComponent implements OnInit, AfterViewInit {

  constructor(private globals: Globals, 
    private restApiService: RestApiService,
    private foundationService: FoundationService) { 
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
  }

  /*async presentPlaidAccountModal(account: PlaidAccount) {
    const modal = await this.modalController.create({
      component: PlaidAccountModalComponent,
      componentProps: { plaidAccount: account },
      cssClass: 'modal-container',
      swipeToClose: true
    });
    return await modal.present();
  }*/

}
