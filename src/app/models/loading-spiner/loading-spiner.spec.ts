import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpiner } from './loading-spiner';

describe('LoadingSpiner', () => {
  let component: LoadingSpiner;
  let fixture: ComponentFixture<LoadingSpiner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpiner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingSpiner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
