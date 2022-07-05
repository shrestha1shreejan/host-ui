import { environment } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_models/message';

@Injectable({
	providedIn: 'root'
})
export class MessageService {
	baseUrl = environment.apiUrl;
	constructor(private http: HttpClient) {}

	getMessages(pageNumber: number, pageSize: number, container: string) {
		let params = getPaginationHeaders(pageNumber, pageSize);
		params = params.append('Container', container);
		return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
	}

	getMessageThread(username: string) {
		return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
	}

	sendMessage(username: string, content: string) {
		const  body = {
			recipientUsername: username,
			content
		};
		return this.http.post<Message>(this.baseUrl + 'messages', body);
	}

	deleteMessage(id: number) {
		return this.http.delete(this.baseUrl + 'messages/'+id);
	}
}
