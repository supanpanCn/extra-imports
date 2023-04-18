import { runArr, doRegex, AnyObj } from "su-helpers";
import parseJsCode, { IScriptResponse } from "./scripts";
// @ts-ignore
import parseComments from "extract-comments";

export interface ICommentsResponse {
  type: "single" | "multiple";
  text: string;
  jsonText: AnyObj;
  start: number;
  end: number;
}

function getPosition(params: any) {
  const { loc, initStart, type, text, value, code } = params;
  const { start, end } = loc;
  const { line } = start || {};
  const { line: endLine, column } = end || {};
  let chart = 0;
  let dyLine = 1;

  const o = {
    start: 0,
    end: 0,
  };
  let reg = /\n/g;
  doRegex(reg, text, (m) => {
    if (dyLine < line) {
      dyLine++;
      chart = m.index;
    }
  });

  const index = text.indexOf("/", chart);
  if (index > chart) {
    chart = index;
  }

  o.start = chart + initStart;

  if (type === "multiple") {
    doRegex(
      /\n/g,
      text,
      (m) => {
        if (dyLine < endLine) {
          dyLine++;
          chart = m.index;
        }
      },
      chart
    );

    const index = text.indexOf("*/", chart);

    if (index > chart) {
      chart = index;
    }

    o.end = initStart + chart + 2;
  } else {
    reg.lastIndex = chart;
    const m = reg.exec(text);
    o.end = o.start + value.length + 2;
    if (m) {
      const len = m.index - chart;
      o.end = o.start + len + 1;
    }
  }

  return o;
}

function getJson(text: string, type: string) {
  if (type === "single") {
    return {
      value: text,
    };
  }
  try {
    let json = {}
    text = text.trim();
    const arr = text.split("\n").map(v=>v.trim());
    let jsonStr = "{\n";
    while (arr.length) {
      const v = arr.shift()!;
      if(v.startsWith('@')){
        const m = /@(\w+)[\s]+\{([^\}]*?)\}/g.exec(v)
        if(m){
          jsonStr += m[1]
          jsonStr += ':'
          jsonStr += `"${m[2]}"`
          jsonStr += ','
        }
        continue
      }
      jsonStr += v
      if(v.endsWith('{')) continue
      jsonStr += ','
    }
    jsonStr += "}";
    jsonStr = `json = ${jsonStr}`
    
    eval(jsonStr)
    return json;
  } catch (_) {
    return {}
  }
}


export default (code: string): ICommentsResponse[] => {
  const res: ICommentsResponse[] = [];
  const jsCode = parseJsCode(code);
  runArr<IScriptResponse>(jsCode, (v) => {
    runArr<any>(parseComments(v.text), (comment) => {
      const type = (comment.type =
        comment.type === "LineComment" ? "single" : "multiple");
      comment.initStart = v.start;
      comment.text = v.text;
      comment.code = code;
      const pos = getPosition(comment);
      res.push({
        type,
        text: code.substring(pos.start, pos.end),
        jsonText: getJson(comment.value, type),
        start: pos.start,
        end: pos.end,
      });
    });
  });
  return res;
};
