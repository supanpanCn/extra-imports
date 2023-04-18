import {
  runArr,
  AnyObj,
  getLastItemOfArray,
  extractBlockCode,
} from "su-helpers";
import parseJsCode, { IScriptResponse } from "./scripts";
import { parse } from "comment-parser";

export interface INoteResponse {
  text: string;
  jsonText: AnyObj;
  description?: string;
}

type Source = {
  source: string;
};

type TagType = "string" | "object" | "array";

function getText(source: Source[]) {
  let text = "";
  runArr<Source>(source, (s) => {
    text += s.source;
    text += "\n";
  });
  return text.trim();
}

function getValueByType(type: TagType, value: string) {
  try {
    const reg = /\{(.*?)\}/g;
    type.match(reg);
    const actualType = RegExp.$1;
    var t: any[] = [];
    switch (actualType) {
      case "boolean":
        return Boolean(value);
      case "string":
        return value;
      case "array":
      case "object":
        const tem = `t = ${value}`;
        eval(tem);
        return t;
    }
    return value;
  } catch (_) {
    return value;
  }
}

let isMatching = false;
let matchingKey: any = "";
var obj = {};

function getJson(source: Source[]) {
  try {
    let json: any = {};

    function findWaitKey() {
      for (let key in json) {
        if (json[key] === "note:wait-process") {
          return key;
        }
      }
    }

    function complete() {
      isMatching = false;
      json["note"] = "{" + json["note"];
      if (matchingKey) {
        const text = json["note"];
        const t = `obj = ${
          extractBlockCode({
            code: text,
            start: "{",
            end: "}",
            initialIndex: text.indexOf("{"),
          })?.text
        }`;
        eval(t);
        json[matchingKey] = obj;
        delete json["note"];
      }

      matchingKey = "";
    }

    runArr<Source>(source, (s) => {
      let str = s.source.trim();

      if (str === "/**" || str === "*/") {
        if (str === "*/" && isMatching && matchingKey) complete();
        return "continue";
      }

      if (isMatching) {
        if (str.startsWith("*")) {
          str = str.substring(1);
        }
        str = str.trim();

        const key = findWaitKey();
        if (key) {
          if (!json["note"]) {
            json["note"] = "";
          }
          json["note"] += str;
        }

        if (str.endsWith("}")) complete();
        return "continue";
      }
      str = str.substring(1).trim();

      if (str[0] !== "@") {
        return "continue";
      }

      str = str.substring(1).trim();
      const arr = str
        .split(" ")
        .filter((v) => v)
        .map((v) => v.trim());

      const len = arr.length;
      if (len === 4) {
        const [key, type, value] = arr || [];
        json[key] = getValueByType(type as TagType, value);
        return "continue";
      }

      if (len === 1) {
        return "continue";
      }

      if (len === 2) {
        const [key, value] = arr || [];
        if (value.trim() === "{") {
          json[key] = "note:wait-process";
          matchingKey = key;
          isMatching = true;
        } else {
          json[key] = value;
        }
        return "continue";
      }

      if (len === 3) {
        if (getLastItemOfArray(arr).endsWith("{")) {
          const [key] = arr || [];
          json[key] = "note:wait-process";
          isMatching = true;
          matchingKey = key;
          return "continue";
        }
        const item = arr.find((v) => v.startsWith("{") && v.endsWith("}"));
        if (item) {
          const [key, type, value] = arr || [];
          json[key] = getValueByType(type as TagType, value);
          return "continue";
        }
        const [key, value] = arr || [];
        json[key] = value;
      }
    });

    return json;
  } catch (_) {
    debugger;
    return {};
  }
}

export default (code: string): INoteResponse[] => {
  const res: INoteResponse[] = [];
  const jsCode = parseJsCode(code);
  runArr<IScriptResponse>(jsCode, (v) => {
    runArr<any>(parse(v.text), (block) => {
      const json: any = {
        description: block?.description,
        text: getText(block?.source),
        jsonText: getJson(block?.source),
      };
      res.push(json);
    });
  });
  return res;
};
