import { ToastrService } from "ngx-toastr";
import { MembersService } from "./../../_services/members.service";
import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../_models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member | undefined;
  constructor(private memberService: MembersService, private tostr: ToastrService) { }

  ngOnInit() {
  }

  addLike(member: Member) {
    this.memberService.addLike(member.username). subscribe({
      next: () => this.tostr.success('You have liked ' + member.knownAs)
    })
  }
}
