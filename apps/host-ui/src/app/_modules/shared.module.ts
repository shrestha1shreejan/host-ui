import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
		TooltipModule.forRoot(),	
    TabsModule.forRoot(),	
    NgxGalleryModule,
		ToastrModule.forRoot({
			positionClass: 'toast-bottom-right'
		})
  ],
  exports: [
    BsDropdownModule,
    ToastrModule,
    TooltipModule,
    TabsModule,
    NgxGalleryModule 
  ]
})
export class SharedModule { }
