import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class TokenCheckService {

  constructor(private globals: Globals, private router: Router) { }

  checkUserAndRedirect(user: string) {
    if (user == null) {
      this.globals.setCurrentUser(null);
      if (this.router.url !== '/login' && this.router.url !== '/sign-up') {
        this.router.navigate(['/login']);
      }
    }
    else {
      this.globals.setCurrentUser(JSON.parse(user));
      if (this.router.url === 'login') {
        this.router.navigate(['/home'])
      }
    }
  }
}