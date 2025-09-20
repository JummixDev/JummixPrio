
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
