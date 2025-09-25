import { Component, signal, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestGraph } from "./test-graph/test-graph";
import { SearchBar } from './components/search-bar/search-bar';
import { FloatingToolbar } from './components/floating-toolbar/floating-toolbar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TestGraph, SearchBar, FloatingToolbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Json2pearl');
  

}
