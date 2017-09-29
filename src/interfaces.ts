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

export interface TextValue {
  data: string;
  'mime-type': string;
}

export interface Comment {
  author_name: string;
  author_username: string;
  comment_id: string ;
  creation_date: Date;
  in_reply_to?: string | null;
  modification_date: Date;
  text: TextValue;
  user_notification: boolean | null;
}

export interface SearchOptions {
  sort_on?: string;
  sort_order?: string;
  metadata_fields?: string[];
  start?: number;
  size?: number;
  fullobjects?: boolean;
}

export interface Batching {
  '@id': string;
  first: string;
  last: string;
  next: string;
  prev: string;
}

export interface SearchResults {
  '@id': string;
  items_total: number;
  items: any[];
  batching: Batching;
}
