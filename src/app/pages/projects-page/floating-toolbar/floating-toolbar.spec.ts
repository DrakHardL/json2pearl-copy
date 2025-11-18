import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingToolbar } from './floating-toolbar.component';

describe('FloatingToolbar', () => {
  let component: FloatingToolbar;
  let fixture: ComponentFixture<FloatingToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(FloatingToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
