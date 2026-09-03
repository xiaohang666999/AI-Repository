// Demo-only local data. This file simulates the data the real LHM/CS2 backend
// would normally stream into the HUD. It never replaces any HUD component.

export type DemoMapName =
  | "de_mirage"
  | "de_dust2"
  | "de_inferno"
  | "de_nuke"
  | "de_overpass"
  | "de_vertigo"
  | "de_ancient"
  | "de_cache"
  | "de_anubis"
  | "de_train";

export const DEMO_MAPS: DemoMapName[] = [
  "de_mirage",
  "de_dust2",
  "de_inferno",
  "de_nuke",
  "de_overpass",
  "de_vertigo",
  "de_ancient",
  "de_cache",
  "de_anubis",
  "de_train",
];

export interface DemoMapDef {
  _id: string;
  name: string;
  lhmId: DemoMapName;
  game: string;
  radars: Array<{
    id: number;
    lhmId: string;
    originX: number;
    originY: number;
    pxPerUX: number;
    pxPerUY: number;
    originHeight?: number;
  }>;
  verticalImage?: string;
  inVetoPool: boolean;
  isActive: boolean;
}

// These are the raw overview (radar_info) values shipped for CS2:
// pos_x / pos_y / scale. The LexoRadar expects origin + pixels-per-world-unit,
// so we derive: pxPerU = 1 / scale, origin = [-pos_x, pos_y] / scale.
function mapDef(lhmId: DemoMapName, posX: number, posY: number, scale: number): DemoMapDef {
  return {
    _id: lhmId,
    name: lhmId,
    lhmId,
    game: "cs2",
    radars: [
      {
        id: 1,
        lhmId: "default",
        originX: -posX / scale,
        originY: posY / scale,
        pxPerUX: 1 / scale,
        pxPerUY: -1 / scale,
      },
    ],
    verticalImage: "",
    inVetoPool: true,
    isActive: true,
  };
}

export const LOCAL_MAP_DEFS: DemoMapDef[] = [
  mapDef("de_mirage", -3230, 1713, 5),
  mapDef("de_dust2", -2476, 3239, 4.4),
  mapDef("de_inferno", -2087, 3870, 4.9),
  mapDef("de_nuke", -3453, 2887, 7),
  mapDef("de_overpass", -4831, 1781, 5.2),
  mapDef("de_vertigo", -3168, 1762, 4),
  mapDef("de_ancient", -2953, 2164, 5),
  mapDef("de_cache", -2000, 3250, 5.5),
  mapDef("de_anubis", -2796, 3328, 5.22),
  mapDef("de_train", -2308, 2078, 4.082077),
];

export const TEAM_LEFT = {
  id: "ct-long",
  name: "Long Range",
  shortName: "LR",
  country: "",
  logo: "",
  extra: {},
};

export const TEAM_RIGHT = {
  id: "t-bright",
  name: "Bright Squad",
  shortName: "BS",
  country: "",
  logo: "",
  extra: {},
};

type RosterEntry = {
  steamid: string;
  name: string;
  realName: string;
  team: "CT" | "T";
  slot: number;
  country?: string;
  weapon: string;
  weaponType: string;
  ammo: number;
  ammoMax: number;
  reserve: number;
  health: number;
  armor: number;
  money: number;
  kills: number;
  assists: number;
  deaths: number;
  mvps: number;
  roundKills: number;
  roundKillHs: number;
  roundDmg: number;
  equip: number;
  defusekit?: boolean;
  grenades?: Array<{ name: string; reserve: number }>;
};

function avatarFor(entry: RosterEntry, index: number): string {
  const initials = String(entry.name)
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase();
  const bg = entry.team === "CT" ? "#5ab8f4" : "#f0c941";
  const fg = entry.team === "CT" ? "#0c0f12" : "#0c0f12";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140"><rect width="140" height="140" fill="${bg}"/><text x="50%" y="54%" font-family="Arial" font-size="46" font-weight="700" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export const ROSTER: RosterEntry[] = [
  { steamid: "900000000000000001", name: "s1mple", realName: "Oleksandr Kostyliev", team: "CT", slot: 1, weapon: "weapon_ak47", weaponType: "Rifle", ammo: 30, ammoMax: 30, reserve: 90, health: 100, armor: 100, money: 4500, kills: 21, assists: 4, deaths: 9, mvps: 6, roundKills: 1, roundKillHs: 1, roundDmg: 76, equip: 4700, defusekit: true, grenades: [{ name: "weapon_hegrenade", reserve: 1 }, { name: "weapon_flashbang", reserve: 2 }, { name: "weapon_smokegrenade", reserve: 1 }] },
  { steamid: "900000000000000002", name: "NiKo", realName: "Nikola Kovač", team: "CT", slot: 2, weapon: "weapon_m4a1", weaponType: "Rifle", ammo: 30, ammoMax: 30, reserve: 90, health: 68, armor: 72, money: 3000, kills: 18, assists: 6, deaths: 12, mvps: 3, roundKills: 0, roundKillHs: 0, roundDmg: 32, equip: 4300, defusekit: true, grenades: [{ name: "weapon_hegrenade", reserve: 1 }, { name: "weapon_flashbang", reserve: 1 }, { name: "weapon_smokegrenade", reserve: 1 }] },
  { steamid: "900000000000000003", name: "m0NESY", realName: "Ilya Osipov", team: "CT", slot: 3, weapon: "weapon_awp", weaponType: "SniperRifle", ammo: 5, ammoMax: 5, reserve: 25, health: 100, armor: 78, money: 3600, kills: 15, assists: 2, deaths: 8, mvps: 4, roundKills: 1, roundKillHs: 1, roundDmg: 92, equip: 5100, defusekit: true, grenades: [] },
  { steamid: "900000000000000004", name: "huNter-", realName: "Nemanja Kovač", team: "CT", slot: 4, weapon: "weapon_ak47", weaponType: "Rifle", ammo: 27, ammoMax: 30, reserve: 90, health: 92, armor: 48, money: 2500, kills: 17, assists: 5, deaths: 11, mvps: 2, roundKills: 0, roundKillHs: 0, roundDmg: 57, equip: 4200, defusekit: true, grenades: [{ name: "weapon_incgrenade", reserve: 1 }, { name: "weapon_flashbang", reserve: 2 }] },
  { steamid: "900000000000000005", name: "b1t", realName: "Valerii Vakhovskyi", team: "CT", slot: 5, weapon: "weapon_m4a1_silencer", weaponType: "Rifle", ammo: 30, ammoMax: 30, reserve: 90, health: 100, armor: 100, money: 4100, kills: 12, assists: 7, deaths: 10, mvps: 1, roundKills: 0, roundKillHs: 0, roundDmg: 23, equip: 4600, defusekit: true, grenades: [{ name: "weapon_smokegrenade", reserve: 1 }, { name: "weapon_flashbang", reserve: 1 }] },
  { steamid: "900000000000000006", name: "ZywOo", realName: "Mathieu Herbaut", team: "T", slot: 6, weapon: "weapon_ak47", weaponType: "Rifle", ammo: 30, ammoMax: 30, reserve: 90, health: 100, armor: 100, money: 4700, kills: 20, assists: 5, deaths: 8, mvps: 5, roundKills: 1, roundKillHs: 1, roundDmg: 84, equip: 4900, grenades: [{ name: "weapon_hegrenade", reserve: 1 }, { name: "weapon_flashbang", reserve: 2 }, { name: "weapon_smokegrenade", reserve: 1 }] },
  { steamid: "900000000000000007", name: "device", realName: "Nicolai Reedtz", team: "T", slot: 7, weapon: "weapon_awp", weaponType: "SniperRifle", ammo: 5, ammoMax: 5, reserve: 20, health: 58, armor: 58, money: 2800, kills: 16, assists: 3, deaths: 12, mvps: 3, roundKills: 0, roundKillHs: 0, roundDmg: 69, equip: 5000, grenades: [] },
  { steamid: "900000000000000008", name: "ropz", realName: "Robin Kool", team: "T", slot: 8, weapon: "weapon_ak47", weaponType: "Rifle", ammo: 22, ammoMax: 30, reserve: 90, health: 74, armor: 68, money: 2200, kills: 14, assists: 6, deaths: 10, mvps: 2, roundKills: 0, roundKillHs: 0, roundDmg: 44, equip: 4000, grenades: [{ name: "weapon_flashbang", reserve: 2 }, { name: "weapon_smokegrenade", reserve: 1 }] },
  { steamid: "900000000000000009", name: "frozen", realName: "David Čerňanský", team: "T", slot: 9, weapon: "weapon_galilar", weaponType: "Rifle", ammo: 30, ammoMax: 35, reserve: 90, health: 38, armor: 32, money: 1500, kills: 9, assists: 4, deaths: 13, mvps: 1, roundKills: 0, roundKillHs: 0, roundDmg: 28, equip: 3600, grenades: [{ name: "weapon_hegrenade", reserve: 1 }] },
  { steamid: "900000000000000010", name: "torzsi", realName: "Ádám Torzsás", team: "T", slot: 10, weapon: "weapon_deagle", weaponType: "Pistol", ammo: 7, ammoMax: 7, reserve: 35, health: 100, armor: 100, money: 3200, kills: 11, assists: 5, deaths: 11, mvps: 2, roundKills: 0, roundKillHs: 0, roundDmg: 41, equip: 3800, grenades: [{ name: "weapon_flashbang", reserve: 2 }] },
];

export const ROSTER_EXTENSIONS = ROSTER.map((entry, index) => ({
  id: entry.steamid,
  name: entry.name,
  steamid: entry.steamid,
  realName: entry.realName,
  country: "",
  avatar: avatarFor(entry, index),
  extra: {},
}));

function weaponMap(w: {
  weapon: string;
  weaponType: string;
  ammo: number;
  ammoMax: number;
  reserve: number;
}) {
  const name = w.weapon;
  return {
    [name]: {
      name,
      paintkit: "default",
      type: w.weaponType,
      ammo_clip: w.ammo,
      ammo_clip_max: w.ammoMax,
      ammo_reserve: w.reserve,
      state: "active",
    },
    weapon_knife: {
      name: "weapon_knife",
      paintkit: "default",
      type: "Knife",
      state: "holstered",
    },
  };
}

function rawPlayer(entry: RosterEntry, position: string, forward: string) {
  const grenades: Record<string, { name: string; paintkit: string; type: string; ammo_reserve: number; state: string }> = {};
  (entry.grenades || []).forEach((grenade, index) => {
    grenades[`grenade_${index + 1}`] = {
      name: grenade.name,
      paintkit: "default",
      type: "Grenade",
      ammo_reserve: grenade.reserve,
      state: "holstered",
    };
  });
  return {
    steamid: entry.steamid,
    name: entry.name,
    clan: "",
    observer_slot: entry.slot,
    team: entry.team,
    match_stats: {
      kills: entry.kills,
      assists: entry.assists,
      deaths: entry.deaths,
      mvps: entry.mvps,
      score: Math.round((entry.kills + entry.assists) * 10 + entry.deaths),
    },
    weapons: {
      ...grenades,
      ...weaponMap(entry),
    },
    state: {
      health: entry.health,
      armor: entry.armor,
      helmet: true,
      flashed: 0,
      smoked: 0,
      burning: 0,
      money: entry.money,
      round_kills: entry.roundKills,
      round_killhs: entry.roundKillHs,
      round_totaldmg: entry.roundDmg,
      equip_value: entry.equip,
      defusekit: !!entry.defusekit,
    },
    position,
    forward,
  };
}

export type SceneKey =
  | "freezetime"
  | "live"
  | "bomb-planted"
  | "defusing"
  | "round-over"
  | "pause"
  | "timeout"
  | "intermission"
  | "gameover";

export interface SceneMeta {
  key: SceneKey;
  label: string;
  description: string;
}

export const SCENES: SceneMeta[] = [
  { key: "freezetime", label: "冻结期", description: "Freezetime / 购买时间 / 玩家存活" },
  { key: "live", label: "比赛进行中", description: "Live / 雷达与玩家状态" },
  { key: "bomb-planted", label: "C4 已下包", description: "Bomb planted / 40 秒倒计时" },
  { key: "defusing", label: "拆弹中", description: "Defusing / 拆弹进度" },
  { key: "round-over", label: "回合结束", description: "Round over / 比分更新" },
  { key: "pause", label: "暂停", description: "Pause" },
  { key: "timeout", label: "战术暂停", description: "CT / T timeout" },
  { key: "intermission", label: "赛间休息", description: "Intermission" },
  { key: "gameover", label: "比赛结束", description: "Game over" },
];

function roundWins(scoreCT: number, scoreT: number): Record<string, string> {
  const wins: Record<string, string> = {};
  for (let i = 1; i <= scoreCT; i++) wins[String(i)] = "ct_win_elimination";
  for (let i = 1; i <= scoreT; i++) wins[String(scoreCT + i)] = "t_win_bomb";
  return wins;
}

export interface DemoSceneOptions {
  scene: SceneKey;
  mapName: DemoMapName;
  scoreCT?: number;
  scoreT?: number;
  round?: number;
}

export function createMatch(options: DemoSceneOptions) {
  const scoreCT = options.scoreCT ?? 8;
  const scoreT = options.scoreT ?? 7;
  const mapName = options.mapName;
  return {
    id: "demo-match",
    current: true,
    left: { id: TEAM_LEFT.id, wins: options.scene === "gameover" ? 2 : 1 },
    right: { id: TEAM_RIGHT.id, wins: options.scene === "gameover" ? 1 : 0 },
    matchType: "bo3",
    vetos: [
      { teamId: TEAM_LEFT.id, mapName: "de_mirage", side: "CT", type: "pick", rounds: [], score: { CT: 13, T: 11 }, winner: TEAM_LEFT.id, mapEnd: true },
      { teamId: TEAM_RIGHT.id, mapName: "de_inferno", side: "T", type: "pick", rounds: [], score: { CT: 5, T: 13 }, winner: TEAM_RIGHT.id, mapEnd: true },
      { mapName: mapName, type: "decider" },
      { teamId: TEAM_LEFT.id, mapName: "de_nuke", side: "NO", type: "ban", rounds: [], mapEnd: false },
      { teamId: TEAM_RIGHT.id, mapName: "de_overpass", side: "NO", type: "ban", rounds: [], mapEnd: false },
    ],
  };
}

export function createRaw(options: DemoSceneOptions): any {
  const {
    scene,
    mapName,
    scoreCT = 8,
    scoreT = 7,
    round = 12,
  } = options;

  const isFreeze = scene === "freezetime";
  const isRoundOver = scene === "round-over" || scene === "gameover";
  const isPause = scene === "pause";
  const isTimeout = scene === "timeout";
  const isIntermission = scene === "intermission";
  const isGameOver = scene === "gameover";
  const isBombPlanted = scene === "bomb-planted";
  const isDefusing = scene === "defusing";

  const phase =
    scene === "freezetime"
      ? "freezetime"
      : scene === "pause"
      ? "paused"
      : isTimeout
      ? "timeout_ct"
      : isIntermission
      ? "intermission"
      : isBombPlanted
      ? "bomb"
      : isDefusing
      ? "defuse"
      : isRoundOver
      ? "over"
      : "live";

  const mapPhase = isIntermission
    ? "intermission"
    : isGameOver
    ? "gameover"
    : scene === "freezetime"
    ? "live"
    : "live";

  const roundPhase = isFreeze ? "freezetime" : isRoundOver ? "over" : "live";

  const allplayers: Record<string, any> = {};
  ROSTER.forEach((entry, index) => {
    const spread = 18000 + index * 270;
    const x = index < 5 ? -2600 + index * 320 : 2600 - (index - 5) * 300;
    const y = index < 5 ? -1300 - index * 25 : 1320 + (index - 5) * 25;
    const z = scene === "freezetime" ? 0 : 160 + index * 8;
    const position = `${x}, ${y}, ${z}`;
    const forward = `${index % 2 === 0 ? 0 : 1}, ${index % 2 === 0 ? 1 : 0}, 0`;
    const player = rawPlayer(entry, position, forward);
    if (entry.team === "T" && isBombPlanted) {
      player.state.health = entry.steamid === "900000000000000006" ? 100 : entry.health;
    }
    if (isBombPlanted && entry.team === "CT" && entry.slot === 2) player.state.health = 0;
    if (isDefusing && entry.team === "CT" && entry.slot === 1) player.state.health = 100;
    if (isDefusing && entry.team === "CT" && entry.slot === 2) player.state.health = 0;
    allplayers[entry.steamid] = player;
  });

  const bombPlayer = "900000000000000006";
  const bombPosition = mapName.includes("nuke")
    ? "-600, 800, 0"
    : mapName.includes("vertigo")
    ? "500, -280, 15000"
    : mapName.includes("train")
    ? "1000, 500, 0"
    : mapName.includes("anubis")
    ? "-800, 900, 0"
    : "1200, 250, 0";

  const bomb =
    isBombPlanted || isDefusing
      ? {
          state: isDefusing ? "defusing" : "planted",
          countdown: isDefusing ? "9" : "40",
          player: bombPlayer,
          position: bombPosition,
        }
      : scene === "freezetime" || scene === "intermission"
      ? {
          state: "dropped",
          player: bombPlayer,
          position: bombPosition,
        }
      : {
          state: "carried",
          player: bombPlayer,
          position: bombPosition,
        };

  const grenades =
    scene === "freezetime" || scene === "live" || isBombPlanted || isDefusing
      ? {
          smoke_1: {
            owner: "900000000000000006",
            type: "smoke",
            position: "900, 100, 0",
            velocity: "1, 1, 0",
            lifetime: "2",
            effecttime: "18",
          },
          flash_1: {
            owner: "900000000000000008",
            type: "flashbang",
            position: "700, 130, 0",
            velocity: "1, 1, 0",
            lifetime: "0.8",
          },
          frag_1: {
            owner: "900000000000000007",
            type: "frag",
            position: "800, 180, 0",
            velocity: "1, 1, 0",
            lifetime: "0.7",
          },
        }
      : {};

  const observer = "900000000000000001";
  const observedState = allplayers[observer].state;

  return {
    provider: {
      name: "Counter-Strike 2",
      appid: 730,
      version: 1,
      steamid: "12345678901234567",
      timestamp: Math.floor(Date.now() / 1000),
    },
    map: {
      mode: "competitive",
      name: mapName,
      phase: mapPhase,
      round,
      team_ct: {
        score: scoreCT,
        consecutive_round_losses: scene === "freezetime" ? 0 : 1,
        timeouts_remaining: 2,
        matches_won_this_series: TEAM_LEFT.id ? 1 : 0,
        name: TEAM_LEFT.name,
        flag: "",
      },
      team_t: {
        score: scoreT,
        consecutive_round_losses: scene === "freezetime" ? 1 : 0,
        timeouts_remaining: 1,
        matches_won_this_series: TEAM_RIGHT.id ? 0 : 0,
        name: TEAM_RIGHT.name,
        flag: "",
      },
      num_matches_to_win_series: 3,
      current_spectators: 4200,
      souvenirs_total: 4,
      round_wins: roundWins(scoreCT, scoreT),
    },
    round: {
      phase: roundPhase,
      bomb: isBombPlanted ? "planted" : isDefusing ? "defused" : undefined,
      win_team: isRoundOver && scoreCT > scoreT + 1 ? "CT" : isRoundOver && scoreT > scoreCT ? "T" : undefined,
    },
    player: {
      steamid: observer,
      name: ROSTER[0].name,
      clan: "",
      observer_slot: 1,
      activity: "playing",
      spectarget: observer,
      state: observedState,
      position: allplayers[observer].position,
      forward: allplayers[observer].forward,
    },
    allplayers,
    bomb,
    grenades,
    phase_countdowns: {
      phase,
      phase_ends_in: String(isFreeze ? 15 : scene === "bomb-planted" ? 40 : isDefusing ? 9 : isRoundOver ? 0 : isPause ? 20 : isTimeout ? 25 : isIntermission ? 60 : isGameOver ? 0 : 115),
    },
    auth: {
      token: "demo",
    },
  };
}

export function createKills() {
  const left = "900000000000000001";
  const left2 = "900000000000000002";
  const left3 = "900000000000000004";
  const right = "900000000000000006";
  const right2 = "900000000000000007";
  const right3 = "900000000000000009";
  return [
    {
      name: "player_death",
      clientTime: Date.now(),
      keys: {
        userid: { value: 2, xuid: right2 },
        attacker: { value: 1, xuid: left },
        assister: { value: 3, xuid: left2 },
        assistedflash: true,
        weapon: "ak47",
        weapon_itemid: "1",
        weapon_fauxitemid: "1",
        weapon_originalowner_xuid: left,
        headshot: false,
        dominated: 0,
        revenge: 0,
        wipe: 0,
        attackerblind: false,
        thrusmoke: false,
        noscope: false,
        penetrated: 1,
        noreplay: false,
        attackerinair: false,
      },
    },
    {
      name: "player_death",
      clientTime: Date.now() + 1,
      keys: {
        userid: { value: 3, xuid: right3 },
        attacker: { value: 1, xuid: left3 },
        assister: { value: 0, xuid: "0" },
        assistedflash: false,
        weapon: "awp",
        weapon_itemid: "1",
        weapon_fauxitemid: "1",
        weapon_originalowner_xuid: left3,
        headshot: true,
        dominated: 0,
        revenge: 0,
        wipe: 0,
        attackerblind: false,
        thrusmoke: true,
        noscope: true,
        penetrated: 0,
        noreplay: false,
        attackerinair: false,
      },
    },
    {
      name: "player_death",
      clientTime: Date.now() + 2,
      keys: {
        userid: { value: 1, xuid: left },
        attacker: { value: 2, xuid: right },
        assister: { value: 0, xuid: "0" },
        assistedflash: false,
        weapon: "deagle",
        weapon_itemid: "1",
        weapon_fauxitemid: "1",
        weapon_originalowner_xuid: right,
        headshot: true,
        dominated: 0,
        revenge: 0,
        wipe: 0,
        attackerblind: false,
        thrusmoke: false,
        noscope: false,
        penetrated: 0,
        noreplay: false,
        attackerinair: false,
      },
    },
  ];
}
