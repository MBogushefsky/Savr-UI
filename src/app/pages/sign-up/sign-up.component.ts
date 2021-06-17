import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { EncryptionService } from 'src/app/services/encryption.service';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {

  isLoading: boolean = false;

  checkingIfInputtedUsernameIsAvailable: boolean = false;
  didCheckIfInputtedUsernameIsAvailable: boolean = false;
  isInputtedUsernameAvailable: boolean = false;

  signUpFormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(36)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(36)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(36)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(36)])
  });

  constructor(private foundationService: FoundationService, 
    private restApiService: RestApiService,
    private encryptionService: EncryptionService,
    private router: Router) {
      this.signUpFormGroup.get('username').valueChanges
            .subscribe(value => {
              this.isInputtedUsernameAvailable = false;
              this.didCheckIfInputtedUsernameIsAvailable = false;
              this.checkingIfInputtedUsernameIsAvailable = false;
              let usernameFormControl = this.signUpFormGroup.get('username');
              if (usernameFormControl.valid) {
                this.checkingIfInputtedUsernameIsAvailable = true;
              }
            });

      this.signUpFormGroup.get('username').valueChanges
            .pipe(debounceTime(600))
            .pipe(distinctUntilChanged())
            .subscribe(value => {
              this.isInputtedUsernameAvailable = false;
              let usernameFormControl = this.signUpFormGroup.get('username');
              if (usernameFormControl.valid) {
                this.checkingIfInputtedUsernameIsAvailable = true;
                this.checkIfUsernameExists(usernameFormControl.value);
              }
            });
  }

  ngOnInit() {}

  checkIfUsernameExists(username: string) {
    this.restApiService.isUsernameAvailable(username).subscribe(
      (returned: boolean) => {
        this.didCheckIfInputtedUsernameIsAvailable = true;
        if (returned) { this.isInputtedUsernameAvailable = true; }
        else { this.signUpFormGroup.get('username').setErrors({ 'not-available': true }) }
        
        this.checkingIfInputtedUsernameIsAvailable = false;
      },
      (error: HttpErrorResponse) => {
        this.isInputtedUsernameAvailable = false;
        this.foundationService.presentBasicAlert("Something went wrong", "Please try again later");
        this.checkingIfInputtedUsernameIsAvailable = true;
      }
    );
  }

  onSignUp() {
    if (this.signUpFormGroup.get('password').value == this.signUpFormGroup.get('confirmPassword').value) {
      /*this.signUpInfo.passwordHash = this.encryptionService.encrypt(this.password);
      this.restApiService.signUp(this.signUpInfo).subscribe(
        (returned: boolean) => {
          this.foundationService.presentBasicAlert("Success!", "Account Created");
          this.router.navigate(['/login']);
        },
        (error: HttpErrorResponse) => {
          this.foundationService.presentBasicAlert("Something went wrong", "Please try again later");
        }
      );*/
    }
    else {
      this.foundationService.presentBasicAlert("Passwords do not match", "");
    }
  }
}
