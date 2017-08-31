const exampleInput = `
// Example graph
(n0) "User" "" red
|cluster| t1 gray
    // Fat money componet yo
    n1 "Money component" "this component is able to
                          process money. So just it keeps
                          track of all the money you throw
                          in and you get the right change" blue
    n2 "Buttons" "" blue
    (n3) "Coffee maker" "" blue

    n0 --"Throw in money"--> n1
    n0 --"communicates with the coffee machine"--> n2 red
    n1 --"signales if there is enough money"--> n2
    n2 --"signales choice & money amount"--> n3 blue
end

n0 --"interact with the machine"--> t1 blue
`
