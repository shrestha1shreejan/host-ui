import { Group } from "./../_models/group";
import { User } from "./../_models/user";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { environment } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_models/message';
import { BehaviorSubject, take } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class MessageService {
	baseUrl = environment.apiUrl;
	hubUrl = environment.hubUrl;
	private hubConnection: HubConnection;
	private messageThreadSource = new BehaviorSubject<Message[]>([]);
	messageThread$ = this.messageThreadSource.asObservable();

	constructor(private http: HttpClient) { }

	/// signalR operations

	/**
	 * method to start message signalr hub connection
	 * send the message thread as behavior subject on receive
	 * @param user message to start the hub connection for messge
	 * @param otherUsername 
	 */
	createHubConnections(user: User, otherUsername: string) {
		this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + 'message?user=' + otherUsername,  {
			accessTokenFactory: () => user.token
		})
		.withAutomaticReconnect()
		.build();

		this.hubConnection.start().catch(error => console.log(error));

		this.hubConnection.on('ReceiveMessageThread', messages => {
			this.messageThreadSource.next(messages);
		})

		this.hubConnection.on('NewMessage', message => {
			this.messageThread$.pipe(take(1)).subscribe(messages => {
				this.messageThreadSource.next([...messages, message])
			});
		})
		
		// /check the updated group and mark the messages
		/// as read if the user in the group has some messages related to this group
		this.hubConnection.on('UpdatedGroup', (group: Group) => {
			if (group.connections.some(x => x.username === otherUsername)) {
				this.messageThread$.pipe(take(1)).subscribe(messages => {
					messages.forEach(message => {
						if(!message.dateRead) {
							message.dateRead = new Date(Date.now())
						}
					});
					this.messageThreadSource.next([...messages]);
				});
			}
		});
	}

	/**
	 * method to stop signalhub connection for message
	 */
	stopHubConnection() {
		if(this.hubConnection) {
			this.hubConnection.stop()
			.catch(error => console.log(error));
		}		
	}
	///

	getMessages(pageNumber: number, pageSize: number, container: string) {
		let params = getPaginationHeaders(pageNumber, pageSize);
		params = params.append('Container', container);
		return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
	}

	getMessageThread(username: string) {
		return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
	}

	async sendMessage(username: string, content: string) {
		const body = {
			recipientUsername: username,
			content
		};
		try {
			return await this.hubConnection.invoke('SendMessage', body);
		} catch (error) {
			return console.log(error);
		}
	}

	deleteMessage(id: number) {
		return this.http.delete(this.baseUrl + 'messages/' + id);
	}
}
