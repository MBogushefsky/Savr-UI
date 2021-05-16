import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Globals } from "../globals";
import { FoundationService } from "../services/foundation.service";
import { tap } from "rxjs/operators";

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

    constructor(private globals: Globals, private foundationService: FoundationService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.foundationService.showLoadingSpinner();
        if (this.globals.getCurrentUser() != null) {
            req = req.clone({
                headers: new HttpHeaders({
                    'Authorization': this.globals.getCurrentUser().id
                })
            });
        }
        return next.handle(req).pipe(tap(
            (event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.foundationService.hideLoadingSpinner();
                }
            },
            (error: HttpErrorResponse) => {
                this.foundationService.hideLoadingSpinner();
                //this.foundationService.presentErrorAlert(error);
            }
        ));
    }
}