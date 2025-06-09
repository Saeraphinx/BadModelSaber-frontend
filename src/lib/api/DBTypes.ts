export type UserPublicAPI = {
    id: string;
    username: string;
    displayName: string | null;
    bio: string | null;
    sponsorUrl: string | null;
    roles: UserRole[];
    avatarUrl: string | null;
}

export enum UserRole {
    Admin = "admin",
    Developer = "developer",
    Moderator = "moderator",
    Trusted = "trusted",
    BSMG = "bsmg",
    Banned = "banned",
}

export enum AssetType {
    Avatar = 'avatar',
    Saber = 'saber',
    Platform = 'platform',
    Note = 'note',
    Wall = 'wall',
    HealthBar = 'health-bar',
    Sound = 'sound',
    Banner = 'banner',

    ChromaEnvironment = 'chroma-environment',
    Camera2Config = 'camera2-config',
    CountersPlusConfig = 'counters-plus-config',
}

export enum AssetFileFormat {
    // sabers
    Saber_Wacker = 'saber_wacker',
    Saber_Saber = 'saber_saber',

    Avatar_Avatar = 'avatar_avatar',

    Platform_Plat = 'platform_plat',

    Note_Bloq = 'note_bloq',
    Note_Cyoob = 'note_cyoob',

    Wall_Pixie = 'wall_pixie',
    Wall_Box = 'wall_box',

    HealthBar_Energy = 'health-bar_energy',

    Sound_Ogg = 'sound_ogg',
    Sound_Mp3 = 'sound_mp3',

    Banner_Png = 'banner_png',

    JSON = 'json_json',
}
    
export enum Status {
    Private = 'private',
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
}

export type StatusHistory = {
    status: Status;
    reason: string;
    timestamp: Date;
    userId: string; // User ID of the person who changed the status
};

export interface LinkedAsset {
    id: string;
    linkType: LinkedAssetLinkType;
}

export enum LinkedAssetLinkType {
    Older = 'older', // e.g. a newer version of the asset
    Newer = 'newer', // e.g. an older version of the asset
    AltFormat = 'altFormat', // e.g. a different format of the same asset (e.g. .saber and .wacker)
    Alternate = 'alternate', // e.g. an alternate version of the asset (e.g. a different color scheme)
}

export interface Credit { // ${workDone} by ${userId.username}
    userId: string; // User ID of the person credited
    workDone: string; // Description of the work done by the user
}

export enum SystemTags {
    CustomColors = 'custom-colors',
    CustomTrails = 'custom-trails',
    CustomBombs = 'custom-bombs',
    CustomArrows = 'custom-arrows',
    Reactive = 'reactive',
    AudioLink = 'AudioLink',
    Thin = 'thin',
    FBT = 'fbt',
    Cloth = 'cloth',
    DynamicBones = 'dynamic-bones',
    EQ = 'eq',
    FirstPersonCompatible = 'first-person-compatible',
    ShaderReplacement = 'shader-replacement',
    NSFW = 'nsfw',
}