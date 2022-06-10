import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeberDetailComponent } from './memeber-detail.component';

describe('MemeberDetailComponent', () => {
  let component: MemeberDetailComponent;
  let fixture: ComponentFixture<MemeberDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemeberDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemeberDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
