import { DataSet, Edge, Node, Network, Options } from 'vis-network/standalone';
import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-test-graph',
  imports: [],
  templateUrl: './test-graph.html',
  styleUrl: './test-graph.scss'
})
export class TestGraph implements OnInit {
  @ViewChild('visNetwork', { static: true }) visNetwork!: ElementRef;

  network!: Network;
  
  // Variables SIMPLES !
  selectedNodes: number[] = [];  // Les nœuds sélectionnés


  private readonly graph_config: Options = {
    nodes: {
      font: { color: '#333', size: 16 },
      borderWidth: 2,
    },
    edges: {
      font: { align: 'middle' },
      arrows: { to: { enabled: true, scaleFactor: 0.7 } },
      color: { color: '#888', highlight: '#000' },
    },
    physics: {
      enabled: true,
      stabilization: { iterations: 100 },
    },
    interaction: {
      hover: true,
      dragNodes: true,
      multiselect: true, // selection multiple
      zoomView: true,
    },
  };

  private readonly nodes: Node[] = [
    { id: 1, label: "1", shape: 'ellipse', color: { background: '#14f300ff', border: '#0288D1' } },
    { id: 2, label: "2", shape: 'diamond', color: { background: '#07b9ffff', border: '#0288D1' } },
    { id: 3, label: "3", shape: 'star', color: { background: '#3b819cff', border: '#0288D1' } },
    { id: 4, label: "4", shape: 'triangle', color: { background: '#9c523bff', border: '#0288D1' } },
    { id: 5, label: "5", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    { id: 6, label: "6", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    { id: 7, label: "7", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    { id: 8, label: "8", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    { id: 9, label: "9", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
  ]
  private readonly edges: Edge[] = [
    { from: 1, to: 3, label: '', arrows: 'to' },
    { from: 1, to: 4, label: '', arrows: 'to' },
    { from: 1, to: 5, label: '', arrows: 'to' },
    { from: 1, to: 6, label: '', arrows: 'to' },
    { from: 1, to: 7, label: '', arrows: 'to' },
    { from: 7, to: 2, label: '', arrows: 'to' },
    { from: 5, to: 3, label: '', arrows: 'to' },
    
  ]

  private readonly default_node: DataSet<Node> = new DataSet<Node>(this.nodes);
  private readonly default_edge: DataSet<Edge> = new DataSet<Edge>(this.edges);

  ngOnInit() {
    this.network = new Network(this.visNetwork.nativeElement, { nodes: this.default_node, edges: this.default_edge }, this.graph_config);

    this.network.on('select', (event) => {
      this.selectedNodes = event.nodes;  
    });
  }

  
  toggleHideNodes() {
    if (this.selectedNodes.length === 0) {
      alert('Sélectionnez des noeuds !');
      return;
    }

    // vérifier l'état du premier nœud sélectionné
    const firstNode = this.default_node.get(this.selectedNodes[0]);
    const isCurrentlyHidden = firstNode && firstNode.hidden === true;

    // montrer les noeuds
    if (isCurrentlyHidden) {
      this.selectedNodes.forEach(nodeId => {
        this.default_node.update({ id: nodeId, hidden: false });
      });
      
    } else {
      // cacher les noeuds
      this.selectedNodes.forEach(nodeId => {
        this.default_node.update({ id: nodeId, hidden: true });
      });
    }
  }
}


