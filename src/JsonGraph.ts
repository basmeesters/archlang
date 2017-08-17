type JsonGraph = {
    nodes: Array<{
        nodeId: string,
        title: string,
        description: string,
        style: string
    }>,
    edges: Array<{
        edgeId: string,
        source: string,
        target: string
        description: string,
        style: string
    }>
}

declare let dagreD3: any;
declare let d3: any;
declare let dagreGraph: any;
