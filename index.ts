function start(): void {
    let graph = ArchitectureParser.parseGraph(exampleInput)
    new DagreGraph(graph.toJson());
}
