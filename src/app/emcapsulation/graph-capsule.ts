import { DataSet, Edge, Network, Node } from "vis-network/standalone";


interface NodeCapsule extends Node {

}

interface EdgeCapsule extends Edge {

}

/**
 * Empacsulation de la librairie Vis-Network [WIP]
 */
export class GraphCapsule {

  private readonly _config = {
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
  }

  private readonly _network;

  private readonly dataSet_nodes = new DataSet<NodeCapsule>(
    //   [
    //   { id: 1, label: "1", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    //   { id: 2, label: "2", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    //   { id: 3, label: "3", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    //   { id: 4, label: "4", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    //   { id: 5, label: "5", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    //   { id: 6, label: "6", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    //   { id: 7, label: "7", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    //   { id: 8, label: "8", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    //   { id: 9, label: "9", shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } },
    // ]
  );
  private readonly dataSet_edges = new DataSet<EdgeCapsule>(
    //   [
    //   { from: 1, to: 3, label: '', arrows: 'to' },
    //   { from: 1, to: 4, label: '', arrows: 'to' },
    //   { from: 1, to: 5, label: '', arrows: 'to' },
    //   { from: 1, to: 6, label: '', arrows: 'to' },
    //   { from: 1, to: 7, label: '', arrows: 'to' },
    //   { from: 7, to: 2, label: '', arrows: 'to' },
    //   { from: 5, to: 3, label: '', arrows: 'to' },
    // ]
  );

  constructor(
    container: HTMLElement
  ) {
    this._network = new Network(
      container,
      { nodes: this.dataSet_nodes, edges: this.dataSet_edges },
      this._config
    );
  }

  addNode(node: NodeCapsule): void {
    this.dataSet_nodes.add(node);
  }
  addEdge(edge: EdgeCapsule): void {
    this.dataSet_edges.add(edge);
  }

  removeNode(node: NodeCapsule): void {
    if (node.id) this.dataSet_nodes.remove(node.id);
  }
  removeEdge(edge: EdgeCapsule): void {
    if (edge.id) this.dataSet_edges.remove(edge.id);
  }

  getNodeByID(id: number): NodeCapsule | null {
    return this.dataSet_nodes.get(id)
  }
  getEdgeByID(id: number): EdgeCapsule | null {
    return this.dataSet_edges.get(id)
  }

  editNode(id: number, data: any): void { }
  editEdge(id: number, data: any): void { }
}
