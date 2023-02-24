import { parseCode } from "su-helpers";
interface Irespose {
  text: string;
  start: number;
  end: number;
}

const filters = ["const", "var", "let","function"]

let step = 0;
function createItem(text: string,astType:string) {
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
  const o: Irespose = {
    text:body,
    start: step,
    end: step + text.length,
  };
  step += text.length;
  return o;
}

export default (code: string) => {
  const res: Irespose[] = [];
  step = 0;
  parseCode(code, {
    visitor(text, s, astType) {
      if (filters.includes(astType)) {
        if (step === 0) {
          step = s;
        }
        const item = createItem(text,astType);
        if(item) res.push(item);
      }
    },
  });
  return res;
};
