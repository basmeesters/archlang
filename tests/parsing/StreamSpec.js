const streamSpec = () => {
    describe("stream", () => {
        it("creates a new stream from a string", () => {
            const s = stream("some string");
            expect(s).toEqual(jasmine.any(Stream));
        });

        it("head() returns the first element of the stream", () => {
            const s = stream("some string");
            expect(s.head()).toEqual("s");
        });

        it("toString() returns the original string", () => {
            const s = stream("some string");
            expect(s.toString()).toEqual("some string");
        });

        it("size() returns the length of the original string", () => {
            const s = stream("some string");
            expect(s.size()).toEqual(11);
        });

        it("move(number) returns a new stream by dropping <number> " +
           "characters the original string", () => {
            const s = stream("some string");
            expect(s.move(5).toString()).toEqual("string");
        });
    })
}
