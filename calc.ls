# Constants
[INTEGER, PLUS, MINUS, MULT, DIV, EOF] = ['INTEGER' 'PLUS' 'MINUS' 'MULT' 'DIV' 'EOF']
lookup = \+ : PLUS, \- : MINUS, \* : MULT, \/ : DIV


# Helper functions
is-digit = (char) -> /\d/.test char
is-whitespace = (char) -> /\s/.test char

class Token
  (@type, @value) ~>

class Interpreter
  (@text) ~>
    @pos = 0
    @current-token = null
    @current-char = @text[@pos]
  
  error: -> throw new Error 'Error parsing input'
  
  advance: ->
    @current-char = if ++@pos > @text.length - 1 then null else @text[@pos]

  skip-whitespace: ->
    while @current-char and is-whitespace @current-char
      @advance!
  
  integer: ->
    result = ''
    while @current-char and is-digit @current-char
      result += @current-char
      @advance!
    parse-int result
  
  get-next-token: ->
    char = void
    while char = @current-char
      if is-whitespace char
        @skip-whitespace!
        continue
      
      return Token INTEGER, @integer! if is-digit char

      return switch char
      | <[\+ \- \* \/]>
        @advance!
        Token lookup[char], char
      | _ => @error!
    
    Token EOF, void
  
  eat: (type) ->
    if @current-token.type is type then @current-token = @get-next-token! else @error!
  
  expr: ->
    @current-token = @get-next-token!
    left = @current-token
    @eat INTEGER

    op = @current-token
    @eat op.type

    right = @current-token
    @eat INTEGER

    return switch op.type
    | PLUS => left.value + right.value
    | MINUS => left.value - right.value
    | MULT => left.value * right.value
    | DIV => left.value / right.value

do ->
  [interpreter, result] = [void, void]
  rl = require 'readline' .create-interface process.stdin, process.stdout
  rl.set-prompt 'calc> '
  rl.prompt!
  rl.on 'line' (text) ->
    return unless text
    interpreter := Interpreter text
    result := interpreter.expr!
    console.log result
    rl.prompt!
  .on 'close' process.exit