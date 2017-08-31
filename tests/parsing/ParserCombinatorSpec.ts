const parserCombinatorSpecs = () => {
    describe("parser combinators", () => {
        describe("where", () => {
            it("returns a 'Success' object when the predicate matches", () => {
                const c = "a";
                const pred = {
                    run: (x: string) => x === c,
                    description: (x: any) => ""
                };
                const result = where(pred).run(stream(c));
                expect(result).toEqual(jasmine.any(Success));
                expect(result.value).toEqual(c);
            });

            it("returns a 'Failure' object when the predicate fails", () => {
                const pred = {
                    run: (x: string) => x === "a",
                    description: (x: any) => "did not match"
                };
                const result = where(pred).run(stream("b"));
                expect(result).toEqual(jasmine.any(Failure));
                expect(result.value).toEqual(`fail: did not match`);
            });
        });

        describe("char", () => {
            it("succeeds when matching a single char given", () => {
                const result = char("a").run(stream("ab"));
                expect(result.rest.toString()).toEqual("b");
                expect(result.value).toEqual("a");
            });

            it("fails for any other char given", () => {
                const result = char("b").run(stream("ab"));
                expect(result.rest.toString()).toEqual("ab");
            });
        });

        describe("string", () => {
            it("succeeds when matching the given string", () => {
                const result = string("str").run(stream("strstr"));
                expect(result.rest.toString()).toEqual("str");
                expect(result.value).toEqual(['s', 't', 'r']);
            });
        });

        describe("either", () => {
            it("succeeds with the first parser that matches", () => {
                const result = either([char("a"), char("b")]).run(stream("b"));
                expect(result.value).toEqual("b");
            });

            it("fails when non of the parsers match", () => {
                const result = either([char("a"), char("b")]).run(stream("c"));
                expect(result.value).toEqual("either failed");
            });
        });

        describe("zeroOrMore", () => {
            it("keeps parsing the same parser as long as it succeeds", () => {
                const result = zeroOrMore(char("a")).run(stream("aaaabbb"));
                expect(result.value).toEqual(['a', 'a', 'a', 'a']);
                expect(result.rest.toString()).toEqual("bbb");
            });

            it("succeeds with an empty list when it doesn't match once", () => {
                const result = zeroOrMore(char("a")).run(stream("bbb"));
                expect(result.value).toEqual([]);
                expect(result.rest.toString()).toEqual("bbb");
            });
        });

        describe("zeroOrMoreAndIgnore", () => {
            it("parses the same parser and ignores the other", () => {
                const parser = zeroOrMoreAndIgnore(char("a"), space)
                const result = parser.run(stream("a a a aaa"));
                expect(result.value).toEqual(['a', 'a', 'a']);
                expect(result.rest.toString()).toEqual("aaa");
            });

            it("succeeds with an empty list when it doesn't match once", () => {
                const parser = zeroOrMoreAndIgnore(char("a"), space)
                const result = parser.run(stream("aaaaaa"));
                expect(result.value).toEqual([]);
                expect(result.rest.toString()).toEqual("aaaaaa");
            });
        });

        describe("not", () => {
            it("succeeds when the parser fails", () => {
                const result = not(string("str")).run(stream("not"));
                expect(result.value).toEqual("n");
            });

            it("succeeds when the parser fails", () => {
                const result = not(string("str")).run(stream("str"));
                expect(result.value).toEqual("not failed");
            });
        });

        describe("maybe", () => {
            it("succeeds when the parser matches", () => {
                const result = maybe(char("a")).run(stream("a"));
                expect(result.value).toEqual("a");
            });

            it("succeeds when the parser does not match", () => {
                const result = maybe(char("a")).run(stream("bb"));
                expect(result.value).toEqual(null);
                expect(result.rest.toString()).toEqual("bb");
            });
        });

        describe("between", () => {
            it("succeeds when it parsers all three, but takes only " +
               "the middle", () => {
                const parser = between(char("("), char("a"), char(")"));
                const result = parser.run(stream("(a)"))
                expect(result.value).toEqual("a");
            })

            it("fails if any of the three parsers fail", () => {
                const parser = between(char("("), char("a"), char(")"));
                const result = parser.run(stream("(a]"))
                expect(result.value).toEqual("fail: match ) to ]");
            })
        });

        describe("ignore", () => {
            it("succeeds when parsing (multiple) whitespace", () => {
                const result = ignore.run(stream("  "));
                expect(result.value).toEqual("  ");
            });

            it("succeeds when parsing (multiple) newlines", () => {
                const result = ignore.run(stream("\n\n"));
                expect(result.value).toEqual("\n\n");
            });

            it("succeeds when parsing comments", () => {
                const result = ignore.run(stream("// this is a comment\n"));
                expect(result.value).toEqual("this is a comment");
            });

            it("succeeds when parsing comments, newlines, and spaces", () => {
                const result = ignore.run(stream(" \n // this is a comment\n"));
                expect(result.value).toEqual(" \n this is a comment");
            });

            it("fails with everything else", () => {
                const result = ignore.run(stream("a\n // this is a comment\n"));
                expect(result.value).toEqual("");
            })
        });
    })
}
