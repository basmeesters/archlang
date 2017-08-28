/**
  * Predicate that needs to be checked for parsing. It needs a 'check' function
  * and a description stating what is being checked for easy error messaging.
  */
type Predicate = {
    run: (val: string) => boolean,
    description: (val: string) => string
}

/**
  * Check if a predicate function returns true on the head of the strm given.
  */
const where = (pred: Predicate): Parser => {
    return new Parser(strm => {
        if (strm.size() === 0) {
            return new Failure('unexpected end', strm)
        }
        const value = strm.head()
        if (pred.run(value)) {
            return new Success(value, strm.move(1))
        }
        return new Failure(`fail: ${pred.description(value)}`, strm)
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
  * Match a string.
  */
const string = (str: string): Parser => sequence(str.split('').map(char));

/**
  * Match any of the parsers given (and return the first that does).
  */
const either = (list: Array<Parser>): Parser => {
    return new Parser((strm: Stream) => {
        for (let i = 0; i < list.length; i++) {
            const parser = list[i]
            const result = parser.run(strm)
            if (result instanceof Success) {
                return result
            }
        }
        return new Failure('either failed', strm)
    })
}

/**
  * Always succeed parsing.
  */
const always = (value: any): Parser =>
    new Parser((strm: Stream) => new Success(value, strm));


/**
  * Always fail parsing.
  */
const never = (value: any): Parser =>
    new Parser((strm: Stream) => new Failure(value, strm));

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
    const flatten = (data: Array<Array<any>>): Array<any> =>
        data.reduce((acc, e) => acc.concat(e), [])
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
        ignore
    ])).map((list) => list.map((l: any, i: number) => l[0]))

const maybe = (parser: Parser): Parser =>
    new Parser(strm =>
        parser.run(strm)
            .fold(
            (v, s) => new Success(v, s),
            (v) => new Success(null, strm)))

/**
  * Parse zero or more occurences of the same parser.
  */
const zeroOrMore = (parser: Parser): Parser =>
    new Parser((strm: Stream) =>
        parser
            .run(strm)
            .fold(
            (value, s) =>
                zeroOrMore(parser).map(rest => [value].concat(rest)).run(s),
            (value, s) =>
                new Success([], strm)));

/**
  * Succeed if the parser failed and vice-versa.
  */
const not = (parser: Parser): Parser =>
    new Parser((strm: Stream) =>
        parser.run(strm)
            .fold(
            (value, s) => new Failure('not failed', strm),
            (value, s) =>
                strm.size() > 0
                    ? new Success(strm.head(), strm.move(1))
                    : new Failure('unexpected end', strm)
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
    string("// "),
    zeroOrMore(not(string("\n"))),
    string("\n")
).map(l => l.join(""))

const ignore: Parser = zeroOrMore(
    either([space, newLine, comment])
).map(l => l.join(""))
