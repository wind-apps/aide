// Generated by Xata Codegen 0.28.1. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "items",
    columns: [
      { name: "title", type: "string" },
      { name: "content", type: "json" },
      { name: "textContent", type: "text" },
      { name: "tags", type: "multiple" },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Items = InferredTypes["items"];
export type ItemsRecord = Items & XataRecord;

export type DatabaseSchema = {
  items: ItemsRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL: "https://Demos-t13ff3.eu-west-1.xata.sh/db/aide-app",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
