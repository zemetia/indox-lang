function indoxScript(script){
	var tabScript = ["selama","untuk","jika","fungsi"];
	var sb = [];
	var x = 0;
	while(x<script.length){
		innerScript = script[x];
		innerScript = innerScript.split("//")[0];
		var cmd = innerScript.match(regex.regexi);
		cmd = cmd?cmd[0]:"";
		if(tabScript.includes(cmd)){
			while(true){
				x++;
				if(script[x].match("\t")){
					sb.push(script[x].replace("\t",""));
				}else{x--;break;}
			}
			var text = innerScript.replace(cmd,"");
			switchCMD(cmd,text.trim(),sb);
			sb =[];
		}
		else{
		var text = innerScript.replace(cmd,"");
		switchCMD(cmd,text.trim());}
		x++;
	}
}

function  masukkan(vari,isian,local=""){
		if(local==""){
			indoxVar[vari] = eval(isian);
		}else{indoxVar[local][vari] = eval(isian);}
}

function indox(script){
		var cmd = script.match(regex.cmd);
		var text = script.replace(cmd[0],"")
		switchCMD(cmd[0],text);
}

function changeVar(text,local=""){
	var string = text.match(regex.string);
	text = text.replace(regex.string,"!");
	var sDOM = text.match(regex.DOM);
	text = text.replace(regex.DOM,"#");
	text = matchLogical(text);
	if(local!=""){
	text = text.replaceAll(/(?!\d)\w+/g,"indoxVar['"+local+"']['$&']");
	}else{
	text = text.replaceAll(/(?!\d)\w+/g,"indoxVar['$&']");
	}
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

function fungsi(nama,vrb){
indoxScript(functionAtt[nama].script)
}

function htmlScript(htm){
}