import { parseCode } from "su-helpers";
export interface IfuncResult {
  text: string;
  start: number;
  end: number;
}

const filters = ["const", "var", "let","function"]

function createItem(text: string,astType:string,step:number) {
  let body = text.trim()
  const f = filters.slice(0,filters.length-1)
  if(f.includes(astType)){
    if(!body.includes('=')){
      return null
    }
    if(!['f','('].includes(body.split('=')[1].trim()[0])){
      return null
    }
  }
  const o: IfuncResult = {
    text:body,
    start: step,
    end: step + text.length,
  };
  step += text.length;
  return o;
}

export default (code: string) => {
  const res: IfuncResult[] = [];
  parseCode(code, {
    visitor(text, s, astType) {
      if (filters.includes(astType)) {
        const item = createItem(text,astType,s);
        if(item) res.push(item);
      }
    },
  });
  return res;
};
