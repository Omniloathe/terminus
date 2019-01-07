function Atom(prop){
  if(typeof prop != 'string')
    throw new Error('only takes string');
  this.prop=prop;
}

Atom.prototype.toString = function(){
  return this.prop;
}

Atom.prototype.equals = function(other){
  return (other instanceof Atom) && (this.prop===other.prop);
}

Atom.prototype.evaluate=function(model){
  //return model[this.prop]===true ? true : false;
  if(model.hasOwnProperty(this.prop)){
    return model[this.prop]===true ? true : false;
  }
  else{
    return undefined;
  }
}


function Not(expr){
  this.clause=expr;
}

Not.prototype.toString = function(){
  return `(NOT ${this.clause})`;
}

Not.prototype.equals = function(other){
  return (other instanceof Not) && (this.clause.equals(other.clause));
}

Not.prototype.move_inwards=function(){
  let inner=this.clause;
  if(inner instanceof Not){
    return inner.clause;
  }
  //I hope to god there are only two inner clauses
  else if(inner instanceof And){
    let a=inner.clauses[0];
    let b=inner.clauses[1];
    return new Or([new Not(a),new Not(b)]);
  }
  else if(inner instanceof Or){
    let a=inner.clauses[0];
    let b=inner.clauses[1];
    return new And([new Not(a),new Not(b)]);
  }
  else{
    return this;
  }
}

Not.prototype.evaluate=function(model){
  //return this.clause.evaluate(model)===false;
  let inner=this.clause;
  if(inner.evaluate(model)===undefined)
    return undefined;
  else
    return !inner.evaluate(model);
}

function And(clauses){
  this.clauses=clauses;
}

And.prototype.toString = function(){
  let clausestrs=this.clauses.map(e => e.toString());
  return "("+clausestrs.join(' AND ')+")";
}

And.prototype.equals = function(other){
  if(!(other instanceof And) || other.clauses.length!=this.clauses.length) return false;
  //ordering......?? maybe sort?
  for(let i=0;i<this.clauses.length;i++){
    if(!this.clauses[i].equals(other.clauses[i]))
      return false;
  }
  return true;
}

And.prototype.simplify=function(){
  let newclauses=[];
  this.clauses.forEach(e => {
    if(!(e instanceof And)){
      newclauses.push(e);
    }
    else{
      newclauses=newclauses.concat(e.clauses);
    }
  });
  return new And(newclauses);
}

And.prototype.evaluate=function(model){
  for(let i=0;i<this.clauses.length;i++){
    let e=this.clauses[i];
    if(e.evaluate(model)!==true)
      return e.evaluate(model);
  }
  return true
}

function Or(clauses){
  this.clauses=clauses;
}

Or.prototype.toString = function(){
  let clausestrs=this.clauses.map(e => e.toString());
  return "("+clausestrs.join(' OR ')+")";
}

Or.prototype.equals = function(other){
  if(!(other instanceof Or) || other.clauses.length!=this.clauses.length) return false;
  //ordering......?? maybe sort?
  for(let i=0;i<this.clauses.length;i++){
    if(!this.clauses[i].equals(other.clauses[i]))
      return false;
  }
  return true;  
}

Or.prototype.distribute=function(){
  //distribute inner And clauses outward
  if(this.clauses.length>2){
    return this;
  }
  else if(this.clauses[0] instanceof And){
    let andcl=this.clauses[0];
    let other=this.clauses[1];
    let subcl1=new Or([andcl.clauses[0],other]);
    let subcl2=new Or([andcl.clauses[1],other]);
    return new And([subcl1,subcl2]);
  }
  else if(this.clauses[1] instanceof And){
    let andcl=this.clauses[1];
    let other=this.clauses[0];
    let subcl1=new Or([andcl.clauses[0],other]);
    let subcl2=new Or([andcl.clauses[1],other]);
    return new And([subcl1,subcl2]);
  }
  else{
    return this;
  }
}

Or.prototype.simplify=function(){
  let newclauses=[];
  this.clauses.forEach(e => {
    if(!(e instanceof Or)){
      newclauses.push(e);
    }
    else{
      newclauses=newclauses.concat(e.clauses);
    }
  });
  return new Or(newclauses);
}

Or.prototype.evaluate=function(model){
  var hasundef=false;
  for(let i=0;i<this.clauses.length;i++){
    if(this.clauses[i].evaluate(model)===true)
      return true;
    else if(this.clauses[i].evaluate(model)===undefined)
      hasundef=true;
  }
  return hasundef ? undefined : false;
}

function If(left,right){
  this.left=left;
  this.right=right;
}

If.prototype.toString=function(){
  return `(IF ${this.left} THEN ${this.right})`;
}

If.prototype.eliminate=function(){
  return new Or([new Not(this.left),this.right]);
}

If.prototype.evaluate=function(model){
  if((this.left.evaluate(model)===true) && (this.right.evaluate(model)===false))
    return false;
  else if(this.left.evaluate(model)===undefined || this.right.evaluate(model)===undefined)
    return undefined;
  else
    return true;
}

function Iff(left,right){
  this.left=left;
  this.right=right;
}

Iff.prototype.toString=function(){
  return `(${this.left} IMPLIES ${this.right})`;
}

Iff.prototype.eliminate=function(){
  let a=this.left;
  let b=this.right;
  return new And([new If(a,b),new If(b,a)]);
}

Iff.prototype.evaluate=function(model){
  if(this.left.evaluate(model)===undefined || this.right.evaluate(model)===undefined)
    return undefined;
  return this.left.evaluate(model)===this.right.evaluate(model);
}

function convert_cnf(clause){
  clause=eliminate_iff(clause);  
  clause=eliminate_if_then(clause);
  clause=move_not(clause);
  clause=distribute_or(clause);
  clause=simplify_andor(clause);
  return clause;
  
}

function eliminate_iff(clause){
  if(clause instanceof Atom){
    return clause;
  }
  else if(clause instanceof Not){
    return new Not(eliminate_iff(clause.clause));
  }
  else if(clause instanceof Or){
    let newclauses=clause.clauses.map(eliminate_iff);
    return new Or(newclauses);
  }
  else if(clause instanceof And){
    let newclauses=clause.clauses.map(eliminate_iff);
    return new And(newclauses);
  }
  else if(clause instanceof If){
    let newleft=eliminate_iff(clause.left);
    let newright=eliminate_iff(clause.right);
    return new If(newleft,newright);
  }
  else{
    let newleft=eliminate_iff(clause.left);
    let newright=eliminate_iff(clause.right);
    let newiff=new Iff(newleft,newright);
    return newiff.eliminate();
  }
}

function eliminate_if_then(clause){
  if(clause instanceof Atom){
    return clause;
  }
  else if(clause instanceof Not){
    return new Not(eliminate_if_then(clause.clause));
  }
  else if(clause instanceof Or){
    let newclauses=clause.clauses.map(eliminate_if_then);
    return new Or(newclauses);
  }
  else if(clause instanceof And){
    let newclauses=clause.clauses.map(eliminate_if_then);
    return new And(newclauses);
  }
  else{
    let newleft=eliminate_if_then(clause.left);
    let newright=eliminate_if_then(clause.right);
    let newif=new If(newleft,newright);
    return newif.eliminate();
  }
}

function move_not(clause){
  if(clause instanceof Atom){
    return clause;
  }
  else if(clause instanceof Or){
    let newclauses=clause.clauses.map(move_not);
    return new Or(newclauses);
  }
  else if(clause instanceof And){
    let newclauses=clause.clauses.map(move_not);
    return new And(newclauses);
  }
  else{
    let newclause=move_not(clause.clause);
    let newnot=new Not(newclause);
    return newnot.move_inwards();
  }
}

function distribute_or(clause){
  if(clause instanceof Atom){
    return clause;
  }
  else if(clause instanceof Not){
    return new Not(distribute_or(clause.clause));
  }
  else if(clause instanceof And){
    let newclauses=clause.clauses.map(distribute_or);
    return new And(newclauses);
  }
  else{
    let newclauses=clause.clauses.map(distribute_or);
    let newor=new Or(newclauses);
    return newor.distribute();
  }
}

function simplify_andor(clause){
  if(clause instanceof Atom){
    return clause;
  }
  else if(clause instanceof Not){
    return new Not(simplify_andor(clause.clause));
  }
  else if(clause instanceof Or){
    let newclauses=clause.clauses.map(simplify_andor);
    let newor=new Or(newclauses);
    return newor.simplify();
  }
  //must be And clause
  else{
    let newclauses=clause.clauses.map(simplify_andor);
    let newand=new And(newclauses);
    return newand.simplify();
  }
}

function str_to_pl(str){
  return new Interpreter(new Lexer(str)).expr();
}

function encode_cnf(cnf_clause,symtab){
  let arr=[];
  cnf_clause.clauses.forEach(subcl => {
    if(subcl instanceof Atom){
      let sym=subcl.prop;
      arr.push([symtab[sym]]);
    }
    else if(subcl instanceof Not){
      let sym=subcl.clause.prop;
      arr.push([-symtab[sym]]);
    }
    else{
      let subarr=[];
      subcl.clauses.forEach(prop => {
        if(prop instanceof Atom){
          let sym=prop.prop;
          subarr.push(symtab[sym]);
        }
        else{
          let sym=prop.clause.prop;
          subarr.push(-symtab[sym]);
        }
      });
      arr.push(subarr);
    }
  });
  return arr;
}

class EncodedCNF{
  constructor(clause,symtab){
    this._cnf=encode_cnf(convert_cnf(clause),symtab);
  }
  
  get cnf(){
    return this._cnf;
  }
  
  toString(){
    return this.cnf.myArrStr();
  }
  
  validate(ttarr){
    let hasundef=false;
    for(let i=0;i<this.cnf.length;i++){
      let subcl=this.cnf[i];
      let allfalse=true;
      let hastrue=false;
      for(let j=0;j<subcl.length;j++){
        let p=subcl[j];
        if(ttarr.includes(p)){
          hastrue=true;
          break;
        }
        else if(!ttarr.includes(-p))
          allfalse=false;
      }
      if(hastrue)
        continue;
      else if(allfalse)
        return false;
      else
        hasundef=true;
    }
    if(hasundef)
      return undefined;
    return true;
  }  

}
  
  
