import { PresenceService } from "./presence.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import jwt_decode from 'jwt-decode';

@Injectable({
		providedIn: 'root'
})
export class AccountService {
		baseUrl = environment.apiUrl;
		
		/// using ReplaySubject to store current user value and replay the old value to the subscriber
		private currentUserSource = new ReplaySubject<User | null>(1);
		currentUser$ = this.currentUserSource.asObservable();

		constructor(private httpClient: HttpClient , private presence: PresenceService) { }

		login(model: any) {
				return this.httpClient.post<User>(this.baseUrl + 'Account/login', model).pipe(
						map((response: User) => {
								const user = response;
								if (user) {
									this.setCurrentUser(user);
									this.presence.createHubConnection(user);
								}
						})
				);
		}

		register(model: any){
			return this.httpClient.post<User>(this.baseUrl + 'Account/register' , model).pipe(
				map((response: User) => {
					const user = response;
					if(user){						
						this.setCurrentUser(user);
						this.presence.createHubConnection(user);
					}
				})
			);
		}
		
		setCurrentUser(user: User){
			user.roles = [];
			const roles = this.getDecodedToken(user.token).role;
			// since roles comes as a string (for single role ) or an array of strings
			Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
			localStorage.setItem('user', JSON.stringify(user));
			this.currentUserSource.next(user);
		}

		logout(){
			localStorage.removeItem('user');
			this.currentUserSource.next(null);
			this.presence.stopHubConnection();
		}

		getDecodedToken(token: string) {				
			//const decodedTokenByBuffer = global.Buffer.from(token.split('.')[1], 'utf8').toString('base64');
			//const decodedTokenByAtob = jwt_decode(token);
			//console.log(decodedTokenByBuffer);
			//console.log(decodedTokenByAtob);
			// console.log();
			return JSON.parse(atob(token.split('.')[1]));
			//return jwt_decode(token)
		}

}
