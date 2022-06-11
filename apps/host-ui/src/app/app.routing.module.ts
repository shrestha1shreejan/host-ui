import { ServerErrorComponent } from "./errors/server-error/server-error.component";
import { NotFoundComponent } from "./errors/not-found/not-found.component";
import { MessagesComponent } from "./messages/messages.component";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { HomeComponent } from "./home/home.component";
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{
		path: '',
		runGuardsAndResolvers: 'always',
		canActivate: [AuthGuard],
		children: [
			{ path: 'members', component: MemberListComponent, canActivate: [AuthGuard] },
			{ path: 'members/:username', component: MemberDetailComponent },
			{ path: 'lists', component: MemberListComponent },
			{ path: 'messages', component: MessagesComponent }
		]
	},
	{path: 'not-found', component: NotFoundComponent},
	{path: 'server-error', component: ServerErrorComponent},
	{ path: '**', component: NotFoundComponent, pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }