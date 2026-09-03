import * as I from "csgogsi";
import Weapon from "./../Weapon/Weapon";
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

  const health = player.state.health;
  const isDead = health === 0;
  const hpState = health > 50 ? "good" : health > 25 ? "mid" : "low";

  // Icon of the weapon that is actually in hand (falls back to best gun).
  const heldWeapon = weapons.find(weapon => weapon.state === "active") || primary || secondary || null;

  return (
    <div className={`player ${isDead ? "dead" : ""} ${isObserved ? 'active' : ''}`}>
      <div className="card">
        <div className={`hp_fill ${hpState} ${isDead ? "none" : ""}`} style={{ width: `${Math.max(health, 0)}%` }}></div>
        <div className="player_data">
          <div className="health">
            <span className="value">{health}</span>
          </div>
          <div className="username">
            <div className="name">{player.name}</div>
            <div className="indicators">
              <Bomb player={player} />
              <Armor health={health} armor={player.state.armor} helmet={player.state.helmet} />
              <Defuse player={player} />
            </div>
          </div>
          <div className="weapon_icon">
            {heldWeapon ? <Weapon weapon={heldWeapon.name} active={heldWeapon.state === "active"} /> : null}
          </div>
          <div className="money">${player.state.money}</div>
        </div>
        <div className="dead_stats">
          <div className="ds_cell">
            <div className="label">K</div>
            <div className="value">{player.stats.kills}</div>
          </div>
          <div className="ds_cell">
            <div className="label">A</div>
            <div className="value">{player.stats.assists}</div>
          </div>
          <div className="ds_cell">
            <div className="label">D</div>
            <div className="value">{player.stats.deaths}</div>
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
