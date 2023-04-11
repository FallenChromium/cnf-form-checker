import { test_parsing, parsing_tests, CNF_tests, TestCNF } from './tests'

let test_number = 0
console.log("Parsing tests")
for (const testcase of parsing_tests) {
    console.log("Test #" + test_number)
    test_parsing(testcase);
    test_number++;
}

test_number = 0
console.log("Analyzer tests")
for (const testcase of CNF_tests) {
    console.log("Test #" + test_number)
    TestCNF(testcase);
    test_number++;
}
