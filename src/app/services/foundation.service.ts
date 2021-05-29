import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Globals } from '../globals';
import { PlaidAccount, PlaidTransaction } from '../models/plaid';

@Injectable({
  providedIn: 'root'
})
export class FoundationService {

    constructor(private globals: Globals, 
        private alertController: AlertController,
        private messageService: MessageService) {}

    async presentErrorAlert(errorResponse: HttpErrorResponse) {
        let errorHeader = errorResponse.status != null ? errorResponse.status : errorResponse.error;
        let errorMessage = (errorResponse.error != null && errorResponse.error.error != null) ? errorResponse.error.error : null;
        this.presentBasicAlert(errorHeader, errorMessage);
    }

    async presentBasicAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header: header,
            subHeader: message,
            buttons: ['OK']
        });
        await alert.present();
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }
     

    randomDataValuesIfPresentationModeDoubleDimensional(type: string, objects: any[][]) {
        for (let objectArray of objects) {
            this.randomDataValuesIfPresentationMode(type, objectArray);
        }
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