const exampleInput = `n1 "Some title" "some description"
n2 "Title2" "second description"
n3 "Title3" "no description"
n1 --""--> n2
`

function start(): void {
    console.log("loaded")
    let jsonGraph = createExampleGraph()
    let graph = GraphParser.parseGraph(exampleInput)
    console.log(graph.toJson())
    new DagreGraph(graph.toJson());

}

function createExampleGraph(): JsonGraph {
    return {
        nodes: [
            {
                id: "n0",
                title: "User",
                description: "",
                style: "fill: rgb(240, 240, 240);",
                shape: "ellipse"
            },
            {
                id: "c0",
                title: "Coffee machine",
                style: "fill: rgb(240, 240, 255);",
                shape: "ellipse",
                children: {
                    nodes: [
                        {
                            id: "n1",
                            title: "Money Component",
                            description: "this component is able to process " +
                                "money. So just it keeps track of all the " +
                                "money you throw in and you get the right " +
                                "change",
                            style: "fill: rgb(220, 220, 240);",
                            shape: "rect"
                        },
                        {
                            id: "n2",
                            title: "Buttons",
                            description: "",
                            style: "fill: rgb(220, 220, 240);",
                            shape: "rect"
                        },
                        {
                            id: "n3",
                            title: "Coffee maker",
                            description: "",
                            style: "fill: rgb(220, 220, 240);",
                            shape: "rect"
                        }
                    ],
                    edges: [
                        {
                            id: "e2",
                            source: "n0",
                            target: "n2",
                            description: "pushes the coffee button",
                            style: "stroke: rgb(255, 128, 0); stroke-width: 2px;",
                            arrowHeadStyle: "fill: rgb(153, 153, 153);"
                        },
                        {
                            id: "e3",
                            source: "n1",
                            target: "n2",
                            description: "signales the money amount",
                            style: "",
                            arrowHeadStyle: "fill: rgb(153, 153, 153);"
                        },
                        {
                            id: "e4",
                            source: "n2",
                            target: "n3",
                            description: "starts if there is money",
                            style: "",
                            arrowHeadStyle: "fill: rgb(153, 153, 153);"
                        }
                    ]
                }
            }
        ],
        edges: [
            {
                id: "e0",
                source: "n0",
                target: "c0",
                description: "throws in money",
                style: "stroke: rgb(153, 153, 153); stroke-width: 1px;",
                arrowHeadStyle: "fill: rgb(153, 153, 153);"
            }
        ]
    }
}
