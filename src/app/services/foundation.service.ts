import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Globals } from '../globals';
import { PlaidAccount, PlaidTransaction } from '../models/plaid';

@Injectable({
  providedIn: 'root'
})
export class FoundationService {

    constructor(private globals: Globals, private alertController: AlertController) {}

    async presentErrorAlert(errorResponse: HttpErrorResponse) {
        let errorHeader = errorResponse.error != null ? errorResponse.error.error : errorResponse.error;
        let errorMessage = errorResponse.error != null ? errorResponse.error.message : null;
        const alert = await this.alertController.create({
            header: errorHeader,
            subHeader: errorMessage,
            buttons: ['OK']
        });
        await alert.present();
    }

    randomDataValuesIfPresentationMode(type: string, objects: any[]) {
        if (!environment.presentationMode) {
            return;
        }
        objects.forEach(
            (object: any, index: number) => {
                if (type === 'PlaidAccount') {
                    object.name = "Hidden Back Account " + (index + 1);
                    /*if (object.currentBalance < 0) {
                        object.currentBalance = -9999;
                    }
                    else {
                        object.currentBalance = 9999;
                    }
                    if (object.availableBalance < 0) {
                        object.availableBalance = -9999;
                    }
                    else {
                        object.availableBalance = 9999;
                    }*/
                    object.currentBalance /= 78;                    
                    object.availableBalance /= 78;
                }
                else if (type === 'PlaidTransaction') {
                    object.merchantName = "Hidden Transaction " + (index + 1);
                    object.name = "Hidden Transaction " + (index + 1);
                    /*if (object.amount < 0) {
                        object.amount = -9999;
                    }
                    else {
                        object.amount = 9999;
                    }*/
                    object.amount /= 78;                    
                }
            }
        );
    }

    showLoadingSpinner() {
        setTimeout(() => {
            this.globals.processing = true;
        });
    }

    hideLoadingSpinner() {
        setTimeout(() => {
            this.globals.processing = false;
        });
    }
}