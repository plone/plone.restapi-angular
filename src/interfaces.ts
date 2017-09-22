
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
  comment_id: string ;
  in_reply_to: string ;
  text: TextValue;
  user_notification: string;
  author_username: string;
  author_name: string;
  creation_date: Date;
  modification_date: Date;
}
