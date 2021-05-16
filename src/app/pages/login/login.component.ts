import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Globals } from 'src/app/globals';
import { User } from 'src/app/models/user';
import { FoundationService } from 'src/app/services/foundation.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = "";
  password: string = "";

  constructor(private restApiService: RestApiService, 
    private storage: Storage, 
    private router: Router,
    private globals: Globals,
    private encryptionService: EncryptionService,
    private foundationService: FoundationService) { }

  ngOnInit() {}

  onUsernameChange(event: any) {
    this.username = event.target.value;
  }

  onPasswordChange(event: any) {
    this.password = event.target.value;
  }

  onLogin() {
    this.restApiService.login(this.username, this.encryptionService.encrypt(this.password)).subscribe(
      (returnedUser: User) => {
        this.storage.set("CurrentUser", JSON.stringify(returnedUser));
        this.globals.setCurrentUser(returnedUser);
        this.router.navigate(['/home']);
      },
      (error: HttpErrorResponse) => {
        if (error.status == 404) {
          this.foundationService.presentBasicAlert("Invalid Login", "Could not find an account with these credentials");
        }
        else {
          this.foundationService.presentBasicAlert("Something went wrong", "Please try again later");
        }
      }
    );
  }
}
