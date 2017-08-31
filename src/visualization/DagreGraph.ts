class DagreGraph {
    public graph: any;
    private MAX_LENGHT = 35;
    private renderer = new Renderer();
    private clusterManager: ClusterManager;

    constructor(jsonGraph: JsonGraph) {
        this.graph = new dagreD3.graphlib.Graph({
            compound: true,
            multigraph: true
        }).setGraph({});
        this.graph.graph().transition = (selection: any) => {
            return selection.transition().duration(500);
        };
        this.createGraphFromJson(jsonGraph);
        this.clusterManager = new ClusterManager(this.graph)
        this.renderer.render(this.graph, this.update);
    }

    public createGraphFromJson(jsonGraph: JsonGraph) {
        let clusters = []
        for (let node of jsonGraph.nodes) {
            this.addNode(node);
        }

        for (let edge of jsonGraph.edges) {
            this.addEdge(edge);
        }
    }

    private breakLine(text: string): string {
        let words = text.split(" ");
        let lineLength = 0;
        let newText = ""
        for (let word of words) {
            if (word.length + lineLength + 1 >= this.MAX_LENGHT) {
                newText += `<br/>${word}`
                lineLength = word.length + 1
            } else {
                newText += ` ${word}`
                lineLength += word.length + 1
            }
        }
        return newText
    }

    private addNode = (node: JsonNode): void => {
        let description = node.description ? node.description : ""
        let value = {
            label: `<b>${node.title}</b><br/> ${this.breakLine(description)}`,
            labelType: "html",
            style: node.style,
            shape: node.shape,
            expanded: false,
            children: node.children
        }
        this.graph.setNode(node.id, value);
    }

    private addEdge = (edge: JsonEdge) => {
        let value = {
            label: edge.description,
            lineInterpolate: 'basis',
            style: edge.style,
            arrowheadStyle: edge.arrowHeadStyle
        }
        this.graph.setEdge(edge.source, edge.target, value, edge.id);
    }

    private update = (svg: any) => {
        svg.selectAll('g.node')
            .on('click', (node_id: string) => {

                // a bit dirty, but check if a node has children OR is is expanded
                if (this.graph.node(node_id).children ||
                    this.graph.node(node_id).collapsible) {
                    if (!this.graph.node(node_id).collapsible)
                        this.clusterManager.expand(node_id, this.addNode,
                            this.addEdge)
                    else
                        this.clusterManager.collapse(node_id);
                    this.renderer.render(this.graph, this.update);
                }
                else {
                    console.log('no children');
                }
            });
    }
}
