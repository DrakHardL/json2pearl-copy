import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TestGraph } from "./test-graph/test-graph";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TestGraph],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Json2pearl');
}
