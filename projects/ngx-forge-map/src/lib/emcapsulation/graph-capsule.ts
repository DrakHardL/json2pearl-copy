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

/**
 * Empacsulation de la librairie Vis-Network [WIP]
 */
export class ForgeGraph {

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
  private readonly test = new Map<NodeShape, Map<number, string>>()

  constructor(
    container: HTMLElement
  ) {
    this._network = new Network(
      container,
      { nodes: this.dataSet_nodes, edges: this.dataSet_edges },
      this._config
    );
  }

  private _registerNewNode(node_type: NodeShape, node_ref_id: number, node_id: string) {
    if (!this.test.has(node_type)) {
      this.test.set(node_type, new Map());
    }
    let e = this.test.get(node_type)!;

    e.set(node_ref_id, node_id);
  }

  private _getNodeRef(node_type: NodeShape, node_ref_id: number): string | undefined {
    return this.test.get(node_type)?.get(node_ref_id);
  }

  addNode(label: string, node_type: NodeShape, node_color: Color, data?: any): void {
    let n: NodeGraph = { label: label, shape: node_type, title: `${node_type} Test`, data: data , color: node_color}
    let id = this.dataSet_nodes.add(n)[0] as unknown as string;
    console.log("ID node geenered ", id);

    this._registerNewNode(node_type, data.id, id);
  }

  addEdge(from: { type: NodeShape, id: number }, to: { type: NodeShape, id: number }): void {

    // Reccupere les references des identifiants dans le graphe et si elles n'existent pas, arrête le processus
    const origin_node = this._getNodeRef(from.type, from.id);
    const arrive_node = this._getNodeRef(to.type, to.id);
    if (!origin_node || !arrive_node) return;

    let is_edge_unique = true;

    this._network.getConnectedEdges(origin_node).forEach(id => {
      let e = this.dataSet_edges.get(id);
      if (e && e.to == arrive_node) is_edge_unique = false;
    })

    if (is_edge_unique) this.dataSet_edges.add({ from: origin_node, to: arrive_node });
  }

  removeNode(node: NodeGraph): void {
    if (node.id) this.dataSet_nodes.remove(node.id);
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
    this.dataSet_edges.clear()
    this.dataSet_nodes.clear()
  }

  getNodes(): NodeGraph[] {
    let rep: NodeGraph[] = [];
    this.dataSet_nodes.distinct("id").forEach(r => {
      let node = this.getNodeByID(r as number);
      if (node) rep.push(node)
    });
    return rep;
  }
  getEdegsIDs() {
    throw new Error('WIP Method not implemented.');
  }
}
