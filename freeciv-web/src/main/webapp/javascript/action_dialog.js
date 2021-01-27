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


/* All generalized actions. */
var actions = {};
var auto_attack = false;
var active_dialogs = [];

/**************************************************************************
  Returns true iff the given action probability belongs to an action that
  may be possible.
**************************************************************************/
function action_prob_possible(aprob)
{
  return 0 < aprob['max'] || action_prob_not_impl(aprob);
}

/**************************************************************************
  Returns TRUE iff the given action probability represents that support
  for finding this action probability currently is missing from Freeciv.
**************************************************************************/
function action_prob_not_impl(probability)
{
  return probability['min'] == 254
         && probability['max'] == 0;
}

/**************************************************************************
  Returns true unless a situation were a regular move always would be
  impossible is recognized.
**************************************************************************/
function can_actor_unit_move(actor_unit, target_tile)
{
  var tgt_owner_id;

  if (index_to_tile(actor_unit['tile']) == target_tile) {
    /* The unit is already on this tile. */
    return false;
  }

  if (-1 == get_direction_for_step(tiles[actor_unit['tile']],
                                   target_tile)) {
    /* The target tile is too far away. */
    return FALSE;
  }

  for (var i = 0; i < tile_units(target_tile).length; i++) {
    tgt_owner_id = unit_owner(tile_units(target_tile)[i])['playerno'];

    if (tgt_owner_id != unit_owner(actor_unit)['playerno']
        && diplstates[tgt_owner_id] != DS_ALLIANCE
        && diplstates[tgt_owner_id] != DS_TEAM) {
      /* Can't move to a non allied foreign unit's tile. */
      return false;
    }
  }

  if (tile_city(target_tile) != null) {
    tgt_owner_id = city_owner(tile_city(target_tile))['playerno'];

    if (tgt_owner_id == unit_owner(actor_unit)['playerno']) {
      /* This city isn't foreign. */
      return true;
    }

    if (diplstates[tgt_owner_id] == DS_ALLIANCE
        || diplstates[tgt_owner_id] == DS_TEAM) {
      /* This city belongs to an ally. */
      return true;
    }

    return false;
  }

  /* It is better to show the "Keep moving" option one time to much than
   * one time to little. */
  return true;
}

/**************************************************************************
  Encode a building ID for transfer in the value field of
  packet_unit_do_action for targeted sabotage city.
**************************************************************************/
function encode_building_id(building_id)
{
  /* Building ID is encoded in the value field by adding one so the
   * building ID -1 (current production) can be transferred. */
  return building_id + 1;
}

/***************************************************************************
  Returns a part of an action probability in a user readable format.
***************************************************************************/
function format_act_prob_part(prob)
{
  return (prob / 2) + "%";
}

/****************************************************************************
  Format the probability that an action will be a success.
****************************************************************************/
function format_action_probability(probability)
{
  if (probability['min'] == probability['max']) {
    /* This is a regular and simple chance of success. */
    return " (" + format_act_prob_part(probability['max']) + ")";
  } else if (probability['min'] < probability['max']) {
    /* This is a regular chance of success range. */
    return " ([" + format_act_prob_part(probability['min']) + ", "
           + format_act_prob_part(probability['max']) + "])";
  } else {
    /* The remaining action probabilities shouldn't be displayed. */
    return "";
  }
}

/**************************************************************************
  Format the label of an action selection button.
**************************************************************************/
function format_action_label(action_id, action_probabilities)
{
  return actions[action_id]['ui_name'].replace("%s", "").replace("%s",
      format_action_probability(action_probabilities[action_id]));
}

/**************************************************************************
  Format the tooltip of an action selection button.
**************************************************************************/
function format_action_tooltip(act_id, act_probs)
{
  var out;

  if (act_probs[act_id]['min'] == act_probs[act_id]['max']) {
    out = "The probability of success is ";
    out += format_act_prob_part(act_probs[act_id]['max']) + ".";
  } else if (act_probs[act_id]['min'] < act_probs[act_id]['max']) {
    out = "The probability of success is ";
    out += format_act_prob_part(act_probs[act_id]['min']);
    out += ", ";
    out += format_act_prob_part(act_probs[act_id]['max']);
    out += " or somewhere in between.";

    if (act_probs[act_id]['max'] - act_probs[act_id]['min'] > 1) {
      /* The interval is wide enough to not be caused by rounding. It is
       * therefore imprecise because the player doesn't have enough
       * information. */
      out += " (This is the most precise interval I can calculate ";
      out += "given the information our nation has access to.)";
    }
  }

  return out;
}

/**************************************************************************
  Returns the function to run when an action is selected.
**************************************************************************/
function act_sel_click_function(parent_id,
                                actor_unit_id, tgt_id, sub_tgt_id,
                                action_id, action_probabilities)
{
  switch (action_id) {
  case ACTION_SPY_TARGETED_STEAL_TECH:
  case ACTION_SPY_TARGETED_STEAL_TECH_ESC:
    return function() {
      popup_steal_tech_selection_dialog(units[actor_unit_id],
                                        cities[tgt_id],
                                        action_probabilities,
                                        action_id);
      remove_active_dialog(parent_id);
    };
  case ACTION_SPY_TARGETED_SABOTAGE_CITY:
  case ACTION_SPY_TARGETED_SABOTAGE_CITY_ESC:
  case ACTION_SPY_INCITE_CITY:
  case ACTION_SPY_INCITE_CITY_ESC:
  case ACTION_SPY_BRIBE_UNIT:
  case ACTION_UPGRADE_UNIT:
    return function() {
      var packet = {
        "pid"         : packet_unit_action_query,
        "diplomat_id" : actor_unit_id,
        "target_id"   : tgt_id,
        "action_type" : action_id,
        "disturb_player" : true
      };
      send_request(JSON.stringify(packet));
      remove_active_dialog(parent_id);
    };
  case ACTION_FOUND_CITY:
    return function() {
      /* Ask the server to suggest a city name. */
      var packet = {
        "pid"     : packet_city_name_suggestion_req,
        "unit_id" : actor_unit_id
      };
      send_request(JSON.stringify(packet));
      remove_active_dialog(parent_id);
    };
  case ACTION_PILLAGE:
  case ACTION_ROAD:
  case ACTION_BASE:
  case ACTION_MINE:
  case ACTION_IRRIGATE:
    return function() {
      var packet = {
        "pid"         : packet_unit_do_action,
        "actor_id"    : actor_unit_id,
        "target_id"   : tgt_id,
        "extra_id"    : sub_tgt_id,
        "value"       : 0,
        "name"        : "",
        "action_type" : action_id
      };
      send_request(JSON.stringify(packet));
      remove_active_dialog(parent_id);
    };
    case ACTION_ATTACK:
      return function() {
        var packet = {
          "pid"         : packet_unit_do_action,
          "actor_id"    : actor_unit_id,
          "target_id"   : tgt_id,
          "extra_id"    : EXTRA_NONE,
          "value"       : 0,
          "name"        : "",
          "action_type" : action_id
        };
        send_request(JSON.stringify(packet));
        // unit lost hp or died or promoted after attack, so update it:
        setTimeout(update_active_units_dialog, update_focus_delay);
        remove_active_dialog(parent_id);
      };      
  default:
    return function() {
      var packet = {
        "pid"         : packet_unit_do_action,
        "actor_id"    : actor_unit_id,
        "target_id"   : tgt_id,
        "extra_id"    : EXTRA_NONE,
        "value"       : 0,
        "name"        : "",
        "action_type" : action_id
      };
      send_request(JSON.stringify(packet));
      remove_active_dialog(parent_id);
    };
  }
}

/**************************************************************************
  Create a button that selects an action.

  Needed because of JavaScript's scoping rules.
**************************************************************************/
function create_act_sel_button(parent_id,
                               actor_unit_id, tgt_id, sub_tgt_id,
                               action_id, action_probabilities)
{
  // Create button_text
  var button_text = format_action_label(action_id, action_probabilities);
  // Fix inaccurate "Conquer City" to "Raze City" for size 1 city:
  if (button_text.includes("Conquer")) {
    var pcity = cities[tgt_id];
    if (pcity && pcity['size']==1)
      button_text = button_text.replace("Conquer", "Raze");
  }

  /* Create the initial button with this action */
  var button = {
    id      : "act_sel_" + action_id + "_" + actor_unit_id,
    "class" : 'act_sel_button',
    text    : button_text,
    title   : format_action_tooltip(action_id,
                                    action_probabilities),
    click   : act_sel_click_function(parent_id,
                                     actor_unit_id, tgt_id, sub_tgt_id,
                                     action_id, action_probabilities)
  };

  /* The button is ready. */
  return button;
}

/****************************************************************************
  Ask the player to select an action.
****************************************************************************/
function popup_action_selection(actor_unit, action_probabilities,
                                target_tile, target_extra,
                                target_unit, target_city)
{
  // reset dialog page.
  var id = "#act_sel_dialog_" + actor_unit['id'];
  remove_active_dialog(id);
  $("<div id='act_sel_dialog_" + actor_unit['id'] + "'></div>").appendTo("div#game_page");

  var actor_homecity = cities[actor_unit['homecity']];

  var buttons = [];

  var dhtml = "";

  if (target_city != null) {
    dhtml += "Your " + unit_types[actor_unit['type']]['name'];

    /* Some units don't have a home city. */
    if (actor_homecity != null) {
      dhtml += " from " + decodeURIComponent(actor_homecity['name']);
    }

    dhtml += " has arrived at " + decodeURIComponent(target_city['name'])
             + ". What is your command?";
  } else if (target_unit != null) {
    dhtml += "Your " + unit_types[actor_unit['type']]['name']
             + " is ready to act against "
             + nations[unit_owner(target_unit)['nation']]['adjective']
             + " " + unit_types[target_unit['type']]['name'] + ".";
  } else {
    dhtml += "Your " + unit_types[actor_unit['type']]['name']
             + " is waiting for your command.";
  }

  $(id).html(dhtml);

  /* Show a button for each enabled action. The buttons are sorted by
   * target kind first and then by action id number. */
  for (var tgt_kind = ATK_CITY; tgt_kind < ATK_COUNT; tgt_kind++) {
    var tgt_id = -1;
    var sub_tgt_id = -1;

    switch (tgt_kind) {
    case ATK_CITY:
      if (target_city != null) {
        tgt_id = target_city['id'];
      }
      break;
    case ATK_UNIT:
      if (target_unit != null) {
        tgt_id = target_unit['id'];
      }
      break;
    case ATK_UNITS:
      if (target_tile != null) {
        tgt_id = target_tile['index'];
      }
      break;
    case ATK_TILE:
      if (target_tile != null) {
        tgt_id = target_tile['index'];
      }
      if (target_extra != null) {
        sub_tgt_id = target_extra['id'];
      }
      break;
    case ATK_SELF:
      if (actor_unit != null) {
        tgt_id = actor_unit['id'];
      }
      break;
    default:
      console.log("Unsupported action target kind " + tgt_kind);
      break;
    }

    for (var action_id = 0; action_id < ACTION_COUNT; action_id++) {
      if (actions[action_id]['tgt_kind'] == tgt_kind
          && action_prob_possible(
              action_probabilities[action_id])) {
        //---------------------------------------------------------------------------------        
        // This code disallows capture IFF:        
        // Longturn && idle nation && human && unit isn't trespassing on player's territory
        // TO DO: move this to C-server
        if (action_id == ACTION_CAPTURE_UNITS && is_longturn() ) {
          var sunits = tile_units(tiles[tgt_id]);
          if (sunits && sunits.length==1) {
            var player_id = sunits[0].owner;
            // Disallow if idle and human:
            if (players[player_id]['nturns_idle'] > 1 && !(players[player_id]['flags'].isSet(PLRF_AI))) {
              // Disallow if idler is NOT trespassing on player's own territory: 
              if (tiles[tgt_id].owner != client.conn.playing.playerno) {
                add_client_message("Info: capture order unavailable on idle human player.");
                continue; // disallow capture
              }
            }
          }
        }
        //-------------------------------------------------------------------------------------
        buttons.push(create_act_sel_button(id, actor_unit['id'],
                                           tgt_id, sub_tgt_id, action_id,
                                           action_probabilities));
      }
    }
  }

  if (can_actor_unit_move(actor_unit, target_tile)) {
    buttons.push({
        id      : "act_sel_move" + actor_unit['id'],
        "class" : 'act_sel_button',
        text    : 'Keep moving',
        click   : function() {
          var dir = get_direction_for_step(tiles[actor_unit['tile']],
                                           target_tile);
          var packet = {
            "pid"       : packet_unit_orders,
            "unit_id"   : actor_unit['id'],
            "src_tile"  : actor_unit['tile'],
            "length"    : 1,
            "repeat"    : false,
            "vigilant"  : false,
            "orders"    : [ORDER_MOVE],
            "dir"       : [dir],
            "activity"  : [ACTIVITY_LAST],
            "target"    : [0],
            "extra"     : [EXTRA_NONE],
            "action"    : [ACTION_COUNT],
            "dest_tile" : target_tile['index']
          };

          if (dir == -1) {
            /* Non adjacent target tile? */
            console.log("Action slection move: bad target tile");
          } else {
            send_request(JSON.stringify(packet));
          }
          remove_active_dialog(id);
        } });
  }

  if (target_unit != null
      && tile_units(target_tile).length > 1) {
    buttons.push({
        id      : "act_sel_tgt_unit_switch" + actor_unit['id'],
        "class" : 'act_sel_button',
        text    : 'Change unit target',
        click   : function() {
          select_tgt_unit(actor_unit,
                          target_tile, tile_units(target_tile));

          remove_active_dialog(id);
        } });
  }

  if (target_extra != null) {
    buttons.push({
        id      : "act_sel_tgt_extra_switch" + actor_unit['id'],
        "class" : 'act_sel_button',
        text    : 'Change extra target',
        click   : function() {
          select_tgt_extra(actor_unit, target_unit, target_tile,
                           list_potential_target_extras(actor_unit,
                                                        target_tile));

          remove_active_dialog(id);
        } });
  }

  /* Special-case handling for auto-attack. */
  if (action_prob_possible(action_probabilities[ACTION_ATTACK])) {
        if (!auto_attack) {
          var button = {
            id      : "act_sel_" + ACTION_ATTACK + "_" + actor_unit['id'],
            "class" : 'act_sel_button',
            text    : "Auto attack from now on!",
            title   : "Attack without showing this attack dialog in the future",
            click   : function() {
                          var packet = {
                              "pid"         : packet_unit_do_action,
                              "actor_id"    : actor_unit['id'],
                              "target_id"   : target_tile['index'],
                              "extra_id"    : EXTRA_NONE,
                              "value"       : 0,
                              "name"        : "",
                              "action_type" : ACTION_ATTACK
                            };
                            send_request(JSON.stringify(packet));
                            setTimeout(update_active_units_dialog, update_focus_delay);
                            auto_attack = true;
                            remove_active_dialog(id);
                          }
          };
          buttons.push(button);
        } else {
          var packet = {
              "pid"         : packet_unit_do_action,
              "actor_id"    : actor_unit['id'],
              "target_id"   : target_tile['index'],
              "extra_id"    : EXTRA_NONE,
              "value"       : 0,
              "name"        : "",
              "action_type" : ACTION_ATTACK
            };
            send_request(JSON.stringify(packet));
            // unit lost hp or died or promoted after attack, so update it:
            setTimeout(update_active_units_dialog, update_focus_delay);
            return;
        }
  }

  buttons.push({
      id      : "act_sel_cancel" + actor_unit['id'],
      "class" : 'act_sel_button',
      text    : 'Cancel (W)',
      click   : function() {
        remove_active_dialog(id);
      } });

  $(id).attr("title",
             "Action for " + unit_types[actor_unit['type']]['name']
             + ":");

  // Dialog UI: Populate richer text for rulesets with features.
  var SP = client_rules_flag[CRF_SURGICAL_PILLAGE];
  var SUA = client_rules_flag[CRF_SPECIAL_UNIT_ATTACKS];

  // This section does override names for surgical pillage:
  if (SP) {
    if (unit_can_iPillage(actor_unit)) {
      for (button_id in buttons) {
        if (buttons[button_id].text.startsWith("Pillage")) {
          buttons[button_id].text = unit_get_pillage_name(actor_unit);          
        }
      }
    }
  }
  var ptype = unit_type(actor_unit); 
  // THIS SECTION DOES OVERRIDE NAMES for special unit actions:
  if (SUA) {
    switch (ptype['rule_name']) {
      case "Siege Ram":  for (button_id in buttons) {
        if (buttons[button_id].text.startsWith("Ranged Attack")) {
          buttons[button_id].text = utype_get_bombard_name(ptype)+" (100%)"
          buttons[button_id].title = "Odds of survival:  100%\n"
                                  + "Combat:                4 rounds\n"
                                  + "Targets:                 ALL\n"
                                  + "Attack bonus:        8.75x\n"
                                  + "Move cost:            1 move\n"
                                  + "Min. moves:          1 1/9 moves\n"
                                  + "Casualties:             --\n"
                                  + "\n\"Damage\" to the Fortress is represented by HP loss to all\n"
                                  + "units (up to 40%/turn): emulating damage reduction to the\n"
                                  + "Fortress defense bonus. HP healing of units (up to 40%/turn),\n"
                                  + "emulates resistance and repairing Fortress damage over the\n"
                                  + "course of a long siege.\n"
        }
        else if (buttons[button_id].text.startsWith("Targeted Sabotage")) {
          buttons[button_id].text = "Attack City Walls ([25%, 50%])"
          buttons[button_id].title = "Odds of survival:  50%  (halved if city is capital)\n"
                                  + "Targets:                 City Walls\n"
                                  + "Move cost:            1/9 move\n"
                                  + "Min. moves:          1 move\n"
                                  + "Attacks the City Walls, resulting in destruction\n"
                                  + "of the City Walls or the loss of the Siege Ram."
        }
      } break;
      case "Phalanx":  for (button_id in buttons) {
        if (buttons[button_id].text.startsWith("Ranged Attack")) {
          buttons[button_id].text = utype_get_bombard_name(ptype)+" (100%)"
          buttons[button_id].title = "Odds of survival:  100%\n"
                                  + "Combat:                3 rounds\n"
                                  + "Targets:                 1 unit\n"
                                  + "Move cost:            5/9 move\n"
                                  + "Min. moves:          fortified OR hasn't moved\n"
                                  + "Casualties:             --\n"
                                  + "\nA 3 round rumble against one unit on the target tile\n"
                                  + "represents the Phalanx safely pushing from a held\n"
                                  + "position vs. a weak defender who comes too close.\n"
        }
      } break;
      case "Archers":  for (button_id in buttons) {
        if (buttons[button_id].text.startsWith("Ranged Attack")) {
            buttons[button_id].text = utype_get_bombard_name(ptype)+" (100%)"
            buttons[button_id].title = "Odds of survival:  100%\n"
                                    + "Combat:                2 rounds\n"
                                    + "Targets:                 7 units\n"
                                    + "Move cost:            1 5/9 moves\n"
                                    + "Casualties:             --\n"
                                    + "\n2 rounds of arrows against up to 7 units,\n"
                                    + "represents Archers raining arrows from a\n"
                                    + "safe distance over an adjacent force."
        }
      } break;
      case "Legion":  for (button_id in buttons) {
        if (buttons[button_id].text.startsWith("Ranged Attack")) {
          buttons[button_id].text = utype_get_bombard_name(ptype)+" (100%)"
          buttons[button_id].title = "Odds of survival:  100%\n"
                                  + "Attack bonus:        2x\n"
                                  + "Combat:                1 round\n"
                                  + "Targets:                 2 units\n"
                                  + "Move cost:            1 move\n"
                                  + "Max. casualties:     2\n"
                                  + "\nPila easily disable shields in the enemy front line, represented by\n"
                                  + "1hp damage caused to up to 2 units. This helps the odds of success\n"
                                  + "of follow-up attack if done before the units heal (\"fix their shields.\")"
        }
      } break;
      case "Fanatics":  for (button_id in buttons) {
        if (buttons[button_id].text.startsWith("Ranged Attack")) {
          buttons[button_id].text = utype_get_bombard_name(ptype)+" (100%)"
          buttons[button_id].title = "Odds of survival:  100%\n"
                                    + "Combat:                3 rounds\n"
                                    + "Targets:                 4 units\n"
                                    + "Move cost:            1 5/9 moves\n"
                                    + "Casualties:             --\n"
                                    + "\nFanatics opportunistically damage and degrade foreign occupants\n"
                                    + "of their native land, for 3 rounds of combat on up to 4 foreign\n"
                                    + "occupants of a city or tile."
          
        }
      } break;
      case "Marines":  for (button_id in buttons) {
        if (buttons[button_id].text.startsWith("Ranged Attack")) {
          buttons[button_id].text = utype_get_bombard_name(ptype)+" (100%)"
          buttons[button_id].title = "Odds of survival:  100%\n"
                                  + "Combat:                3 rounds\n"
                                  + "Targets:                 4 units\n"
                                  + "Move cost:            1 5/9 moves\n"
                                  + "Max. casualties:     1\n"        
                                  + "\nV3 Marines use agility/mobility over terrain features to improvise hit-and-run\n"
                                  + "ballistic attacks: 3 rounds of combat on up to 4 occupants of a tile.\n"
        }
      } break;
      case "Battleship":  for (button_id in buttons) {
        if (buttons[button_id].text.startsWith("Ranged Attack")) {
          buttons[button_id].text = utype_get_bombard_name(ptype)+" (100%)"
          buttons[button_id].title = "Odds of survival:  100%\n"
                                  + "Combat:                3 rounds\n"
                                  + "Targets:                 4 units\n"
                                  + "Move cost:            5 moves\n"
                                  + "Max. casualties:     1\n"
                                  + "\nUses the range advantage of massive large guns to safely\n" 
                                  + "shell and degrade up to 4 distant targets on a tile or city.\n"
        }
      } break;
    }
  }
  //--------------------------------------------------------------------

  $(id).dialog({
      bgiframe: true,
     // modal: true,   // non-modal: allows player to see and witness large multi-unit battle with many dialogs
      dialogClass: "act_sel_dialog",
      width: "390",
      buttons: buttons });

  $(id).dialog('open');
  $(id).dialog('widget').position({my:"center top", at:"center top", of:window})
  dialog_register(id);
}

/**************************************************************************
  Show the player the price of bribing the unit and, if bribing is
  possible, allow him to order it done.
**************************************************************************/
function popup_bribe_dialog(actor_unit, target_unit, cost, act_id)
{
  var bribe_possible = false;
  var dhtml = "";
  var id = "#bribe_unit_dialog_" + actor_unit['id'];

  /* Reset dialog page. */
  remove_active_dialog(id);

  $("<div id='bribe_unit_dialog_" + actor_unit['id'] + "'></div>")
      .appendTo("div#game_page");

  dhtml += "Treasury contains " + unit_owner(actor_unit)['gold'] + " gold. ";
  dhtml += "The price of bribing "
              + nations[unit_owner(target_unit)['nation']]['adjective']
              + " " + unit_types[target_unit['type']]['name']
           + " is " + cost + ". ";

  bribe_possible = cost <= unit_owner(actor_unit)['gold'];

  if (!bribe_possible) {
    dhtml += "Traitors Demand Too Much!";
    dhtml += "<br>";
  }

  $(id).html(dhtml);

  var close_button = {	"Close (W)": function() {remove_active_dialog(id);}};
  var bribe_close_button = {	"Cancel (W)": function() {remove_active_dialog(id);},
  				"Do it!": function() {
      var packet = {"pid" : packet_unit_do_action,
                    "actor_id" : actor_unit['id'],
                    "target_id": target_unit['id'],
                    "extra_id" : EXTRA_NONE,
                    "value" : 0,
                    "name" : "",
                    "action_type": act_id};
      send_request(JSON.stringify(packet));
      remove_active_dialog(id);
    }
  };

  $(id).attr("title", "Bribery Action");

  $(id).dialog({bgiframe: true,
                modal: true,
                buttons: (bribe_possible ? bribe_close_button : close_button),
                height: "auto",
                width: "auto"});

  $(id).dialog('open');
  $(id).dialog('widget').position({my:"center top", at:"center top", of:window})
  dialog_register(id);
}

/**************************************************************************
  Show the player the price of inviting the city and, if inciting is
  possible, allow him to order it done.
**************************************************************************/
function popup_incite_dialog(actor_unit, target_city, cost, act_id)
{
  var incite_possible;
  var id;
  var dhtml;

  id = "#incite_city_dialog_" + actor_unit['id'];

  /* Reset dialog page. */
  remove_active_dialog(id);

  $("<div id='incite_city_dialog_" + actor_unit['id'] + "'></div>")
      .appendTo("div#game_page");

  dhtml = "";

  dhtml += "Treasury contains " + unit_owner(actor_unit)['gold'] + " gold.";
  dhtml += " ";
  dhtml += "The price of inciting "
           + decodeURIComponent(target_city['name'])
           + " is " + cost + ".";

  incite_possible = cost != INCITE_IMPOSSIBLE_COST
                    && cost <= unit_owner(actor_unit)['gold'];

  if (!incite_possible) {
    dhtml += " ";
    dhtml += "Traitors Demand Too Much!";
    dhtml += "<br>";
  }

  $(id).html(dhtml);

  var close_button = {         'Close (W)':    function() {remove_active_dialog(id);}};
  var incite_close_buttons = { 'Cancel (W)': function() {remove_active_dialog(id);},
                               'Do it!': function() {
                                 var packet = {"pid" : packet_unit_do_action,
                                               "actor_id" : actor_unit['id'],
                                               "target_id": target_city['id'],
                                               "extra_id" : EXTRA_NONE,
                                               "value" : 0,
                                               "name" : "",
                                               "action_type": act_id};
                                 send_request(JSON.stringify(packet));

                                 remove_active_dialog(id);
                               }
                             };

  $(id).attr("title", "Incite Revolt");

  $(id).dialog({bgiframe: true,
                modal: true,
                buttons: (incite_possible ? incite_close_buttons : close_button),
                height: "auto",
                width: "auto"});

  $(id).dialog('open');
  $(id).dialog('widget').position({my:"center top", at:"center top", of:window})
  dialog_register(id);
}

/**************************************************************************
  Show the player the price of upgrading the unit and, if upgrading is
  affordable, allow him to order it done.
**************************************************************************/
function popup_unit_upgrade_dlg(actor_unit, target_city, cost, act_id)
{
  var upgrade_possible;
  var id;
  var dhtml;

  id = "#upgrade_unit_dialog_" + actor_unit['id'];

  /* Reset dialog page. */
  remove_active_dialog(id);

  $("<div id='upgrade_unit_dialog_" + actor_unit['id'] + "'></div>")
      .appendTo("div#game_page");

  dhtml = "";

  dhtml += "Treasury contains " + unit_owner(actor_unit)['gold'] + " gold.";
  dhtml += " ";
  dhtml += "The price of upgrading our "
           + unit_types[actor_unit['type']]['name']
           + " is " + cost + ".";

  upgrade_possible = cost <= unit_owner(actor_unit)['gold'];

  $(id).html(dhtml);

  var close_button = {          'Close (W)':    function() {remove_active_dialog(id);}};
  var upgrade_close_buttons = { 'Cancel (W)': function() {remove_active_dialog(id);},
                                'Do it!': function() {
                                  var packet = {
                                    "pid" : packet_unit_do_action,
                                    "actor_id" : actor_unit['id'],
                                    "target_id": target_city['id'],
                                    "extra_id" : EXTRA_NONE,
                                    "value" : 0,
                                    "name" : "",
                                    "action_type": act_id
                                  };
                                  send_request(JSON.stringify(packet));

                                  remove_active_dialog(id);
                                }
                             };

  $(id).attr("title", "Unit upgrade");

  $(id).dialog({bgiframe: true,
                modal: true,
                buttons: (upgrade_possible ? upgrade_close_buttons
                                           : close_button),
                height: "auto",
                width: "auto"});

  $(id).dialog('open');
  $(id).dialog('widget').position({my:"center top", at:"center top", of:window})
  dialog_register(id);
}

/**************************************************************************
  Create a button that steals a tech.

  Needed because of JavaScript's scoping rules.
**************************************************************************/
function create_steal_tech_button(parent_id, tech,
                                  actor_unit_id, target_city_id,
                                  action_id)
{
  /* Create the initial button with this tech */
  var button = {
    text : tech['name'],
    click : function() {
      var packet = {"pid" : packet_unit_do_action,
        "actor_id" : actor_unit_id,
        "target_id": target_city_id,
        "extra_id" : EXTRA_NONE,
        "value" : tech['id'],
        "name" : "",
        "action_type": action_id};

      send_request(JSON.stringify(packet));
      remove_active_dialog("#"+parent_id);
    }
  };

  /* The button is ready. */
  return button;
}

/**************************************************************************
  Select what tech to steal when doing targeted tech theft.
**************************************************************************/
function popup_steal_tech_selection_dialog(actor_unit, target_city, 
                                           act_probs, action_id)
{
  var id = "stealtech_dialog_" + actor_unit['id'];
  var buttons = [];
  var untargeted_action_id = ACTION_COUNT;

  /* Reset dialog page. */
  remove_active_dialog("#"+id);
  
  $("<div id='" + id + "'></div>").appendTo("div#game_page");

  /* Set dialog title */
  $("#" + id).attr("title", "Pick Tech to Steal");

  /* List the alternatives */
  for (var tech_id in techs) {
    /* JavaScript for each iterates over keys. */
    var tech = techs[tech_id];

    /* Actor and target player tech known state. */
    var act_kn = player_invention_state(client.conn.playing, tech_id);
    var tgt_kn = player_invention_state(city_owner(target_city), tech_id);

    /* Can steal a tech if the target player knows it and the actor player
     * has the pre requirements. Some rulesets allows the player to steal
     * techs the player don't know the prereqs of. */
    if ((tgt_kn == TECH_KNOWN)
        && ((act_kn == TECH_PREREQS_KNOWN)
            || (game_info['tech_steal_allow_holes']
                && (act_kn == TECH_UNKNOWN)))) {
      /* Add a button for stealing this tech to the dialog. */
      buttons.push(create_steal_tech_button(id, tech,
                                            actor_unit['id'],
                                            target_city['id'],
                                            action_id));
    }
  }

  /* The player may change his mind after selecting targeted tech theft and
   * go for the untargeted version after concluding that no listed tech is
   * worth the extra risk. */
  if (action_id == ACTION_SPY_TARGETED_STEAL_TECH_ESC) {
    untargeted_action_id = ACTION_SPY_STEAL_TECH_ESC;
  } else if (action_id == ACTION_SPY_TARGETED_STEAL_TECH) {
    untargeted_action_id = ACTION_SPY_STEAL_TECH;
  }

  if (untargeted_action_id != ACTION_COUNT
      && action_prob_possible(
           act_probs[untargeted_action_id])) {
    /* Untargeted tech theft may be legal. Add it as an alternative. */
    buttons.push({
                   text  : "At " + unit_types[actor_unit['type']]['name']
                           + "'s Discretion",
                   click : function() {
                     var packet = {
                       "pid" : packet_unit_do_action,
                       "actor_id" : actor_unit['id'],
                       "target_id": target_city['id'],
                       "extra_id" : EXTRA_NONE,
                       "value" : 0,
                       "name" : "",
                       "action_type": untargeted_action_id};
                     send_request(JSON.stringify(packet));

                     remove_active_dialog("#"+id);
                   }
                 });
  }

  /* Allow the user to cancel. */
  buttons.push({
                 text : 'Cancel (W)',
                 click : function() {
                  remove_active_dialog("#"+id);
                 }
               });

  /* Create the dialog. */
  $("#" + id).dialog({
                       modal: true,
                       buttons: buttons,
                       width: "90%"});

  /* Show the dialog. */
  $("#" + id).dialog('open');
  $("#" + id).dialog('widget').position({my:"center top", at:"center top", of:window})
  dialog_register("#"+id);
}

/**************************************************************************
  Create a button that orders a spy to try to sabotage an improvement.

  Needed because of JavaScript's scoping rules.
**************************************************************************/
function create_sabotage_impr_button(improvement, parent_id,
                                     actor_unit_id, target_city_id, act_id)
{
  /* Create the initial button with this tech */
  var button = {
    text : improvement['name'],
    click : function() {
      var packet = {
        "pid"          : packet_unit_do_action,
        "actor_id"     : actor_unit_id,
        "target_id"    : target_city_id,
        "extra_id"     : EXTRA_NONE,
        "value"        : encode_building_id(improvement['id']),
        "name"         : "",
        "action_type"  : act_id
      };
      send_request(JSON.stringify(packet));

      remove_active_dialog("#" + parent_id);
    }
  };

  /* The button is ready. */
  return button;
}

/**************************************************************************
  Select what improvement to sabotage when doing targeted sabotage city.
**************************************************************************/
function popup_sabotage_dialog(actor_unit, target_city, city_imprs, act_id)
{
  var id = "sabotage_impr_dialog_" + actor_unit['id'];
  var buttons = [];

            // Siege Ram used for Wall sabotage: highjack for better presentation****
            var battering_event = false;
            if (client_rules_flag[CRF_SIEGE_RAM] == true) {
              var punit = units[actor_unit['id']];
              var ptype = unit_type(punit);
              if (ptype['name'] == "Siege Ram") battering_event = true;
            } //**********************************************************************


  /* Reset dialog page. */
  remove_active_dialog("#" + id);
  $("<div id='" + id + "'></div>").appendTo("div#game_page");

  /* Set dialog title */
  $("#" + id).attr("title", "Pick Sabotage Target");

  /* List the alternatives */
  for (var i = -1; i < ruleset_control['num_impr_types']; i++) {
    var improvement;
    if (i >= 0) improvement = improvements[i];
    // "virtual improvement" id==-1, is the  code to sabotage production instead of building: 
    else {
      improvement = {"name": "Production", "id": -2, "sabotage": 100}; // code is -1 but encoding adds +=1.
    }

              // Battering Rams can only select City Walls *********************************
              if (battering_event) {
                if (improvement['name'] != "City Walls") continue;
                //We got here if we're at City Walls, see if it's present now:
                if (city_imprs.isSet(i) && improvement['sabotage'] > 0) {
                  // City walls present! No need to make a button: we know they'd press it.
                  // Instead, just automate what would happen if they did press the button:
                  var packet = {
                    "pid"          : packet_unit_do_action,
                    "actor_id"     : actor_unit['id'],
                    "target_id"    : target_city['id'],
                    "extra_id"     : EXTRA_NONE,
                    "value"        : encode_building_id(improvement['id']),
                    "name"         : "",
                    "action_type"  : act_id
                  };
                  send_request(JSON.stringify(packet));
                  
                  // We're done. Go home without making popup dialog.
                  return;
                }
              } //****************************************************************************

    if (i==-1 || // can always sabotage production.
       (city_imprs.isSet(i) && improvement['sabotage'] > 0)) {
      /* The building is in the city. The probability of successfully
       * sabotaging it as above zero. */
      buttons.push(create_sabotage_impr_button(improvement, id,
                                               actor_unit['id'],
                                               target_city['id'],
                                               act_id));
    }
  }
  if (battering_event) {
    swal("City has no City Walls.");
    return;
  }

  /* Allow the user to cancel. */
  buttons.push({
                 text : 'Cancel (W)',
                 click : function() {
                  remove_active_dialog("#"+id);
                 }
               });

  /* Create the dialog. */
  $("#" + id).dialog({
                       modal: true,
                       buttons: buttons,
                       width: "90%"});

  /* Show the dialog. */
  $("#" + id).dialog('open');
  $("#" + id).dialog('widget').position({my:"center top", at:"center top", of:window})
  dialog_register("#"+id);
}

/**************************************************************************
  Create a button that selects a target unit.

  Needed because of JavaScript's scoping rules.
**************************************************************************/
function create_select_tgt_unit_button(parent_id, actor_unit_id,
                                       target_tile_id, target_unit_id)
{
  var text = "";
  var target_unit = units[target_unit_id];
  var button = {};

  text += unit_types[target_unit['type']]['name'];

  if (get_unit_homecity_name(target_unit) != null) {
    text += " from " + get_unit_homecity_name(target_unit);
  }

  text += " (";
  text += nations[unit_owner(target_unit)['nation']]['adjective'];
  text += ")";

  button = {
    text  : text,
    click : function() {
      var packet = {
        "pid"            : packet_unit_get_actions,
        "actor_unit_id"  : actor_unit_id,
        "target_unit_id" : target_unit_id,
        "target_tile_id" : target_tile_id,
        "target_extra_id": EXTRA_NONE,
        "disturb_player" : true
      };
      send_request(JSON.stringify(packet));

      remove_active_dialog(parent_id);
    }
  };

  /* The button is ready. */
  return button;
}

/**************************************************************************
  Create a dialog where a unit select what other unit to act on.
**************************************************************************/
function select_tgt_unit(actor_unit, target_tile, potential_tgt_units)
{
  var i;

  var rid     = "sel_tgt_unit_dialog_" + actor_unit['id'];
  var id      = "#" + rid;
  var dhtml   = "";
  var buttons = [];

  /* Reset dialog page. */
  remove_active_dialog(id);
  $("<div id='" + rid + "'></div>").appendTo("div#game_page");

  dhtml += "Select target unit for your ";
  dhtml += unit_types[actor_unit['type']]['name'];

  $(id).html(dhtml);

  for (i = 0; i < potential_tgt_units.length; i++) {
    var tgt_unit = potential_tgt_units[i];

    buttons.push(create_select_tgt_unit_button(id, actor_unit['id'],
                                               target_tile['index'],
                                               tgt_unit['id']));
  }

  $(id).dialog({
      title    : "Target unit selection",
      bgiframe : true,
      modal    : true,
      buttons  : buttons });

  $(id).dialog('open');
  $(id).dialog('widget').position({my:"center top", at:"center top", of:window})
  dialog_register(id);
}

/**************************************************************************
  List potential extra targets at target_tile
**************************************************************************/
function list_potential_target_extras(act_unit, target_tile)
{
  var potential_targets = [];

  for (var i = 0; i < ruleset_control.num_extra_types; i++) {
    var pextra = extras[i];

    if (tile_has_extra(target_tile, pextra.id)) {
      /* This extra is at the tile. Can anything be done to it? */
      if (is_extra_removed_by(pextra, ERM_PILLAGE)
          && unit_can_do_action(act_unit, ACTION_PILLAGE)) {
        /* TODO: add more extra removal actions as they appear. */
        potential_targets.push(pextra);
      }
    } else {
      /* This extra isn't at the tile yet. Can it be created? */
      if (pextra.buildable
          && ((is_extra_caused_by(pextra, EC_IRRIGATION)
               && unit_can_do_action(act_unit, ACTION_IRRIGATE))
              || (is_extra_caused_by(pextra, EC_MINE)
                  && unit_can_do_action(act_unit, ACTION_MINE))
              || (is_extra_caused_by(pextra, EC_BASE)
                  && unit_can_do_action(act_unit, ACTION_BASE))
              || (is_extra_caused_by(pextra, EC_ROAD)
                  && unit_can_do_action(act_unit, ACTION_ROAD)))) {
        /* TODO: add more extra creation actions as they appear. */
        potential_targets.push(pextra);
      }
    }
  }

  return potential_targets;
}

/**************************************************************************
  Create a button that selects a target extra.
  Needed because of JavaScript's scoping rules.
**************************************************************************/
function create_select_tgt_extra_button(parent_id, actor_unit_id,
                                        target_unit_id,
                                        target_tile_id, target_extra_id)
{
  var text = "";
  var button = {};

  var target_tile = index_to_tile(target_tile_id);

  text += extras[target_extra_id]['name'];

  text += " (";
  if (tile_has_extra(target_tile, target_extra_id)) {
    if (extra_owner(target_tile) != null) {
      text += nations[extra_owner(target_tile)['nation']]['adjective'];
    } else {
      text += "target";
    }
  } else {
    text += "create";
  }
  text += ")";

  button = {
    text  : text,
    click : function() {
      var packet = {
        "pid"            : packet_unit_get_actions,
        "actor_unit_id"  : actor_unit_id,
        "target_unit_id" : target_unit_id,
        "target_tile_id" : target_tile_id,
        "target_extra_id": target_extra_id,
        "disturb_player" : true
      };
      send_request(JSON.stringify(packet));

      remove_active_dialog(parent_id);
    }
  };

  /* The button is ready. */
  return button;
}

/**************************************************************************
  Create a button that selects a transport to load on.
  Needed because of JavaScript's scoping rules.
**************************************************************************/
function create_load_transport_button(actor, ttile, tid, tmoves, tloaded, tcapacity,
                                      dialog_id, dialog_num, last_dialog)
{
  // Mark and disable button if transport is at full capacity:
  var disable = false;
  if (tloaded  >= tcapacity) {
    tloaded = " FULL";
    disable = true;
  } else tloaded = " L:"+tloaded;

  var moves_text = move_points_text(tmoves);
  if (moves_text == "-") {
  // "-" means it was NaN/unknown because foreign, which means it's an ally on same tile
    moves_text = " ALLY"
  } else {
    moves_text = " M:"+moves_text;
  }

  var title_text = get_unit_city_info(units[tid]);

  var load_button = {
    title : title_text,
    text  :     "T" + tid 
                + " " + unit_type(units[tid])['name'] +":"
                + moves_text
                + tloaded 
                + " C:" + tcapacity,
    disabled :  disable,
    click : function() {
      var packet = {
        "pid"              : packet_unit_load,
        "cargo_id"         : actor,
        "transporter_id"   : tid,
        "transporter_tile" : ttile
      };
      send_request(JSON.stringify(packet));
      // Loaded units don't ask orders later:
      remove_unit_id_from_waiting_list(actor['id']); 
      actor['done_moving'] = true;
      setTimeout(update_active_units_dialog, 600);

      // for very last dialog, click advances unit focus
      if (dialog_num==last_dialog) setTimeout(function() {advance_unit_focus(false)}, 700);

      remove_active_dialog(dialog_id);
    }
  }
  return load_button;
}
/**************************************************************************
  Create a dialog where a unit select what other unit to act on.
**************************************************************************/
function select_tgt_extra(actor_unit, target_unit,
                          target_tile, potential_tgt_extras)
{
  var i;

  var rid     = "sel_tgt_extra_dialog_" + actor_unit['id'];
  var id      = "#" + rid;
  var dhtml   = "";
  var buttons = [];

  /* Reset dialog page. */
  remove_active_dialog(id);
  $("<div id='" + rid + "'></div>").appendTo("div#game_page");

  dhtml += "Select target extra for your ";
  dhtml += unit_types[actor_unit['type']]['name'];

  $(id).html(dhtml);

  for (i = 0; i < potential_tgt_extras.length; i++) {
    var tgt_extra = potential_tgt_extras[i];

    buttons.push(create_select_tgt_extra_button(id, actor_unit['id'],
                                                target_unit == null ?
                                                  IDENTITY_NUMBER_ZERO :
                                                  target_unit['id'],
                                                target_tile['index'],
                                                tgt_extra['id']));
  }

  $(id).dialog({
      title    : "Target extra selection",
      bgiframe : true,
      modal    : true,
      buttons  : buttons });

  $(id).dialog('open');
  $(id).dialog('widget').position({my:"center top", at:"center top", of:window})
  dialog_register(id);
}

/**************************************************************************
 Registers a dialog as active, so that 'W' will close the most recent
 opened dialog (First In Last Out). Also binds the dialog close function
 to clean-up function remove_active_dialog(..)
**************************************************************************/
function dialog_register(id) {
  $(id).dialog('widget').keydown(dialog_key_listener);
  active_dialogs.push(id);
  //close, cancel, and [x]
  $(id).dialog({ 
      autoOpen: true
  }).bind('dialogclose', function(event, ui) { 
    remove_active_dialog(id);
  });
}
/**************************************************************************
  Create a close button (for multiple cascading dialogs)
  (such as multiple dialogs for multiple units each getting a dialog)
  Needed because of JavaScript's scoping rules.
**************************************************************************/
function create_a_close_button(parent_id)
{
  var close_button = {text: "Cancel (W)", click: function() {
      remove_active_dialog(parent_id)
  }};
  return close_button;
}
/**************************************************************************
  Called when dialog close-binding function is triggered from the dialog
  closing some other way than by hitting 'W'.
**************************************************************************/
function remove_active_dialog(id)
{
  const index = active_dialogs.indexOf(id);
  if (index > -1) {
    active_dialogs.splice(index, 1);
  }    
  $(id).remove();
}

/**************************************************************************
 Callback to handle keyboard events for simple dialogs.
**************************************************************************/
function dialog_key_listener(ev)
{
  var keyboard_key = String.fromCharCode(ev.keyCode).toUpperCase();
  var key_code = ev.keyCode;
  // Check if focus is in chat field, where these keyboard events are ignored.
  if ($('input:focus').length > 0 || !keyboard_input) return;
  if (C_S_RUNNING != client_state()) return;
  if (!active_dialogs) return;

  if (key_code==27) {
    ev.stopPropagation();
    return;
  }
  switch (keyboard_key) {
    case 'W': 
      if (active_dialogs.length) { 
        ev.stopPropagation();
        remove_active_dialog(active_dialogs.pop());
      }
      break;
  }
}
