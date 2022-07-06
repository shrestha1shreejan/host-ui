import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrModule } from 'ngx-toastr';
import { FileUploadModule } from 'ng2-file-upload';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TimeagoModule } from 'ngx-timeago';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TimeagoModule.forRoot(),
    ButtonsModule.forRoot(),
		TooltipModule.forRoot(),	
    TabsModule.forRoot(),	
    ModalModule.forRoot(),
    NgxGalleryModule,
    FileUploadModule,
		ToastrModule.forRoot({
			positionClass: 'toast-bottom-right'
		})
  ],
  exports: [
    BsDropdownModule,
    BsDatepickerModule,
    PaginationModule,
    TimeagoModule,
    ButtonsModule,
    ToastrModule,
    TooltipModule,
    TabsModule,
    ModalModule,
    NgxGalleryModule,
    FileUploadModule 
  ]
})
export class SharedModule { }
