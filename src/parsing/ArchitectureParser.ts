/**
  * Use the `ParserCombinators` parsers to provide means to parse the Archlang's
  * DSL.
  */
class ArchitectureParser {
    public static parseGraph(input: string) {
        const stream = new Stream(input)
        const result = ArchitectureParser.parseArchitecture.run(stream)
        if (result.rest.size() > 0) {
            return new Failure(
                `fail, not all text was parsed: ${result.rest.toString()}`,
                result.rest
            )
        } else {
            return result
        }
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
            ArchitectureParser.parseShapeAndParser(ArchitectureParser.parseId),
            string(" "),
            ArchitectureParser.parseDescription,
            string(" "),
            ArchitectureParser.parseDescription,
            ArchitectureParser.parseColor,
            string("\n")
        ]).map(list => {
            const id = list[0][0]
            const shape = list[0][1]
            const title = list[2].join("")
            const description = list[4].join("")
            const color = list[5] ? list[5] : Color.Gray
            return new Component(id, title, description, shape, color)
        })

    private static parseComponents: Parser =
        zeroOrMoreAndIgnore(ArchitectureParser.parseComponent, whitespace)

    private static parseArrow: Parser =
        between(
            string("--"),
            ArchitectureParser.parseDescription,
            string("-->")
        )


    private static parseConnector: Parser =
        sequence([
            ArchitectureParser.parseId,
            string(" "),
            ArchitectureParser.parseArrow,
            string(" "),
            ArchitectureParser.parseId,
            ArchitectureParser.parseColor,
            string("\n")
        ]).map(list => {
            const source = list[0].join("")
            const label = list[2].join("")
            const target = list[4].join("")
            const color = list[5] ? list[5] : Color.DarkGray
            return new Connector(source, target, label, color)
        })

    private static parseConnectors: Parser =
        zeroOrMoreAndIgnore(ArchitectureParser.parseConnector, whitespace)

    private static parseCluster: Parser =
        sequence([
            ArchitectureParser.parseShapeAndParser(string("cluster")),
            string(" "),
            ArchitectureParser.parseId,
            ArchitectureParser.parseColor,
            string("\n"),
            whitespace,
            ArchitectureParser.parseComponents,
            ArchitectureParser.parseConnectors,
            string("end\n")
        ]).map(list => {
            const id = list[2].join("")
            const title = id
            const description = ""
            const shape = list[0][1]
            const color = list[3] ? list[3] : Color.Gray
            const architecture = new Architecture(list[6], list[7])

            return new Component(id, title, description, shape, color,
                architecture)
        })

    private static parseClusters: Parser =
        zeroOrMoreAndIgnore(
            either([
                ArchitectureParser.parseCluster,
                ArchitectureParser.parseComponent
            ]),
            whitespace
        )

    private static parseArchitecture: Parser =
        sequence([
            whitespace,
            ArchitectureParser.parseClusters,
            whitespace,
            ArchitectureParser.parseConnectors
        ]).map(list => {
            const nodes = list[1]
            const edges = list[3]
            return new Architecture(nodes, edges)
        })
}
