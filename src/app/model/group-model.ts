export interface Group {
  id: number,
  web_url: string,
  name: string,
  path: string,
  description: string,
  visibility: string,
  share_with_group_lock: boolean,
  require_two_factor_authentication: boolean,
  two_factor_grace_period: number,
  project_creation_level: string,
  auto_devops_enabled: null,
  subgroup_creation_level: string,
  emails_disabled: boolean,
  emails_enabled: boolean,
  mentions_disabled: null,
  lfs_enabled: boolean,
  math_rendering_limits_enabled: boolean,
  lock_math_rendering_limits_enabled: boolean,
  default_branch: null,
  default_branch_protection: number,
  default_branch_protection_defaults: {
    allowed_to_push: [
      { access_level: number }
    ],
    allow_force_push: boolean,
    allowed_to_merge: [
      { access_level: number }
    ]
  },
  avatar_url: null,
  request_access_enabled: boolean,
  full_name: string,
  full_path: string,
  created_at: string,
  parent_id: number,
  organization_id: number,
  shared_runners_setting: string,
  max_artifacts_size: null
}