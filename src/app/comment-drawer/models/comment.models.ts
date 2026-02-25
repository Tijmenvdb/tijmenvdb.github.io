
export interface CommentSection {
  title: string,
  order: number,
  comments: Comment[]
}

export interface Comment {
  // backend
  id: string,
  username: string,
  message: string,
  date?: Date,
  replies: Comment[]

  // frontend
  isNew?: boolean,
}

export type CommentElementType = 'main' | 'drawer' | 'header' | 'hook' | 'section' | 'comment'


