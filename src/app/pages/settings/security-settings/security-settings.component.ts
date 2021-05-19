import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/globals';
import { User } from 'src/app/models/user';
import { EncryptionService } from 'src/app/services/encryption.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss'],
})
export class SecuritySettingsComponent implements OnInit {

  changePasswordSettings = {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  };

  constructor(private globals: Globals,
    private storage: Storage,
    private encryptionService: EncryptionService,
    private restApiService: RestApiService) { }

  ngOnInit() {}

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
}
