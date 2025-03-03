
export interface Notification {
    id: string;
    account_id: string;
    title: string;
    message: string;
    type: string;
    link?: string;
    is_read: boolean;
    created_at: string;
  }