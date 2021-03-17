import { Storage } from '@ionic/storage';
import { User } from './models/user';

export class Globals {
  public currentUser: User;
  public currentUserData: { [key: string]: any }; 
}
