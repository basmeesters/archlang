function start(): void {
    console.log("loaded")
    let jsonGraph = createExampleGraph()
    new DagreGraph(jsonGraph);
}

function createExampleGraph(): JsonGraph {
    return {
        nodes: [
            {
                id: "n0",
                title: "User"
            }
            {
                id: "n1",
                title: "Money Component",
                description: "this component is able to process money"
            },
            {
                id: "n2",
                title: "Buttons"
            },
            {
                id: "n3",
                title: "Coffee maker",
                description: ""
            }
        ],
        edges: [
            {
                id: "e1",
                source: "n0",
                target: "n1",
                description: "throws in money"
            },
            {
                id: "e2",
                source: "n0",
                target: "n2",
                description: "pushes the coffee button"
            },
            {
                id: "e3",
                source: "n1",
                target: "n2",
                description: "signales the money amount"
            }
            {
                id: "e4",
                source: "n2",
                target: "n3",
                description: "starts if there is money"
            }
        ]
    }
}
