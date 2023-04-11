import * as fs from 'fs';
import * as readline from 'readline';
import { Parser } from './parser';
import { isCNF } from './cnf_checker'

(async function processLineByLine(file_path: string) {
    try {
      const rl = readline.createInterface({
        input: fs.createReadStream(file_path),
        crlfDelay: Infinity
      });
  
      rl.on('line', (line) => {
        console.log(`Formula from file: ${line}`);
        const parser = new Parser(line);
        const ast = parser.parse();
        const is_cnf = isCNF(ast);
        console.log(`Formula ${is_cnf ? 'is' : 'is NOT'} in CNF`);
      });
    } catch (err) {
      console.error(err);
    }
  })(process.argv[2]);
