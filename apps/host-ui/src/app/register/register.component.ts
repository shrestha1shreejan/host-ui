import { ToastrService } from "ngx-toastr";
import { AccountService } from "./../_services/account.service";
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
	@Input() usersFromHome: any;
	@Output() cancelRegister = new EventEmitter();

	model: any = {}
	constructor(private accountService: AccountService, private toastr: ToastrService) { }

	ngOnInit(): void { }

	register() {
		this.accountService.register(this.model).subscribe({
			next: (response) => {
				console.log(response);
				this.cancel();
			},
			error: (error) =>{ 
				console.log(error)
				this.toastr.error(error)
			}
		});
		console.log(this.model);
	}

	cancel() {
		console.log('cancelled');
		this.cancelRegister.emit(false);
	}
}
