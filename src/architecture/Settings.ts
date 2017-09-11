class Settings {
    public static DEFAULT_SHAPE = NodeShape.Rect
    public static DEFAULT_NODE_COLOR = Color.Gray
    public static DEFAULT_EDGE_COLOR = Color.DarkGray
    public static DEFAULT_MODE = VisualizationMode.Dynamic

    constructor(
        public defaultNodeShape: NodeShape,
        public defaultNodeColor: Color,
        public defaultEdgeColor: Color,
        public visualizatonMode: VisualizationMode
    ) { }

    public static empty = new Settings(
        Settings.DEFAULT_SHAPE,
        Settings.DEFAULT_NODE_COLOR,
        Settings.DEFAULT_EDGE_COLOR,
        Settings.DEFAULT_MODE
    )

    /**
      * Convenience method to create an actual color from a Color enum.
      */
    public colorToJson = (color: Color, isNode: boolean): string => {
        const defaultColor = isNode ? this.defaultNodeColor : this.defaultEdgeColor
        switch(color) {
            case Color.Gray:
                return "rgb(230, 230, 230);";
            case Color.LightBlue:
                return "rgb(210, 210, 255);";
            case Color.Red:
                return "rgb(255, 210, 210);";
            case Color.DarkGray:
                return "rgb(153, 153, 153);"
            case Color.Default:
                return this.colorToJson(defaultColor, isNode)
        }
    }
}
