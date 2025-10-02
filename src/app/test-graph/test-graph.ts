import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { GraphForge, GroupApiService, NodeShape, ProjectApiService, UserApiService } from 'ngx-forge-map';

enum NodeColor {
  PROJECT = "#E0AC54",
  USER = "#78B1DD",
  GROUP = "#55D764"
}

enum NodeType {
  PROJECT,
  USER,
  GROUP,
}

@Component({
  selector: 'app-test-graph',
  imports: [],
  templateUrl: './test-graph.html',
  styleUrl: './test-graph.scss'
})
export class TestGraph implements OnInit {
  @ViewChild('visNetwork', { static: true }) visNetwork!: ElementRef;


  //une sortie qui peut stocker l'id du projet sélectionné

  @Output() projectSelected = new EventEmitter<{name: string, description: string, thematic: string, version: string, createdDate: string, creator: string, originalLink: string}>();
  @Output() utilisateurSelected = new EventEmitter<{ name: string, webUrl: string, nombreProjets: number, projectLinks: string[] }>();


  network!: GraphForge;
selectedNodes: string[] = [];  


  constructor(
    private readonly projectsAPI: ProjectApiService,
    private readonly groupAPI: GroupApiService,
    private readonly userAPI: UserApiService,
  ) { }

  ngOnInit() {
    this.network = new GraphForge(this.visNetwork.nativeElement);

    this.network.onNodeDoubleClick().subscribe(id => this.on2click(id));
    this.network.onNodeSelect().subscribe(id => {
      console.log("node selected :", id);
      this.onNodeSelected(id);
    });
  }

  //fonction pour gérer la sélection de noeuds
  private onNodeSelected(nodeId: string) {
    this.selectedNodes = this.network.getSelectedNodes();
    if (this.selectedNodes.length === 0) return;

    const nodeType = this.network.getNodeType(nodeId);
   

    // convertir nodeType en number car getNodeType retourne un string
    const nodeTypeNumber = Number(nodeType);
    
    if (nodeTypeNumber === NodeType.PROJECT) {
      //appel de la fonction pour afficher les infos projet
      this.showProjectInfo(nodeId);
    } else if (nodeTypeNumber === NodeType.USER) {
      //appel de la fonction pour afficher les infos utilisateur
      this.showUserInfo(nodeId);
    }
  }



  //fonction pour afficher les infos projet
  private showProjectInfo(nodeId: string) {
    const projectId = this.network.getNodeID(nodeId);
    this.projectsAPI.getProject(projectId as number).subscribe(project => {
      const projectData = {
        name: project.name,
        description: project.description,
        thematic: project.topics.join(', '),
        version: project.default_branch,
        createdDate: new Date(project.created_at).toLocaleDateString('fr-FR'),
        creator: project.namespace.name,
        originalLink: project.http_url_to_repo
      };
      this.projectSelected.emit(projectData);
    });
  }


  //fonction pour afficher les infos utilisateur
  private showUserInfo(nodeId: string) {

    const userId = this.network.getNodeID(nodeId);
    
    this.userAPI.getUserProjects(userId.toString()).subscribe(projects => {
      const links = projects
        .map(p => p.web_url || p.http_url_to_repo)
        .filter(url => url);
      
      const userData = {
        name: userId.toString(),
        webUrl: `https://forge.apps.education.fr/${userId}`,
        nombreProjets: projects.length,
        projectLinks: links
      };
      this.utilisateurSelected.emit(userData);
    });
  }



  onSearch(_t3: HTMLInputElement) {
    this.projectsAPI.searchProjects(_t3.value).subscribe(projects => {
      this.network.clear()
      projects.forEach(project => { this.createProject(project) });
    })
  }

  on2click(id: string) {
    this.extends(id);
    
  }

  private extends(id: string) {
    const type: NodeType = this.network.getNodeType(id);
    const elt_id = this.network.getNodeID(id);

    console.log("type du noued :", type, type == NodeType.PROJECT);
    console.log("identifiant du noued :", elt_id);

    if (type == NodeType.PROJECT) {
      this.projectsAPI.getProjectUsers(elt_id as unknown as number).subscribe(users => {
        users.forEach(user => {
          this.connectNodes(this.createUser(user), id);
        });
      });
      this.projectsAPI.getProjectGroups(elt_id as unknown as number).subscribe(groups => {
        groups.forEach(group => {
          this.connectNodes(this.createGroup(group), id);
        });
      });
    } else if (type == NodeType.USER) {
      this.userAPI.getUserProjects(elt_id as unknown as string).subscribe(projects => {
        projects.forEach(project => {
          this.connectNodes(this.createProject(project), id)
        });
      });
    } else if (type == NodeType.GROUP) {
      this.groupAPI.getGroupProjects(elt_id as unknown as number).subscribe(projects => {
        projects.forEach(project => {
          this.connectNodes(this.createProject(project), id);
        });
      });
    } else {
      throw new Error("nouveau type non declarer");
    }
  }

  onExpend() {
    this.network.getSelectedNodes().forEach(id => {
      this.extends(id);
    })
  }

  private connectNodes(id_node_1: string, id_node_2: string) {
    return this.network.connectNodes(id_node_1, id_node_2);
  }

  private createNode(label: string, type: number, shape: NodeShape, color: string, data: any): string {
    return this.network.createNode(label, type, shape, color, data);
  }

  createUser(user: any): string {
    console.log("create user");
    return this.createNode(user.name, NodeType.USER, NodeShape.DOT, NodeColor.USER, user);
  }

  createProject(project: any): string {
    return this.createNode(project.name, NodeType.PROJECT, NodeShape.SQUARE, NodeColor.PROJECT, project);
  }

  createGroup(group: any): string {
    return this.createNode(group.name, NodeType.GROUP, NodeShape.TRIANGLE, NodeColor.GROUP, group);
  }


  // fonction pour supprimer les noeuds sélectionnés
  
  removeSelectedNodes() {
    if (this.selectedNodes.length === 0) {
      alert('Sélectionnez des noeuds !');
      return;
    }

    this.selectedNodes.forEach(nodeId => {
      this.network.removeNode(nodeId);
    });
    
    this.selectedNodes = [];
  }


  
}
