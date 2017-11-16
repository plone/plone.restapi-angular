/*
 * Status
 */
import { HttpErrorResponse } from '@angular/common/http';

export interface LoadingStatus {
  loading?: boolean;
  error?: Error;
}

export interface Error {
  type: string;
  message: string;
  traceback?: string[];
  response?: HttpErrorResponse;
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
  review_state?: string;
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
  username: string | null;
  error?: string;
}

export interface LoginInfo {
  login: string;
  password: string;
}

export interface PasswordResetInfo {
  oldPassword?: string;
  newPassword: string;
  login: string;
  token?: string;
}


/* File download */

export interface NamedFile {
  download: string;  // download path
  filename: string;
  'mime-type': string;
}

export interface DownloadStartedEvent {
  namedFile: NamedFile;
  originalEvent: Event;
}

export interface DownloadSucceededEvent {
  blob: Blob;
  namedFile: NamedFile;
}

export interface DownloadFailedEvent {
  error: Error;
  namedFile: NamedFile;
}
