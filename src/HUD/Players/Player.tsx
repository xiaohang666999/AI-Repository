import * as I from "csgogsi";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import Armor from "./../Indicators/Armor";
import Bomb from "./../Indicators/Bomb";
import Defuse from "./../Indicators/Defuse";
import React from "react";

interface IProps {
  player: I.Player,
  isObserved: boolean,
}

const compareWeapon = (weaponOne: I.WeaponRaw, weaponTwo: I.WeaponRaw) => {
  if (weaponOne.name === weaponTwo.name &&
    weaponOne.paintkit === weaponTwo.paintkit &&
    weaponOne.type === weaponTwo.type &&
    weaponOne.ammo_clip === weaponTwo.ammo_clip &&
    weaponOne.ammo_clip_max === weaponTwo.ammo_clip_max &&
    weaponOne.ammo_reserve === weaponTwo.ammo_reserve &&
    weaponOne.state === weaponTwo.state
  ) return true;

  return false;
}

const compareWeapons = (weaponsObjectOne: I.Weapon[], weaponsObjectTwo: I.Weapon[]) => {
  const weaponsOne = [...weaponsObjectOne].sort((a, b) => a.name.localeCompare(b.name))
  const weaponsTwo = [...weaponsObjectTwo].sort((a, b) => a.name.localeCompare(b.name))

  if (weaponsOne.length !== weaponsTwo.length) return false;

  return weaponsOne.every((weapon, i) => compareWeapon(weapon, weaponsTwo[i]));
}

const arePlayersEqual = (playerOne: I.Player, playerTwo: I.Player) => {
  if (playerOne.name === playerTwo.name &&
    playerOne.steamid === playerTwo.steamid &&
    playerOne.observer_slot === playerTwo.observer_slot &&
    playerOne.defaultName === playerTwo.defaultName &&
    playerOne.clan === playerTwo.clan &&
    playerOne.stats.kills === playerTwo.stats.kills &&
    playerOne.stats.assists === playerTwo.stats.assists &&
    playerOne.stats.deaths === playerTwo.stats.deaths &&
    playerOne.stats.mvps === playerTwo.stats.mvps &&
    playerOne.stats.score === playerTwo.stats.score &&
    playerOne.state.health === playerTwo.state.health &&
    playerOne.state.armor === playerTwo.state.armor &&
    playerOne.state.helmet === playerTwo.state.helmet &&
    playerOne.state.defusekit === playerTwo.state.defusekit &&
    playerOne.state.flashed === playerTwo.state.flashed &&
    playerOne.state.smoked === playerTwo.state.smoked &&
    playerOne.state.burning === playerTwo.state.burning &&
    playerOne.state.money === playerTwo.state.money &&
    playerOne.state.round_killhs === playerTwo.state.round_killhs &&
    playerOne.state.round_kills === playerTwo.state.round_kills &&
    playerOne.state.round_totaldmg === playerTwo.state.round_totaldmg &&
    playerOne.state.equip_value === playerTwo.state.equip_value &&
    playerOne.state.adr === playerTwo.state.adr &&
    playerOne.avatar === playerTwo.avatar &&
    !!playerOne.team.id === !!playerTwo.team.id &&
    playerOne.team.side === playerTwo.team.side &&
    playerOne.country === playerTwo.country &&
    playerOne.realName === playerTwo.realName &&
    compareWeapons(playerOne.weapons, playerTwo.weapons)
  ) return true;

  return false;
}

const Player = ({ player, isObserved }: IProps) => {

  const weapons = player.weapons.map(weapon => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
  const primary = weapons.filter(weapon => !['C4', 'Pistol', 'Knife', 'Grenade', undefined].includes(weapon.type))[0] || null;
  const secondary = weapons.filter(weapon => weapon.type === "Pistol")[0] || null;
  const grenades = weapons.filter(weapon => weapon.type === "Grenade");

  const zeus = weapons.find(weapon => weapon.name === "taser");

  const inHand = (primary && primary.state === "active")
    ? primary
    : (secondary && secondary.state === "active")
      ? secondary
      : (primary || secondary);

  const health = Math.max(0, player.state.health || 0);
  const isDead = health === 0;
  const isLow = !isDead && health <= 20;

  return (
    <div className={`player ${isDead ? "dead" : ""} ${isObserved ? 'active' : ''}`}>
      <div className={`hp_fill ${isLow ? "low" : ""}`} style={{ width: `${health}%` }}></div>
      <div className="player_data">
        <div className="avatar_col">
          <Avatar teamId={player.team.id} steamid={player.steamid} url={player.avatar} height={42} width={42} showSkull={false} showCam={false} sidePlayer={true} />
        </div>
        <div className="info_col">
          <div className="row_top">
            <div className={`hp_text ${isLow ? "low" : ""}`}>{health}</div>
            <div className="name">{player.name}</div>
            {inHand
              ? <div className="main_weapon"><Weapon weapon={inHand.name} active={inHand.state === "active"} /></div>
              : null}
            {player.state.round_kills ? <div className="rk"><i className="skull" />{player.state.round_kills}</div> : null}
            <div className="row_spacer" />
            <div className="slot">{player.observer_slot}</div>
            <div className="money">${player.state.money}</div>
          </div>
          <div className="row_bot">
            <div className="state_icons">
              <Bomb player={player} />
              <Armor health={health} armor={player.state.armor} helmet={player.state.helmet} />
              <Defuse player={player} />
            </div>
            <div className="loadout">
              {zeus ? <Weapon className="zeus" weapon="taser" active={zeus.state === "active"} /> : null}
              {grenades.map(grenade => (
                <React.Fragment key={`${grenade.name}-${grenade.state}`}>
                  <Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade />
                  {grenade.ammo_reserve === 2 ? <Weapon key={`${grenade.name}-double`} weapon={grenade.name} active={false} isGrenade /> : null}
                </React.Fragment>
              ))}
              {primary && secondary ? <div className="secondary_wrap"><Weapon weapon={secondary.name} active={secondary.state === "active"} /></div> : null}
            </div>
            {isDead ? (
              <div className="kd_stats">
                <span>{player.stats.kills}<b>K</b></span>
                <span>{player.stats.assists}<b>A</b></span>
                <span>{player.stats.deaths}<b>D</b></span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

const arePropsEqual = (prevProps: Readonly<IProps>, nextProps: Readonly<IProps>) => {
  if (prevProps.isObserved !== nextProps.isObserved) return false;

  return arePlayersEqual(prevProps.player, nextProps.player);
}

export default React.memo(Player, arePropsEqual);
//export default Player;
