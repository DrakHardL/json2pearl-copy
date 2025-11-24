export interface User {
  id: number,
  username: string,
  name: string,
  state: string
  locked: boolean
  avatar_url: string | null,
  web_url: string,
}