
export interface NavLink {
  title: string;
  path: string;
  active: boolean;
  properties?: any;
}

export interface NavTree {
  children: NavTree[];
  inPath?: boolean;
  active?: boolean;
  properties?: any;
}
