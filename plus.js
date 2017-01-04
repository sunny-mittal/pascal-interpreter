// Constants
const [INTEGER, PLUS, EOF] = ['INTEGER', 'PLUS', 'EOF']

// Helper functions
const isDigit = (char) => /\d/.test(char)

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
  }

  error() {
    throw new Error('Error parsing input')
  }

  getNextToken() {
    let text = this.text
    if (this.pos > text.length - 1)
      return new Token(EOF, null)

    let currentChar = text[this.pos]

    if (isDigit(currentChar)) {
      this.pos++
      return new Token(INTEGER, parseInt(currentChar))
    }

    if (currentChar == '+') {
      this.pos++
      return new Token(PLUS, currentChar)
    }

    this.error()
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
    this.eat(PLUS)

    let right = this.currentToken
    this.eat(INTEGER)

    return left.value + right.value
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