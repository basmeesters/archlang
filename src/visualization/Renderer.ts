/**
  * Object that actually does the rendering, zooming and panning of the given
  * graph.
  */
class Renderer {
    constructor(
        private width: number,
        private height: number,
        private svgId: string
    ) { }

    public render(graph: any, update: any) {
        let render = new dagreD3.render();
        var svg = d3.select(`#${this.svgId}`),
            svgGroup = svg.append("g");
        svg.attr('width', this.width);
        svg.attr('height', this.height);
        render(d3.select(`#${this.svgId} g`), graph);
        this.setZoomBehavior(svg, graph.graph())
        update(svg)
    }

    /**
      * Actually zoom and translate the view.
      */
    private zoom(svg: any): void {
        svg.select('g').attr("transform",
            `translate(${d3.event.translate}), ` +
            `scale(${d3.event.scale})`);
    }

    /**
      * Setup zoom behaviour so the user can zoom and scale the visualization
      * automatically.
      */
    private setZoomBehavior(svg: any, renderedGraph: any) {
        const d3Zoom = d3.behavior.zoom();
        d3Zoom.on("zoom", () => this.zoom(svg));
        svg.call(d3Zoom);
        svg.on("dblclick.zoom", null);
        this.scaleVisualization(svg, d3Zoom, renderedGraph);
    }

    private scaleVisualization(svg: any, zoom: any, renderedGraph: any) {
        const xScale = svg.attr('width') / renderedGraph.width;
        const yScale = svg.attr('height') / renderedGraph.height;
        const newScale = Math.min(xScale, yScale, 1);

        this.focusOnLocation(svg, zoom, -150, -150, newScale);
    }

    private focusOnLocation(
        svg: any,
        d3Zoom: any,
        x: number,
        y: number,
        scale: number): void {

        // transform both the svg and the zoom for it to work properly
        svg.select('g').transition().duration(500).attr(
            "transform", `scale(${scale}), translate(${-x},${-y})`);
        d3Zoom.translate([-x * scale, -y * scale]);
        d3Zoom.scale(scale);
    }
}
