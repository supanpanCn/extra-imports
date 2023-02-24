import { parseCode,replaceAll } from "su-helpers";
interface Irespose {
  text: string;
  start: number;
  end: number;
  key: string;
  value: string | undefined;
}
let step = 0;
function createItem(text: string) {
  function _getKey(key:string){
    const reg = /let|var|const/g
    const m = reg.exec(key)
    if(m){
      key = replaceAll(key,m[0])
      return key.trim()
    }
    return ''
  }
  let key = ''
  let value:string|undefined = ''
  if(text.includes("=")){
    let [processingKey,processingValue] = text.split("=") as string[]
    processingKey = processingKey.trim()
    value = processingValue.trim()
    if(value === '' || value.includes('function')){
      return null
    }
    key = _getKey(processingKey)
  }else{
    key =  _getKey(text)
    value = undefined
  }
  const o: Irespose = {
    text:text.trim(),
    start: step,
    end: step + text.length,
    key,
    value,
  };
  step += text.length;
  return o;
}

export default (code: string) => {
  const res: Irespose[] = [];
  step = 0;
  parseCode(code, {
    visitor(text, s, astType) {
      if (["const", "var", "let"].includes(astType)) {
        if (step === 0) {
          step = s;
        }
        const item = createItem(text);
        item && res.push(item);
      }
    },
  });
  return res;
};
