class DagreGraph {
    public graph: any;

    constructor(jsonGraph: JsonGraph) {
        this.graph = new dagreD3.graphlib.Graph({
            compound:true,
            multigraph: true
        }).setGraph({});
        this.createGraphFromJson(jsonGraph);
        this.render();
    }

    public createGraphFromJson(jsonGraph: JsonGraph) {
        for (let node of jsonGraph.nodes) {
            this.addNode(node.id, node.title, node.description, node.style);
        }

        for (let edge of jsonGraph.edges) {
            this.addEdge(edge.id, edge.source, edge.target, edge.description);
        }
    }

    private render() {
        let render = new dagreD3.render();
        let svg = d3.select('#graph');
        svg.attr('width', window.innerWidth * 0.80);
        svg.attr('height', window.innerHeight * 0.80);
        render(svg, this.graph);
        this.setZoomBehavior(svg, this.graph.graph())
    }

    private setZoomBehavior(svg, renderedGraph) {
        let zoom = d3.behavior.zoom();
        zoom.on("zoom", () => this.zoomBehavior(svg));
        svg.call(zoom);
        svg.on("dblclick.zoom", null);
        this.scaleVisualization(svg, zoom, renderedGraph);
    }

    private zoomBehavior(svg) {
        svg.select('g').attr("transform",
            `translate(${d3.event.translate}), ` +
            `scale(${d3.event.scale})`);
    }

    private scaleVisualization(svg, zoom, renderedGraph) {
        let xScale = svg.attr('width') / renderedGraph.width * 0.9;
        let yScale = svg.attr('height') / renderedGraph.height * 0.9;
        let newScale = Math.min(xScale, yScale, 0.9);

        this.focusOnLocation(svg, zoom, -150, -150, newScale);
    }

    private focusOnLocation(svg, zoom, x, y, scale) {
        // transform both the svg and the zoom for it to work properly
        svg.select('g').transition().duration(500).attr(
            "transform", `scale(${scale}), translate(${-x},${-y})`);
        zoom.translate([-x * scale, -y * scale]);
        zoom.scale(scale);
    }

    private addNode(id: string,
                   title: string,
                   description: string = "",
                   style = "fill: rgb(220, 220, 220);") {
        let value = {
            label: `<b>${title}</b><br/> ${description}`,
            labelType: "html",
            style: style
        }
        this.graph.setNode(id, value);
    }

    private addEdge(id: string,
                    start: string,
                    end: string,
                    description: string) {
        let value = {
            label: description,
            lineInterpolate: 'basis'
        }
        this.graph.setEdge(start, end, value, id);
    }
}
