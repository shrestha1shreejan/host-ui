import { AccountService } from "./../_services/account.service";
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { User } from '../_models/user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User | undefined;
    // take(1) will take 1 iteam and unsubscribe from observable
    // if we are not sure if we need to unsubscribe we can use .pipe(take(1))
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user as User);
    if (currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      })
    }
    
    return next.handle(request);
  }
}
