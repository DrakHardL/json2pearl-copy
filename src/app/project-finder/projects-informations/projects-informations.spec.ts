import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsInformations } from './projects-informations';

describe('ProjectsInformations', () => {
  let component: ProjectsInformations;
  let fixture: ComponentFixture<ProjectsInformations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsInformations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsInformations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
