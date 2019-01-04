function Token(type,value){
  this.type=type;
  this.value=value;
}

function Not(clause){
  this.clause=claus;
}

function And(clauses){
  this.clauses=clauses;
}

 

function 

var argparser={
  
  tokenize:function(str){
    var atomregex=/^[a-zA-Z][a-zA-Z0-9_]{0,8}/;
    var andregex=/^(&|and)/i;
    var orregex=/^(\||or)/i;
    var notregex=/^(~|not)/i;
    var implyregex=/^->/;
    var iffregex=/^<->/;
    var lparen=/^\(/;
    var rparen=/^\)/;
    var regexes=[[lparen,"LPAREN"],[rparen,"RPAREN"],[andregex,"AND"],[orregex,"OR"],[notregex,"NOT"],[implyregex,"IF"],[iffregex,"IFF"],[atomregex,"ATOM"]];
    var tokens=[];
    while(str!==""){
      str=str.trim();
      var matched=false;
      for(var i=0;i<regexes.length;i++){
        var reg=regexes[i];
        var m=str.match(reg[0]);
        if(m!=null){
          matched=true;
          tokens.push(new Token(reg[1],m[0]));
          str=str.slice(m[0].length);
          break;
        }
      }
      if(!matched){
        throw "Invalid symbol found at: "+str;
      }  
    }
    return tokens;
  },
  
  parse:function(tokens){
    var parsetree=new ParseNode(tokens);
    return parsetree.eval();
},
  full_parse:function(str){
    return this.parse(this.tokenize(str));
  }
  
}