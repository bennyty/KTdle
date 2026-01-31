export interface WeaponProfile {
    wepId: string;
    seq: number;
    profileName: string;
    ATK: string;
    HIT: string;
    DMG: string; // e.g. "[Normal]/[Critical]"
    WR: string; // Comma-separated Weapon Rules
}

export interface Weapon {
    opTypeId: string;
    wepId: string;
    wepName: string;
    wepType: string; // R | M | P | E
    profiles: WeaponProfile[];
}

export interface Ability {
    abilityId: string;
    opTypeId: string;
    abilityName: string;
    AP: number | null; // null for passive abilities
    description: string; // Markdown
}

export interface Option {
    optionId: string;
    opTypeId: string;
    optionName: string;
    description: string; // Markdown
    effects: string;
}

export interface Operative {
    killteamId: string;
    opTypeId: string;
    opTypeName: string;
    MOVE: string;
    APL: number;
    SAVE: string;
    WOUNDS: number;
    keywords: string; // Comma-separated
    basesize: number;
    nameType: string;
    weapons: Weapon[];
    abilities: Ability[];
    options: Option[];
}

export interface Ploy {
    ployId: string;
    killteamId: string;
    seq: number;
    ployType: string; // S | T | F
    ployName: string;
    description: string; // Markdown
}

export interface Equipment {
    eqId: string;
    killteamId: string;
    seq: number;
    eqName: string;
    description: string; // Markdown
    effects: string;
}

export interface Killteam {
    factionId: string;
    killteamId: string;
    killteamName: string;
    description: string; // Markdown (flavor)
    composition: string; // Markdown
    archetypes: string | null; // Slash-delimited list
    opTypes: Operative[];
    ploys: Ploy[];
    equipments: Equipment[];
    isHomebrew: boolean;
}