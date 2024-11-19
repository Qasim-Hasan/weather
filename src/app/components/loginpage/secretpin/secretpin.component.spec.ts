import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretpinComponent } from './secretpin.component';

describe('SecretpinComponent', () => {
  let component: SecretpinComponent;
  let fixture: ComponentFixture<SecretpinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretpinComponent]
    });
    fixture = TestBed.createComponent(SecretpinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
