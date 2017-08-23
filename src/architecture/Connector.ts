class Connector {
    constructor(
        public source: string,
        public target: string,
        public label: string,
        public color: Color = Color.DarkGray
    ) { }

    public toJson(id: string): JsonEdge {
        const color = Component.colorToJson(this.color);
        return {
            id: id,
            source: this.source,
            target: this.target,
            description: this.label,
            style: `stroke: ${color}; stroke-width: 1.5px;`,
            arrowHeadStyle: `fill: ${color};`
        }
    }
}
