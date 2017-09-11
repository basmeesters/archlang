/**
  * JSON structure that is used as input for the drawing of the graph.
  */
type JsonGraph = {
    nodes: Array<JsonNode>,
    edges: Array<JsonEdge>,
    mode: number
}

type JsonNode = {
    id: string,
    title: string,
    description?: string,
    style: string,
    shape: string,
    children?: JsonGraph
}

type JsonEdge = {
    id: string,
    source: string,
    target: string
    description: string,
    style: string,
    arrowHeadStyle: string
}

// Declarations to provide some expression of intent.
declare let dagreD3: any;
declare let d3: any;
declare let dagreGraph: any;
