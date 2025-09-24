import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchBar } from './components/search-bar/search-bar';
import { FloatingToolbar } from './components/floating-toolbar/floating-toolbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SearchBar, FloatingToolbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Json2pearl');
}
