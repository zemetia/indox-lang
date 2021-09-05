
//========== awal deklarasi beberapa array =========
let panggilIndoxScript;
let indoxSRCarr = [];
let indoxVar = [];
let script = [];
let error = [];
let functionAtt = [];//functionAtt['namafungsi']={script:[script],var:[variable]}
let lm = 0;
let selamaBool;
var regex = {
	logical:/(?<=[)\s])(?=dan|atau)(dan|atau)+(?=[(\s])/g,
	cmdx:/^((#)?\w)+/,cmd:/^((\.|#|~)?\w)+([(].*?[)])?/,
	string: /((\").*?(\")|(\').*?(\'))/g,
	digit: /\d+/,
	var: /\w+/,
	fungsi: /\w+[(].*?[)]/, fungsiB:/[(].*?[)]/,
	DOM:/(#|\.|~)\w+/g,
	cmdDOM:/^(#|\.|~)/,
	htmlopen:/(<!)(.|\n)*?(!>)/,
	regexi:/^((\.|#|~)?\w)+/}

//================ initialize awal ====================
function include(js){
	link = document.getElementsByName('indox').src;
	link.replace("parse.js",js);


}

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

function switchCMD(cmd,text,scr=[]){
	if(!cmd)cmd="";
	switch(cmd){
			case "tampil":
				text = changeVar(text);
				console.log(eval(text));
				break;

			case "jika":
				var bl = text.split("?");
				var bla = eval(changeVar(bl[0]));
				var at = bl[1].split("atau");
				if(at[1]){
					if(bla){indox(at[0].trim());} else {indox(at[1].trim());}
				}else{
					if(bla){indox(at[0].trim());}
				}
				break;

			case "import":
				imp = eval(changeVar(text));
				LoadFile(imp);
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
				b = text.replace(":","").trim();
				bool = eval(changeVar(b));
				while(bool){
					indoxScript(scr);
					bool = eval(changeVar(b));
				}
				break;

			case "fungsi":
				/*fungsi anjay(x):tampil x.  anjay(100)->tampil(x=100)->tampil indoxVar['anjay']['x']*/
				//functionAtt['namafungsi']={script:[script],var:[variable]}
				text = text.replace(":","");
				var va = text.match(/\w+/g);
				var namaFungsi = va[0];
				functionAtt[namaFungsi]={script:[],var:[]};
				functionAtt[namaFungsi].script = scr;
				va.shift();
				for(nvar of va){
				functionAtt[namaFungsi].var[nvar]=null;}
				break;

			case "":
				break;

			default:

				cmd = cmd.replace("=","");
				cmdDOM = cmd.match(regex.cmdDOM);
				if(brack=cmd.match(regex.fungsiB)){
					var vrb = brack[0].match(/\w+/g);
					for(var i = 0; i<vrb.length;i++){
						vrb[i]=eval(changeVar(vrb[i]));
					}
					//isu: bagaimana cara memakai variablenya
					var nama=cmd.match(/^\w+/)[0];
					fungsi(nama,vrb);
				}
				else if(cmdDOM!=null){
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
