import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/globals';
import { User } from 'src/app/models/user';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Storage } from '@ionic/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit {

  profileSettings = Object.assign(this.globals.getCurrentUser(), {});

  fieldControls: Field[];

  profileSettingsFormGroup: FormGroup;

  constructor(public globals: Globals, 
    private restApiService: RestApiService, 
    private foundationService: FoundationService,
    private storage: Storage) { 
      this.fieldControls = [
        { 
          id: 'firstName', 
          name: 'First Name', 
          type: 'text', 
          initialValue: this.profileSettings.firstName, 
          validators: [Validators.required]
        },
        { 
          id: 'lastName', 
          name: 'Last Name', 
          type: 'text', 
          initialValue: this.profileSettings.lastName, 
          validators: [Validators.required]
        },
        { 
          id: 'email', 
          name: 'Email', 
          type: 'email', 
          initialValue: this.profileSettings.email, 
          validators: [Validators.required, Validators.email]
        },
        { 
          id: 'phoneNumber', 
          name: 'Phone Number', 
          type: 'phone', 
          initialValue: this.profileSettings.phoneNumber, 
          validators: [Validators.required, Validators.minLength(17), Validators.maxLength(17)]
        }
      ];
  }

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
