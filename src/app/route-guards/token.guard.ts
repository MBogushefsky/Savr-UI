import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { Globals } from '../globals';
import { TokenCheckService } from '../services/token-check.service';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate {

  constructor(private storage: Storage,
    private globals: Globals,
    private tokenCheckService: TokenCheckService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.globals.getCurrentUser() != null) {
        return true;
      }
      return this.storage.get('CurrentUser').then((user) => {
        this.tokenCheckService.checkUserAndRedirect(user);
        return true;
      });
  }
}
