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

    /**
      * Example: n1
      */
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

    /**
      * Example: "some description"
      */
    private static parseDescription: Parser =
        between(
            char('"'),
            zeroOrMore(not(string('"'))),
            char('"'),
        )

    /**
      * |<parser>| or (<parser>) where <parser> can be any parser.
      */
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

    /**
      * Succeeds when parsing one of the available colors or nothing.
      */
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

    /**
      * Example: (n1) "some title" "some description" blue\n
      */
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
        zeroOrMoreAndIgnore(ArchitectureParser.parseComponent, ignore)

    /**
      * Example: --"some label"-->
      */
    private static parseArrow: Parser =
        between(
            string("--"),
            ArchitectureParser.parseDescription,
            string("-->")
        )

    /**
      * Example: n1 --"label"--> n2 red
      */
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
        zeroOrMoreAndIgnore(ArchitectureParser.parseConnector, ignore)

    /**
      * Example:
      *
      * cluster c1 "cluster" "description" blue
      *  ...
      *  end
      */
    private static parseCluster: Parser =
        sequence([
            string("cluster "),
            ArchitectureParser.parseComponent,
            ignore,
            ArchitectureParser.parseComponents,
            ArchitectureParser.parseConnectors,
            string("end\n")
        ]).map(list => {
            const component = list[1]
            const architecture = new Architecture(list[3], list[4])

            return new Component(component.id, component.title,
                component.description, component.shape, component.color,
                architecture)
        })

    private static parseClusters: Parser =
        zeroOrMoreAndIgnore(
            either([
                ArchitectureParser.parseCluster,
                ArchitectureParser.parseComponent
            ]),
            ignore
        )

    private static parseArchitecture: Parser =
        sequence([
            ignore,
            ArchitectureParser.parseClusters,
            ignore,
            ArchitectureParser.parseConnectors
        ]).map(list => {
            const nodes = list[1]
            const edges = list[3]
            return new Architecture(nodes, edges)
        })
}
