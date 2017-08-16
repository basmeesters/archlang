declare let dagreD3: any;
declare let d3: any;

class ArchitectureGraph {
    public graph: any;

    constructor() {
        this.graph = new dagreD3.graphlib.Graph(
            {compound:true, multigraph: true}
        ).setGraph({});

        this.exampleGraph();
        this.color()
        this.render();
    }

    private exampleGraph() {
        for (let i of [0,1,2,3]) {
            this.addNode(`n${i}`, {
                label: `<b>Node ${i}</b></br> Does this work?`,
                labelType: "html"
            });
        }
        this.addEdge("e1", "n0", "n1", {label: "", lineInterpolate: 'basis' })
        this.addEdge("e1", "n1", "n2", {label: "", lineInterpolate: 'basis' })
        this.addEdge("e1", "n3", "n2", {label: "", lineInterpolate: 'basis' })
    }

    private color() {
        let states = this.graph.nodes();
        for (let stateId of states) {
            let state = this.graph.node(stateId);
            state.labelStyle = 'font-weight : normal'
            state.rx = 1
            state.ry = 1
            state.style = "fill: rgb(200, 200, 200);"
            // state.shape = "ellipse"
        }
    }

    public addNode(id: string, value: { label: string, labelType: string }) {
        this.graph.setNode(id, value);
    }

    public addEdge(id: string, start: string, end: string, value: any) {
        this.graph.setEdge(start, end, value, id);
    }

    public render() {
        let render = new dagreD3.render()
        let svg = d3.select('#graph');
        svg.attr('width', window.innerWidth * 0.50);
        svg.attr('height', window.innerHeight * 0.50);

        render(svg, this.graph);
    }
}
