/**
  * Using the `ParserCombinators` provide parsers to provide the Archlang's DSL.
  */
class GraphParser {
    public static parseGraph(input: string) {
        const stream = new Stream(input)
        return GraphParser.parseArchitecture.run(stream).fold(
                v => v,
                e => e
            )
    }

    private static parseId: Parser =
        zeroOrMore(not(either([string(" "), string("\n")])))

    private static parseDescription: Parser =
        between(
            char('"'),
            zeroOrMore(not(string('"'))),
            char('"'),
        )

    private static parseComponent: Parser =
        separatorAndEnd([
            GraphParser.parseId,
            GraphParser.parseDescription,
            GraphParser.parseDescription
        ], string(" "), string("\n")).map(list => {
            const id = list[0].join("")
            const title = list[1].join("")
            const description = list[2].join("")
            return new Component(id, title, description)
        })

    private static parseArrow: Parser =
        between(
            string("--"),
            GraphParser.parseDescription,
            string("-->")
        )


    private static parseConnector: Parser =
        separatorAndEnd([
            GraphParser.parseId,
            GraphParser.parseArrow,
            GraphParser.parseId
        ], char(" "), char("\n")).map(list => {
            const source = list[0].join("")
            const target = list[2].join("")
            const label = list[1].join("")
            return new Connector(source, target, label)
        })

    private static parseCluster: Parser =
        sequence([
            string("cluster "),
            GraphParser.parseId,
            string("\n"),
            zeroOrMore(GraphParser.parseComponent),
            zeroOrMore(GraphParser.parseConnector),
            string("end\n")
        ]).map(list => {
            const id = list[1].join("")
            const title = id
            const description = ""
            const architecture = new Architecture(list[3], list[4])

            return new Component(id, title, description, Shape.Rect, Color.Gray, architecture)
        })

    private static parseArchitecture: Parser =
        sequence([
            whitespace,
            zeroOrMore(either([GraphParser.parseCluster, GraphParser.parseComponent])),
            whitespace,
            zeroOrMore(GraphParser.parseConnector)
        ]).map(list => {
            const nodes = list[1]
            const edges = list[3]
            return new Architecture(nodes, edges)
        })
}