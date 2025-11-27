import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolBarItem } from '../../../models/toolbar-item';

@Component({
  selector: 'app-floating-toolbar',
  imports: [CommonModule],
  templateUrl: './floating-toolbar.component.html',
  styleUrl: './floating-toolbar.component.scss',
})
export class FloatingToolbar {
  @Output() toolClicked = new EventEmitter<ToolBarItem>();

  buttons = [
    { id: ToolBarItem.EXPEND, text: 'Explorer', image: 'icons/expend-icon.svg' },
    { id: ToolBarItem.HIDE, text: 'Cacher la sélection', image: 'icons/hide-icon.svg' },
    { id: ToolBarItem.INFO, text: 'Information', image: 'icons/info-icon.svg' },
    { id: ToolBarItem.COPY, text: 'Copier le lien dans le presse-papier', image: 'icons/copy-icon.svg' },
  ];

  protected toolClick(tool_id: ToolBarItem): void {
    return this.toolClicked.emit(tool_id);
  }
}
