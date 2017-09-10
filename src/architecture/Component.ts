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
        public shape: NodeShape,
        public color: Color,
        public children?: Architecture
    ) { }

    public toJson(settings: Settings): JsonNode {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            shape: this.shapeToJson(this.shape, settings),
            style: `fill: ${settings.colorToJson(this.color, true)}`,
            children: this.children ? this.children.toJson() : undefined
        }
    }

    private shapeToJson(shape: NodeShape, settings: Settings): string {
        switch(shape) {
            case NodeShape.Ellipse:
                return "ellipse";
            case NodeShape.Rect:
                return "rect";
            case NodeShape.Default:
                return this.shapeToJson(settings.defaultNodeShape, settings)
        }
    }
}
