QUnit.test( "lexer test: (P & Q)", function( assert ) {
  var mylexer=new Lexer("(P & Q)");
  var curtoken=mylexer.get_next_token();
  //console.log(curtoken.toString());
  assert.ok(curtoken.type=="LPAREN","token0");
  curtoken=mylexer.get_next_token();
  assert.ok(curtoken.type=="ATOM","token1");
  assert.ok(curtoken.value=="P","atom0 val");
  curtoken=mylexer.get_next_token();
  assert.ok(curtoken.type=="AND","token2");
  curtoken=mylexer.get_next_token();
  assert.ok(curtoken.type=="ATOM","token3");
  assert.ok(curtoken.value=="Q","atom1 val");
  curtoken=mylexer.get_next_token();
  assert.ok(curtoken.type=="RPAREN","token4");
  curtoken=mylexer.get_next_token();
  assert.ok(curtoken.type=="EOF","eof");
});

QUnit.test( "lexer test: P -> (Q |   R)", function( assert ) {
  var mylexer=new Lexer("P -> (Q |   R)");
  var curtoken=mylexer.get_next_token();
  //console.log(typeof curtoken);
  assert.ok(curtoken.equals(new Token("ATOM","P")),"atom0");
  curtoken=mylexer.get_next_token();
  assert.ok(curtoken.type=="IF","iftoken");
  curtoken=mylexer.get_next_token();
  assert.ok(curtoken.type=="LPAREN","lparen");
  curtoken=mylexer.get_next_token();
  assert.ok(curtoken.equals(new Token("ATOM","Q")),"atom 1");
  curtoken=mylexer.get_next_token();
  assert.ok(curtoken.type=="OR","ortoken");
  curtoken=mylexer.get_next_token();
  assert.ok(curtoken.equals(new Token("ATOM","R")),"atom2");
  curtoken=mylexer.get_next_token();
  assert.ok(curtoken.type=="RPAREN","rparen");
  curtoken=mylexer.get_next_token();
  assert.ok(curtoken.type=="EOF","eof");
});


QUnit.test( "third lexer test: (A|B)&C->!D&!E", function( assert ) {
  let str="(A|B)&C->!D&!E";
  var tokens;
  try{
    let lexer=new Lexer(str);
    tokens=lexer.get_all_tokens();
    //console.log(tokens.map(e => e.toString()).join('\n'));
  }
  catch(err){
    console.log("Error from third lexer test: "+err.message);
  } 
  //console.log(result.toString());
  assert.ok(tokens[0].type==="LPAREN","token 0");
  assert.ok(tokens[1].type==="ATOM" && tokens[1].value==="A","token 1");
  assert.ok(tokens[7].type==="IF","token 7");
  
});