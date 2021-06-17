import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Globals } from 'src/app/globals';
import { User } from 'src/app/models/user';
import { FoundationService } from 'src/app/services/foundation.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginFormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  loggingIn: boolean = false;

  constructor(private restApiService: RestApiService, 
    private storage: Storage, 
    private router: Router,
    private globals: Globals,
    private encryptionService: EncryptionService,
    private foundationService: FoundationService) { }

  ngOnInit() {}

  onLogin() {
    if (!this.loginFormGroup.valid) {
      this.foundationService.presentBasicAlert("Please fill in both username and password", "");
      return;
    }
    this.loggingIn = true;
    this.restApiService.login(this.loginFormGroup.get('username').value, 
      this.encryptionService.encrypt(this.loginFormGroup.get('password').value)).subscribe(
      (returnedUser: User) => {
        this.storage.set("CurrentUser", JSON.stringify(returnedUser));
        this.globals.setCurrentUser(returnedUser);
        this.router.navigate(['/home']);
        this.loggingIn = false;
      },
      (error: HttpErrorResponse) => {
        if (error.status == 404) {
          this.foundationService.presentBasicAlert("The given username and password is incorrent", "");
          this.loginFormGroup.get('password').setValue('');
        }
        else {
          this.foundationService.presentBasicAlert("Something went wrong", "Please try again later");
        }
        this.loggingIn = false;
      }
    );
  }
}
