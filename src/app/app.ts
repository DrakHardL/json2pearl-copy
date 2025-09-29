import { Component, signal, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestGraph } from "./test-graph/test-graph";
import { FloatingToolbar } from './components/floating-toolbar/floating-toolbar';
import { ProjectsInformations } from './components/projects-informations/projects-informations';
import { UtilisateurInformation } from './components/utilisateur-information/utilisateur-information';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TestGraph, FloatingToolbar, ProjectsInformations, UtilisateurInformation],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
   title= (signal('Json2pearl'));

   
   selectedProjectName = ''; 
   selectedProjectDescription = '';
   selectedProjectThematic = '';
   selectedProjectVersion = '';
   selectedProjectCreatedDate = '';
   selectedProjectCreator = '';
   selectedProjectOriginalLink = '';

   utilisateurName = '';
   utilisateurRole = '';
   utilisateurNombreProjets = 0;

   


   onProjectSelected(project: {name: string, description: string, thematic: string, version: string, createdDate: string, creator: string, originalLink: string}) {
     this.selectedProjectName = project.name;
     this.selectedProjectDescription = project.description;
     this.selectedProjectThematic = project.thematic;
     this.selectedProjectVersion = project.version;
     this.selectedProjectCreatedDate = project.createdDate;
     this.selectedProjectCreator = project.creator;
     this.selectedProjectOriginalLink = project.originalLink;
   }

   onUtilisateurSelected(utilisateur: { name: string, role: string, nombreProjets: number }) {
     this.utilisateurName = utilisateur.name;
     this.utilisateurRole = utilisateur.role;
     this.utilisateurNombreProjets = utilisateur.nombreProjets;
   }


   
}
