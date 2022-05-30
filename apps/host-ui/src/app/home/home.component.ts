import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
	users: any;
	registerMode = false;

	constructor(private http: HttpClient) { }

	ngOnInit(): void {
		this.getAllUser();
	 }

	registerToggle() {
		this.registerMode = !this.registerMode;
	}

	getAllUser() {
		const url = 'https://localhost:7234/api/Users';
		return this.http.get(url).subscribe({
			next: (response) => this.users = response,
			error: (error) => console.log(error)
		});
	}

	cancelRegistrationMode(event: boolean) {
		this.registerMode = event;
	}
}
