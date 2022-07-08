import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject, take } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class PresenceService {
	hubUrl = environment.hubUrl;
	private hubConnection: HubConnection;

	private onlineUserSource = new BehaviorSubject<string[]>([]);
	onlineUsers$ = this.onlineUserSource.asObservable();

	constructor(private tostr: ToastrService, private router: Router) { }

	// creating hub connection (should be called usually when application starts and user logs in or registers)
	createHubConnection(user: User) {
		// creating hub connection and adding the access token as well as automatic reconnect feture
		this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + 'presence',  {
			accessTokenFactory: () => user.token
		})
		.withAutomaticReconnect()
		.build();

		// start the connection 
		this.hubConnection.start()
			.catch(error => console.log(error));

		// the method name eg UserIsOnline should exactly match with that in server	
		this.hubConnection.on('UserIsOnline', username => {
			// this.tostr.info(username + ' has connected' );
			this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
				this.onlineUserSource.next([...usernames, username]);
			})
		});

		this.hubConnection.on('UserIsOffline', username => {
			this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
				this.onlineUserSource.next([...usernames.filter(x =>x !== username)]);
			})
		});

		this.hubConnection.on('GetOnlineUsers', (usernames: string[])=> {
			this.onlineUserSource.next(usernames); /// sending event to the behavior subject
		});

		this.hubConnection.on('NewMessageReceived', ({username, knownAs})=> {
			this.tostr.info(knownAs + ' has sent you a new message !!')
			.onTap
			.pipe(take(1))
			.subscribe(() => this.router.navigateByUrl('/members/' + username + '?tab=3')) 
		})
	}

	// method to stop hubConnection (should be called during logout)
	stopHubConnection() {
		this.hubConnection.stop()
			.catch(error => console.log(error));
	}
}
