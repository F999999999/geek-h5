import { RouteObject } from "react-router-dom";

export interface RouterBody extends RouteObject {
  name?: string;
  path: string;
  component?: any;
  element?: any;
  children?: RouterBody[];
  auth?: boolean;
  title?: string;
}
