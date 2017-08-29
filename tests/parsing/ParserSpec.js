const createParser = () => {
    const f = (strm) => new Success(strm.head(), strm.move(1));
    return new Parser(f);
}

const parserSpec = () => {
    describe("parser class", () => {
        it("is created by proving a stream to result function", () => {
            const f = (strm) => new Success(strm.head(), strm.move(1));
            const p = new Parser(f);
            expect(p).toEqual(jasmine.any(Parser));
        });

        it("run(stream) invokes the parse function", () => {
            const parser = createParser();
            const result = parser.run(stream("ab"))
            expect(result).toEqual(jasmine.any(Success))
            expect(result.value).toEqual("a")
            expect(result.rest.toString()).toEqual('b')
        });

        it("map(f) applies `f` over the result of parsing", () => {
            const parser = createParser().map(r => r.toUpperCase());
            const result = parser.run(stream("ab"))
            expect(result.value).toEqual("A");
        });

        it("chain(f) invokes `run` and chains f to the result", () => {
            const parser = createParser();
            const chainedParser = parser.chain((v) => createParser());
            const result = chainedParser.run(stream("ab"))
            expect(result.value).toEqual("b")
        });

        it("fold(s, f) invokes run and executes the correct " +
           "result function", () => {
             const func = (v, s) => v.toUpperCase();
             const successParser = createParser().fold(func, func);

             const f = strm => new Failure('fail', strm);
             const failParser = new Parser(f).fold(func, func);

             const successResult = successParser.run(stream("ab"));
             const failResult = failParser.run(stream("ab"));

             expect(successResult).toEqual("A");
             expect(failResult).toEqual("FAIL");
         });
    });
}
