class GraphParser {
    public static parseGraph(input: string) {
        return sequence([
            zeroOrMore(GraphParser.parseComponent),
            zeroOrMore(GraphParser.parseConnector)
        ])
            .run(input)
            .fold(
                v => new Architecture(v[0], v[1]),
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
}
