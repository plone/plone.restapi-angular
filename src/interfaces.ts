
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
