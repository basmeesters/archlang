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
                [l.join(""), NodeShape.Rect]
            ),
            between(string("("), parser, string(")")).map(l =>
                [l.join(""), NodeShape.Ellipse]
            ),
            parser.map(l => [l.join(""), NodeShape.Default])
        ])
    }

    private static parseStyleAndParser(parser: Parser): Parser {
        return either([
            between(string("=="), parser, string("==>")).map(l =>
                [l, EdgeStyle.Fat]
            ),
            between(string("--"), parser, string("-->")).map(l =>
                [l, EdgeStyle.Normal]
            ),
            between(string("-."), parser, string(".->")).map(l =>
                [l, EdgeStyle.Stroked]
            )
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
            const color = list[5] ? list[5] : Color.Default
            return new Component(id, title, description, shape, color)
        })

    private static parseComponents: Parser =
        zeroOrMoreAndIgnore(ArchitectureParser.parseComponent, ignore)

    /**
      * Example: --"some label"-->
      */
    private static parseArrow: Parser =
        ArchitectureParser.parseStyleAndParser(
            ArchitectureParser.parseDescription
        );

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
            const label = list[2][0].join("")
            const style = list[2][1]
            const target = list[4].join("")
            const color = list[5] ? list[5] : Color.Default
            return new Connector(source, target, label, color, style)
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
    private static parseCluster(settings: Settings): Parser {
        return sequence([
            string("cluster "),
            ArchitectureParser.parseComponent,
            ignore,
            ArchitectureParser.parseComponents,
            ArchitectureParser.parseConnectors,
            string("end\n")
        ]).map(list => {
            const component = list[1]
            const architecture =
                new Architecture(settings, list[3], list[4])

            return new Component(component.id, component.title,
                component.description, component.shape, component.color,
                architecture)
        })
    }

    private static parseClusters(settings: Settings): Parser {
        return zeroOrMoreAndIgnore(
            either([
                ArchitectureParser.parseCluster(settings),
                ArchitectureParser.parseComponent
            ]),
            ignore
        )
    }

    private static parseKeyValue(key: string, value: Parser): Parser {
        return sequence([
            string(key),
            string(":"),
            value
        ]).map(l => l[2])
    }

    private static parseShape: Parser =
        sequence([
            string(" "),
            either([
                string("rect").map(_l => NodeShape.Rect),
                string("ellipse").map(_l => NodeShape.Ellipse)
            ])
        ]).map(l => l[1])

    private static parseMode: Parser =
        sequence([
            string(" "),
            either([
                string("static").map(l => VisualizationMode.Static),
                string("expanded").map(l => VisualizationMode.Expanded)
            ])
        ]).map(l => l[1])

    private static parseSettings: Parser =
        sequence([
            string("settings: "),
            between(
                string("{"),
                sequence([
                    ignore,
                    maybe(ArchitectureParser.parseKeyValue("component-shape",
                        ArchitectureParser.parseShape),
                        Settings.DEFAULT_SHAPE),
                    ignore,
                    maybe(ArchitectureParser.parseKeyValue("component-color",
                        ArchitectureParser.parseColor),
                        Settings.DEFAULT_NODE_COLOR
                    ),
                    ignore,
                    maybe(ArchitectureParser.parseKeyValue("edge-color",
                        ArchitectureParser.parseColor),
                        Settings.DEFAULT_EDGE_COLOR
                    ),
                    ignore,
                    maybe(ArchitectureParser.parseKeyValue("mode",
                        ArchitectureParser.parseMode),
                        Settings.DEFAULT_MODE
                    ),
                    ignore,
                ]),
                string("}")
            )
        ]).map(l => {
            const shape = l[1][1]
            const nodeColor = l[1][3]
            const edgeColor = l[1][5]
            const mode = l[1][7]

            return new Settings(shape, nodeColor, edgeColor, mode)
        })


    private static parseArchitecture: Parser =
        sequence([
            ignore,
            maybe(ArchitectureParser.parseSettings).map(l => {
                return l ? l : Settings.empty
            })
        ]).chain(l => {
            const settings = l[1]
            return sequence([
                ignore,
                ArchitectureParser.parseClusters(settings),
                ignore,
                ArchitectureParser.parseConnectors
            ]).map(list => {
                const nodes = list[1]
                const edges = list[3]
                return new Architecture(settings, nodes, edges)
            })
        })
}
