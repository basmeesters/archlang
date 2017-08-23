class Connector {
    constructor(
        public source: string,
        public target: string,
        public label: string,
        public color: Color = Color.Gray
    ) { }

    public toJson(id: string): JsonEdge {
        return {
            id: id,
            source: this.source,
            target: this.target,
            description: this.label,
            style: "",
            arrowHeadStyle: "fill: rgb(153, 153, 153);"
        }
    }
}
