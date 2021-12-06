import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDestroyComponent } from './base-destroy.component';

describe('BaseDestroyComponent', () => {
  let component: BaseDestroyComponent;
  let fixture: ComponentFixture<BaseDestroyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseDestroyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDestroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
