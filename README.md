Archlang
========

Archlang is a small utility application (to be) that allows you to _describe_ a
graph-like structure (such as a software architecture diagram, hence _archlang_)
using a small DSL, where after this structure is visualized. The layout
algorithm & visualization itself is provided by
[dagre-d3](https://github.com/cpettitt/dagre-d3/wiki).

Run
---

You can run the application by starting npm (`npm start`) and running some
web server (e.g. live-server).

TODO
----

* [x] Setup a TypeScript environment.
* [ ] Provide all the building blocks for drawing a graph:
    - ~~Nodes with a title & description.~~
    - ~~Edges with a description.~~
    - ~~Zooming and panning of the visualization.~~
    - ~~Various styles for both nodes and edges to distinguish various types
      of blocks.~~
    - ~~Break long lines in descriptions.~~
    - ~~Clusters to enable grouping.~~
    - Interactive hiding / showing of clusters and descriptions.
    - Ability to create a legend.
* [ ] A small language to describe the graph-like structure, that gets
      interpreted and visualized.
