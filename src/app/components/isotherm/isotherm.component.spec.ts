import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsothermComponent } from './isotherm.component';

describe('IsothermComponent', () => {
  let component: IsothermComponent;
  let fixture: ComponentFixture<IsothermComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IsothermComponent]
    });
    fixture = TestBed.createComponent(IsothermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
