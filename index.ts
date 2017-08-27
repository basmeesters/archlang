function start(): void {
    const result = ArchitectureParser.parseGraph(exampleInput)
    if (result instanceof Success) {
        const graph = result.value as Architecture
        new DagreGraph(graph.toJson());
    } else {
        console.log(result.value)
    }
}
