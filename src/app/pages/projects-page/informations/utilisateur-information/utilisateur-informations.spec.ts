import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurInformation } from './utilisateur-informations.component';

describe('UtilisateurInformation', () => {
  let component: UtilisateurInformation;
  let fixture: ComponentFixture<UtilisateurInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurInformation],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
