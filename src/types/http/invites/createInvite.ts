export interface CreateInviteOptions {
  channelId: string;
  maxUses?: number;
}

export interface CreateInviteResponse {
  code: string;
  uses: number;
  maxUses: number;
  createdAt: string;
  expires: string | null;
  creatorId: string;
  deleteable: boolean;
  type: number;
}
