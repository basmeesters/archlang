class DagreGraph {
    public graph: any;
    private MAX_LENGHT = 35;

    constructor(jsonGraph: JsonGraph) {
        this.graph = new dagreD3.graphlib.Graph({
            compound:true,
            multigraph: true
        }).setGraph({});
        this.createGraphFromJson(jsonGraph);
        this.render();
    }

    public createGraphFromJson(jsonGraph: JsonGraph) {
        let clusters = []
        for (let node of jsonGraph.nodes) {
            let description = node.description ? node.description : ""
            if (node.children) {
                clusters.push({
                    id: node.id,
                    title: node.title,
                    children: node.children,
                    style: node.style
                })
            } else {
                this.addNode(node.id, node.title, description, node.style,
                    node.shape);
            }
        }
        for (let cluster of clusters) {
            this.addCluster(cluster.id, cluster.title, cluster.children,
                cluster.style)
        }

        for (let edge of jsonGraph.edges) {
            this.addEdge(edge.id, edge.source, edge.target, edge.description,
                edge.style, edge.arrowHeadStyle);
        }
    }

    private render() {
        let render = new dagreD3.render();
        let svg = d3.select('#graph');
        svg.attr('width', window.innerWidth * 1);
        svg.attr('height', window.innerHeight * 1);
        render(svg, this.graph);
        this.setZoomBehavior(svg, this.graph.graph())
    }

    private setZoomBehavior(svg: any, renderedGraph: any): void {
        let zoom = d3.behavior.zoom();
        zoom.on("zoom", () => this.zoomBehavior(svg));
        svg.call(zoom);
        svg.on("dblclick.zoom", null);
        this.scaleVisualization(svg, zoom, renderedGraph);
    }

    private zoomBehavior(svg: any) {
        svg.select('g').attr("transform",
            `translate(${d3.event.translate}), ` +
            `scale(${d3.event.scale})`);
    }

    private scaleVisualization(svg: any, zoom: any, renderedGraph: any) {
        let xScale = svg.attr('width') / renderedGraph.width * 0.9;
        let yScale = svg.attr('height') / renderedGraph.height * 0.9;
        let newScale = Math.min(xScale, yScale, 0.9);

        this.focusOnLocation(svg, zoom, -150, -150, newScale);
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

    private focusOnLocation(svg: any,
                            zoom: any,
                            x: number,
                            y: number,
                            scale: number): void {
        // transform both the svg and the zoom for it to work properly
        svg.select('g').transition().duration(500).attr(
            "transform", `scale(${scale}), translate(${-x},${-y})`);
        zoom.translate([-x * scale, -y * scale]);
        zoom.scale(scale);
    }

    private addNode(id: string,
                    title: string,
                    description: string,
                    style: string,
                    shape: string): void {
        let value = {
            label: `<b>${title}</b><br/> ${this.breakLine(description)}`,
            labelType: "html",
            style: style,
            shape: shape
        }
        this.graph.setNode(id, value);
    }

    private addCluster(id: string,
                       title: string,
                       children: Array<string>,
                       style: string): void {
        let value = {
            label: title,
            style: style,
            parent_level : 0,
            clusterLabelPos : 'top'
        }
        this.graph.setNode(id, value)
        for (let nodeId of children) {
            this.graph.setParent(nodeId, id)
        }
    }

    private addEdge(id: string,
                    start: string,
                    end: string,
                    description: string,
                    style: string,
                    arrowheadStyle: string) {
        let value = {
            label: description,
            lineInterpolate: 'basis',
            style: style,
            arrowheadStyle: arrowheadStyle
        }
        this.graph.setEdge(start, end, value, id);
    }
}
