import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
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

  profileSettings = Object.assign(this.globals.getCurrentUser(), {});
  changePasswordSettings = {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  };
  userPreferenceValues: { [id: string]: string } = {};

  availableUserPreferenceTypes: UserPreferenceType[] = [];
  availableGeneralAlerts: UserPreferenceType[] = [];
  availableCryptocurrencyAlerts: UserPreferenceType[] = [];

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

  constructor(public globals: Globals, 
    private restApiService: RestApiService, 
    private foundationService: FoundationService,
    private storage: Storage,
    private encryptionService: EncryptionService,
    private plaidLinkService: NgxPlaidLinkService) { 
    }

  ngOnInit() {
    this.restApiService.getAllUserPreferenceTypes().subscribe(
      (resultUserPreferenceTypes: UserPreferenceType[]) => {
        this.restApiService.getAllUserPreferences().subscribe(
          (resultUserPreferences: UserPreference[]) => {
            this.availableUserPreferenceTypes = resultUserPreferenceTypes;
            this.availableUserPreferenceTypes.forEach(
              (userPreferenceType) => {
                let foundUserPreferenceForType = resultUserPreferences.filter((userPreference) => userPreference.typeId === userPreferenceType.id);
                if (foundUserPreferenceForType.length == 1) {
                  this.userPreferenceValues[userPreferenceType.id] = foundUserPreferenceForType[0].value;
                }
                else {
                  this.userPreferenceValues[userPreferenceType.id] = null;
                }
              }
            );
            this.availableGeneralAlerts = this.availableUserPreferenceTypes.filter((type) => type.category === 'General Alert');
            this.availableCryptocurrencyAlerts = this.availableUserPreferenceTypes.filter((type) => type.category === 'Cryptocurrency Alert');
          }
        );
      }
    );
    this.restApiService.getAccounts().subscribe(
      (returnedAccounts: PlaidAccount[]) => {
        this.foundationService.randomDataValuesIfPresentationMode('PlaidAccount', returnedAccounts);
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
      }
    );
  }

  onProfileImageFileChange(event: any) {
    let imageFile = event.target.files[0];
    let formData = new FormData();
    formData.append('file', imageFile);
    this.restApiService.uploadProfileImage(formData).subscribe(
      (returnedUser: User) => {
        this.globals.setCurrentUser(returnedUser);
        this.storage.set("CurrentUser", JSON.stringify(returnedUser));
      }
    );
  }

  alertChanged(event: any, typeId: string) {
    this.userPreferenceValues[typeId] = event.target.checked;
    let preferenceToUpdate: UserPreference = {
      typeId: typeId,
      userId: this.globals.getCurrentUser().id,
      value: this.userPreferenceValues[typeId]
    };
  }

  saveProfileSettings() {
    this.restApiService.changeProfileSettings(this.profileSettings).subscribe(
      (resultUser: User) => {
        this.storage.set("CurrentUser", JSON.stringify(resultUser));
        this.globals.setCurrentUser(resultUser);
      }
    );
  }

  changePassword() {
    this.changePasswordSettings = {
      currentPassword: this.encryptionService.encrypt(this.changePasswordSettings.currentPassword),
      newPassword: this.encryptionService.encrypt(this.changePasswordSettings.newPassword),
      newPasswordConfirm: this.encryptionService.encrypt(this.changePasswordSettings.newPasswordConfirm)
    }
    this.restApiService.changePassword(this.changePasswordSettings).subscribe(
      (resultUser: User) => {
        this.storage.set("CurrentUser", JSON.stringify(resultUser));
        this.globals.setCurrentUser(resultUser);
      }
    );
  }

  saveAlertPreferences() {
    let allAvailableUserPreferenceTypes = [
      ...this.availableGeneralAlerts,
      ...this.availableCryptocurrencyAlerts
    ];
    let preferencesToUpdate: UserPreference[] = [];
    for (let key in this.userPreferenceValues) {
      let foundUpdatedPreference = allAvailableUserPreferenceTypes.filter((type) => type.id === key);
      if (foundUpdatedPreference.length !== 0) {
        preferencesToUpdate.push(
          {
            typeId: key,
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
