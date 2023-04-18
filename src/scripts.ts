import { doRegex, regex } from "su-helpers";

export interface IScriptResponse {
  text: string;
  start: number;
  end: number;
}

function getCon(text:string){
  if(typeof text === 'string' && regex.scriptBodyRE.exec(text)){
    console.log(RegExp.$1)
  }
  
  return text
}

export default (code: string) => {
  const reg = regex.scriptBodyRE;
  const res: IScriptResponse[] = [];
  doRegex(reg, code, (m) => {
    res.push({
      text: m[0],
      start: m.index,
      end: reg.lastIndex
    });
  });
  if (res.length === 0) {
    res.push({
      text: code,
      start: 0,
      end: code.length
    });
  }
  return res;
};
