import { parseCode,replaceAll } from "su-helpers";
export interface IvariableResult {
  text: string;
  start: number;
  end: number;
  key: string;
  value: string | undefined;
}
function createItem(text: string,step:number) {
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
  const o: IvariableResult = {
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
  const res: IvariableResult[] = [];
  parseCode(code, {
    visitor(text, s, astType) {
      if (["const", "var", "let"].includes(astType)) {
        const item = createItem(text,s);
        item && res.push(item);
      }
    },
  });
  return res;
};
