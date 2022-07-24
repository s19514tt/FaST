import { HTMLElement } from "node-html-parser";

export type RefType =
  | ["Element", string]
  | ["Empty", null]
  | ["TextNode", null];

export type HtmlBlock = {
  blockId: string;
  element: HTMLElement;
  ref: RefType; //appendChildの際に用いるreference
};

//HTML Blockを通してdependしている変数も記述する
//HTML 親またはその親の関係にある全てのブロックのifstatementをまとめる
