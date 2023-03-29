import { ASTNode } from './parser'
import { TOKENS } from './tokenizer'

function isLiteral(node: ASTNode): boolean {
    if (node.type === 'Identifier') {
        return true;
    }

    if (node.type === 'UnaryOperation' && node.operator === TOKENS.NEG && node.child.type === 'Identifier') {
        return true;
    }

    return false;
}

function isClause(node: ASTNode): boolean {
    if (isLiteral(node)) {
        return true;
    }

    if (
        node.type === 'BinaryOperation' &&
        node.operator === TOKENS.DISJ &&
        /*
        this might fail if someone will use combined nesting in the formula
        ((isClause(node.left) && isLiteral(node.right)) || (isLiteral(node.left) && isClause(node.right)))
        */
       isClause(node.left) && isClause(node.right)
    ) {
        return true;
    }

    return false;
}

export function isCNF(node: ASTNode): boolean {
    if (isClause(node)) {
        return true;
    }

    if (
        node.type === 'BinaryOperation' &&
        node.operator === TOKENS.CONJ &&
        isCNF(node.left) &&
        isCNF(node.right)
    ) {
        return true;
    }

    return false;
}




