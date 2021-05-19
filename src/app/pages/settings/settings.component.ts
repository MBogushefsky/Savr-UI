import { Component, OnInit } from '@angular/core';
import { NgxPlaidLinkService, PlaidConfig, PlaidLinkHandler } from 'ngx-plaid-link';
import { Globals } from 'src/app/globals';
import { PlaidAccount, PlaidInstitution } from 'src/app/models/plaid';
import { User } from 'src/app/models/user';
import { UserPreference, UserPreferenceType } from 'src/app/models/user-preference';
import { EncryptionService } from 'src/app/services/encryption.service';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settingsScope: string = 'Profile';

  constructor(public globals: Globals) { 
  }

  ngOnInit() {
    
  }

  onScopeChange(scope: string, event?: any) {
    if (scope == null && event != null) {
      scope = event.detail.value;
    }
    this.settingsScope = scope;
  }
  
}
