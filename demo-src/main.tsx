import * as process from "process";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import "../src/App.css";
import {
  DEMO_MAPS,
  LOCAL_MAP_DEFS,
  ROSTER_EXTENSIONS,
  SCENES,
  SceneKey,
  DemoMapName,
  createMatch,
  createRaw,
  createKills,
  TEAM_LEFT,
  TEAM_RIGHT,
} from "./data";

globalThis.process = process;

async function bootstrap() {
  // ---------------------------------------------------------------------
  // Patch the local API facade BEFORE importing the original HUD, so the
  // original UI code keeps using its own data paths but gets local fixtures.
  // ---------------------------------------------------------------------
  const apiMod = await import("../src/API");
  const api = apiMod.default as any;

  api.maps.get = async () => LOCAL_MAP_DEFS;
  api.players.get = async () => [];
  api.players.getAvatarURLs = async (steamid: string) => {
    const ext = ROSTER_EXTENSIONS.find((player) => player.steamid === steamid);
    return { custom: ext?.avatar || "", steam: "" };
  };
  api.camera.get = async () => ({ availablePlayers: [], uuid: "" });
  api.tournaments.get = async () => null;
  api.match.getCurrent = async () => null;
  api.teams.getOne = async () => null;
  api.match.get = async () => [];
  api.teams.get = async () => [];

  // ---------------------------------------------------------------------
  // Load the original HUD modules (components, styles, animations).
  // ---------------------------------------------------------------------
  const { GSI } = await import("../src/API/HUD");
  const { configs, actions, SettingsProvider } = await import(
    "../src/API/contexts/actions"
  );
  const maps = (await import("../src/HUD/Radar/LexoRadar/maps")).default as any;
  const { default: Layout } = await import("../src/HUD/Layout/Layout");

  // Point the original radar-map loader at the bundled radar images.
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  DEMO_MAPS.forEach((mapName) => {
    if (maps && maps[mapName]) {
      maps[mapName].file = `assets/radar-maps/${mapName}.png`;
    }
  });

  // Extensions: real player names/avatars for the original player components.
  GSI.players = ROSTER_EXTENSIONS as any;
  GSI.damage = [];

  configs.save({
    trivia: {
      title: "CS2 HUD UI 本地预览",
      content: "开关场景即可查看原项目 HUD 的真实渲染与动效。",
    },
    display_settings: {
      left_title: "Caster / POV LEFT",
      left_subtitle: "Long Range",
      right_title: "Caster / POV RIGHT",
      right_subtitle: "Bright Squad",
      left_image: "",
      right_image: "",
      replace_avatars: "if_missing",
    },
    preview_settings: {
      match_preview: null,
      select_preview: "show",
      player_preview: null,
      player_preview_toggle: false,
      match_preview_toggle: false,
    },
  });

  function DemoApp() {
    const [scene, setScene] = useState<SceneKey>("live");
    const [mapName, setMapName] = useState<DemoMapName>("de_mirage");
    const [game, setGame] = useState<any>(null);
    const [match, setMatch] = useState<any>(null);
    const [scale, setScale] = useState(0.5);
    const [autoPlay, setAutoPlay] = useState(false);
    const [autoIndex, setAutoIndex] = useState(0);
    const [lastAction, setLastAction] = useState("等待加载数据");

    const pushScene = useCallback(
      (nextScene: SceneKey, nextMap: DemoMapName) => {
        GSI.teams.left = {
          id: TEAM_LEFT.id,
          name: TEAM_LEFT.name,
          country: null,
          logo: null,
          map_score: nextScene === "gameover" ? 2 : 1,
          extra: {},
        } as any;
        GSI.teams.right = {
          id: TEAM_RIGHT.id,
          name: TEAM_RIGHT.name,
          country: null,
          logo: null,
          map_score: nextScene === "gameover" ? 1 : 0,
          extra: {},
        } as any;
        const raw = createRaw({ scene: nextScene, mapName: nextMap });
        const parsed = GSI.digest(raw);
        setGame(parsed);
        setMatch(createMatch({ scene: nextScene, mapName: nextMap }));
        setScene(nextScene);
        setMapName(nextMap);
        setLastAction(`已切换：${nextScene} / ${nextMap}`);
      },
      []
    );

    useEffect(() => {
      pushScene("freezetime", "de_mirage");
      // Hide the original camera containers (they only make sense with LHM peercams)
      // and keep trivia hidden by default in the demo.
      const hideCams = window.setTimeout(() => {
        actions.execute("toggleCams");
        actions.execute("triviaState", "hide");
      }, 80);
      return () => window.clearTimeout(hideCams);
    }, [pushScene]);

    useEffect(() => {
      const resize = () => {
        const el = document.querySelector<HTMLElement>(".demo-stage");
        const height = Math.max(document.documentElement.clientHeight - 54 - 12, 220);
        const width = Math.max(
          (el?.clientWidth || window.innerWidth - 340) - 20,
          300
        );
        setScale(Math.min(width / 1920, height / 1080));
      };
      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
      if (!autoPlay) return;
      let alive = true;
      const timer = window.setInterval(() => {
        if (!alive) return;
        const nextScene = SCENES[autoIndex % SCENES.length].key;
        pushScene(nextScene, mapName);
        setAutoIndex((v) => v + 1);
      }, 4200);
      return () => {
        alive = false;
        window.clearInterval(timer);
      };
    }, [autoPlay, autoIndex, mapName, pushScene]);

    const triggerKills = () => {
      const kills = createKills();
      kills.forEach((kill, index) => {
        window.setTimeout(() => {
          GSI.digestMIRV(kill as any);
        }, index * 420);
      });
      setLastAction("已触发击杀 / 击杀播报动效");
    };

    const toggleBoxes = () => {
      const hidden = !(game && game.phase_countdowns?.phase === "freezetime");
      actions.execute("boxesState", hidden ? "show" : "hide");
      setLastAction(hidden ? "显示左侧/右侧信息框" : "隐藏左侧/右侧信息框");
    };

    const currScene = useMemo(
      () => SCENES.find((item) => item.key === scene),
      [scene]
    );

    return (
      <div className="demo-shell">
        <header className="demo-header">
          <span className="dot" />
          <h1>CS2 HUD · 1920×1080 本地预览</h1>
          <span className="hint">直接使用原项目 src/HUD 组件 / 样式 / 动效</span>
        </header>
        <div className="demo-body">
          <div className="demo-stage">
            <div
              className="canvas-viewport"
              style={{ width: 1920 * scale, height: 1080 * scale }}
            >
              <div
                className="hud-canvas"
                style={{ transform: `scale(${scale})` }}
              >
                {game ? (
                  <SettingsProvider>
                    <Layout game={game} match={match} />
                  </SettingsProvider>
                ) : (
                  <div className="loading">Loading local HUD data…</div>
                )}
              </div>
            </div>
          </div>
          <aside className="demo-panel">
            <div className="section">
              <h2>场景 Scene</h2>
              <div className="scene-grid">
                {SCENES.map((item) => (
                  <button
                    key={item.key}
                    className={`scene-btn ${scene === item.key ? "active" : ""}`}
                    onClick={() => pushScene(item.key, mapName)}
                  >
                    {item.label}
                    <small>{item.description}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="section">
              <h2>地图 Map / Radar</h2>
              <div className="map-buttons">
                {DEMO_MAPS.map((map) => (
                  <button
                    key={map}
                    className={`map-btn ${mapName === map ? "active" : ""}`}
                    onClick={() => pushScene(scene, map)}
                  >
                    {map}
                  </button>
                ))}
              </div>
            </div>

            <div className="section">
              <h2>动效触发</h2>
              <button className="fn-btn" onClick={triggerKills}>
                触发 Killfeed
              </button>
              <button className="fn-btn" onClick={toggleBoxes}>
                切换信息框
              </button>
              <button
                className="fn-btn"
                onClick={() => setAutoPlay((v) => !v)}
              >
                {autoPlay ? "停止自动演示" : "自动演示场景"}
              </button>
            </div>

            <div className="section">
              <h2>当前状态</h2>
              <div className="status">
                <div>
                  <span className="key">场景：</span>
                  {currScene?.label || scene}
                </div>
                <div>
                  <span className="key">地图：</span>
                  {mapName}
                </div>
                <div>
                  <span className="key">画布：</span>
                  1920×1080（缩放 {Math.round(scale * 100)}%）
                </div>
                <div style={{ marginTop: 8 }}>{lastAction}</div>
              </div>
            </div>

            <footer>
              原有快捷键仍可用：Alt+B 缩小雷达、Alt+V 放大雷达、Alt+C 开关摄像头，
              也可在页面里直接切换场景。模拟数据全部内置于网页，无需安装依赖，无需启动
              CS / LHM，也无需访问后端。
            </footer>
          </aside>
        </div>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <DemoApp />
    </React.StrictMode>
  );
}

bootstrap().catch((error) => {
  console.error("Demo bootstrap failed", error);
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `<div style="padding:40px;font-family:sans-serif;color:#fff;background:#111"><h2>Demo 启动失败</h2><pre style="white-space:pre-wrap">${String(
      error?.stack || error
    )}</pre></div>`;
  }
});
