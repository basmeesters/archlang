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
        zeroOrMore(
            not(
                either([
                    string(" "),
                    string("\n"),
                    string("|"),
                    string("("),
                    string(")")]
                )
            )
        )

    private static parseDescription: Parser =
        between(
            char('"'),
            zeroOrMore(not(string('"'))),
            char('"'),
        )

    private static parseShapeAndParser(parser: Parser): Parser {
        return either([
            between(string("|"), parser, string("|")).map(l =>
                [l.join(""), Shape.Rect]
            ),
            between(string("("), parser, string(")")).map(l =>
                [l.join(""), Shape.Ellipse]
            ),
            parser.map(l => [l.join(""), Shape.Rect])
        ])
    }

    private static parseColor: Parser =
        maybe(
            sequence([
                string(" "),
                either([
                    string("blue").map(c => Color.LightBlue),
                    string("gray").map(c => Color.Gray),
                    string("red").map(c => Color.Red),
                    string("dark-grey").map(c => Color.DarkGray)
                ])
            ]).map(l => l[1])
        )

    private static parseComponent: Parser =
        sequence([
            GraphParser.parseShapeAndParser(GraphParser.parseId),
            string(" "),
            GraphParser.parseDescription,
            string(" "),
            GraphParser.parseDescription,
            GraphParser.parseColor,
            string("\n")
        ]).map(list => {
            const id = list[0][0]
            const shape = list[0][1]
            const title = list[2].join("")
            const description = list[4].join("")
            const color = list[5] ? list[5] : Color.Gray
            return new Component(id, title, description, shape, color)
        })

    private static parseArrow: Parser =
        between(
            string("--"),
            GraphParser.parseDescription,
            string("-->")
        )


    private static parseConnector: Parser =
        sequence([
            GraphParser.parseId,
            string(" "),
            GraphParser.parseArrow,
            string(" "),
            GraphParser.parseId,
            GraphParser.parseColor,
            string("\n")
        ]).map(list => {
            const source = list[0].join("")
            const label = list[2].join("")
            const target = list[4].join("")
            const color = list[5] ? list[5] : Color.DarkGray
            return new Connector(source, target, label, color)
        })

    private parseClusterType: Parser

    private static parseCluster: Parser =
        sequence([
            GraphParser.parseShapeAndParser(string("cluster")),
            string(" "),
            GraphParser.parseId,
            GraphParser.parseColor,
            string("\n"),
            zeroOrMore(GraphParser.parseComponent),
            zeroOrMore(GraphParser.parseConnector),
            string("end\n")
        ]).map(list => {
            const id = list[2].join("")
            const title = id
            const description = ""
            const shape = list[0][1]
            const color = list[3] ? list[3] : Color.Gray
            const architecture = new Architecture(list[5], list[6])

            return new Component(id, title, description, shape, color, architecture)
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
