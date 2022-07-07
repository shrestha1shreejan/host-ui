import { PresenceService } from "./_services/presence.service";
import { AccountService } from "./_services/account.service";
import { Component, OnInit } from "@angular/core";
import { User } from './_models/user';

@Component({
	selector: 'host-ui-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	title = 'host-ui';
	users: any;
	constructor(private accountService: AccountService, private presence: PresenceService) {

	}
	ngOnInit() {	
		this.setCurrentUser();
	}
	
	setCurrentUser(){
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const user: User = JSON.parse(localStorage.getItem('user')!);
		if (user) {
			this.accountService.setCurrentUser(user);
			this.presence.createHubConnection(user);
		}
		
	}

	

}
