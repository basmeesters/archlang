/**
  * A Connector (edge) connects two Components.
  */
class Connector {
    constructor(
        public source: string,
        public target: string,
        public description: string,
        public color: Color = Color.DarkGray,
        public style: EdgeStyle = EdgeStyle.Normal
    ) { }

    public toJson(id: string): JsonEdge {
        const color = colorToJson(this.color);
        const style = this.styleToJson(this.style);
        return {
            id: id,
            source: this.source,
            target: this.target,
            description: this.description,
            style: `stroke: ${color} ${style}`,
            arrowHeadStyle: `fill: ${color};`
        }
    }

    private styleToJson(style: EdgeStyle): string {
        switch(style) {
            case EdgeStyle.Normal:
                return "stroke-width: 1.5px;";
            case EdgeStyle.Stroked:
                return "stroke-width: 1.5px; stroke-dasharray: 5, 5;";
            case EdgeStyle.Fat:
                return "stroke-width: 3.0px;";
        }
    }
}
