import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphDemo } from './graph-demo';

describe('GraphDemo', () => {
  let component: GraphDemo;
  let fixture: ComponentFixture<GraphDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
