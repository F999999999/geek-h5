import { RouteObject } from "react-router-dom";

export interface RouterBody extends RouteObject {
  children?: RouterBody[];
  title?: string;
  auth?: boolean;
}
