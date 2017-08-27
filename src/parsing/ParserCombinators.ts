/**
  * Predicate that needs to be checked for parsing. It needs a 'check' function
  * and a description stating what is being checked for easy error messaging.
  */
type Predicate = {
    run: (val: string) => boolean,
    description: (val: string) => string
}

/**
  * Check if a predicate function returns true on the head of the stream given.
  */
const where = (pred: Predicate): Parser => {
    return new Parser(stream => {
        if (stream.size() === 0) {
            return new Failure('unexpected end', stream)
        }
        const value = stream.head()
        if (pred.run(value)) {
            return new Success(value, stream.move(1))
        }
        return new Failure(`fail: ${pred.description(value)}`, stream)
    })
}

/**
  * Match a char.
  */
const char = (c: string): Parser => {
    return where({
        run: x => x === c,
        description: x => `match ${c} to ${x}`
    })
}

/**
  * Match any of the parsers given (and return the first that does).
  */
const either = (list: Array<Parser>): Parser => {
    return new Parser((stream: Stream) => {
        for (let i = 0; i < list.length; i++) {
            const parser = list[i]
            const result = parser.run(stream)
            if (result instanceof Success) {
                return result
            }
        }
        return new Failure('either failed', stream)
    })
}

/**
  * Always succeed parsing.
  */
const always = (value: any): Parser =>
    new Parser((stream: Stream) => new Success(value, stream));


/**
  * Always fail parsing.
  */
const never = (value: any): Parser =>
    new Parser((stream: Stream) => new Failure(value, stream));

/**
  * Apply each of the parsers in succession and concat the results.
  */
const append = (p1: Parser, p2: Parser): Parser => {
    return p1.chain(vs => p2.map(v => vs.concat([v])));
}

/**
  * Parse each of the parsers given in sequence and return all results.
  */
const sequence = (list: Array<Parser>): Parser => {
    return list.reduce((acc: Parser, parser: Parser) =>
        append(acc, parser), always([]))
}

/**
  * Parse zero or more of the same parser and ignore all instances of the
  * second parser.
  */
const zeroOrMoreAndIgnore = (parser: Parser, ignore: Parser): Parser =>
    zeroOrMore(sequence([
        parser,
        whitespace
    ])).map((list) => list.map((l: any, i: number) => l[0]))

/**
  * Helper function to flatten an array of arrays.
  */
const flatten = (data: Array<Array<any>>): Array<any> =>
    data.reduce((acc, e) => acc.concat(e), [])

const maybe = (parser: Parser): Parser =>
    new Parser(stream =>
        parser.run(stream)
            .fold(
            (v, s) => new Success(v, s),
            (v) => new Success(null, stream)))

/**
  * Give a parse result without consuming anything from the stream.
  */
const lookahead = (parser: Parser): Parser =>
    new Parser((stream: Stream) =>
        parser.run(stream)
            .fold(
            (v) => new Success(v, stream),
            (v) => new Failure(v, stream)))

/**
  * Parse zero or more occurences of the same parser.
  */
const zeroOrMore = (parser: Parser): Parser =>
    new Parser((stream: Stream) =>
        parser
            .run(stream)
            .fold(
            (value, s) =>
                zeroOrMore(parser).map(rest => [value].concat(rest)).run(s),
            (value, s) =>
                new Success([], stream)));

/**
  * Match a string.
  */
const string = (str: string): Parser => sequence(str.split('').map(char));

/**
  * Succeed if the parser failed and vice-versa.
  */
const not = (parser: Parser): Parser =>
    new Parser((stream: Stream) =>
        parser.run(stream)
            .fold(
            (value, s) => new Failure('not failed', stream),
            (value, s) =>
                stream.size() > 0
                    ? new Success(stream.head(), stream.move(1))
                    : new Failure('unexpected end', stream)
            )
        )

/**
  * Parse the parser and ignore the two parser results 'around' it.
  */
const between = (l: Parser, p: Parser, r: Parser): Parser =>
    sequence([l, p, r]).map(v => v[1])

const space: Parser = string(" ")

const newLine: Parser = string("\n")

const comment: Parser = between(
    string("//"),
    zeroOrMore(not(string("\n"))),
    string("\n")
)

const whitespace: Parser = zeroOrMore(either([space, newLine, comment]))
