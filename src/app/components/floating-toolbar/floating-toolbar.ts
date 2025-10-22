import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestGraph } from '../../test-graph/test-graph';

@Component({
  selector: 'app-floating-toolbar',
  imports: [CommonModule],
  templateUrl: './floating-toolbar.html',
  styleUrl: './floating-toolbar.scss'
})
export class FloatingToolbar {
  @Input() testGraph!: TestGraph;  // @Input() pour recevoir les données du graph
  @Output() informationClicked = new EventEmitter<void>();  // nouvel Output pour le bouton information

  buttons = [
    { text: 'Développer projet/docs', 
      image: 'projets.png' 
    },
    { text: 'Associé/Membres', image: 'associé.png' },
    { text: 'Afficher Versions', image: 'versions.png' },
    { text: 'Cacher la sélection', image: 'Group 7.png' },
    { text: 'Information', image: 'Group 12.png' }
  ];

  
//methode appelée lors du clic sur un bouton
  clickButton(buttonText: string) {
   
    if (buttonText === 'Cacher la sélection') {
      this.testGraph.removeSelectedNodes(); 
    } 
    else if (buttonText === 'Information') {
      // événement vers le parent pour afficher/masquer les infos
      this.informationClicked.emit();
    } 
    else {
      alert('Vous avez cliqué sur : ' + buttonText);
    }
  }
}