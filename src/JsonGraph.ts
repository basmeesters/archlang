type JsonGraph = {
    nodes: Array<{
        id: string,
        title: string,
        description: string,
        style: string,
        shape: string
    }>,
    edges: Array<{
        id: string,
        source: string,
        target: string
        description: string,
        style: string,
        arrowHeadStyle: string
    }>
}

declare let dagreD3: any;
declare let d3: any;
declare let dagreGraph: any;
