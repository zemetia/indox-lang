
//========== awal deklarasi beberapa array =========
let panggilIndoxScript;
let indoxSRCarr = [];
let indoxVar = [];
let script = [];
let error = [];
let lm = 0;
let selamaBool;
var regex = {
	logical:/(?<=[)\s])(?=dan|atau)(dan|atau)+(?=[(\s])/g,
	cmd:/^((#)?\w)+/,
	string: /((\").*?(\")|(\').*?(\'))/g,
	digit: /\d+/,
	var: /\w+/,
	fungsi: /\w+[(].*?[)]/,
	DOM:/(#|\.|~)\w+/g,
	cmdDOM:/^(#|\.|~)/}

//================ initialize awal ====================
function init(){
	var IndoxTag = document.getElementsByTagName("indox");
	for(let IdxIsi of IndoxTag){
		let src = IdxIsi.getAttribute("src");
		if(src){
			indoxSRCarr.push(src);
		}
	}
	for(let i of indoxSRCarr){
  LoadFile(i);
}
}

async function LoadFile(file){ 
  let x = await fetch(file);
  let y = await x.text();
  let line = y.split("\r\n");
  script.push(line);
  indoxScript(line);
}

document.addEventListener("DOMContentLoaded", ()=>{
	init();
});
//======================================================
//======================================================


function switchCMD(cmd,text){
	if(!cmd)cmd="";
	switch(cmd){
			case "tampil":
				text = changeVar(text);
				console.log(eval(text));
				break;
			case "jika":
				var bl = text.split("?");
				var at = bl[1].split("atau");
				if(eval(changeVar(bl[0]))){
					indox(at[0].trim());
				} else {indox(at[1].trim());}
				break;
			case "masukkan":
				var bagi = text.split("ke");
				//bagi[0] = matchLogical(bagi[0]);
				cmdDOM = bagi[1].trim().match(regex.cmdDOM);
				if(cmdDOM!=null){
					if(cmdDOM[0]=="~"){bagi[1] = bagi[1].trim().substr(1)};
					document.querySelector(bagi[1]).innerHTML = eval(changeVar(bagi[0].trim()));
				}else{
					masukkan(bagi[1].trim(),changeVar(bagi[0].trim()));
				}
				break;
			case "selama":
				selamaBool = text.replace(":","").trim();
				lm = 1;
				break;
			case "":
				break;
			default:
				cmd = cmd.replace("=","");
				cmdDOM = cmd.match(regex.cmdDOM);
				if(cmdDOM!=null){
					if(cmdDOM[0]=="~"){cmd = cmd.substr(1)};
					document.querySelector(cmd).innerHTML = eval(changeVar(text.replace("=","").trim()));
				}else{
					text = text.replace("=","").trim();
					text = matchLogical(text);
					masukkan(cmd.trim(),changeVar(text));
				}
				cmdDOM = null;

				break;
		}
}

function indoxScript(script){
	var tabScript = [];
	for(let innerScript of script){
		var regexi = /^((\.|#|~)?\w)+/;
		innerScript = innerScript.split("//")[0];
		var cmd = innerScript.match(regexi);
		if(cmd){
		var text = innerScript.replace(cmd[0],"");}
		else {cmd=[""];}
		//lm 0/1 dimana ada fungsi butuh script kaya while, if, loop, function,dll
		if(lm==1){
			if(innerScript.match("\t")){
				tabScript.push(innerScript);
			}else{
				selama(selamaBool,tabScript);
				tabScript=[];
				lm=0;
				switchCMD(cmd[0],text);''
			}
		}else{
		switchCMD(cmd[0],text);}
	}
}

function  masukkan(vari,isian){
		indoxVar[vari] = eval(isian);
}

function indox(script){
		var cmd = script.match(regex.cmd);
		var text = script.replace(cmd[0],"")
		switchCMD(cmd[0],text);
}

function changeVar(text){
	var string = text.match(regex.string);
	text = text.replace(regex.string,"!");
	var sDOM = text.match(regex.DOM);
	text = text.replace(regex.DOM,"#");
	text = matchLogical(text);
	text = text.replaceAll(/(?!\d)\w+/g,"indoxVar['$&']");
	
	if(sDOM){
	for(i in sDOM){
		if(sDOM[i][0]=="~"){sDOM[i] = sDOM[i].substr(1)};
	text = text.replace("#","document.querySelector('"+sDOM[i]+"').innerHTML");
	}}
	if(string){
	for(i in string){
    text = text.replace("!",string[i]);
	}}
	return text;
}

function detectVariable(vari){
	vari.replace(/\w+/,"");
}

function declareVar(varr,isi = null){
	 if(isi==null){
	 	return indoxVar[varr];
	 } else {
	 	indoxVar[varr] = isi;}
}

function intOperator(x){
return eval(x);
}

function logical(x){
	x = x.replaceAll(regex.logical,y=>danatau(y));
	return x;
}
function danatau(text){
	if(text.trim()=="dan"){return "&&";}
	else if(text.trim()=="atau"){return "||";}
}

function matchLogical(text){
	if(text.match(/(dan|atau)/g)!=null){
		return logical(text);
	}else{return text;}
}

function jika(kondisi,script){
	if(logical(kondisi)){
		scriptProg(script);
	}
}

function selama(bool,script){
	bool = matchLogical(changeVar(bool));
	while(eval(bool)){
		indoxScript(hapusTabArray(script));
	}
}

function hapusTabArray(ar){
	for(i in ar){
		ar[i] = ar[i].replace("\t","");
	}
	return ar;
}