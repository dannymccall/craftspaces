export type User = {
    id: number;
    email:string;
    password:string;
    role:string;
    name:string;
    email_verified: boolean;
    avatar?:string
  }

export interface CustomFile {
  name: string;
  lastModified: number;
  lastModifiedDate: Date;
  webkitRelativePath: string;
  size: number;
  // Add other properties if needed, for example:
  // type: string;
}