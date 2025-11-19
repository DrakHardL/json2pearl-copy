import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Group } from 'ngx-forge-map';

@Component({
  selector: 'app-group-informations',
  imports: [CommonModule],
  templateUrl: './group-informations.html',
  styleUrl: './group-informations.scss',
})
export class GroupInformations {
  @Input() group?: Group;
  @Input() members: any[] = [];

  showMembers = false;

  toggleMembers() {
    this.showMembers = !this.showMembers;
  }
}
