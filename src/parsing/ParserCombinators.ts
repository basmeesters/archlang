const where = pred =>
    new Parser(stream => {
        if (stream.length === 0) {
            return new Failure('unexpected end', stream)
        }
        const value = stream.head()
        if (pred(value)) {
            return new Success(value, stream.move(1))
        }
        return new Failure('predicate did not match', stream)
    })

const char = c => where(x => x === c)

const either = list =>
    new Parser(stream => {
        for (let i = 0; i < list.length; i++) {
            const parser = list[i]
            const result = parser.run(stream)
            if (result instanceof Success) {
                return result
            }
        }
        return new Failure('either failed', stream)
    })

const always = (value: any): Parser =>
    new Parser((stream) => new Success(value, stream))

const never = (value: any): Parser =>
    new Parser(stream => new Failure(value, stream))

const append = (p1: Parser, p2: Parser): Parser =>
    p1.chain(vs => p2.map(v => vs.concat([v])))

const concat = (p1: Parser, p2: Parser): Parser =>
    p1.chain(xs => p2.map(ys => xs.concat(ys)))

const sequence = list =>
    list.reduce((acc, parser) => append(acc, parser), always([]))

const separatorAndEnd = (list, separator, end) => {
    return append(
        sequence(flatten(list.map(l => [l, separator])).slice(0, -1)
    ), end).map(l =>
        l.reduce((acc, el) =>
            typeof el == "string" ? acc : acc.concat([el])
        , [])
    )
}


const flatten = (data: Array<Array<any>>): Array<any> =>
    data.reduce((acc, e) => acc.concat(e), [])


const maybe = (parser: Parser): Parser =>
    new Parser(stream =>
        parser.run(stream)
            .fold(
            (v, s) => new Success(v, s),
            (v) => new Success(null, stream)))

const lookahead = (parser: Parser): Parser =>
    new Parser(stream =>
        parser.run(stream)
            .fold(
            (v) => new Success(v, stream),
            (v) => new Failure(v, stream)))


const zeroOrMore = (parser: Parser): Parser =>
    new Parser(stream =>
        parser
            .run(stream)
            .fold(
            (value, s) => zeroOrMore(parser).map(rest => [value].concat(rest)).run(s),
            (value, s) => new Success([], stream)))

const string = (str: string): Parser => sequence(str.split('').map(char))

const not = (parser: Parser): Parser =>
    new Parser(stream =>
        parser.run(stream)
            .fold(
            (value, s) => new Failure('not failed', stream),
            (value, s) =>
                stream.length > 0
                    ? new Success(stream.head(), stream.move(1))
                    : new Failure('unexpected end', stream)))

const between = (l: Parser, p: Parser, r: Parser): Parser =>
    sequence([l, p, r]).map(v => v[1])

const takeLeft = (l: Parser, r: Parser): Parser =>
    sequence([l, r]).map(v => v[0])
