export enum TOKENS {
    IDTF = 1,
    CONST,
    DISJ,
    CONJ,
    NEG,
    EQUA,
    IMPL,
    LPARENTHESIS,
    RPARENTHESIS
};

const IDTFS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const CONSTS = ['0', '1']

const OPS = { DISJ: '\\/', CONJ: '/\\', NEGA: '!', EQUA: '~', IMPL: '->' };

export interface Token {
    type: TOKENS,
    value: string;
}

export function tokenize(str: string): Token[] {
    let tokens: Array<Token> = [];
    for (let i = 0; i < str.length; ++i) {
        switch (str[i]) {
            case '(': tokens.push({ type: TOKENS.LPARENTHESIS, value: '(' }); break;

            case ')': tokens.push({ type: TOKENS.RPARENTHESIS, value: ')' }); break;

            case OPS.CONJ[0]: {

                if (str[i + 1] === OPS.CONJ[1]) {
                    tokens.push({ type: TOKENS.CONJ, value: '/\\' });
                    i++;
                }
                else {
                    throw Error('Invalid symbol. Expected conjunction.');
                }
                break;
            }
            case OPS.DISJ[0]: {

                if (str[i + 1] === OPS.DISJ[1]) {
                    tokens.push({ type: TOKENS.DISJ, value: '\\/' });
                    i = i + 1;
                }
                else {
                    throw Error('Invalid symbol. Expected disjunction.');
                }
                break;
            }
            case OPS.IMPL[0]: {
                if (str[i + 1] === OPS.IMPL[1]) {
                    tokens.push({ type: TOKENS.IMPL, value: '->' });
                    i = i + 1;
                }
                else {
                    throw Error('Invalid symbol. Expected implication.');
                }
                break;
            }
            case OPS.NEGA: tokens.push({ type: TOKENS.NEG, value: '!' }); break;
            case OPS.EQUA: tokens.push({ type: TOKENS.EQUA, value: '~' }); break;
            case CONSTS[0]:  tokens.push({ type: TOKENS.CONST, value: '0'}); break;
            case CONSTS[1]: tokens.push({ type: TOKENS.CONST, value: '1'}); break;
            default: {
                // check if it's a valid identifier
                if (IDTFS.indexOf(str[i]) > -1) {
                    tokens.push({ type: TOKENS.IDTF, value: str[i] });
                }
                else {
                    throw Error('Invalid symbol. ' + str[i]);
                }
                break;
            }
        }
    }
    return tokens
}
