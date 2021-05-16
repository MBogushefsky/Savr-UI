import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Globals } from './globals';
import { User } from './models/user';
import { TokenCheckService } from './services/token-check.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  public tokenCheck;
  public appLoading: boolean = true;

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home', comingSoon: false, section: 0 },
    { title: 'Funds', url: '/funds', icon: 'cash', comingSoon: false, section: 0 },
    { title: 'Expenses', url: '/expenses', icon: 'restaurant', comingSoon: false, section: 0 },
    { title: 'Investments', url: '/investments', icon: 'trending-up', comingSoon: true, section: 0 },
    { title: 'Plan An Event', url: '/event-planning', icon: 'wine', comingSoon: true, section: 0 },    
    { title: 'Smart-Shopping', url: '/shopping', icon: 'card', comingSoon: true, section: 0 },    
    { title: 'Deals', url: '/deals', icon: 'pricetag', comingSoon: true, section: 0 },    
    { title: 'Settings', url: '/settings', icon: 'settings', section: 1 }
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(public router: Router, private storage: Storage, public globals: Globals, private tokenCheckService: TokenCheckService) {
    this.tokenCheck = setInterval(() => {
      this.storage.get('CurrentUser').then((user) => {
        this.tokenCheckService.checkUserAndRedirect(user);
      });
    }, 2000);
    this.storage.get('CurrentUser').then((user) => {
      this.globals.setCurrentUser(JSON.parse(user));
      this.globals.appLoaded = true;
    });
  }

  ngOnInit() {
  }

  onLogout() {
    this.storage.remove('CurrentUser').then(
      () => {
        this.globals.setCurrentUser(JSON.parse(null));
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
