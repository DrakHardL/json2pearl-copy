import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxForgeMap } from './ngx-forge-map';

describe('NgxForgeMap', () => {
  let component: NgxForgeMap;
  let fixture: ComponentFixture<NgxForgeMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxForgeMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxForgeMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
