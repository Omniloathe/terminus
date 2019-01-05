

function get_symbols(clause){
  if(clause instanceof Atom){
    return [clause.prop];
  }
  else if(clause instanceof Not){
    return get_symbols(clause.clause);
  }
  else if((clause instanceof If) || clause instanceof Iff){
    let symbols=[];
    get_symbols(clause.left).forEach(e => {
      if(!symbols.includes(e))
        symbols.push(e);
    });
    get_symbols(clause.right).forEach(e => {
      if(!symbols.includes(e))
        symbols.push(e);
    });
    return symbols;
  }
  else{
    let symbols=[];
    clause.clauses.forEach( subcl => {
      let subsym=get_symbols(subcl);
      subsym.forEach(e => {
        if(!symbols.includes(e))
          symbols.push(e);
      });
    });
  return symbols;
  }
}

class SymbleTable{
  constructor(){
    this._symtab={};
    this._counter=1;
  }
  
  get symtab(){
    return this._symtab;
  }
  
  get counter(){
    return this._counter;
  }
  
  set counter(n){
    this._counter=n;
  }
  
  hasSymbol(c){
    return this.symtab.hasOwnProperty(c);
  }
  
  addSymbol(c){
    if(!this.hasSymbol(c)){
      this.symtab[c]=this.counter;
      this.counter++;
    }
  }
    
    addSymbols(arr){
      arr.forEach(c => {this.addSymbol(c)});
    }
  
  get symbols(){
    return Object.getOwnPropertyNames(this.symtab);
  }
  
  
}


class KnowledgeBase{
  constructor(){
    this._clauses=[];
    this._symtab=new SymbleTable();
  }
  
  add_clause(clause){
    this.clauses.push(clause);
    this.symtab.addSymbols(get_symbols(clause));
  }
  
  
  get clauses(){
    return this._clauses;
  }
  
  
  get symtab(){
    return this._symtab;
  }
  
  get symbols(){
    return this.symtab.symbols;
  }
  
  get sentence(){
    return new And(this.clauses);
  }
  
  remove_clause(i){
    this._clauses=this._clauses.slice(i,1);
  }
  
  
  
  
  print(){
    this.clauses.forEach(e => {
      console.log(e.toString());
    });
  }
  
  get encoded(){
    return new EncodedCNF(this.sentence,this.symtab);
  }
  
}



function tt_entails(KB,alpha){
  //KB: knowledge base, a sentence in PL
  //alpha: query, sentence in PL
  let symbols=KB.symbols.concat(get_symbols(alpha));
  return tt_check_all(KB.sentence,alpha,symbols,{});
}

function tt_check_all(KBsen,alpha,symbols,model){
  if(symbols.length===0){
    return pl_true(KBsen,model) ? pl_true(alpha,model) : true;
  }
  else{
    let p=symbols[0];
    let rest=symbols.slice(1);
    return (tt_check_all(KBsen,alpha,rest,Object.assign({p:true},model))) && (tt_check_all(KBsen,alpha,rest,Object.assign({p:false,model})));
  }
}

function pl_true(sentence,model){
  return sentence.evaluate(model);
}

function dpll_satisfiable(KB){
  //needs a sentence in PL
  let CNFclause=convert_cnf(KB.sentence);
  let clauses=CNFclause.clauses;
  let symbols=get_symbols(CNFclause);
  return dpll(clauses,symbols,{});
}

function dpll(clauses,symbols,model){
  console.log(symbols);
  if(clauses.every(e => e.evaluate(model)===true)){
    return true;
  }
  else if(clauses.some(e => e.evaluate(model)===false)){
    return false;
  }
  let p, value;
  [p,value]=find_pure_symbol(clauses,symbols,model);
  if(p!==null){
    model[p]=value;
    symbols=symbols.filter(e => e!==p);
    return dpll(clauses,symbols,model);
  }
  [p,value]=find_unit_clause(clauses,model);
  if(p!==null){
    model[p]=value;
    symbols=symbols.filter(e => e!==p);
    return dpll(clauses,symbols,model);
  }
  p=symbols[0];
  let rest=symbols.slice(1);
  let tmodel=Object.assign({},model);
  tmodel[p]=true;
  let fmodel=Object.assign({},model);
  fmodel[p]=false;
  return dpll(clauses,rest,tmodel) || dpll(clauses,rest,fmodel);
}


function find_pure_symbol(clauses,symbols,model){
  let history={};
  /*
  undefined: not found
  true: pure
  false: pure
  null: impure
  */
  
  
  for(let i=0;i<clauses.length;i++){
    let clause=clauses[i];
    if(clause.evaluate(model)!==true){
      if(clause instanceof Atom){
        let s=clause.prop;
        if(history[s]===undefined)
          history[s]=true;
        else if(history[s]===false)
          history[s]=null;
      }
      else if(clause instanceof Not){
        let s=clause.clause.prop;
        if(history[s]===undefined)
          history[s]=false;
        else if(history[s]===true)
          history[s]=null;
      }
      else{
        clause.clauses.forEach(subcl => {
          if(subcl instanceof Atom){
            let s=subcl.prop;
            if(history[s]===undefined)
              history[s]=true;
            else if(history[s]===false)
              history[s]=null;
          }
          else if(subcl instanceof Not){
            let s=subcl.clause.prop;
            if(history[s]===undefined)
              history[s]=false;
            else if(history[s]===true)
              history[s]=null;
          }
        });
      }
    }
  }
  //console.log(history);
  for(let i=0;i<symbols.length;i++){
    let symbol=symbols[i];
    if(history[symbol]===true || history[symbol]===false)
      return [symbol,history[symbol]];
  }
  return [null,null];
}



/*function find_pure_symbol(clauses,symbols,model){
  //A FUCKING LIST OF OR, NOT, OR ATOM
  let history={};
  symbols.forEach(symbol =>{
    history[symbol]=null;
  });
  clauses.forEach(clause => {
    if(clause.evaluate(model)!==true){
    clause.clauses.forEach(prop =>{
      if(prop instanceof Not){
        let sym=prop.clause.prop; //this is stupid
        if(!history[sym]===undefined){
          if(history[sym]===null)
            history[sym]=false;
          else if(history[sym]===true)
            delete history[sym];
        }
      }
      else{
        let sym=prop.prop; //this is also stupid
        if(!history[sym]===undefined){
          if(history[sym]===null)
            history[sym]=true;
          else if(history[sym]===false)
            delete history[sym];
      }
    }
  });
    }
});
 Object.getOwnPropertyNames(history).forEach(sym => {
   if(history[sym]===true || history[sym]===false)
     return [sym,history[sym]];
 });
  return [null,null];
}
*/
function find_unit_clause(clauses,model){
  for(let i=0;i<clauses.length;i++){
    let clause=clauses[i];
    if(clause.evaluate(model)===true) continue;
    
    if(clause instanceof Atom){
      let s=clause.prop;
      if(!model.hasOwnProperty(s))
        return [s,true];
    }
    else if(clause instanceof Not){
      let s=clause.clause.prop;
      if(!model.hasOwnProperty(s))
        return [s,false];
    }
    else{
      let subcls=clause.clauses;
      let p=undefined,val=undefined;
      for(let i=0;i<subcls.length;i++){
        let subcl=subcls[i];
        if(subcl instanceof Atom){
          let s=subcl.prop;
          if(!model.hasOwnProperty(s)){
            if(p===undefined){
              p=s;
              val=true;
            }
            else{
              p=null;
              val=null;
              break;
            }
          }
        }
        else{
          let s=subcl.clause.prop;
          if(!model.hasOwnProperty(s)){
            if(p===undefined){
              p=s;
              val=false;
            }
            else{
              p=null;
              val=null;
              break;
            }
          }
        }
      }
      if(p!==null || p!==undefined)
        return [p,val];
    }
      
    }
  return [null,null];
}
/*
function find_unit_clause(clauses,model){
  clauses.forEach(clause =>{
    if(clause.evaluate(model)!==true){
    let p=null;
    let value=null;
    let notunit=false;
    for(let i=0;i<clause.clauses.length;i++){
      let prop=clause.clauses[i];
      if(prop instanceof Not){
        let sym=prop.clause.prop;
        let symval=false;
      }
      else{
        let sym=prop.prop;
        let symval=true;
      }
      if(model[sym]!==undefined){
        if(model[sym]===symval){
          notunit=true;
          break;
        }
      }
      else{
        if(p!==null){
          notunit=true;
          break;
        }
        else{
          p=sym;
          value=symval;
        }
      }
    }
    if(!notunit && p!==null){
      return [p,value];
    }
    }
  });
       return [null,null];
}
*/
       

