class DagreGraph {
    public graph: any;
    private MAX_LENGHT = 35;
    private renderer: Renderer
    private clusterManager: ClusterManager;

    constructor(
        jsonGraph: JsonGraph,
        width: number,
        height: number,
        private svgId: string
    ) {
        this.graph = new dagreD3.graphlib.Graph({
            compound: true,
            multigraph: true
        }).setGraph({});
        this.graph.graph().transition = (selection: any) => {
            return selection.transition().duration(500);
        };
        this.createGraphFromJson(jsonGraph);
        this.clusterManager = new ClusterManager(this.graph)
        this.renderer = new Renderer(width, height, svgId, this.graph);
        this.renderer.render(this.graph, this.update);
    }

    public createGraphFromJson(jsonGraph: JsonGraph): void {
        let clusters = []
        for (let node of jsonGraph.nodes) {
            this.addNode(node);
        }

        for (let edge of jsonGraph.edges) {
            this.addEdge(edge);
        }
    }

    private breakLine(text: string): string {
        const trimmed =  text.replace(/ +(?= )/g,'');
        const words = trimmed.split(" ");

        let lineLength = 0;
        let newText = ""
        for (let word of words) {
            if (word.length + lineLength + 1 >= this.MAX_LENGHT) {
                newText += `<br>${word}`
                lineLength = word.length + 1
            } else {
                newText += ` ${word}`
                lineLength += word.length + 1
            }
        }
        return newText
    }

    private addNode = (node: JsonNode): void => {
        const description = node.description ? node.description : ""
        const value = {
            title: node.title,
            description: node.description,
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
        const value = {
            label: edge.description,
            lineInterpolate: 'basis',
            style: edge.style,
            arrowheadStyle: edge.arrowHeadStyle
        }
        this.graph.setEdge(edge.source, edge.target, value, edge.id);
    }

    private update = (svg: any) => {
        svg.selectAll(`#${this.svgId} g.node`)
            .on('click', (nodeId: string) => {

                // a bit dirty, but check if a node has children OR is is
                // expanded
                if (this.graph.node(nodeId).children ||
                    this.graph.node(nodeId).collapsible) {
                    if (!this.graph.node(nodeId).collapsible)
                        this.clusterManager.expand(nodeId, this.addNode,
                            this.addEdge)
                    else
                        this.clusterManager.collapse(nodeId);
                    this.renderer.render(this.graph, this.update);
                }
                else {
                    console.log('no children');
                }
            });
    }
}
