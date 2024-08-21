import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsohyetsComponent } from './isohyets.component';

describe('IsohyetsComponent', () => {
  let component: IsohyetsComponent;
  let fixture: ComponentFixture<IsohyetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IsohyetsComponent]
    });
    fixture = TestBed.createComponent(IsohyetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
