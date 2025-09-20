

export type SortOption = 'relevance' | 'newest' | 'popularity' | 'date_asc' | 'date_desc' | 'rating' | 'price_asc' | 'price_desc' | 'distance';
export type DateFilter = 'all' | 'today' | 'weekend' | 'month';

export type Event = {
  id: string;
  [key:string]: any;
};

export type UserProfile = {
    uid: string;
    displayName: string;
    username: string;
    photoURL: string;
    hint: string;
    followers?: string[];
    following?: string[];
    isVerifiedHost?: boolean;
};
