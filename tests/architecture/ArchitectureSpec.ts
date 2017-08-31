const standardDescription = `
    (n1) "node" "some description" red
    |n2| "node2" "" blue
    n1 --""--> n2 gray
`;

describe("architecture class", () => {
    it("consists of components", () => {
        const a = createArch(standardDescription);
        expect(a.components[0]).toEqual(jasmine.any(Component));
    });

    it("consists of connectors connecting them" , () => {
        const a = createArch(standardDescription);
        expect(a.connectors[0]).toEqual(jasmine.any(Connector));
    });

    it("it returns a list of empty errors if the architecture is valid", () => {
        const a = createArch(standardDescription);
        const errors = a.validate();
        expect(errors.length).toEqual(0);
    });

    it("returns a list of errors when the architecture is not valid", () => {
        const desc = `
            n1 --""--> n2
            n3 --""--> n2
        `
        const a = createArch(desc);
        const errors = a.validate();

        // Duplicates are filtered
        expect(errors.length).toEqual(3);
        expect(errors[0]).toEqual("n1 does not exist as component")
        expect(errors[1]).toEqual("n2 does not exist as component")
        expect(errors[2]).toEqual("n3 does not exist as component")
    });

    it("can be translated to JSON", () => {
        const a = createArch(standardDescription);
        const json = a.toJson();
        expect(json).toEqual({
            nodes: [
                { id: 'n1',
                  title: 'node',
                  description: 'some description',
                  shape: 'ellipse',
                  style: 'fill: rgb(255, 210, 210);',
                  children: undefined
                },
                { id: 'n2',
                  title: 'node2',
                  description: '',
                  shape: 'rect',
                  style: 'fill: rgb(210, 210, 255);',
                  children: undefined
                }
            ],
            edges: [
                { id: 'e0',
                  source: 'n1',
                  target: 'n2',
                  description: '',
                  style: 'stroke: rgb(153, 153, 153); stroke-width: 1.5px;',
                  arrowHeadStyle: 'fill: rgb(153, 153, 153);;'
                }
            ]
        })
    });
});
