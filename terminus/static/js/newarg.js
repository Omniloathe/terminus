//random filler for footer to add content
/*function dateStr(){
  return new Date().toDateString();
}

var footer=document.querySelector('footer');
footer.innerHTML=dateStr();*/

//argument object

var argument={
  _clauses: [],
  _conclusion: undefined,
  
  get clauses(){
    return this._clauses;
  },
  
  get conclusion(){
    return this._conclusion;
  },
  
  set conclusion(val){
    this._conclusion=val;
  },
  
  
  addClause: function(clause){
      this.clauses.push(clause);
    },

  deleteClause:function(i){
    this.clauses.splice(i,1);
    this.printConsole();
  },
  
  printConsole: function(){
    if(this.clauses.length===0){
      console.log("Empty argument");
    }
    else{
      console.log(this.clauses.map(e => e.toString()).join(","));
    }
  }
  //end of argument object because I'm dumb
}

var view={
  displayArgList:function(){
    //this might be a bad idea
    var arglist=document.querySelector('ol');
   arglist.innerHTML=''; argument.clauses.forEach(function(clause,position){
      var clauseli=document.createElement('li');
      clauseli.id="clause-"+position;
      clauseli.textContent=clause;
      rmbutton=document.createElement('button');
      rmbutton.className="rmbutton";
      rmbutton.textContent="Delete";
      clauseli.appendChild(rmbutton);
      arglist.appendChild(clauseli);
    });
},
  
  displayConclusion: function(errorstr=""){
    const conclusiondiv=document.getElementById("conclusion_div");
    conclusiondiv.innerHTML="";
    const concbutton=document.createElement("button");
    concbutton.className="sidebutton";
    if(argument.conclusion===undefined){
      const conc_input=document.createElement("input");
      conc_input.id="conclusion_input";
      conc_input.type="text";
      //conc_input.default=input_text;
      conclusiondiv.appendChild(conc_input);
      concbutton.textContent="Set Conclusion";
      concbutton.addEventListener("click",handlers.setConclusion);
    }
    else{
      const conc_text=document.createElement("span");
      conc_text.innerHTML=`Ergo: ${argument.conclusion.toString()}`;
      conclusiondiv.appendChild(conc_text);
      concbutton.textContent="Edit";
      concbutton.addEventListener("click",handlers.editConclusion);
    }
    conclusiondiv.appendChild(concbutton);
    if(errorstr!==""){
      conclusiondiv.appendChild(document.createElement("br"));
      const errorp=document.createElement("p");
      errorp.className="errortext";
      errorp.textContent=errorstr;
      conclusiondiv.appendChild(errorp);
    }
  },
  
  setupEventListeners:function(){
    var arglist=document.querySelector('ol');
  arglist.addEventListener('click',function(event){
    var clicked=event.target;

    if(clicked.className==="rmbutton"){
      var i=parseInt(clicked.parentElement.id.split('-')[1]);
      handlers.deleteClause(i);
    }
    });
  }
}  

var handlers={
  addClause:function(){
    const clausetext=document.getElementById('addclausetext').value;
    const anterror=document.getElementById("anterror");
    try{
      const clause=str_to_pl(clausetext);
      argument.addClause(clause);
      anterror.textContent="";
    }
    catch(e){
      anterror.textContent=e.message;
    }
    
    view.displayArgList();
  },
  deleteClause:function(i){
    argument.deleteClause(i);
    view.displayArgList();
},
  setConclusion(){
    const concstr=document.getElementById("conclusion_input").value;
    try{
      const cclause=str_to_pl(concstr);
      argument.conclusion=cclause;
      view.displayConclusion();
    }
    catch(e){
      view.displayConclusion(e.message);
    }
  },
  editConclusion(){
    argument.conclusion=undefined;
    view.displayConclusion();
  },
  validate(){
    const valtext=document.getElementById("validatemsg");
    if(argument.clauses.length===0){
      valtext.className="errortext";
      valtext.innerHTML="Requires at least one premise";
    }
    else if(argument.conclusion===undefined){
      valtext.className="errortext";
      valtext.innerHTML="Please specify a conclusion";
    }
    else{
    try{
      const KB=new KnowledgeBase();
      argument.clauses.forEach(clause => KB.add_clause(clause));
      KB.add_clause(new Not(argument.conclusion));
      const result=dpll_satisfiable(KB);
      if(result===false){
        valtext.className="successtext";
        valtext.innerHTML="The conclusion is entailed from the premises";
      }
      else{
        valtext.className="errortext";
        valtext.innerHTML="The conclusion is not entailed from the premises";
      }
    }
    catch(e){
      valtext.className="errortext";
      valtext.innerHTML=e.message;
    }
  }
}
}

view.setupEventListeners();
view.displayConclusion();


