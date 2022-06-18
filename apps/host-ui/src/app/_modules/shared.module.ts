import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrModule } from 'ngx-toastr';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
		TooltipModule.forRoot(),	
    TabsModule.forRoot(),	
    NgxGalleryModule,
    FileUploadModule,
		ToastrModule.forRoot({
			positionClass: 'toast-bottom-right'
		})
  ],
  exports: [
    BsDropdownModule,
    BsDatepickerModule,
    ToastrModule,
    TooltipModule,
    TabsModule,
    NgxGalleryModule,
    FileUploadModule 
  ]
})
export class SharedModule { }
