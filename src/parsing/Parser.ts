/**
  * Create a parser by providing a parse function. The Parser object contains
  * helper functions to chain and map over existing parsers.
  */
class Parser {
    constructor(
        private parse: (strm: Stream) => Result
    ) { }

    /**
      * Run the parser over the strm.
      */
    public run(strm: Stream) {
        return this.parse(strm)
    }

    /**
      * Map the function given over the result of parsing.
      */
    public map(f: (val: any) => any): Parser {
        return new Parser(strm =>
            this.parse(strm).map(f)
        )
    }

    /**
      * First parse the parser given in the constructor, then parse the
      * parser given as argument.
      */
    public chain(f: (val: any) => Parser): Parser {
        return new Parser(strm =>
            this.parse(strm).chain((v, s) => f(v).run(s))
        )
    }

    /**
      * Fold the function given over the result of parsing.
      */
    public fold(
            success: (val: any, rest: Stream) => any,
            failure: (val: any, rest: Stream) => any
        ): Parser {
        return new Parser((strm: Stream) =>
            this.parse(strm).fold(success, failure)
        )
    }
}
