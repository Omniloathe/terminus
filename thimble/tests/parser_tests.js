QUnit.test( "first parser test: A", function( assert ) {
  let str="A";
  let lexer=new Lexer(str);
  let parser=new Interpreter(lexer);
  let result=parser.expr();
  //console.log(result.toString());
  assert.ok(result.toString()==="A","test");
});

QUnit.test( "second parser test: A & B", function( assert ) {
  let str="A & B";
  let lexer=new Lexer(str);
  let parser=new Interpreter(lexer);
  let result=parser.expr();
  //console.log(result.toString());
  assert.ok(result.toString()==="(A AND B)","test");
});

QUnit.test( "third parser test: !P", function( assert ) {
  let str="!P";
  let lexer=new Lexer(str);
  let parser=new Interpreter(lexer);
  let result=parser.expr();
  //console.log(result.toString());
  assert.ok(result.toString()==="(NOT P)","test");
});

QUnit.test( "fourth parser test: (A & B)", function( assert ) {
  let str="(A & B)";
  let lexer=new Lexer(str);
  let parser=new Interpreter(lexer);
  let result=parser.expr();
  //console.log(result.toString());
  assert.ok(result.toString()==="(A AND B)","test");
});

QUnit.test( "fifth parser test: !(A & B)", function( assert ) {
  let str="!(A & B)";
  let lexer=new Lexer(str);
  let parser=new Interpreter(lexer);
  let result=parser.expr();
  //console.log(result.toString());
  assert.ok(result.toString()==="(NOT (A AND B))","test");
});

QUnit.test( "sixth parser test: C |(A & B)", function( assert ) {
  let str="C |(A & B)";
  let lexer=new Lexer(str);
  let parser=new Interpreter(lexer);
  let result=parser.expr();
  console.log(result.toString());
  assert.ok(result.toString()==="(C OR (A AND B))","test");
});

QUnit.test( "seventh parser test: P -> Q", function( assert ) {
  let str="P -> Q";
  let lexer=new Lexer(str);
  let parser=new Interpreter(lexer);
  let result=parser.expr();
  console.log(result.toString());
  assert.ok(result.toString()==="(IF P THEN Q)","test");
});

QUnit.test( "eighth parser test: (P & Q) <-> !(R | S)", function( assert ) {
  let str="(P & Q) <-> !(R | S)";
  let lexer=new Lexer(str);
  let parser=new Interpreter(lexer);
  let result=parser.expr();
  console.log(result.toString());
  assert.ok(result.toString()==="((P AND Q) IMPLIES (NOT (R OR S)))","test");
});

QUnit.test( "final parser test: B1_1 <-> (P1_1 | P2_1)", function( assert ) {
  let str="B1_1 <-> (P1_1 | P2_1)";
  let lexer=new Lexer(str);
  let parser=new Interpreter(lexer);
  let result=parser.expr();
  console.log(result.toString());
  assert.ok(result.toString()==="(B1_1 IMPLIES (P1_1 OR P2_1))","test");
});