import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToolBarItem } from '../data/toolbar-item';
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
    { id: ToolBarItem.DEVELOPPE, text: 'Développer projet/docs', image: 'projets.png' },
    { id: ToolBarItem.MEMBRES, text: 'Associé/Membres', image: 'associé.png' },
    { id: ToolBarItem.VERSIONS, text: 'Afficher Versions', image: 'versions.png' },
    { id: ToolBarItem.HIDE, text: 'Cacher la sélection', image: 'Group 7.png' },
    { id: ToolBarItem.INFORMATION, text: 'Information', image: 'Group 12.png' },
    { id: ToolBarItem.FAVORIS, text: 'Copy link', image: 'icons/copy_icon.svg' },
  ];

  protected toolClick(tool_id: ToolBarItem): void {
    return this.toolClicked.emit(tool_id);
  }
}
