import { tokenize } from "./tokenizer";
import { Parser } from "./parser";
import { isCNF } from "./cnf_checker";

export interface TestCase {
    formula: string;
    expected: boolean;
    description: string;
}

export const parsing_tests: TestCase[] = [
    { formula: "", expected: true, description: "Empty formula" },
    { formula: "A", expected: true, description: "Single variable" },
    { formula: "1", expected: true, description: "Single constant" },
    { formula: "(!B)", expected: true, description: "Negation" },
    { formula: "(A\\/C)", expected: true, description: "Disjunction" },
    { formula: "((A\\/B)\\/C)", expected: true, description: "Nested disjunction" },
    { formula: "((A\\/(!B))\\/(!C))", expected: true, description: "Nested disjunction with negations" },
    { formula: "((A\\/(B\\/(!C)))/\\((!D)\\/((!E)\\/F)))", expected: true, description: "Nested disjunction and conjunction with negations" },
    { formula: "(((A\\/B)/\\(C->D))~(E\\/F))", expected: true, description: "All binary operators" },
    { formula: "(((A\\/B)/\\(C->D))<->(E\\/F))", expected: false, description: "Failing an invalid operator in tokenizer" },
    { formula: "(A\\/(B\\/C))/\\(A\\/((!B)\\/C))", expected: false, description: "Missing parenthesis" },
    { formula: "(!(B\\/C))", expected: true, description: "Negation of a binary formula" }
]

export function test_parsing(testCase: TestCase) {
    let error = false;
    let ast = null;
    try {
        let parser = new Parser(testCase.formula);
        ast = parser.parse();
    }
    catch (e) {
        error = true;
        //console.log(e);
    }
    finally {
        // this makes sense, because usually expected != error, i.e with we expect error=true if expected=false
        if (testCase.expected == error) {
            console.error("TEST FAILED: expected " + (testCase.expected ? 'success' : 'errors') + " but got " + (error ? 'errors' : 'success'));
            console.info("Initital expression: " + testCase.formula)
            console.info("---")
            return false;
        }

        else {
            console.log("TEST PASSED:")
            console.info("Initital expression: " + testCase.formula)
            /*
            console.log("Token stream: ")
            console.log(token_stream)
            */
            if (testCase.expected == true) {
                console.info("Parse tree")
                console.info(JSON.stringify(ast, null, 4));
            }
            console.log("---")
            return true;
        }
    }

}

export const CNF_tests: TestCase[] = [
    {
        formula: "((A\\/B)/\\(B\\/C))",
        expected: true,
        description: "Simple CNF",
    },
    {
        formula: "((A\\/B)/\\((B\\/C)/\\(A\\/C)))",
        expected: true,
        description: "Right-nested CNF",
    },
    {
        formula: "(((A\\/B)/\\(B\\/C))/\\(A\\/C))",
        expected: true,
        description: "Left-nested CNF",
    },
    {
        formula: "(((A\\/B)/\\(B\\/C))/\\((A\\/C)/\\(C\\/D)))",
        expected: true,
        description: "Combined nested CNF",
    },
    {
        formula: "((A\\/B)/\\((B\\/C)/\\((A\\/C)/\\(C\\/D))))",
        expected: true,
        description: "Deeply nested CNF",
    },
    {
        formula: "(((A\\/B)\\/C)~(D\\/E))",
        expected: false,
        description: "Non-CNF formula (equality instead of conjunction)",
    },
    {
        formula: "((A\\/B)/\\((B/\\C)\\/D))",
        expected: false,
        description: "Non-CNF formula (conjunction inside)",
    },
];

export function TestCNF(testCase: TestCase): boolean {
    let result = null;
    let ast = null;

    let parser = new Parser(testCase.formula);
    ast = parser.parse();
    result = isCNF(ast!);

    if (result === testCase.expected) {
        console.log(`PASSED: ${testCase.description}`);
        console.info('---')
        return true;
    } else {
        console.error(`FAILED: ${testCase.description}. Expected ${testCase.expected} but got ${result}`);
        console.info(`Formula: ${testCase.formula}`);
        console.info(`AST: ${JSON.stringify(ast, null, 4)}`);
        console.info('---')
        return false;
    }
}
