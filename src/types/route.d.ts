export interface RouterBody {
  name?: string;
  path: string;
  component?: any;
  element?: any;
  children?: RouterBody[];
  auth?: boolean;
  title?: string;
}