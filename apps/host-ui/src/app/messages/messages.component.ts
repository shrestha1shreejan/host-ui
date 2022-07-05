import { MessageService } from "./../_services/message.service";
import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
	messages: Message[] = [];
	pageNumber = 1;
	pageSize = 5;
	pagination: Pagination;
	container = 'Unread';
	loading = false;	

	constructor(private messgeService: MessageService) {}

	ngOnInit(): void {
		this.loadMessages();
	}

	loadMessages() {
		this.loading = true;
		this.messgeService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
			next: response => {
				this.messages = response.result;
				this.pagination = response.pagination;
				this.loading = false;
			}
		});
	}

	pageChanged(event: any) {
		if (this.pageNumber !== event.page) {
			this.pageNumber = event.page;
			this.loadMessages();
		}		
	  }

	  deleteMessage(id: number) {
		this.messgeService.deleteMessage(id).subscribe({
			next: () => {
				/// remove the deleted message from the ui
				this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
			}
		})
	  }
}
