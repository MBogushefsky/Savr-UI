import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/globals';
import { User } from 'src/app/models/user';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit {

  profileSettings = Object.assign(this.globals.getCurrentUser(), {});

  constructor(public globals: Globals, 
    private restApiService: RestApiService, 
    private foundationService: FoundationService,
    private storage: Storage) { }

  ngOnInit() {}

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

  saveProfileSettings() {
    this.restApiService.changeProfileSettings(this.profileSettings).subscribe(
      (resultUser: User) => {
        this.storage.set("CurrentUser", JSON.stringify(resultUser));
        this.globals.setCurrentUser(resultUser);
      }
    );
  }
}
