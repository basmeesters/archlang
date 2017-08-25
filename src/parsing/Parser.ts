/**
  * Create a parser by providing a parse function. The Parser object contains
  * helper functions to chain and map over existing parsers.
  */
class Parser {
    constructor(
        private parse: (stream: Stream) => Result
    ) { }

    /**
      * Run the parser over the stream.
      */
    public run(stream: Stream) {
        return this.parse(stream)
    }

    /**
      * Map the function given over the result of parsing.
      */
    public map(f: (val: any) => any): Parser {
        return new Parser(stream =>
            this.parse(stream).map(f)
        )
    }

    /**
      * First parse the parser given in the constructor, then parse the
      * parser given as argument.
      */
    public chain(f: (val: any) => Parser): Parser {
        return new Parser(stream =>
            this.parse(stream).chain((v, s) => f(v).run(s))
        )
    }

    /**
      * Fold the function given over the result of parsing.
      */
    public fold(
            success: (val: any, rest: Stream) => any,
            failure: (val: any, rest: Stream) => any
        ): Parser {
        return new Parser((stream: Stream) =>
            this.parse(stream).fold(success, failure)
        )
    }
}
