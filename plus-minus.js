// Constants
const [INTEGER, PLUS, MINUS, EOF] = ['INTEGER', 'PLUS', 'MINUS', 'EOF']

// Helper functions
const isDigit = (char) => /\d/.test(char)
const isWhitespace = (char) => /\s/.test(char)

class Token {
  constructor(type, value) {
    this.type = type
    this.value = value
  }

  toString() {
    return `Token(${this.type}, ${this.value})`
  }
}

class Interpreter {
  constructor(text) {
    this.text = text
    this.pos = 0
    this.currentToken = null
    this.currentChar = this.text[this.pos]
  }

  error() {
    throw new Error('Error parsing input')
  }

  advance() {
    this.currentChar = ++this.pos > this.text.length - 1 ? null : this.text[this.pos]
  }

  skipWhitespace() {
    while (this.currentChar && isWhitespace(this.currentChar)) this.advance()
  }

  integer() {
    let result = ''
    while (this.currentChar && isDigit(this.currentChar)) {
      result += this.currentChar
      this.advance()
    }
    return parseInt(result)
  }

  getNextToken() {
    let char
    while (char = this.currentChar) {
      if (isWhitespace(char)) {
        this.skipWhitespace()
        continue
      }

      if (isDigit(char))
        return new Token(INTEGER, this.integer())
      
      if (char == '+') {
        this.advance()
        return new Token(PLUS, '+')
      }

      if (char == '-') {
        this.advance()
        return new Token(MINUS, '-')
      }

      this.error()
    }

    return new Token(EOF, null)
  }

  eat(type) {
    if (this.currentToken.type == type)
      this.currentToken = this.getNextToken()
    else
      this.error()
  }

  expr() {
    this.currentToken = this.getNextToken()

    let left = this.currentToken
    this.eat(INTEGER)

    let op = this.currentToken
    if (op.type == PLUS)
      this.eat(PLUS)
    else
      this.eat(MINUS)

    let right = this.currentToken
    this.eat(INTEGER)

    return op.type == PLUS ? 
      left.value + right.value :
      left.value - right.value
  }
}

function main() {
  let interpreter, result
  const rl = require('readline').createInterface(process.stdin, process.stdout)
  rl.setPrompt('calc> ')
  rl.prompt()
  rl.on('line', (text) => {
    if (!text) return
    interpreter = new Interpreter(text)
    result = interpreter.expr()
    console.log(result)
    rl.prompt()
  }).on('close', () => process.exit(0))
}

main()