import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ProjectApiService } from '../services/projects-api/project-api-service';
import { GroupApiService } from '../services/group-api/group-api-service';
import { GraphCapsule } from '../emcapsulation/graph-capsule';

@Component({
  selector: 'app-test-graph',
  imports: [],
  templateUrl: './test-graph.html',
  styleUrl: './test-graph.scss'
})
export class TestGraph implements OnInit {
  @ViewChild('visNetwork', { static: true }) visNetwork!: ElementRef;

  //une sortie qui peut stocker l'id du projet sélectionné
  @Output() projectSelected = new EventEmitter<string>();
  
  network!: GraphCapsule;
  selectedNodes: number[] = [];  

  constructor(
    private readonly projectsAPI: ProjectApiService,
    private readonly groupAPI: GroupApiService,
  ) { }

  ngOnInit() {
    this.network = new GraphCapsule(this.visNetwork.nativeElement);
    
    // quand on clique sur un noeud
    this.network.on('select', (event) => {
      this.selectedNodes = event.nodes;
      
      if (this.selectedNodes.length > 0) {
        const node = this.network.nodes.get(this.selectedNodes[0]);
        if (node && node.shape === 'square') {
          this.projectSelected.emit(node.label);
        }
      }
    });
  }




  onSearch(_t3: HTMLInputElement) {
    this.network.clear()
    this.projectsAPI.searchProjects(_t3.value).subscribe(projects => {
      projects.forEach(p => {
        this.network.addNode({ 
          id: p.id, 
          label: `${p.name}`, 
          shape: 'square', 
          color: { background: '#E0AC54', border: '#000000ff' } 
        })
      })
      this.onShowUser();
    })
  }

  onShowUser() {
    this.network.getNodes().forEach(n => {
      this.projectsAPI.getProjectUsers(n.id! as number).subscribe(users => {
        users.forEach(user => {
          this.network.addNode({ 
            id: user.id, 
            label: `${user.name}`, 
            shape: user.avatar_url ? 'circularImage' : 'circle',
            image: user.avatar_url || undefined,
            color: { background: '#78B1DD', border: '#000000ff' }, 
            size: 55
          })
          this.network.addEdge({ from: n.id!, to: user.id, label: '', arrows: 'to' })
        })
      })
      this.projectsAPI.getProjectGroups(n.id! as number).subscribe(groups => {
        groups.forEach(group => {
          this.network.addNode({ id: group.id, label: `${group.name}`, shape: 'triangle', color: { background: '#55D764', border: '#000000ff' } })
          this.network.addEdge({ from: n.id!, to: group.id, label: '', arrows: 'to' })
        })
      })
    });
  }

  // fonction pour cacher ou afficher les noeuds sélectionnés
  
  toggleHideNodes() {
    if (this.selectedNodes.length === 0) {
      alert('Sélectionnez des noeuds !');
      return;
    }

    const firstNode = this.network.nodes.get(this.selectedNodes[0]);
    const isCurrentlyHidden = firstNode && firstNode.hidden === true;

    if (isCurrentlyHidden) {
      this.selectedNodes.forEach(nodeId => {
        this.network.nodes.update({ id: nodeId, hidden: false });
      });
    } else {
      this.selectedNodes.forEach(nodeId => {
        this.network.nodes.update({ id: nodeId, hidden: true });
      });
    }
  }
}


