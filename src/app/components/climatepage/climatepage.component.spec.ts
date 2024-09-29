import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimatepageComponent } from './climatepage.component';

describe('ClimatepageComponent', () => {
  let component: ClimatepageComponent;
  let fixture: ComponentFixture<ClimatepageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClimatepageComponent]
    });
    fixture = TestBed.createComponent(ClimatepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
