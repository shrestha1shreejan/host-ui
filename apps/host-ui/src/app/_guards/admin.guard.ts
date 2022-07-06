import { ToastrService } from "ngx-toastr";
import { AccountService } from "./../_services/account.service";
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class AdminGuard implements CanActivate {

	constructor(private accountService: AccountService,  private tostr: ToastrService) {}

	canActivate(): Observable<boolean> {
	return this.accountService.currentUser$.pipe(
		map(user => {
			if ( user!==null && (user.roles.includes('Admin') || user?.roles.includes('Moderator'))) {
				return true;
			}
			this.tostr.error('You cannot access this area');
			return false;
		})
	);
	}
	
}
