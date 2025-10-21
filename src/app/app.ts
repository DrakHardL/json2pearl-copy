import { Component, signal, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestGraph } from "./test-graph/test-graph";
import { FloatingToolbar } from './components/floating-toolbar/floating-toolbar';
import { ProjectsInformations } from './components/projects-informations/projects-informations';
import { UtilisateurInformation } from './components/utilisateur-information/utilisateur-information';
import { GroupInfo } from './components/group-info/group-info';


@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, TestGraph, FloatingToolbar, ProjectsInformations, UtilisateurInformation, GroupInfo],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {

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
   utilisateurProjects: any[] = [];

   groupName = '';
   groupDescription = '';
   groupWebUrl = '';
   groupCreatedAt = '';
   groupMembers: any[] = [];
   
// état pour la visibilité de la boîte d'infos et type de sélection

infoVisible: boolean = false;

selectedType: string = '';  // project, user ou group


//fonction qui permet d'affecter les informations du projet sélectionné aux variables correspondantes
   onProjectSelected(project: {name: string, description: string, thematic: string, version: string, createdDate: string, creator: string, originalLink: string}) {
     this.selectedProjectName = project.name;
     this.selectedProjectDescription = project.description;
     this.selectedProjectThematic = project.thematic;
     this.selectedProjectVersion = project.version;
     this.selectedProjectCreatedDate = project.createdDate;
     this.selectedProjectCreator = project.creator;
     this.selectedProjectOriginalLink = project.originalLink;
     //le type de sélection est un projet
     this.selectedType = 'project';
     this.infoVisible = true; // Affiche la boîte d'information automatiquement
   }


  onUtilisateurSelected(utilisateur: { name: string, webUrl: string, nombreProjets: number, projectLinks: string[], projects: any[] }) {
    this.utilisateurName = utilisateur.name;
    this.utilisateurWebUrl = utilisateur.webUrl;
    this.utilisateurNombreProjets = utilisateur.nombreProjets;
    this.utilisateurProjectLinks = utilisateur.projectLinks || [];
    this.utilisateurProjects = utilisateur.projects || [];
    this.selectedType = 'user';
    this.infoVisible = true;
  }

  onGroupSelected(group: { name: string, description: string, webUrl: string, createdAt: string, members: any[] }) {
    this.groupName = group.name;
    this.groupDescription = group.description;
    this.groupWebUrl = group.webUrl;
    this.groupCreatedAt = group.createdAt;
    this.groupMembers = group.members || [];
    this.selectedType = 'group';
    this.infoVisible = true;
  }

// Gestion du clic sur le bouton "Information"
onInformationClicked() {
  if (!this.selectedType) {
    alert("Sélectionnez un noeud !");
    return;
  }
  // Bascule de la visibilité des boîtes d'information
  this.infoVisible = !this.infoVisible;
}
   
}
