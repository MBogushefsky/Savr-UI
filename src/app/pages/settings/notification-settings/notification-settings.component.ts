import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/globals';
import { UserPreference, UserPreferenceType } from 'src/app/models/user-preference';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
})
export class NotificationSettingsComponent implements OnInit {

  userPreferenceValues: { [id: string]: string } = {};

  availableUserPreferenceTypes: UserPreferenceType[] = [];
  availableTextAlerts: UserPreferenceType[] = [];
  availableEmailAlerts: UserPreferenceType[] = [];

  constructor(private globals: Globals,
    private restApiService: RestApiService) { }

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
            this.availableTextAlerts = this.availableUserPreferenceTypes.filter((type) => type.medium === 'Text');
            this.availableEmailAlerts = this.availableUserPreferenceTypes.filter((type) => type.medium === 'Email');
          }
        );
      }
    );
  }

  alertChanged(event: any, typeId: string) {
    this.userPreferenceValues[typeId] = event.target.checked;
  }

  saveAlertPreferences() {
    let allAvailableUserPreferenceTypes = [
      ...this.availableTextAlerts,
      ...this.availableEmailAlerts,
    ];
    let preferencesToUpdate: UserPreference[] = [];
    for (let key in this.userPreferenceValues) {
      let foundUpdatedPreference = allAvailableUserPreferenceTypes.filter((type) => type.id === key);
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
}
