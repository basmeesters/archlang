/**
  * Shape a Component can have
  */
enum NodeShape {
    Ellipse,
    Rect,
    Default
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
    Default
}

type HashMap = {
  [key: string]: string;
}
