import { Component, signal, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestGraph } from "./test-graph/test-graph";
import { FloatingToolbar } from './components/floating-toolbar/floating-toolbar';
import { ProjectsInformations } from './components/projects-informations/projects-informations';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TestGraph, FloatingToolbar, ProjectsInformations],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
   title= (signal('Json2pearl'));

   
   selectedProjectName = ''; 
   selectedProjectDescription = ''; 


   onProjectSelected(project: {name: string, description?: string}) {
     this.selectedProjectName = project.name;
     this.selectedProjectDescription = project.description || '';
   }
}
