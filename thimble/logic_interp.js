function is_space(c){
  return /\s/.test(c);
}

function is_digit(c){
  return /[0-9]/.test(c);
}

function is_letter(c){
  return /[A-Z]/.test(c);
}

function Token(type,value){
  this.type=type;
  this.value=value;
}

function LexerException(message){
  this.message=message;
  this.name="LexerException";
}


//TOKENIZER
Token.prototype.toString=function(){
  //return "Token("+this.type+","+this.value+")";
  return `Token(${this.type}:'${this.value}')`;
}

Token.prototype.equals=function(otoken){
  return (otoken instanceof Token) && this.type===otoken.type && this.value===otoken.value;
}
  
function Lexer(text){
  if(text==="")
    throw new LexerException("Empty String");
  this.text=text;
  this.pos=0;
  this.current_char=this.text[this.pos];
}

Lexer.prototype.error=function(){
  throw new LexerException("Invalid character");
}

Lexer.prototype.advance=function(){
  this.pos++;
  if(this.pos>(this.text.length)-1){
    this.current_char=null;
  }
  else{
    this.current_char=this.text[this.pos];
  }
}

Lexer.prototype.skip_whitespace=function(){
  while(this.current_char!=null && /\s/.test(this.current_char)){
    this.advance();
  }
}

//todo: decide if atom is one letter or more?
Lexer.prototype.atom=function(){
  var result="";
  while(this.current_char!=null && /[A-Z_1-9]/.test(this.current_char)){
    result+=this.current_char;
    this.advance();
  }
  return result;
}

Lexer.prototype.get_next_token=function(){
  while(this.current_char!=null){
    if(is_space(this.current_char)){
      this.skip_whitespace();
      continue;
    }
    if(is_letter(this.current_char)){
      return new Token("ATOM",this.atom());
    }
    if(this.current_char==="&"){
      this.advance();
      return new Token("AND","&");
    }
    if(this.current_char==="|"){
      this.advance();
      return new Token("OR","|");
    }
    if(this.current_char==="!"){
      this.advance();
      return new Token("NOT","!");
    }
    
    if(this.current_char==="-"){
      this.advance();
      if(this.current_char===">"){
        this.advance();
        return new Token("IF","->");
      }
      this.error();
    }
    
    if(this.current_char==="<"){
      this.advance();
      if(this.current_char==="-"){
        this.advance();
      }
      else{
        this.error();
      }
      if(this.current_char===">"){
        this.advance();
        return new Token("IFF","<->");
      }
      this.error();     
    }
        
    if(this.current_char==="("){
      this.advance();
      return new Token("LPAREN","(");
    }
    
    if(this.current_char===")"){
      this.advance();
      return new Token("RPAREN",")");
    }
    
    this.error();
  }
  return new Token("EOF","");
}

Lexer.prototype.reset=function(){
  this.pos=0;
}

Lexer.prototype.get_all_tokens=function(){
  this.reset();
  let tokenarr=[];
  let token=this.get_next_token();
  while(token.type!=="EOF"){
    tokenarr.push(token);
    token=this.get_next_token();
  }
    
  tokenarr.push(token);
  return tokenarr;
  
}


//todo: do I need a separate object for this?
function ParserException(message){
  this.message=message;
  this.name="ParserException";
}

function Interpreter(lexer){
  this.lexer=lexer;
  this.current_token=this.lexer.get_next_token();
}

Interpreter.prototype.error=function(s=""){
  throw new ParserException("invalid syntax "+s);
}

Interpreter.prototype.eat=function(token_type){
  if(token_type instanceof Array){
    if(token_type.includes(this.current_token.type))
      this.current_token=this.lexer.get_next_token();
    else
      this.error(`expected ${token_type} but found ${this.current_token.type}`);
  }
  else{
    if(this.current_token.type===token_type)
      this.current_token=this.lexer.get_next_token();
    else
      this.error(`expected ${token_type} but found ${this.current_token.type}`);
  }
}

Interpreter.prototype.factor=function(){
  // ATOM | LPAREN expr RPAREN
  let token=this.current_token;
  if(token.type==='ATOM'){
    this.eat('ATOM');
    return new Atom(token.value);
  }
  else if(token.type==='LPAREN'){
    this.eat('LPAREN');
    let result=this.expr();
    this.eat('RPAREN');
    return result;
  }
}

Interpreter.prototype.neg=function(){
  let token=this.current_token;
  if(token.type==='NOT'){
    this.eat('NOT');
    let result=this.factor();
    return new Not(result);
  }
  else
    return this.factor();
}

Interpreter.prototype.impl=function(){
  let result=this.neg();
  let token=this.current_token;
  if(token.type==="AND"){
    this.eat("AND");
    let right=this.neg();
    result=new And([result,right]);
  }
  else if(token.type==="OR"){
    this.eat("OR");
    let right=this.neg();
    result=new Or([result,right]);
  }
  return result;
}


Interpreter.prototype.expr=function(){
  let result=this.impl();
  let token=this.current_token;
  if(token.type==="IF"){
    this.eat("IF");
    let right=this.impl();
    result=new If(result,right);
  }
  else if(token.type==="IFF"){
    this.eat("IFF");
    let right=this.impl();
    result=new Iff(result,right);
  }
  return result;
  
}




function logic_repl(){
  var text;
  while(true){
    try{
      text=prompt("logic> ");
    }
    catch(err){
      console.log(err);
  }
  if(text===""){ continue; }
  let lexer=new Lexer(text);
  let interpreter=new Interpreter(lexer);
  let result=interpreter.expr();
  console.log(result);
  }
}