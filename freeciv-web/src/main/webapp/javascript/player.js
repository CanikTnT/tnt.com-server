/**********************************************************************
    Freeciv-web - the web version of Freeciv. http://play.freeciv.org/
    Copyright (C) 2009-2015  The Freeciv-web project

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

***********************************************************************/



var players = {};
var research_data = {};

var MAX_NUM_PLAYERS = 30;

var MAX_AI_LOVE = 1000;

var DS_ARMISTICE = 0;
var DS_WAR = 1;
var DS_CEASEFIRE = 2;
var DS_PEACE = 3;
var DS_ALLIANCE = 4;
var DS_NO_CONTACT = 5;
var DS_TEAM = 6;
var DS_LAST = 7;

/* The plr_flag_id enum. */
var PLRF_AI = 0;
var PLRF_SCENARIO_RESERVED = 1;
var PLRF_COUNT = 2;

function valid_player_by_number(playerno)
{
  /*  TODO:
  pslot = player_slot_by_number(player_id);
  if (!player_slot_is_used(pslot)) {
    return NULL;  */

  return players[playerno];
}

function player_by_number(playerno)
{
  return players[playerno];
}


function player_by_name(pname)
{
  for (var player_id in players) {
    var pplayer = players[player_id];
    if (pname == pplayer['name']) return pplayer;
  }
  return null;
}

function player_by_full_username(pname)
{
  var ainame;
  if (pname.substr(0, 3) == 'AI ') {
    ainame = pname.substr(3);
  } else {
    ainame = pname;
  }
  for (var player_id in players) {
    var pplayer = players[player_id];
    if (pplayer['flags'].isSet(PLRF_AI)){
      if (ainame == pplayer['name']) return pplayer;
    } else {
      // players may only know each others playername not name, so intercept from that:
      if (pname == pplayer['name']) return pplayer;
      // following line may no longer be needed but kept just in case:
      if (pname == pplayer['username']) return pplayer;
    }
  }
  return null;
}


/***************************************************************
 If the specified player owns the unit with the specified id,
 return pointer to the unit struct.  Else return NULL.
 Uses fast idex_lookup_city.

 pplayer may be NULL in which case all units registered to
 hash are considered - even those not currently owned by any
 player. Callers expect this behavior.
***************************************************************/
function player_find_unit_by_id(pplayer, unit_id)
{
  var punit = idex_lookup_unit(unit_id);

  if (punit == null) return null;

  if (pplayer != null || (unit_owner(punit) == pplayer)) {
    /* Correct owner */
    return punit;
  }

  return NULL;

}

/**************************************************************************
  Return the player index.

  Currently same as player_number(), paired with player_count()
  indicates use as an array index.
**************************************************************************/
function player_index(pplayer)
{
  return player_number(pplayer);
}

/**************************************************************************
  Return the player index/number/id.
**************************************************************************/
function player_number(player)
{
  return player['playerno'];
}


/**************************************************************************
  ...
**************************************************************************/
function get_diplstate_text(state_id)
{
  // These exact strings are checked elsewhere in nation.js.  If altered, 
  // just globalise an array diplstate_text[state_id] and use that instead
  // of this function.
  if (DS_ARMISTICE == state_id) {
    return "Armistice";
  } else if (DS_WAR == state_id) {
    return "War";
  } else if (DS_CEASEFIRE == state_id) {
    return "Ceasefire";
  } else if (DS_PEACE == state_id) {
    return "Peace";
  } else if (DS_ALLIANCE == state_id) {
    return "Alliance";
  } else if (DS_NO_CONTACT == state_id) {
    return "None";
  } else if (DS_TEAM == state_id) {
    return "Team";
  } else {
    return "Unknown state";
  }

}

/**************************************************************************
  Returns a universally standard string representing embassy status 
  between current player and foreign player_id player
**************************************************************************/

// These strings shouldn't be hard-coded because they are checked in different
// parts of the code; changing in one place would create failures elsewhere.
var embassy_status_text = ["None", "We have embassy", "They have embassy", "Both"];
const EMBASSY_NONE    = 0;
const EMBASSY_WEHAVE  = 1;
const EMBASSY_THEYHAVE= 2;
const EMBASSY_BOTH    = 3;

function get_embassy_text(player_id)
{
  const NO_INFO = "-";

  if (player_id == null) return NO_INFO;

  const me = client.conn.playing;
  if (me == null || client_is_observer()) return NO_INFO;

  const my_id = me.playerno;
  if (player_id == my_id) return NO_INFO;

  const them = players[player_id];
  if (them == null) return NO_INFO;

  const embassy_with = me.real_embassy[player_id];
  const embassy_from = them.real_embassy[my_id];

  if (embassy_with && embassy_from) {
    return embassy_status_text[EMBASSY_BOTH];
  } else if (embassy_with) {
    return embassy_status_text[EMBASSY_WEHAVE];
  } else if (embassy_from) {
    return embassy_status_text[EMBASSY_THEYHAVE];
  } else {
    return embassy_status_text[EMBASSY_NONE];
  }

}

/**************************************************************************
  ...
**************************************************************************/
function get_ai_level_text(player)
{
  var ai_level = player['ai_skill_level'];
  if (ai_level == 0) {
    return "Away";
  } else if (ai_level == 1) {
    return "Handicapped";
  } else if (ai_level == 2) {
    return "Novice";
  } else if (ai_level == 3) {
    return "Easy";
  } else if (ai_level == 4) {
    return "Normal";
  } else if (ai_level == 5) {
    return "Hard";
  } else if (ai_level == 6) {
    return "Cheating";
  } else if (ai_level == 7) {
    return "Experimental";
  }

  return "Unknown";

}

/**************************************************************************
  Status text for short connection info
**************************************************************************/
function get_player_connection_status(pplayer)
{
  if (pplayer == null) return "";
  if (!pplayer['is_alive']) return "dead";

  if (pplayer['phase_done']) {
    return "done moving";
  } else if (pplayer['nturns_idle'] > 1) {
    return pplayer['nturns_idle'] + " turns idling";
  } else {
    return "moving";
  }
}

/**************************************************************************
  Returns the research object related to the given player.
**************************************************************************/
function research_get(pplayer)
{
  if (pplayer == null) return null;

  if (game_info['team_pooled_research']) {
    return research_data[pplayer['team']];
  } else {
    return research_data[pplayer['playerno']];
  }

}

/**************************************************************************
  returns true if the given player has the given wonder (improvement)
**************************************************************************/
function player_has_wonder(playerno, improvement_id)
{
  // This is faster than looping through every city like we did before.
  if (players[playerno].wonders[improvement_id]) return true;

  /* preserved just in case the faster code above fails for some reason:
  for (var city_id in cities) {
    var pcity = cities[city_id];
    if (city_owner(pcity).playerno == playerno && city_has_building(pcity, improvement_id)) {
      return true;
    }
  }*/
  return false;
}
/**************************************************************************
  returns true if the active player has the given wonder (improvement)
  Note: uses the string value of the wonder and fetches the id for you.
**************************************************************************/
function has_wonder(wonder_name_str)
{
  return player_has_wonder(client.conn.playing.playerno,
    improvement_id_by_name(wonder_name_str));
}

/**************************************************************************
  returns true if the any player in the world has the given Wonder
  Note: uses the string value of the wonder and fetches the id for you.
**************************************************************************/
function world_has_wonder(wonder_name_str)
{
  for (player_id in players) {
    if (player_has_wonder(client.conn.playing.playerno,
        improvement_id_by_name(wonder_name_str))) {

      return true;
    }
  }
  return false;
}

/**************************************************************************
  Checks if a username is valid.
  Returns a textual reason for invalid names, null for valid ones.
**************************************************************************/
function get_invalid_username_reason(username)
{
  if (username == null || username.length == 0) {
    return "empty";
  } 
  else if (username.length <= 2) {
    return "too short";
  }
  else if (username.length >= 32) {
    return "too long";
  }
  username = username.toLowerCase();
  if (username == "pbem") {
    return "not available";
  } 
  /*else if (username.search(/^[a-z][a-z0-9]*$/g) != 0) {
    return "invalid: only English letters and numbers are allowed, and must start with a letter";
  } */
  else if (username != alphanumeric_cleaner(username)) {
    return "invalid: only alphabetic letters and numbers are allowed, and must start with a letter";  
  }
  else if (!check_text_with_banlist_exact(username)) {
    return "banned";
  }
  return null;
}

/**************************************************************************
 returns the the player's capital city, or undefined
 **************************************************************************/
function player_capital(player)
{
  for (const city_id in cities) {
    const city = cities[city_id];
    if (does_player_own_city(player, city) && is_capital(city)) {
      return city;
    }
  }
}

/**************************************************************************
 returns true if the specified player owns the specified city
 **************************************************************************/
function does_player_own_city(player, city)
{
  return city_owner_player_id(city) === player.playerno;
}
