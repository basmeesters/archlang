/**
  * Shape a Component can have
  */
enum NodeShape {
    Ellipse,
    Rect
}

enum EdgeStyle {
    Normal,
    Fat,
    Stroked
}

/**
  * Color that a Component and a Connector can have.
  */
enum Color {
    Gray,
    DarkGray,
    LightBlue,
    Red,
}

type HashMap = {
  [key: string]: string;
}

/**
  * Convenience method to create an actual color from a Color enum.
  */
const colorToJson = (color: Color): string => {
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
