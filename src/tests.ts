import { tokenize } from "./tokenizer";
import { Parser } from "./parser";
var treeify = require('treeify');

export const parsing_tests = [
    { formula: "", expected: true },
    { formula: "A", expected: true },
    { formula: "1", expected: true },
    { formula: "(!B)", expected: true },
    { formula: "(A\\/C)", expected: true },
    { formula: "((A\\/B)\\/C)", expected: true },
    { formula: "((A\\/(!B))\\/(!C))", expected: true },
    { formula: "((A\\/(B\\/(!C)))/\\((!D)\\/((!E)\\/F)))", expected: true },
    { formula: "(((A\\/B)/\\(C->D))~(E\\/F))", expected: true },
    { formula: "(((A\\/B)/\\(C->D))<->(E\\/F))", expected: true },
    { formula: "(A\\/(B\\/C))/\\(A\\/((!B)\\/C))", expected: false },
    { formula: "((A/\\B)\\/((A\\/B)/\\(A\\/B)))", expected: true },
    { formula: "(!(B\\/C))", expected: true }
]

export function test_parsing(formula: string, expected: boolean) {
    let error = false;
    let ast = null;
    try {
        let token_stream = tokenize(formula)
        let parser = new Parser(token_stream);
        ast = parser.match();
    }
    catch (e) {
        error = true;
        //console.log(e);
    }
    finally {
        // this makes sense, because usually expected != error, i.e with we expect error=true if expected=false
        if (expected == error) {
            console.error("TEST FAILED: expected " + (expected ? 'success' : 'errors') + " but got " + (error ? 'errors' : 'success'));
            console.log("Initital expression: " + formula)
            console.log("---")
            return false;
        }

        else {
            console.log("TEST PASSED:")
            console.log("Initital expression: " + formula)
            /*
            console.log("Token stream: ")
            console.log(token_stream)
            */
            if (expected == true) {
                console.log("Parse tree")
                console.error(treeify.asTree(ast, true));

            }
            console.log("---")
            return true;
        }
    }

}
