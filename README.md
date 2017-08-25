Archlang
========

Archlang is a small utility application (to be) that allows you to _describe_ a
graph-like structure (such as a software architecture diagram, hence _archlang_)
using a small DSL, where after this structure is visualized. The layout
algorithm & visualization itself is provided by
[dagre-d3](https://github.com/cpettitt/dagre-d3/wiki).

The parser combinator code is originally taken from this
[blog](https://medium.com/@chetcorcos/introduction-to-parsers-644d1b5d7f3d) and
modified / extended to fit my needs and work with TypeScript. There are some
limitations as explained in the article, but it seems to provide everything I
need, so I kept it like this instead of using a full-fledged library.

Run
---

You can run the application by starting npm (`npm start`) and running some
web server (e.g. live-server). Since I am not completely aware of how an
idiomatic node application setup should look like, and this just a pet project
is, I simply included the dependencies in the `/lib` directory and ignore the
`npm` error messages.


TODO
----

* [x] Setup a TypeScript environment.
* [x] Provide all the building blocks for drawing a graph:
    - ~~Nodes with a title & description.~~
    - ~~Edges with a description.~~
    - ~~Zooming and panning of the visualization.~~
    - ~~Various styles for both nodes and edges to distinguish various types
      of blocks.~~
    - ~~Break long lines in descriptions.~~
    - ~~Clusters to enable grouping.~~
    - ~~Interactive hiding / showing of clusters.~~
* [ ] A small language to describe the graph-like structure, that gets
      interpreted and visualized.
    - ~~Interpret components (nodes).~~
    - ~~Interpret connectors (edges).~~
    - ~~Interpret clusters.~~
    - ~~Interpret layout options.~~
    - ~~Work better with insignificant whitespace.~~
    - ~~Allow for comments.~~
    - Better error messages parsing.
* [ ] Include & use testing framework.
* [ ] Add some utility features.
    - import from file.
    - export to pdf / svg / png(?).
