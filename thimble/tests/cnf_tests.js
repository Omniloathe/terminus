QUnit.test( "testing CNF conversion individual parts: B1_1 <-> (P1_1 | P2_1)", function( assert ) {
  let str="B1_1 <-> (P1_2 | P2_1)";
  let lexer=new Lexer(str);
  let parser=new Interpreter(lexer);
  let result=parser.expr();
  result=eliminate_iff(result);
  console.log(result.toString());
  assert.ok(result.toString()==="((IF B1_1 THEN (P1_2 OR P2_1)) AND (IF (P1_2 OR P2_1) THEN B1_1))","eliminate_iff");
  result=eliminate_if_then(result);
  console.log(result.toString());
  assert.ok(result.toString()==="(((NOT B1_1) OR (P1_2 OR P2_1)) AND ((NOT (P1_2 OR P2_1)) OR B1_1))","eliminate_if_then")
  result=move_not(result);
  console.log(result.toString());
  assert.ok(result.toString()==="(((NOT B1_1) OR (P1_2 OR P2_1)) AND (((NOT P1_2) AND (NOT P2_1)) OR B1_1))","move_not");
  result=distribute_or(result);
  console.log(result.toString());
  assert.ok(result.toString()==="(((NOT B1_1) OR (P1_2 OR P2_1)) AND (((NOT P1_2) OR B1_1) AND ((NOT P2_1) OR B1_1)))","distribute_or");
  result=simplify_andor(result);
  console.log(result.toString());
  assert.ok(result.toString()==="(((NOT B1_1) OR P1_2 OR P2_1) AND ((NOT P1_2) OR B1_1) AND ((NOT P2_1) OR B1_1))","simplify_andor");
});

QUnit.test( "testing CNF conversion whole thing: B1_1 <-> (P1_1 | P2_1)", function( assert ) {
  let str="B1_1 <-> (P1_2 | P2_1)";
  let lexer=new Lexer(str);
  let parser=new Interpreter(lexer);
  let result=parser.expr();
  result=convert_CNF(result);
  assert.ok(result.toString()==="(((NOT B1_1) OR P1_2 OR P2_1) AND ((NOT P1_2) OR B1_1) AND ((NOT P2_1) OR B1_1))","convert_CNF");
});

