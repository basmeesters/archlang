type JsonGraph = {
    nodes: Array<GraphNode>,
    edges: Array<GraphEdge>
}

type GraphNode = {
    id: string,
    title: string,
    description?: string,
    style: string,
    shape: string,
    children?: JsonGraph
}

type GraphEdge = {
    id: string,
    source: string,
    target: string
    description: string,
    style: string,
    arrowHeadStyle: string
}

declare let dagreD3: any;
declare let d3: any;
declare let dagreGraph: any;
