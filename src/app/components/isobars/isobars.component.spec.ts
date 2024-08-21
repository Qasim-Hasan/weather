import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsobarsComponent } from './isobars.component';

describe('IsobarsComponent', () => {
  let component: IsobarsComponent;
  let fixture: ComponentFixture<IsobarsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IsobarsComponent]
    });
    fixture = TestBed.createComponent(IsobarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
