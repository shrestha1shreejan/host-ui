import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";
import { MembersService } from "./../../_services/members.service";
import { AccountService } from "./../../_services/account.service";
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_models/member';
import { User } from '../../_models/user';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  // to get access to template refrence varialbe
  @ViewChild('editForm' ) editForm: NgForm | undefined;
  member!: Member;
  user!: User;

  // listen to browser event and execute some process
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true
    }
  }

  constructor(private accountService: AccountService, private memberService: MembersService, private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user as User)
   }

  ngOnInit() {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMember(this.user.username).subscribe(member => this.member = member);
  }

  updateMember(){
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastr.success('Profile updated sucessfully');
    this.editForm?.reset(this.member);
    });    
  }
}
