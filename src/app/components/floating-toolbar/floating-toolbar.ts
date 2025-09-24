import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-toolbar',
  imports: [CommonModule],
  templateUrl: './floating-toolbar.html',
  styleUrl: './floating-toolbar.scss'
})
export class FloatingToolbar {
  buttons = [
    { text: 'Développer projet/docs', 
      image: 'projets.png' 
    },
    { text: 'Associé/Membres', image: 'associé.png' },
    { text: 'Afficher Versions', image: 'versions.png' },
    { text: 'Mettre en avant les liens', image: 'Group 8.png' },
    { text: 'Cacher la sélection', image: 'Group 7.png' },
    { text: 'Information', image: 'Group 12.png' }
  ];



  clickButton(buttonText: string) {
    alert('Vous avez cliqué sur : ' + buttonText);
  }
}