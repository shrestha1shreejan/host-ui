import { BsModalRef } from "ngx-bootstrap/modal";
import { ConfirmService } from "./../../_services/confirm.service";
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-confirm-dialog',
	templateUrl: './confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
	title: string
	message: string
	btnOktext: string
	btnCancleText: string
	result: boolean;

	constructor(private bsModelRef: BsModalRef) { }

	ngOnInit() {
	}

	confirm() {
		this.result = true;
		this.bsModelRef.hide();
	}

	decline() {
		this.result = false;
		this.bsModelRef.hide();
	}

}
