const exampleInput = `
n0 "User" ""
cluster t1
n1 "Money component" "this component is able to
                      process money. So just it keeps
                      track of all the money you throw
                      in and you get the right change"
n2 "Buttons" ""
n3 "Coffee maker" ""
n0 --"communicates with the coffee machine"--> n2
n1 --"signales if there is enough money"--> n2
n2 --"signales choice & money amount"--> n3
end
n0 --"Throw in money"--> t1
`

function start(): void {
    let graph = GraphParser.parseGraph(exampleInput)
    new DagreGraph(graph.toJson());
}
