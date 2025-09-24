import { DataSet, Edge, Node, Network, Options } from 'vis-network/standalone';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-test-graph',
  imports: [],
  templateUrl: './test-graph.html',
  styleUrl: './test-graph.scss'
})
export class TestGraph implements OnInit {
  @ViewChild('visNetwork', { static: true }) visNetwork!: ElementRef;

  network!: Network;

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
      zoomView: true,
    },
  };

  private readonly nodes: Node[] = [
    { id: 1, label: "1", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    { id: 2, label: "2", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    { id: 3, label: "3", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    { id: 4, label: "4", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
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

  }
}
