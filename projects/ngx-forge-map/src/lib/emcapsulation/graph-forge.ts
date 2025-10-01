import { Color, DataSet, Edge, Network, Node, Options } from "vis-network/standalone";


interface NodeGraph extends Node {
  data?: any,
}

interface EdgeGraph extends Edge {
  data?: any,
}

export enum NodeShape {
  SQUARE = "square",
  IMAGE = "image",
  CIRCULAR_IMAGE = "circularImage",
  DIAMOND = "diamond",
  DOT = "dot",
  STAR = "star",
  TRIANGLE = "triangle",
  TRIANGLE_DOWN = "triangleDown",
  HEXAGON = "hexagon",
  ICON = "icon",
}

export class GraphForge {

  private readonly _config: Options = {
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
      multiselect: true,
    },
  }

  private readonly _network;

  private readonly dataSet_nodes = new DataSet<NodeGraph>();
  private readonly dataSet_edges = new DataSet<EdgeGraph>();
  private readonly ref_nodes = new Map<NodeShape, Map<number, string>>()
  private readonly reverse_ref_node = new Map<string, { type: NodeShape, id: number }>();

  constructor(
    container: HTMLElement
  ) {
    this._network = new Network(
      container,
      { nodes: this.dataSet_nodes, edges: this.dataSet_edges },
      this._config
    );
  }

  private _registerNewNode(node_type: NodeShape, node_ref_id: number, node_id: string): boolean {
    if (!this.ref_nodes.has(node_type)) {
      this.ref_nodes.set(node_type, new Map());
    }
    let e = this.ref_nodes.get(node_type)!;

    if (e.has(node_ref_id)) return false;
    e.set(node_ref_id, node_id);
    this.reverse_ref_node.set(node_id, { type: node_type, id: node_ref_id });
    return true;
  }

  private _getReverseNodeRef(graph_node_id: string) {
    return this.reverse_ref_node.get(graph_node_id);
  }

  private _getNodeRef(node_type: NodeShape, node_ref_id: number): string | undefined {
    return this.ref_nodes.get(node_type)?.get(node_ref_id);
  }

  addNode(label: string, node_type: NodeShape, node_color: Color, data?: any): void {
    let node: NodeGraph = { label: label, shape: node_type, title: `${node_type} ${data.id}`, data: data, color: node_color }
    let id = this.dataSet_nodes.add(node)[0] as unknown as string;
    console.log("ID node geenered ", id);
    if (!this._registerNewNode(node_type, data.id, id)) this.dataSet_nodes.remove(node);
  }

  addEdge(from: { type: NodeShape, id: number }, to: { type: NodeShape, id: number }): void {
    const origin_node = this._getNodeRef(from.type, from.id);
    const arrive_node = this._getNodeRef(to.type, to.id);
    if (!origin_node || !arrive_node) return;

    this.dataSet_edges.forEach(edges => {
      if (edges.from === origin_node && edges.to === arrive_node) return
      if (edges.from === arrive_node && edges.to === origin_node) return
    })

    this.dataSet_edges.add({ from: origin_node, to: arrive_node });
  }

  removeNode(node_type: NodeShape, node_id: number): void {
    const n = this._getNodeRef(node_type, node_id);
    if (n) this.dataSet_nodes.remove(n);
  }

  removeEdge(edge: EdgeGraph): void {
    if (edge.id) this.dataSet_edges.remove(edge.id);
  }

  getNodeByID(id: number): NodeGraph | null {
    return this.dataSet_nodes.get(id)
  }
  getEdgeByID(id: number): EdgeGraph | null {
    return this.dataSet_edges.get(id)
  }

  editNode(id: number, data: any): void {
    let node = this.dataSet_nodes.get(id);
    if (node) node.data = data;
  }

  editEdge(id: number, data: any): void {
    let edge = this.dataSet_edges.get(id);
    if (edge) edge.data = data;
  }

  clear(): void {
    this.dataSet_edges.clear();
    this.dataSet_nodes.clear();
    this.ref_nodes.clear();
    this.reverse_ref_node.clear();
  }

  getSelectedNodes(): { type: NodeShape, id: number }[] {
    return this._network.getSelectedNodes()
      .map(e => this._getReverseNodeRef(e as unknown as string))
      .filter((el): el is { type: NodeShape, id: number } => el !== undefined);
  }
}
