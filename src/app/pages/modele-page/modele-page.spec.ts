import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelePage } from './modele-page';

describe('ModelePage', () => {
  let component: ModelePage;
  let fixture: ComponentFixture<ModelePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
