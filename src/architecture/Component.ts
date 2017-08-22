class Component {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public shape: Shape = Shape.Rect,
        public color: Color = Color.Gray,
        public children: Architecture = undefined
    ) { }

    public toJson(): JsonNode {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            shape: this.shapeToJson(this.shape),
            style: this.colorToJson(this.color),
            children: this.children ? this.children.toJson() : undefined
        }
    }

    private shapeToJson(shape) {
        switch(shape) {
            case Shape.Ellipse:
                return "ellipse";
            case Shape.Rect:
                return "rect";
        }
    }

    private colorToJson(color) {
        switch(color) {
            case Color.Gray:
                return "fill: rgb(240, 240, 240);";
            case Color.LightBlue:
                return "";
            case Color.Red:
                return "";
        }
    }
}
