export interface Topic {
  id: number
  name: string
  title: string
  description: string | null
  total_projects_count: number
  organization_id: number
  avatar_url: string | null
}
