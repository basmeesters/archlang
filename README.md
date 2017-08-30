Archlang
========

Archlang is a small utility application that allows you to _describe_ a
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

Test
----

Testing can be done similarly to running the code. Simply follow the
instructions from _Run_ above and paste `/tests/spec.html` behind the URL.

Features
--------

Currently _ArchLang_ provides two features; the ability to interpret some
graph-like description, and a way to visualize it.

The language supported can interpret components (nodes), connectors(edges), and
clusters of nodes:

* Components:
  ```
  n1 "title" "description
  ```

* Connectors:
  ```
  n1 --"some description"--> n2
  ```

* Comments:
  ```
  // Archlang uses C-style comments.
  ```

* Clusters:
  ```
  cluster c1
  ... // nodes and edges
  end
  ```

*  Parse and ignore insignificant whitespace for readability:
   ```
   n1 "some node" "some description"

   cluster c1
       n2 "another node" ""
   end

   n1 --""--> c1
   ```

* Layout styles for nodes, edges, and clusters:
  ```
  // A blue, rectangle shaped cluster node
  |cluster| c1 blue

     (n1) "node" "with circular shape and red color" red
     |n2| "node2" "rectanle and gray" gray

     n1 --"dark grey connector"--> n2 dark-gray
  end
  ```
