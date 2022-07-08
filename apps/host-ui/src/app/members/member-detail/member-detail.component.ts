import { take } from "rxjs";
import { AccountService } from "./../../_services/account.service";
import { PresenceService } from "./../../_services/presence.service";
import { MessageService } from "./../../_services/message.service";
import { MembersService } from "./../../_services/members.service";
import { Member } from "./../../_models/member";
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Message } from '../../_models/message';
import { User } from '../../_models/user';

@Component({
	selector: 'app-member-detail',
	templateUrl: './member-detail.component.html',
	styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
	@ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
	member: Member;
	galleryOptions: NgxGalleryOptions[] = [];
	galleryImages: NgxGalleryImage[] = [];
	activeTab: TabDirective;
	messages: Message[] = [];
	user: User;

	constructor(public presence: PresenceService, private route: ActivatedRoute, private router: Router,
		private messageService: MessageService, private accountService: AccountService) {
		this.accountService.currentUser$.pipe(take(1)).subscribe({
			next: user => this.user = user as User
		});

		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
	}

	ngOnInit() {
		this.route.data.subscribe(data => {
			this.member = data['member'];
		})
		// this.loadMember(); // using resolvers instead

		/// to load message tab directly in case ites routed from message component
		// or from the messages link in the member card component
		this.route.queryParams.subscribe(params => {
			params['tab'] ? this.selectTab(params['tab']) : this.selectTab(0);
		});
		this.galleryOptions = [
			{
				width: '500px',
				height: '500px',
				imagePercent: 100,
				thumbnailsColumns: 4,
				imageAnimation: NgxGalleryAnimation.Slide,
				preview: false
			}
		]

		this.galleryImages = this.getImages();
	}

	loadMessages() {
		this.messageService.getMessageThread(this.member.username as string).subscribe({
			next: messages => this.messages = messages
		});
	}

	onTabActivated(data: TabDirective) {
		this.activeTab = data;
		if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
			// using signalR for this now
			// this.loadMessages();
			this.messageService.createHubConnections(this.user, this.member.username)
		} else {
			this.messageService.stopHubConnection();
		}
	}

	selectTab(tabId: number) {
		this.memberTabs.tabs[tabId].active = true;
		console.log(this.memberTabs.tabs.find(x => x.heading === 'Messages')?.id);
	}

	getImages(): NgxGalleryImage[] {
		const imageUrls = [];
		if (this.member) {
			for (const photo of this.member.photos) {
				imageUrls.push({
					small: photo?.url,
					medium: photo?.url,
					big: photo?.url
				})
			}
		}
		return imageUrls;
	}

	ngOnDestroy(): void {
		this.messageService.stopHubConnection();
	}
}
