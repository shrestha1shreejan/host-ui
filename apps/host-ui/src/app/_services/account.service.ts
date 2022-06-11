import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';

@Injectable({
		providedIn: 'root'
})
export class AccountService {
		baseUrl = environment.apiUrl;
		
		/// using ReplaySubject to store current user value and replay the old value to the subscriber
		private currentUserSource = new ReplaySubject<User | null>(1);
		currentUser$ = this.currentUserSource.asObservable();

		constructor(private httpClient: HttpClient) { }

		login(model: any) {
				return this.httpClient.post<User>(this.baseUrl + 'Account/login', model).pipe(
						map((response: User) => {
								const user = response;
								if (user) {
										localStorage.setItem('user', JSON.stringify(user));
										this.currentUserSource.next(user);
								}
						})
				);
		}

		register(model: any){
			return this.httpClient.post<User>(this.baseUrl + 'Account/register' , model).pipe(
				map((response: User) => {
					const user = response;
					if(user){
						localStorage.setItem('user', JSON.stringify(user));
						this.currentUserSource.next(user);
					}
				})
			);
		}
		
		setCurrentUser(user: User){
			this.currentUserSource.next(user);
		}

		logout(){
			localStorage.removeItem('user');
			this.currentUserSource.next(null);
		}

}
