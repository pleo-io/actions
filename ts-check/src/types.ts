export interface Commit {
  id: string
  distinct: boolean
}

export enum FileStatus {
  ADDED = 'added',
  MODIFIED = 'modified'
}
