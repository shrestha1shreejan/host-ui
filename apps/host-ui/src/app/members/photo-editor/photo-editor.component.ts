import { MembersService } from "./../../_services/members.service";
import { Photo } from "./../../_models/photo";
import { take } from "rxjs";
import { AccountService } from "./../../_services/account.service";
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'apps/host-ui/src/environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { Member } from '../../_models/member';
import { User } from '../../_models/user';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member!: Member ;
  uploader!: FileUploader;
  hasBaseDropZoneOver = false;
  baseurl = environment.apiUrl;
  user!: User;
  constructor(private accountService: AccountService, private memberService: MembersService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user as User);
  }

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e:any) {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        this.user.photoUrl = photo.url;
        this.accountService.setCurrentUser(this.user);
        this.member.photoUrl = photo.url;
        this.member.photos.forEach(p => {
          if(p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        })
      }
    })
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.member.photos = this.member.photos.filter(x => x.id !== photoId);
      }
    })
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseurl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024  *1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false; // else we have to make change to our api cors to send credentials
    }

    this.uploader.onSuccessItem= (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);  
        this.member?.photos.push(photo);
      }
    }
  }

}
