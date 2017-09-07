/**
  * Object able to expand and collapse a cluster in new nodes and edges.
  */
class ClusterManager {

    private parentTable: HashMap = {};
    constructor(private graph: any) { }

    public expand(
        nodeId: string,
        addNodeFunction: (node: JsonNode) => void,
        addEdgeFunction: (edge: JsonEdge) => void
    ): void {
        const inEdges = this.graph.inEdges(nodeId);
        const outEdges = this.graph.outEdges(nodeId);
        const children = this.graph.node(nodeId).children as JsonGraph;
        const childId = children.nodes[0].id
        this.parentTable[nodeId] = childId
        this.parentTable[children.nodes[0].id] = nodeId

        this.setExpandDescription(nodeId);
        this.addNodesAndEdges(children, addNodeFunction, addEdgeFunction);
        this.setParent(nodeId, children, inEdges, outEdges);
        this.replaceClusterEdges(inEdges, childId, addEdgeFunction)
        this.removeClusterEdges(outEdges);
    }

    public collapse(nodeId: string) {
        const node = this.graph.node(nodeId);
        const parentId = this.graph.parent(nodeId);
        const parent = this.graph.node(parentId);
        parent.expanded = false;

        for (const childNode of node.children.nodes) {
            this.graph.removeNode(childNode.id);
        }

        for (const edge of node.deleted_in_edges) {
            const source = this.getOrChild(edge.edge.v)
            this.checkExists(source, parentId)
            this.graph.setEdge(source, parentId, edge.value);
        }

        for (const edge of node.deleted_out_edges) {
            const target = this.getOrChild(edge.edge.w)
            this.checkExists(parentId, target)
            this.graph.setEdge(parentId, target, edge.value);
        }
        this.setCollapseDescription(parentId)
    }

    private checkExists(source: string, target: string) {
        let valid = true;
        if (!this.graph.hasNode(source)) {
            console.log(`Node <${source}> does currently not exist`)
            valid = false;
        }
        if (!this.graph.hasNode(target)) {
            console.log(`Node <${target}> does currently not exist`)
            valid = false
        }
        if (!valid) {
            console.log(`in <${source}> to <${target}>`)
        }
    }

    private setExpandDescription(nodeId: string) {
        const node = this.graph.node(nodeId)
        node.expanded = true
        node.oldLabel = node.label
        node.clusterLabelPos = 'top'
        node.label = `<b>${node.title}</b>`;
    }

    private setCollapseDescription(nodeId: string) {
        const node = this.graph.node(nodeId)
        node.label = node.oldLabel;
    }

    private addNodesAndEdges(
        children: JsonGraph,
        addNodeFunction: (node: JsonNode) => void,
        addEdgeFunction: (edge: JsonEdge) => void) {

        for (const childNode of children.nodes) {
            addNodeFunction(childNode);
        }

        for (const childEdge of children.edges) {
            const source = this.getOrChild(childEdge.source)
            const target = this.getOrChild(childEdge.target)
            const newEdge: JsonEdge = this.copy(childEdge)

            newEdge.source = source
            newEdge.target = target

            addEdgeFunction(newEdge);
        }
    }

    private copy(obj: any): any {
        return jQuery.extend(true, {}, obj);
    }

    private getOrChild(id: string): string {
        return this.graph.hasNode(id) && this.graph.node(id).expanded == false
               ? id
               : this.parentTable[id]
    }

    private replaceClusterEdges(
        edgeIds: Array<any>,
        newEdgeId: string,
        addEdge: any
    ): void {
        for (const edgeId of edgeIds) {
            const edge = this.graph.edge(edgeId)
            const newEdge = this.copy(edge);
            newEdge.source = edgeId.v
            newEdge.target = newEdgeId
            this.graph.removeEdge(edgeId);
            addEdge(newEdge)
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
