/**
  * Component (or node) present in an architecture. Each component potentially
  * also contains a 'sub-architecture'. Currently only one level of nesting
  * is supported in the parser.
  */
class Component {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public shape: NodeShape = NodeShape.Rect,
        public color: Color = Color.Gray,
        public children?: Architecture
    ) { }

    public toJson(): JsonNode {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            shape: this.shapeToJson(this.shape),
            style: `fill: ${colorToJson(this.color)}`,
            children: this.children ? this.children.toJson() : undefined
        }
    }

    private shapeToJson(shape: NodeShape): string {
        switch(shape) {
            case NodeShape.Ellipse:
                return "ellipse";
            case NodeShape.Rect:
                return "rect";
        }
    }
}
