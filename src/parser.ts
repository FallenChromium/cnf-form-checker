import { Token, TOKENS, tokenize } from "./tokenizer";

// AST Node types
type Identifier = {
    type: 'Identifier';
    value: string;
};

type Constant = {
    type: 'Constant';
    value: boolean;
};

type UnaryOperation = {
    type: 'UnaryOperation';
    operator: TOKENS.NEG;
    child: ASTNode;
};

type BinaryOperation = {
    type: 'BinaryOperation';
    operator: TOKENS.DISJ | TOKENS.CONJ | TOKENS.EQUA | TOKENS.IMPL;
    left: ASTNode;
    right: ASTNode;
};

export type ASTNode = Identifier | Constant | UnaryOperation | BinaryOperation;


export class Parser {
    private tokens: Token[];
    private position: number;
    private formula: string;

    constructor(formula: string) {
        this.tokens = [];
        this.position = 0;
        this.formula = formula
    }

    private match_IDTF(): Identifier | null {
        const token = this.tokens[this.position];

        if (token.type === TOKENS.IDTF) {
            this.position++;
            return { type: 'Identifier', value: token.value };
        }

        return null;
    }

    private match_CONST(): Constant | null {
        const token = this.tokens[this.position];

        if (token.type === TOKENS.CONST) {
            this.position++;
            return { type: 'Constant', value: token.value === '1' };
        }

        return null;
    }

    private match_LPARENTHESIS(): boolean {
        const token = this.tokens[this.position];

        if (token.type === TOKENS.LPARENTHESIS) {
            this.position++;
            return true;
        }

        return false;
    }

    private match_RPARENTHESIS(): boolean {
        const token = this.tokens[this.position];

        if (token.type === TOKENS.RPARENTHESIS) {
            this.position++;
            return true;
        }

        return false;
    }

    private match_NEG(): boolean {
        const token = this.tokens[this.position];

        if (token.type === TOKENS.NEG) {
            this.position++;
            return true;
        }

        return false;
    }

    private match_binary_operator(): TOKENS.DISJ | TOKENS.CONJ | TOKENS.EQUA | TOKENS.IMPL | null {
        const token = this.tokens[this.position];

        if (
            token.type === TOKENS.DISJ ||
            token.type === TOKENS.CONJ ||
            token.type === TOKENS.EQUA ||
            token.type === TOKENS.IMPL
        ) {
            this.position++;
            return token.type;
        }

        return null;
    }

    private match_formula(): ASTNode | null {
        return (
            this.match_CONST() ||
            this.match_IDTF() ||
            this.match_unary_formula() ||
            this.match_binary_formula()
        );
    }

    parse(): ASTNode | null {
        this.tokens = tokenize(this.formula);
        if (this.tokens.length === 0) {
            return null;
        }
        let parsed = this.match_formula()
        if (parsed && this.position === this.tokens.length) {
            return parsed;
        }
        else {
            throw new Error("Parsing didn't succeed")
        }
    }

    private match_unary_formula(): UnaryOperation | null {
        const startPos = this.position;

        if (this.match_LPARENTHESIS() && this.match_NEG()) {
            const child = this.match_formula();

            if (child && this.match_RPARENTHESIS()) {
                return { type: 'UnaryOperation', operator: TOKENS.NEG, child };
            }
        }

        this.position = startPos;
        return null;
    }

    private match_binary_formula(): BinaryOperation | null {
        const startPos = this.position;

        if (this.match_LPARENTHESIS()) {
            const left = this.match_formula();

            if (left) {
                const operator = this.match_binary_operator();

                if (operator) {
                    const right = this.match_formula();

                    if (right && this.match_RPARENTHESIS()) {
                        return { type: 'BinaryOperation', operator, left, right };
                    }
                }
            }
        }

        this.position = startPos;
        return null;
    }
}
