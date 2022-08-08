
[spec]

; Format and options of this spec file: 
options = "+Freeciv-spec-Devel-2015-Mar-25"

[info]

;84 x 60 images give an extra 20 horizontal pixels and 12 vertical pixels for "oversize" images.

artists = "
    Bobomax
"

[file]
gfx = "amplio2/units_oversize"

[grid_main]

x_top_left = 1
y_top_left = 1
dx = 84
dy = 60
pixel_border = 1

tiles = { "row", "column", "tag"
  0,  0, "u.stealth_bomber_o"         ; Bobomax
  0,  1, "u.howitzer_o"               ; Bobomax
  0,  2, "u.ultra_heavy_bomber_o"     ; Bobomax
  0,  3, "u.jet_bomber_o"             ; Bobomax
  0,  4, "u.heavy_bomber_o"           ; Bobomax
  0,  5, "u.artillery_o"              ; Bobomax
  0,  6, "u.awacs_o"                  ; Bobomax
  0,  7, "u.spy_plane_o"              ; Bobomax
  0,  8, "u.wagon"                    ; Bobomax
  0,  9, "u.truck"                    ; Bobomax
  1,  0, "u.zeppelin"                 ; Bobomax
  1,  1, "u.founder_o"                ; Bobomax
  1,  2, "u.phalanx_o"                ; Bobomax
  1,  3, "u.pikemen_o"                ; Bobomax
  1,  4, "u.ballista_o"               ; Lexxie
  1,  5, "u.siege_tower_o"            ; Lexxie
  1,  6, "u.patriarch_o"              ; Lexxie
  1,  7, "u.trawler_o"                ; Lexxie
  1,  8, "u.turret_guns_o"            ; Lexxie
}
