import type { ESMExport } from "mlly";
import { runArr, extractBlockCode, Mixin } from "su-helpers";
import { findExports } from "mlly";

type Export = Mixin<
  ESMExport,
  {
    declaration?: string;
  }
>;

export interface IexportResult {
  text: string;
  start: number;
  end: number;
  key?: string;
  value?: string;
}

function extractFuncBody(initialIndex:number,endIndex:number,code:string){
  const { end } =
    extractBlockCode({
      code,
      start: "(",
      end: ")",
      initialIndex,
    }) || {};
  if (end) {
    const { end: finalEnd } =
      extractBlockCode({
        code,
        start: "{",
        end: "}",
        initialIndex: end,
      }) || {};
    if (finalEnd) {
      return code.substring(endIndex, finalEnd + 1);
    }
  }
  return ''
}

function execBrace(this: IexportResult,code:string,initialIndex:number,getLen:(text:string)=>number){
  const { text = "" } =
    extractBlockCode({
      code,
      start: "{",
      end: "}",
      initialIndex: initialIndex,
    }) || {};
  this.value = text.trim();
  this.end += getLen(text)
  execRewriteText.call(this,code)
}

function execRewriteText(this: IexportResult,code:string){
  this.text = code.substring(this.start,this.end)
}

function execArrowFunction(this: IexportResult,endIndex:number,code:string,getLen:(text:string)=>number){
  const value = extractFuncBody(this.end,endIndex,code)
  this.value = value.trim()
  this.end += getLen(value)
  execRewriteText.call(this,code)
}

function execFunction(this: IexportResult,endIndex:number,code:string,getLen:(text:string)=>number){
  const value = extractFuncBody(this.end,endIndex,code);
  this.value = value.trim()
  this.end += getLen(value)
  execRewriteText.call(this,code)
}


function complement(this: IexportResult, code: string, exp: Export) {

  const _execArrowFunction = execArrowFunction.bind(this)
  const _execFunction = execFunction.bind(this)
  const _rewriteText = execRewriteText.bind(this)
  const _execBrace = execBrace.bind(this)

  if (exp.type === "default") {
    _execBrace(code,this.end,(text)=>text.length)
    _rewriteText(code)
    return;
  }
  

  if (exp.declaration === "function") {
    const value = extractFuncBody(this.end,this.end,code)
    this.value = value.trim()
    this.end += value.length
    _rewriteText(code)
    return;
  }

  if (exp.declaration && /let|var|const/g.test(exp.declaration)) {
    let i = code.indexOf("\n", this.end);
    const lineText = code.substring(this.end, i);
    if (!lineText.includes("=")) {
      this.value = undefined;
      _rewriteText(code)
      return;
    }

    const eqPos = lineText.indexOf('=')
    const leftCon = lineText.substring(0,eqPos)
    const rightCon = lineText.substring(eqPos+1)
    const trimedRightCon = rightCon.trim()
    const misLen = leftCon.length - leftCon.trim().length + 1
    if (trimedRightCon[trimedRightCon.length - 1] === ";") {
      this.value = trimedRightCon.substring(0,trimedRightCon.length-1).trim();
      this.end += misLen + rightCon.length
      _rewriteText(code)
      return;
    }

    if(trimedRightCon){

      if(trimedRightCon[0] === '{'){
        _execBrace(code,this.end + misLen + rightCon.indexOf('{'),(text)=>misLen + rightCon.length + text!.length - 1)
        return
      }
      
      if((trimedRightCon[0] === '(' && trimedRightCon.includes('=>'))){
        _execArrowFunction(this.end+misLen,code,(value)=>misLen + value.length)
        return
      }

      if(trimedRightCon.startsWith('function')){
        _execFunction(this.end+misLen,code,(value)=>misLen + value.length)
        return
      }
      
    }
    const reg = /(?<=[^;\n]*?)(\{|function|\()/g
    reg.lastIndex = this.end + misLen
    const m = reg.exec(code)
    if(m){
      const getLen = (text:string)=> misLen + m.index - this.end + text!.length - 1
      if(m[1]==='{'){
        _execBrace(code,m.index,getLen)
        return
      }

      if(m[1] === '('){
        _execArrowFunction(m.index,code,getLen)
        return
      }

      if(m[1] === 'function'){
        _execFunction(m.index,code,getLen)
        return
      }
    }
  }
}


export default (code: string) => {
  const exports: IexportResult[] = [];
  const parsedExports = findExports(code);
  runArr<Export>(parsedExports, (v) => {
    const o = {
      text: v.code,
      start: v.start,
      end: v.end,
      key: v.name,
      value: "",
    };
    complement.call(o, code, v);
    exports.push(o);
  });
  return exports;
};
