export enum FileStatus {
  ADDED = 'added',
  MODIFIED = 'modified'
}

export interface Error {
  file: string
  message: string
}
