import { runArr, AnyObj, replaceAll } from "su-helpers";
import parseJsCode, { IScriptResponse } from "./scripts";
import parseComments from "displace-comments";
import parseNote from "./note";

export interface ICommentsResponse {
  type: "single" | "multiple" | "html" | "note";
  text: string;
  jsonText: AnyObj;
  start: number;
  end: number;
}

function getType(type: ICommentsResponse["type"], text: string) {
  if (type === "multiple") {
    if (text.indexOf("@") > -1) {
      return "note";
    }
  }
  return type;
}

function getHtml(text: string) {
  text = text.replace("<!--", "");
  text = text.replace("-->", "");
  return text.trim();
}

function getSingle(text: string) {
  text = text.replace("//", "");
  return text.trim();
}

function getMultiple(text: string) {
  const fragments = text.split("\n");
  const json: AnyObj = {
    unknows: [],
  };
  runArr<string>(fragments, (v, i) => {
    const reg: any = /\*/g;
    v = replaceAll(v, reg);
    v = v.trim();
    if (v.startsWith("/")) {
      return "continue";
    }
    if (v.indexOf(":") > -1) {
      let [key, value] = v.split(":");
      key = key.trim();
      const m = /[a-zA-Z]*/.exec(key);
      if (m && m[0].length === key.length) {
        const r = /('|")(.*?)\1/.exec(value);
        json[key] = r ? r[2] : value;
        return "continue";
      }
    }
    json.unknows.push([v, i]);
  });

  return json;
}

function getNote(text: string) {
  const [{ jsonText }] = parseNote(text) || [
    {
      jsonText: {},
    },
  ];
  return jsonText;
}

function getJson(text: string, type: ICommentsResponse["type"]) {
  if (type === "single") {
    return {
      value: getSingle(text),
    };
  }

  if (type === "html") {
    return {
      value: getHtml(text),
    };
  }

  switch (type) {
    case "multiple":
      return getMultiple(text);
    case "note":
      return getNote(text);
  }
}

export default (code: string): ICommentsResponse[] => {
  const res: ICommentsResponse[] = [];
  const jsCode = parseJsCode(code);
  runArr<IScriptResponse>(jsCode, (v) => {
    const { detail } = parseComments(v.text) || {
      detail: [],
    };
    runArr<any>(detail, (comment) => {
      const { type, start, end, text } = comment;
      const o = {
        type: getType(type, text),
        text,
        start: start + v.start,
        end: end + v.end,
        jsonText: {},
      };

      o.jsonText = getJson(text, o.type) as any;
      res.push(o);
    });
  });
  return res;
};
