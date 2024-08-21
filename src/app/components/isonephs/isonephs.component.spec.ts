import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsonephsComponent } from './isonephs.component';

describe('IsonephsComponent', () => {
  let component: IsonephsComponent;
  let fixture: ComponentFixture<IsonephsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IsonephsComponent]
    });
    fixture = TestBed.createComponent(IsonephsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
