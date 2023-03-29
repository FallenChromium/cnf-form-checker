import { test_parsing, parsing_tests } from './tests'

let test_number = 0
console.log("Parsing tests")
for (const testcase of parsing_tests) {
    console.log("Test #" + test_number)
    test_parsing(testcase.formula, testcase.expected);
    test_number++;
}
console.log("Analyzer tests")

