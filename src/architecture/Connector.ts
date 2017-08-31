/**
  * A Connector (edge) connects two Components.
  */
class Connector {
    constructor(
        public source: string,
        public target: string,
        public description: string,
        public color: Color = Color.DarkGray
    ) { }

    public toJson(id: string): JsonEdge {
        const color = colorToJson(this.color);
        return {
            id: id,
            source: this.source,
            target: this.target,
            description: this.description,
            style: `stroke: ${color} stroke-width: 1.5px;`,
            arrowHeadStyle: `fill: ${color};`
        }
    }
}
