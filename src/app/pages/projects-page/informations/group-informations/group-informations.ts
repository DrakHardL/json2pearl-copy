import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-group-informations',
  imports: [CommonModule],
  templateUrl: './group-informations.html',
  styleUrl: './group-informations.scss',
})
export class GroupInfo {
  // permet au composant GroupInfo de recevoir des données depuis son composant parent
  @Input() name: string = '';
  @Input() description: string = '';
  @Input() webUrl: string = '';
  @Input() createdAt: string = '';
  @Input() members: any[] = [];

  showMembers = false;

  toggleMembers() {
    this.showMembers = !this.showMembers;
  }
}
