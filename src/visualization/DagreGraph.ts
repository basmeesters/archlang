class DagreGraph {
    public graph: any;
    private MAX_LENGHT = 35;

    constructor(jsonGraph: JsonGraph) {
        this.graph = new dagreD3.graphlib.Graph({
            compound:true,
            multigraph: true
        }).setGraph({});
        this.graph.graph().transition = (selection: any) => {
            return selection.transition().duration(500);
        };
        this.createGraphFromJson(jsonGraph);
        this.render();
    }

    public createGraphFromJson(jsonGraph: JsonGraph) {
        let clusters = []
        for (let node of jsonGraph.nodes) {
            if (node.children) {
                this.addClusterNode(node.id, node.title, node.style, node.children)
            } else {
                this.addNode(node);
            }
        }

        for (let edge of jsonGraph.edges) {
            this.addEdge(edge);
        }
    }

    private render() {
        let render = new dagreD3.render();
        var svg = d3.select("svg"),
                svgGroup = svg.append("g");
        svg.attr('width', window.innerWidth * 1);
        svg.attr('height', window.innerHeight * 1);
        render(d3.select("svg g"), this.graph);
        this.setZoomBehavior(svg, this.graph.graph())
        this.update(svg)
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

    private addNode(node: GraphNode): void {
        let description = node.description ? node.description : ""
        let value = {
            label: `<b>${node.title}</b><br/> ${this.breakLine(description)}`,
            labelType: "html",
            style: node.style,
            shape: node.shape,
            expanded: false
        }
        this.graph.setNode(node.id, value);
    }

    private addClusterNode(id: string,
                       title: string,
                       style: string,
                       children: JsonGraph): void {
        let value = {
            label: title,
            style: style,
            parent_level : 0,
            clusterLabelPos : 'top',
            children: children
        }
        this.graph.setNode(id, value)
    }

    private addEdge(edge: GraphEdge) {
        let value = {
            label: edge.description,
            lineInterpolate: 'basis',
            style: edge.style,
            arrowheadStyle: edge.arrowHeadStyle
        }
        this.graph.setEdge(edge.source, edge.target, value, edge.id);
    }

    private update(svg: any) {
            svg.selectAll('g.node')
                .on('click', (node_id: string) => {

                    // a bit dirty, but check if a node has children OR is is expanded
                    if(this.graph.node(node_id).children ||
                       this.graph.node(node_id).collapsible) {
                        if(!this.graph.node(node_id).collapsible)
                            this.expand(node_id, svg);
                        else
                            this.collapse(node_id, svg);
                    }
                    else {
                        console.log('no children');
                    }
                }
            );
    }
    private expand(node_id: string, svg: any) {
        let obj = this;
        let g = this.graph
        var in_edges = g.inEdges(node_id),
            out_edges = g.outEdges(node_id),
            children = g.node(node_id).children;

        add_children();
        remove_edges();
        new_edges();
        set_parent();
        this.render()

        function add_children() {
            for(let i=0; i < children.nodes.length; i++) {
                obj.addNode(children.nodes[i])
            }

            for(let i=0; i < children.edges.length; i++) {
                obj.addEdge(children.edges[i])
            }
            return g
        }

        function remove_edges() {
            for (var i=0; i < in_edges.length; i++) {
                g.removeEdge(in_edges[i]);
            }

            for (var i=0; i < out_edges.length; i++) {
                g.removeEdge(out_edges[i]);
            }
            return g
        }

        function new_edges() {

            for(let i=0; i < in_edges.length; i++) {
                g.setEdge(in_edges[i].v, children.nodes[0].id, {})
            }

            for(let i=0; i < out_edges.length; i++) {
                g.setEdge(children.nodes[children.nodes.length -1].id, out_edges[i].w, {})
            }
        }

        function set_parent() {
            g.node(children.nodes[0].id).collapsible=true;
            g.node(children.nodes[0].id).children = children;
            g.node(children.nodes[0].id).deleted_in_edges = in_edges;
            g.node(children.nodes[0].id).deleted_out_edges = out_edges;

            for(let i=0; i < children.nodes.length; i++) {
                g.setParent(children.nodes[i].id, node_id)
            }
        }
    }

    private collapse(node_id: string, svg: any) {
        let g = this.graph
        var node = g.node(node_id),
            parent = g.parent(node_id);

        for(var i =0; i < node.children.nodes.length; i++) {
            g.removeNode(node.children.nodes[i].id);
        }
        for(var i =0; i < node.deleted_in_edges.length; i++) {
            g.setEdge(node.deleted_in_edges[i].v, parent, {});
        }

        for(var i =0; i < node.deleted_out_edges.length; i++) {
            g.setEdge(parent, node.deleted_out_edges[i].w);
        }
        this.render();

    }
}
