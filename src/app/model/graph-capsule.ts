import { DataSet, Edge, Network, Node } from "vis-network";

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
    private readonly nodes = [];
    private readonly edges = [];

    private readonly dataSet_nodes = new DataSet<Node>();
    private readonly dataSet_edges = new DataSet<Edge>();

    constructor(
        container: HTMLElement
    ) {
        this._network = new Network(
            container,
            { nodes: this.dataSet_nodes, edges: this.dataSet_edges },
            this._config
        );
    }

    addNode(): void {}
    addEdge(): void {}
    
    removeNode(): void {}
    removeEdge(): void {}

    getNodeByID(id: number): void {}
    getEdgeByID(id: number): void {}

    editNode(id: number, data: any): void {}
    editEdge(id: number, data: any): void {}
}
