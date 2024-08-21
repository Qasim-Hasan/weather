import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsohumesComponent } from './isohumes.component';

describe('IsohumesComponent', () => {
  let component: IsohumesComponent;
  let fixture: ComponentFixture<IsohumesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IsohumesComponent]
    });
    fixture = TestBed.createComponent(IsohumesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
