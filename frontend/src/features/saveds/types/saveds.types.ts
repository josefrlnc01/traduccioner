export type Saveds = {
  _id: string,
  fileId: string,
  title: string,
  segments: {
    start: number,
    end: number,
    text: string
  }[],
  duration: string,
  origin: string,
  user: string,
}[]

export type SavedsList = {
  files: Saveds,
  youtubeFiles: Saveds
}