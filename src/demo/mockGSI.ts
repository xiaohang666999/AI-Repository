import { CSGORaw } from "csgogsi";
import { GSI } from "../API/HUD";
import { Match } from "../API/types";
import { socket } from "../API/socket";

const query = new URLSearchParams(window.location.search);
export const isDemoEnabled = query.get("demo") !== "0";

export const DEMO_MATCH: Match = {
  id: "demo-match",
  current: true,
  left: { id: "navi", wins: 1 },
  right: { id: "faze", wins: 0 },
  matchType: "bo3",
  vetos: [
    {
      teamId: "navi",
      mapName: "de_mirage",
      side: "CT",
      type: "pick",
      mapEnd: false,
    },
    {
      teamId: "faze",
      mapName: "de_inferno",
      side: "T",
      type: "pick",
      mapEnd: false,
    },
    {
      teamId: "",
      mapName: "de_nuke",
      side: "NO",
      type: "decider",
      mapEnd: false,
    },
  ],
};

type DemoPlayer = {
  steamid: string;
  name: string;
  slot: number;
  team: "CT" | "T";
  health: number;
  armor: number;
  helmet: boolean;
  money: number;
  kills: number;
  assists: number;
  deaths: number;
  mvps: number;
  score: number;
  roundKills: number;
  roundHs: number;
  damage: number;
  equip: number;
  defuse?: boolean;
  bomb?: boolean;
  position: string;
  weapons: CSGORaw["allplayers"] extends infer P
    ? P extends Record<string, { weapons: infer W }>
      ? W
      : never
    : never;
};

const ctWeapons = (
  rifle: string,
  active: "rifle" | "pistol" = "rifle"
): DemoPlayer["weapons"] => ({
  weapon_0: {
    name: "weapon_knife",
    paintkit: "default",
    type: "Knife",
    state: "holstered",
  },
  weapon_1: {
    name: "weapon_usp_silencer",
    paintkit: "default",
    type: "Pistol",
    ammo_clip: 12,
    ammo_clip_max: 12,
    ammo_reserve: 24,
    state: active === "pistol" ? "active" : "holstered",
  },
  weapon_2: {
    name: rifle,
    paintkit: "default",
    type: rifle.includes("awp") ? "SniperRifle" : "Rifle",
    ammo_clip: rifle.includes("awp") ? 5 : 30,
    ammo_clip_max: rifle.includes("awp") ? 5 : 30,
    ammo_reserve: rifle.includes("awp") ? 30 : 90,
    state: active === "rifle" ? "active" : "holstered",
  },
  weapon_3: {
    name: "weapon_hegrenade",
    paintkit: "default",
    type: "Grenade",
    ammo_reserve: 1,
    state: "holstered",
  },
  weapon_4: {
    name: "weapon_flashbang",
    paintkit: "default",
    type: "Grenade",
    ammo_reserve: 2,
    state: "holstered",
  },
  weapon_5: {
    name: "weapon_smokegrenade",
    paintkit: "default",
    type: "Grenade",
    ammo_reserve: 1,
    state: "holstered",
  },
});

const tWeapons = (
  rifle: string,
  extras: { bomb?: boolean; molotov?: boolean } = {}
): DemoPlayer["weapons"] => {
  const weapons: DemoPlayer["weapons"] = {
    weapon_0: {
      name: "weapon_knife_t",
      paintkit: "default",
      type: "Knife",
      state: "holstered",
    },
    weapon_1: {
      name: "weapon_glock",
      paintkit: "default",
      type: "Pistol",
      ammo_clip: 20,
      ammo_clip_max: 20,
      ammo_reserve: 120,
      state: "holstered",
    },
    weapon_2: {
      name: rifle,
      paintkit: "default",
      type: rifle.includes("awp") ? "SniperRifle" : "Rifle",
      ammo_clip: rifle.includes("awp") ? 5 : 30,
      ammo_clip_max: rifle.includes("awp") ? 5 : 30,
      ammo_reserve: rifle.includes("awp") ? 30 : 90,
      state: "active",
    },
    weapon_3: {
      name: "weapon_hegrenade",
      paintkit: "default",
      type: "Grenade",
      ammo_reserve: 1,
      state: "holstered",
    },
    weapon_4: {
      name: extras.molotov ? "weapon_molotov" : "weapon_flashbang",
      paintkit: "default",
      type: "Grenade",
      ammo_reserve: extras.molotov ? 1 : 2,
      state: "holstered",
    },
  };
  if (extras.bomb) {
    weapons.weapon_5 = {
      name: "weapon_c4",
      paintkit: "default",
      type: "C4",
      state: "holstered",
    };
  }
  return weapons;
};

const players: DemoPlayer[] = [
  {
    steamid: "76561198000000001",
    name: "s1mple",
    slot: 1,
    team: "CT",
    health: 100,
    armor: 100,
    helmet: true,
    money: 4350,
    kills: 18,
    assists: 4,
    deaths: 9,
    mvps: 3,
    score: 42,
    roundKills: 2,
    roundHs: 1,
    damage: 187,
    equip: 5700,
    defuse: true,
    position: "-323.1, -1612.4, -175.9",
    weapons: ctWeapons("weapon_awp"),
  },
  {
    steamid: "76561198000000002",
    name: "b1t",
    slot: 2,
    team: "CT",
    health: 87,
    armor: 100,
    helmet: true,
    money: 2100,
    kills: 14,
    assists: 6,
    deaths: 11,
    mvps: 2,
    score: 34,
    roundKills: 1,
    roundHs: 1,
    damage: 98,
    equip: 4900,
    defuse: true,
    position: "272.4, -1604.8, -167.9",
    weapons: ctWeapons("weapon_m4a1_silencer"),
  },
  {
    steamid: "76561198000000003",
    name: "jL",
    slot: 3,
    team: "CT",
    health: 64,
    armor: 78,
    helmet: true,
    money: 650,
    kills: 11,
    assists: 7,
    deaths: 12,
    mvps: 1,
    score: 28,
    roundKills: 0,
    roundHs: 0,
    damage: 42,
    equip: 4700,
    defuse: true,
    position: "-1102.2, -612.1, -167.9",
    weapons: ctWeapons("weapon_m4a1"),
  },
  {
    steamid: "76561198000000004",
    name: "w0nderful",
    slot: 4,
    team: "CT",
    health: 100,
    armor: 100,
    helmet: true,
    money: 3200,
    kills: 9,
    assists: 5,
    deaths: 10,
    mvps: 1,
    score: 24,
    roundKills: 0,
    roundHs: 0,
    damage: 0,
    equip: 5200,
    defuse: true,
    position: "-1678.4, 280.2, -159.9",
    weapons: ctWeapons("weapon_aug"),
  },
  {
    steamid: "76561198000000005",
    name: "iM",
    slot: 5,
    team: "CT",
    health: 23,
    armor: 0,
    helmet: false,
    money: 1400,
    kills: 7,
    assists: 8,
    deaths: 13,
    mvps: 0,
    score: 19,
    roundKills: 0,
    roundHs: 0,
    damage: 55,
    equip: 3900,
    defuse: true,
    position: "1084.7, 412.3, -263.9",
    weapons: ctWeapons("weapon_famas", "pistol"),
  },
  {
    steamid: "76561198000000011",
    name: "broky",
    slot: 6,
    team: "T",
    health: 100,
    armor: 100,
    helmet: true,
    money: 3850,
    kills: 16,
    assists: 3,
    deaths: 10,
    mvps: 2,
    score: 38,
    roundKills: 1,
    roundHs: 0,
    damage: 112,
    equip: 5500,
    position: "-544.8, 612.1, -159.9",
    weapons: tWeapons("weapon_awp"),
  },
  {
    steamid: "76561198000000012",
    name: "rain",
    slot: 7,
    team: "T",
    health: 76,
    armor: 100,
    helmet: true,
    money: 1750,
    kills: 12,
    assists: 9,
    deaths: 13,
    mvps: 1,
    score: 31,
    roundKills: 0,
    roundHs: 0,
    damage: 67,
    equip: 4800,
    bomb: true,
    position: "124.2, 880.4, -263.9",
    weapons: tWeapons("weapon_ak47", { bomb: true, molotov: true }),
  },
  {
    steamid: "76561198000000013",
    name: "karrigan",
    slot: 8,
    team: "T",
    health: 100,
    armor: 91,
    helmet: true,
    money: 2450,
    kills: 8,
    assists: 11,
    deaths: 14,
    mvps: 1,
    score: 26,
    roundKills: 0,
    roundHs: 0,
    damage: 34,
    equip: 4600,
    position: "-220.1, -240.8, -167.9",
    weapons: tWeapons("weapon_ak47", { molotov: true }),
  },
  {
    steamid: "76561198000000014",
    name: "frozen",
    slot: 9,
    team: "T",
    health: 41,
    armor: 54,
    helmet: false,
    money: 900,
    kills: 10,
    assists: 4,
    deaths: 12,
    mvps: 0,
    score: 22,
    roundKills: 1,
    roundHs: 1,
    damage: 89,
    equip: 4300,
    position: "1360.4, -36.2, -167.9",
    weapons: tWeapons("weapon_galilar"),
  },
  {
    steamid: "76561198000000015",
    name: "ropz",
    slot: 0,
    team: "T",
    health: 0,
    armor: 0,
    helmet: false,
    money: 50,
    kills: 13,
    assists: 5,
    deaths: 11,
    mvps: 2,
    score: 33,
    roundKills: 0,
    roundHs: 0,
    damage: 0,
    equip: 0,
    position: "-1188.2, -2404.6, -351.9",
    weapons: {
      weapon_0: {
        name: "weapon_knife_t",
        paintkit: "default",
        type: "Knife",
        state: "holstered",
      },
    },
  },
];

const observed = players[0];

const buildRaw = (phaseEndsIn: number): CSGORaw => {
  const allplayers: NonNullable<CSGORaw["allplayers"]> = {};
  for (const p of players) {
    allplayers[p.steamid] = {
      steamid: p.steamid,
      name: p.name,
      observer_slot: p.slot,
      team: p.team,
      match_stats: {
        kills: p.kills,
        assists: p.assists,
        deaths: p.deaths,
        mvps: p.mvps,
        score: p.score,
      },
      weapons: p.weapons,
      state: {
        health: p.health,
        armor: p.armor,
        helmet: p.helmet,
        defusekit: p.defuse,
        flashed: 0,
        smoked: 0,
        burning: 0,
        money: p.money,
        round_kills: p.roundKills,
        round_killhs: p.roundHs,
        round_totaldmg: p.damage,
        equip_value: p.equip,
      },
      position: p.position,
      forward: "0.12, 0.99, 0.02",
    };
  }

  return {
    provider: {
      name: "Counter-Strike: Global Offensive",
      appid: 730,
      version: 14013,
      steamid: observed.steamid,
      timestamp: Math.floor(Date.now() / 1000),
    },
    map: {
      mode: "competitive",
      name: "de_mirage",
      phase: "live",
      round: 19,
      team_ct: {
        score: 11,
        consecutive_round_losses: 0,
        timeouts_remaining: 1,
        matches_won_this_series: 1,
        name: "NAVI",
      },
      team_t: {
        score: 8,
        consecutive_round_losses: 1,
        timeouts_remaining: 1,
        matches_won_this_series: 0,
        name: "FaZe",
      },
      num_matches_to_win_series: 2,
      current_spectators: 18420,
      souvenirs_total: 0,
      round_wins: {
        "1": "ct_win_elimination",
        "2": "t_win_bomb",
        "3": "ct_win_defuse",
        "4": "ct_win_elimination",
        "5": "t_win_elimination",
        "6": "ct_win_time",
        "7": "t_win_bomb",
        "8": "ct_win_elimination",
        "9": "ct_win_defuse",
        "10": "t_win_elimination",
        "11": "ct_win_elimination",
        "12": "t_win_bomb",
        "13": "ct_win_elimination",
        "14": "t_win_elimination",
        "15": "ct_win_defuse",
        "16": "ct_win_elimination",
        "17": "t_win_bomb",
        "18": "ct_win_elimination",
        "19": "ct_win_time",
      },
    },
    round: {
      phase: "live",
    },
    player: {
      steamid: observed.steamid,
      name: observed.name,
      observer_slot: observed.slot,
      team: observed.team,
      activity: "playing",
      state: {
        health: observed.health,
        armor: observed.armor,
        helmet: observed.helmet,
        flashed: 0,
        smoked: 0,
        burning: 0,
        money: observed.money,
        round_kills: observed.roundKills,
        round_killhs: observed.roundHs,
        round_totaldmg: observed.damage,
        equip_value: observed.equip,
      },
      spectarget: observed.steamid,
      position: observed.position,
      forward: "0.12, 0.99, 0.02",
    },
    allplayers,
    bomb: {
      state: "carried",
      player: "76561198000000012",
      position: "124.2, 880.4, -263.9",
    },
    grenades: {},
    phase_countdowns: {
      phase: "live",
      phase_ends_in: phaseEndsIn.toFixed(1),
    },
  };
};

let timer = 78.4;
let interval: number | null = null;
let stopped = false;

const applyDemoFrame = () => {
  if (stopped) return;
  GSI.digest(buildRaw(timer));
};

export const startDemo = () => {
  if (!isDemoEnabled || stopped) return;

  GSI.teams.left = {
    id: "navi",
    name: "NAVI",
    country: "UA",
    logo: null,
    map_score: 1,
    extra: {},
  };
  GSI.teams.right = {
    id: "faze",
    name: "FaZe",
    country: "EU",
    logo: null,
    map_score: 0,
    extra: {},
  };

  applyDemoFrame();
  interval = window.setInterval(() => {
    timer = timer <= 0 ? 115 : timer - 1;
    applyDemoFrame();
  }, 1000);
};

export const stopDemo = () => {
  stopped = true;
  if (interval !== null) {
    window.clearInterval(interval);
    interval = null;
  }
};

socket.on("update", () => {
  stopDemo();
});
