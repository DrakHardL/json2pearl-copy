import { Component, Output, EventEmitter } from '@angular/core';
import { ToolBarItem } from '../../../models/toolbar-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-toolbar',
  imports: [CommonModule],
  templateUrl: './floating-toolbar.component.html',
  styleUrl: './floating-toolbar.component.scss',
})
export class FloatingToolbar {
  @Output() toolClicked = new EventEmitter<ToolBarItem>();

  buttons = [
    { id: ToolBarItem.DEVELOPPE, text: 'Développer projet/docs', image: 'images/projets.png' },
    { id: ToolBarItem.MEMBRES, text: 'Associé/Membres', image: 'images/associé.png' },
    { id: ToolBarItem.VERSIONS, text: 'Afficher Versions', image: 'images/versions.png' },
    { id: ToolBarItem.HIDE, text: 'Cacher la sélection', image: 'images/Group 7.png' },
    { id: ToolBarItem.INFORMATION, text: 'Information', image: 'images/Group 12.png' },
    { id: ToolBarItem.FAVORIS, text: 'Copy link', image: 'icons/copy_icon.svg' },
  ];

  protected toolClick(tool_id: ToolBarItem): void {
    return this.toolClicked.emit(tool_id);
  }
}
