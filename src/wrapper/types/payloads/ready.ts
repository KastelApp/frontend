export interface ReadyPayload {
    user: User
    guilds: Guild[]
    settings: Settings
    presence: Presence[]
  }
  
  export interface User {
    id: string
    email: string
    emailVerified: boolean
    username: string
    globalNickname: string | null
    tag: string
    avatar: string | null
    publicFlags: string
    flags: string
    phoneNumber: string | null
    mfaEnabled: boolean
    mfaVerified: boolean
    bio: string | null
  }
  
  export interface Guild {
    name: string
    description: string | null
    features: string[]
    id: string
    icon: string | null
    owner: Owner
    coOwners: Owner[]
    maxMembers: number
    flags: number
    channels: Channel[]
    roles: Role[]
    members: Member[]
  }
  
  export interface Owner {
    avatar: string | null
    flags: string
    globalNickname: string | null
    id: string
    publicFlags: string
    tag: string
    username: string
  }
  
  export interface Channel {
    name: string
    description: string | null
    id: string
    parentId?: string
    ageRestricted: boolean
    slowmode: number
    type: number
    children: string[]
    permissionOverrides: PermissionOverrides
    position: number
  }
  
  export interface PermissionOverrides {
    [key: string]: PermissionOverride
  }
  
  export interface PermissionOverride {
    allow: [string, string][]
    deny: [string, string][]
    slowmode: number
    type: number
  }
  
  export interface Role {
    name: string
    color: number
    hoist: boolean
    id: string
    permissions: [string, string][]
    position: number
    allowedAgeRestricted: boolean
  }
  
  export interface Member {
    user: MemberUser
    owner: boolean
    nickname: string | null
    roles: string[]
  }
  
  export interface MemberUser {
    username: string
    id: string
    flags: string
    publicFlags: string
    avatar: string | null
  }
  
  export interface Settings {
    language: string
    privacy: number
    theme: string
    guildOrder: {
        guildId: string
        position: number
    }[]
  }
  
  export interface Presence {
    type: number
    state: string | null
    status: string
    since: number
  }
  