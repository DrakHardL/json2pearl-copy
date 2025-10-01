import { Component, signal, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestGraph } from "./test-graph/test-graph";
import { FloatingToolbar } from './components/floating-toolbar/floating-toolbar';
import { ProjectsInformations } from './components/projects-informations/projects-informations';
import { UtilisateurInformation } from './components/utilisateur-information/utilisateur-information';


@Component({
  selector: 'app-root',
  imports: [CommonModule, TestGraph, FloatingToolbar, ProjectsInformations, UtilisateurInformation],
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
   utilisateurNombreProjets = 0;
   utilisateurWebUrl = '';
  utilisateurProjectLinks: string[] = [];

  
  infoVisible: boolean = false;
  selectedType: string = '';  // 'project' ou 'user'
   


   onProjectSelected(project: {name: string, description: string, thematic: string, version: string, createdDate: string, creator: string, originalLink: string}) {
     this.selectedProjectName = project.name;
     this.selectedProjectDescription = project.description;
     this.selectedProjectThematic = project.thematic;
     this.selectedProjectVersion = project.version;
     this.selectedProjectCreatedDate = project.createdDate;
     this.selectedProjectCreator = project.creator;
     this.selectedProjectOriginalLink = project.originalLink;
     
     // memoriser le type de sélection
     this.selectedType = 'project';
   }

  onUtilisateurSelected(utilisateur: { name: string, webUrl: string, nombreProjets: number, projectLinks: string[] }) {
    this.utilisateurName = utilisateur.name;
    this.utilisateurWebUrl = utilisateur.webUrl;
    this.utilisateurNombreProjets = utilisateur.nombreProjets;
    this.utilisateurProjectLinks = utilisateur.projectLinks || [];
    
    // memoriser le type de sélection
    this.selectedType = 'user';
  }

  onInformationClicked() {
    if (!this.selectedType) {
      alert("sélectionnez un noeud");
      return;
    }

    // basculer la visibilité
    this.infoVisible = !this.infoVisible;
  }

   
}
