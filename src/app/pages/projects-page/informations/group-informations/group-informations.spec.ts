import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInformations } from './group-informations';

describe('GroupInfo', () => {
  let component: GroupInformations;
  let fixture: ComponentFixture<GroupInformations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupInformations],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupInformations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
