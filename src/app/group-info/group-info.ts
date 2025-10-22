import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-info',
  imports: [CommonModule],
  templateUrl: './group-info.html',
  styleUrl: './group-info.scss'
})
export class GroupInfo {
  @Input() name: string = '';
  @Input() description: string = '';
  @Input() webUrl: string = '';
  @Input() createdAt: string = '';
  @Input() fullPath: string = '';
}
