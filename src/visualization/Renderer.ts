/**
  * Object that actually does the rendering, zooming and panning of the given
  * graph.
  */
class Renderer {
    private svg: any
    constructor(
        private width: number,
        private height: number,
        private svgId: string,
        initialGraph: any
    ) {
        this.svg = d3.select(`#${this.svgId}`)
        const svgGroup = this.svg.append("g");
        this.svg.attr('width', this.width);
        this.svg.attr('height', this.height);

        this.render(initialGraph, (a: any) => {})
        this.setZoomBehavior(this.svg, initialGraph.graph())
    }

    public render(graph: any, update: any) {
        let render = new dagreD3.render();
        render(d3.select(`#${this.svgId} g`), graph);
        update(this.svg)
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
