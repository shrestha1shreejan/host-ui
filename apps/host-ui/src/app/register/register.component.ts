import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AccountService } from "./../_services/account.service";
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, Validators, FormBuilder } from "@angular/forms";
import { HelperService } from '../_services/helper.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
	@Input() usersFromHome: any;
	@Output() cancelRegister = new EventEmitter();

	registerForm: FormGroup;
	maxDate: Date;
	validationErrors: string[] = [];

	constructor(private accountService: AccountService, private toastr: ToastrService, public helperService: HelperService, 
		private fb: FormBuilder, private router: Router) { }

	ngOnInit(): void {
		this.initializeForm();
		this.maxDate = new Date();
		this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
	}



	passwordMatch(password: string, confirmPassword: string) {
		return (formGroup: AbstractControl): ValidationErrors | null => {
			const passwordControl = formGroup.get(password);
			const confirmPasswordControl = formGroup.get(confirmPassword);

			if (!passwordControl || !confirmPasswordControl) {
				return null;
			}

			if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
				return null;
			}

			if (passwordControl.value !== confirmPasswordControl.value) {
				confirmPasswordControl.setErrors({ passwordMismatch: true });
				return { passwordMismatch: true };
			} else {
				confirmPasswordControl.setErrors(null);
				return null;
			}
		};
	}

	initializeForm() {
		this.registerForm = this.fb.group({
			gender: ['male'],
			username: ['', Validators.required],
			knownAs: ['', Validators.required],
			dateOfBirth: ['', Validators.required],
			city: ['', Validators.required],
			country: ['', Validators.required],			
			password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
			confirmPassword: ['', [Validators.required]]
		},
			{ validators: this.passwordMatch('password', 'confirmPassword') }
		)

		// this.registerForm = new FormGroup({
		// 	username: new FormControl('', Validators.required),
		// 	password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
		// 	confirmPassword: new FormControl('', [Validators.required])
		// },
		// 	{ validators: this.passwordMatch('password', 'confirmPassword') }
		// )

		// this.registerForm.controls['password'].valueChanges.subscribe(() => {
		// 	this.registerForm.controls['confirmPassword'].updateValueAndValidity();
		// })
	}


	register() {		
		this.accountService.register(this.registerForm.value).subscribe({
			next: (response) => {
				this,this.router.navigateByUrl('/members');
			},
			error: (error) =>{ 
				console.log(error);		
				this.validationErrors = error;		
			}
		});		
	}

	cancel() {
		console.log('cancelled');
		this.cancelRegister.emit(false);
	}
}
