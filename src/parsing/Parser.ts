/**
  * Create a parser by providing a parse function. The Parser object contains
  * helper functions to chain and map over existing parsers.
  */
class Parser {
    constructor(private parse: (stream) => Result) { }

    /**
      * Run the parser over the stream.
      */
    public run(iterable) {
        if (iterable instanceof Stream) {
            return this.parse(iterable)
        } else {
            return this.parse(new Stream(iterable))
        }
    }

    /**
      * Map the function given over the result of parsing.
      */
    public map(f): Parser {
        return new Parser(stream => this.parse(stream).map(f))
    }

    /**
      * Chain the function given over the result of parsing.
      */
    public chain(f): Parser {
        return new Parser(stream => this.parse(stream).chain((v, s) => f(v).run(s)))
    }

    /**
      * Fold the function given over the result of parsing.
      */
    public fold(s, f): Parser {
        return new Parser(stream => this.parse(stream).fold(s, f))
    }
}
