import { HelperService } from "./../../_services/helper.service";
import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from "@angular/forms";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements ControlValueAccessor {

	@Input() label: string;
	@Input() maxDate: Date;	
  bsConfig?: Partial<BsDatepickerConfig>;

	/**
	 * Self decorator (looks at hiearchy)
	 * @param ngControl 
	 */
	constructor(@Self() public ngControl: NgControl, public helperService: HelperService) {
		this.ngControl.valueAccessor = this;
    this.bsConfig = {
      containerClass: 'theme-blue',
      dateInputFormat: 'DD MMMM YYYY'
    }
	 }

	writeValue(obj: any): void {}
	registerOnChange(fn: any): void {}
	registerOnTouched(fn: any): void {}
	
}
