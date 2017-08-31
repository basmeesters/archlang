class ClusterManager {
    constructor(private graph: any) { }

    public expand(
        nodeId: string,
        addNodeFunction: (node: JsonNode) => void,
        addEdgeFunction: (edge: JsonEdge) => void): void {

        const inEdges = this.graph.inEdges(nodeId);
        const outEdges = this.graph.outEdges(nodeId);
        const children = this.graph.node(nodeId).children;

        this.addNodesAndEdges(children, addNodeFunction, addEdgeFunction);
        this.setParent(nodeId, children, inEdges, outEdges);
        this.removeClusterEdges(inEdges.concat(outEdges));
    }

    public collapse(nodeId: string) {
        const node = this.graph.node(nodeId);
        const parent = this.graph.parent(nodeId);

        for (const childNode of node.children.nodes) {
            this.graph.removeNode(childNode.id);
        }

        for (const edge of node.deleted_in_edges) {
            this.graph.setEdge(edge.edge.v, parent, edge.value);
        }

        for (const edge of node.deleted_out_edges) {
            this.graph.setEdge(parent, edge.edge.v, edge.value);
        }
    }

    private addNodesAndEdges(
        children: JsonGraph,
        addNodeFunction: (node: JsonNode) => void,
        addEdgeFunction: (edge: JsonEdge) => void) {

        for (const childNode of children.nodes) {
            addNodeFunction(childNode);
        }

        for (const childEdge of children.edges) {
            addEdgeFunction(childEdge);
        }
    }

    private removeClusterEdges(edgeIds: Array<any>) {
        for (const edgeId of edgeIds) {
            this.graph.removeEdge(edgeId);
        }
    }

    private setParent(
        nodeId: string,
        children: JsonGraph,
        inEdges: Array<any>,
        outEdges: Array<any>) {

        const oldInEdges = inEdges.map((id: number, index: number) => {
            return { edge: inEdges[index], value: this.graph.edge(id) }
        })
        const oldOutEdges = outEdges.map((id: number, index: number) => {
            return { edge: outEdges[index], value: this.graph.edge(id) }
        })

        this.graph.node(children.nodes[0].id).collapsible = true;
        this.graph.node(children.nodes[0].id).children = children;
        this.graph.node(children.nodes[0].id).deleted_in_edges = oldInEdges;
        this.graph.node(children.nodes[0].id).deleted_out_edges = oldOutEdges;

        for (const childNode of children.nodes) {
            this.graph.setParent(childNode.id, nodeId);
        }
    }
}
