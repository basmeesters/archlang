const createArch = (input: string) => {
    const result = ArchitectureParser.parseGraph(input)
    expect(result).toEqual(jasmine.any(Success))
    return result.value
}

const architectureParserSpec = () => {
    describe("architecture parser class", () => {
        describe("components", () => {
            it("can parse a simple component", () => {
                const a = createArch('c1 "title" "description"\n');

                expect(a.components.length).toEqual(1);
                expect(a.components[0].id).toEqual("c1");
                expect(a.components[0].title).toEqual("title");
                expect(a.components[0].description).toEqual("description");
            });

            it("can parse a more complex component", () => {
                const desc = '(c1) "someTitle" "someDescription" red\n'
                const a = createArch(desc);

                expect(a.components.length).toEqual(1);
                expect(a.components[0].id).toEqual("c1");
                expect(a.components[0].title).toEqual("someTitle");
                expect(a.components[0].description).toEqual("someDescription");
                expect(a.components[0].shape).toEqual(NodeShape.Ellipse);
                expect(a.components[0].color).toEqual(Color.Red);
            });

            it("can parse various components at once", () => {
                const desc = `
                    (c1) "some title" "d e s c r iption" gray\n
                    |c2| "title2" ""\n
                `
                const a = createArch(desc)

                expect(a.components.length).toEqual(2);
                expect(a.components[0].id).toEqual("c1");
                expect(a.components[0].title).toEqual("some title");
                expect(a.components[0].description).toEqual("d e s c r iption");
                expect(a.components[0].shape).toEqual(NodeShape.Ellipse);
                expect(a.components[0].color).toEqual(Color.Gray);

                expect(a.components[1].id).toEqual("c2");
                expect(a.components[1].title).toEqual("title2");
                expect(a.components[1].description).toEqual("");
                expect(a.components[1].shape).toEqual(NodeShape.Rect);
                expect(a.components[1].color).toEqual(Color.Gray);
            });
        });

        describe("edges", () => {
            it("can parse a simple edge", () => {
                const desc = 'c1 --""--> c2\n';
                const a = createArch(desc);

                expect(a.connectors.length).toEqual(1);
                expect(a.connectors[0].source).toEqual("c1");
                expect(a.connectors[0].target).toEqual("c2");
            });

            it("can parse a more complex edge", () => {
                const desc = 'c1 --"some description"--> c2 blue\n';
                const a = createArch(desc);

                expect(a.connectors.length).toEqual(1);
                expect(a.connectors[0].source).toEqual("c1");
                expect(a.connectors[0].target).toEqual("c2");
                expect(a.connectors[0].description).toEqual("some description");
                expect(a.connectors[0].color).toEqual(Color.LightBlue);
            });

            it("can parse multiple edges", () => {
                const desc = `
                c1 --"some description"--> c2
                c2 --""--> c1 dark-grey
                `;
                const a = createArch(desc);

                expect(a.connectors.length).toEqual(2);
                expect(a.connectors[0].source).toEqual("c1");
                expect(a.connectors[0].target).toEqual("c2");
                expect(a.connectors[0].description).toEqual("some description");
                expect(a.connectors[0].color).toEqual(Color.DarkGray);

                expect(a.connectors[1].source).toEqual("c2");
                expect(a.connectors[1].target).toEqual("c1");
                expect(a.connectors[1].description).toEqual("");
                expect(a.connectors[1].color).toEqual(Color.DarkGray);
            });
        });

        describe("clusters", () => {
            it("can parse an empty cluster", () => {
                const desc = `
                    cluster |cl1| "cluster" "cl description"
                    end
                `;
                const a = createArch(desc);
                expect(a.components.length).toEqual(1);
                expect(a.components[0].id).toEqual("cl1");
                expect(a.components[0].title).toEqual("cluster");
                expect(a.components[0].description).toEqual("cl description")

                const children = a.components[0].children;
                expect(children).toEqual(jasmine.any(Architecture));
                expect(children.components.length).toEqual(0);
                expect(children.connectors.length).toEqual(0);
            });

            it("can parse a cluster with various components " +
               "and connectors", () => {
                const desc = `
                    cluster (c1) "title" "" dark-grey
                        c1 "title1" ""
                        c2 "title2" "description" red
                        c1 --""--> c2 blue
                    end
                `;
                const a = createArch(desc);
                expect(a.components[0].shape).toEqual(NodeShape.Ellipse);
                expect(a.components[0].color).toEqual(Color.DarkGray);

                const children = a.components[0].children;
                expect(children).toEqual(jasmine.any(Architecture));
                expect(children.components.length).toEqual(2);
                expect(children.connectors.length).toEqual(1);
            });
        });

        describe("an architecture" , () => {
            it("parses an empty description as an empty architecture", () => {
                const a = createArch("");
                expect(a.components.length).toEqual(0);
                expect(a.connectors.length).toEqual(0);
            });

            it("can parse an architecture with comments and whitespace", () => {
                const desc = `
                    c1 "some component" "with description"
                    // a cluster
                    cluster |cl1| "cl1" "" blue
                        (c2) "title1" ""
                        |c3| "title2" "description" red
                        c1 --""--> c2 gray
                        c2 --"label"--> c1 red
                    end
                    c1 --"connects"--> cl1
                `;
                const a = createArch(desc);
                expect(a.components.length).toEqual(2);
                expect(a.connectors.length).toEqual(1);

                const cluster = a.components[1].children;
                expect(cluster.components.length).toEqual(2);
                expect(cluster.connectors.length).toEqual(2);
            });
        });
    });
}
