import { Component, Input, OnInit, EventEmitter } from "@angular/core";
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from '../../_models/user';

@Component({
	selector: 'app-roles-modal',
	templateUrl: './roles-modal.component.html',
	styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
	@Input() updateSelectedRoles = new EventEmitter();
	user: User;
	roles: any[];

	constructor(public bsModalRef: BsModalRef) { }

	ngOnInit() {
	}

	updateRoles() {
		this.updateSelectedRoles.emit(this.roles);
		this.bsModalRef.hide();
	}

}
