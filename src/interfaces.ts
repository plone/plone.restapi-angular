/*
 * Status
 */

export interface LoadingStatus {
  loading?: boolean;
  error?: Error;
}

export interface Error {
  type: string;
  message: string;
  traceback:string[];
}


/*
 * NAVIGATION
 */


/*
 * Navigation element of breadcrumbs and global nav
 */
export interface NavLink {
  title: string;
  path: string;
  active: boolean;
  properties?: any;
}

/*
 * Navigation tree
 */
export interface NavTree {
  children: NavTree[];
  inPath?: boolean;
  active?: boolean;
  properties?: any;
}


/*
 * COMMENTS
 *
 */

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


/*
 * SEARCH
 *
 */

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

/*
 * AUTHENTICATION
 *
 */

/* Authentication status */
export interface AuthenticatedStatus {
  state: boolean;
  error?: string
}

export interface LoginInfo {
  login: string;
  password: string;
}

export interface PasswordResetInfo {
  oldPassword?: string,
  newPassword: string,
  login: string,
  token?: string
}

/* User information */
export interface UserInfo {
  sub: string;
  exp: number;
  fullname: string;
}
