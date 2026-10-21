export const commands = ['frida -U -f com.lab.vault -l root-bypass.js','frida -U -f com.lab.vault -l ssl-bypass.js'];
export function validateCommand(input, stage) {
 const tokens=input.trim().split(/\s+/);
 if(tokens.shift()!=='frida'||tokens.length!==5)return false;
 const flags={};
 while(tokens.length){const flag=tokens.shift(); if(flag==='-U'){if(flags[flag])return false;flags[flag]=true;}else if(flag==='-f'||flag==='-l'){if(flags[flag])return false;flags[flag]=tokens.shift();}else return false;}
 return flags['-U']===true&&flags['-f']==='com.lab.vault'&&flags['-l']===(stage===0?'root-bypass.js':stage===1?'ssl-bypass.js':null);
}
