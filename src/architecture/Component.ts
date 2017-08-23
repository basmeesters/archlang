class Component {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public shape: Shape = Shape.Rect,
        public color: Color = Color.Gray,
        public children?: Architecture
    ) { }

    public toJson(): JsonNode {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            shape: this.shapeToJson(this.shape),
            style: `fill: ${Component.colorToJson(this.color)}`,
            children: this.children ? this.children.toJson() : undefined
        }
    }

    private shapeToJson(shape: Shape): string {
        switch(shape) {
            case Shape.Ellipse:
                return "ellipse";
            case Shape.Rect:
                return "rect";
        }
    }

    public static colorToJson(color: Color): string {
        switch(color) {
            case Color.Gray:
                return "rgb(230, 230, 230);";
            case Color.LightBlue:
                return "rgb(210, 210, 255);";
            case Color.Red:
                return "rgb(255, 210, 210);";
            case Color.DarkGray:
                return "rgb(153, 153, 153);"
        }
    }
}
