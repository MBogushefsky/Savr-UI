import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Globals } from './globals';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public tokenCheck;
  public appLoading: boolean = true;

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(public router: Router, private storage: Storage, public globals: Globals) {
    this.tokenCheck = setInterval(() => {
      this.storage.get('CurrentUser').then((user) => {
        this.checkUserAndRedirect(user);
      });
    }, 2000);
    this.storage.get('CurrentUser').then((user) => {
      this.checkUserAndRedirect(user);
      this.appLoading = false;
      this.router.navigate(['/home']);
    });
  }

  ngOnInit() {
  }

  checkUserAndRedirect(user: string) {
    if (user == null) {
      this.globals.currentUser = null;
      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    }
    else {
      this.globals.currentUser = JSON.parse(user);
      if (this.router.url === 'login') {
        this.router.navigate(['/home'])
      }
    }
  }

  onLogout() {
    this.storage.remove('CurrentUser').then(
      () => {
        this.globals.currentUser = null;
        this.router.navigate(['/login']);
      }
    )
  }

  ngOnDestroy() {
    if (this.tokenCheck) {
      clearInterval(this.tokenCheck);
    }
  }
}
