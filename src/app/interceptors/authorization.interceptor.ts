import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Globals } from "../globals";


@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

    constructor(private globals: Globals) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.globals.currentUser != null) {
            const authReq = req.clone({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': this.globals.currentUser.id
                })
            });
            return next.handle(authReq);
        }
        return next.handle(req);
    }
    
}