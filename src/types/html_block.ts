import { HTMLElement } from "node-html-parser";
import { Dependent } from "./dependent";

export type RefType =
  | ["Element", string, string]
  | ["Empty", null, string]
  | ["TextNode", null, string]
  | ["Base", null, null];

// ref type,ref id,parent elm id

export type HtmlBlock = {
  blockId: string;
  element: HTMLElement;
  ref: RefType; //appendChildの際に用いるreference
  parentBlockId?: string;
  condition?: string;
  dependencies: Dependent[];
  childHtmlBlock: HtmlBlock[];
};

//HTML Blockを通してdependしている変数も記述する
//HTML 親またはその親の関係にある全てのブロックのifstatementをまとめる
