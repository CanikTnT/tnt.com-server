/****************************************************************************
If including art on an instance with public access, abide by the below:

   1. Music and static or animated visual imagery ("Art") is presumed
      copyrighted by the author who created it.
   2. Only an original author can release a copyright to render Art as
      General Public License ("GPL".) Artistic content ("Material") does
      not become licensed as GPL unless submitted as GPL by its author or
      designated legal agent. 
   3. Including such Material in a repository for copy or download may be 
      a copyright and/or license violation if no other licensing was made
      operative. This includes copyrighted Material which would otherwise be
      permissibly represented/reproduced under Fair Use provisions or other
      licensing.
   4. Non-GPL Material may be accessed by a project ("Instance") under Fair
      Use, other licensing, and/or exemptions. In many cases, this Material
      may NOT be distributed in the public respository of said project. 
      Moreover, in such cases, non-GPL Material must be non-essential to the
      function of the Instance and established as external to the project.
      Other restrictions may be operative.
   5. An Instance may access legally available Material from external sources
      such as the Internet or user-supplied content. Such Material is by its
      nature not inclusive to the GPL unless released as such.
   6. Most information sources on GPL access of Material are incomplete
      or inaccurate. When accessing non-GPL content, independently supplied
      content, Creative Commons or other licensed content, or Fair Use content,
      it is strongly advised to retain qualified legal counsel on
      Intellectual Property law. 
   7. An AGPL Instance which accesses alternative licensed Material in most cases
      must operate with non-dependence on the aforementioned; that is, not be
      dependent upon that Material for it to perform any of its essential purposes,
      operations, functions, determinations, representations, or results.
   8. Mark all CC-BY-NC-ND or other dual-licensed Material separately from
      GPL Material lest it be presumed as GPL under the provisions of same,
      and accordingly, then conflict with the Material's original rights under
      copyright and/or other licensing arrangements or Fair Use exceptions.

The Freeciv-Web project cannot know the jurisdiction nor individual ownership
and/or sub-licensing of Art of any particular Instance of Freeciv-Web. Any
accessed Material partaken by individual Instances must be clearly separated
from the project and be non-essential to the function of the Instance. 
******************************************************************************/



/******************************************************************************
 Statement of dual-licensed content.

   July 2021. Contra Costa county, California, United States of America.
              Mittelfranken, Bayern, Bundesrepublik Deutschland (EU).

   freecivweb.org music selections are a combination of GPL in AGPL,
   Creative Commons, sub-licensed, and/or Fair Use Material under Section 107
   of the United States Copyright Act in intersectional abidance where
   applicable with Urheberrechtsgesetz, UrhG Bundesrepublik Deutschland
   and the supercession of EU Copyright Directive 93/98/EEC.
******************************************************************************/


/* The const declaration below represents external and non-essential Material
   to be accessed by an audio component within the project which runs in a
   separate thread as background music.
   
   The data keys are tags that the internal "DJ" uses to select the contnet
   you specify by tags. See music.js if you wish to modify or replace with your
   own DJ/tag system.

   You may modify the URL data below to reference your own external Material,
   the supplied GPL material internal to the project, or any other legally
   accessible external Material. */ 
   const music_list = { 
    "brk_style1": // european *
    [
      "breaks/british",  
      "breaks/byzantine",  
      "breaks/french",  
      "breaks/goth",  
      "breaks/italian",
      "breaks/magyar",  
      "breaks/portuguese",  
      "breaks/slav",  
      "breaks/spanish",  
      "breaks/teuton",  
      "breaks/viking",
      "breaks/ambientbreak1",
      "breaks/wardrumbreak",
      "breaks/Ascension",
      "breaks/FlowingRiverBreak",
      "breaks/BoysEye",
      "breaks/30secondbreak",
      "breaks/30secondbreak",
      "breaks/ColdWindBreak"
    ],
  "brk_style2": // classical *
    [
      "breaks/byzantine",
      "breaks/ambientbreak1",
      "breaks/italian",
      "breaks/teuton",
      "breaks/classicbreak",
      "breaks/SaluteMessala",
      "breaks/ShofarCall",
      "breaks/SaluteGratus",
      "breaks/Rowers",
      "breaks/victorybreak",
      "breaks/victory2",
      "breaks/SaluteArrius",
      "breaks/prisonbreak",
      "breaks/circusbreak",
      "breaks/circus2",
      "breaks/circus7",
      "breaks/wardrumbreak",
      "breaks/Ascension",
      "breaks/FlowingRiverBreak",
      "breaks/BoysEye",
      "breaks/30secondbreak",
      "breaks/30secondbreak",
      "breaks/ColdWindBreak"
    ],
  "brk_style3": // tropical *
    [
      "breaks/aztec",  
      "breaks/inca",  
      "breaks/ambientbreak1",
      "breaks/mayan",  
      "breaks/teuton",  
      "breaks/hun",  
      "breaks/mongol",
      "breaks/tropicalbreak",
      "breaks/tropicalbreak3",
      "breaks/tropicalbreak2",
      "breaks/wardrumbreak",
      "breaks/tropicaltribedrums",
      "breaks/dekadrum",
      "breaks/FlowingRiverBreak",
      "breaks/Ascension",
      "breaks/tropicalbreak4",
      "breaks/BoysEye",
      "breaks/30secondbreak",
      "breaks/30secondbreak",
      "breaks/ColdWindBreak"
    ],
  "brk_style4": // asian *
    [
      "breaks/burmese",  
      "breaks/chinese",  
      "breaks/ambientbreak1",
      "breaks/goth",  
      "breaks/hun",  
      "breaks/indian",  
      "breaks/japanese",
      "breaks/khmer",  
      "breaks/korean",  
      "breaks/malay",  
      "breaks/mongol",  
      "breaks/vietnamese",  
      "breaks/teuton",
      "breaks/wardrumbreak",
      "breaks/gong1",
      "breaks/gong2",
      "breaks/FlowingRiverBreak",
      "breaks/Ascension",
      "breaks/kotobreak",
      "breaks/BoysEye",
      "breaks/30secondbreak",
      "breaks/30secondbreak",
      "breaks/ColdWindBreak"
    ],
  "brk_style5": // babylonian *
    [
      "breaks/berber",  
      "breaks/byzantine",  
      "breaks/ambientbreak1",
      "breaks/ethiopian",  
      "breaks/indian",  
      "breaks/malian",  
      "breaks/persian",  
      "breaks/saracen",  
      "breaks/slav",  
      "breaks/spanish",  
      "breaks/teuton",  
      "breaks/Saladin_Middle_Intro",
      "breaks/wardrumbreak",
      "breaks/SitarSlide",
      "breaks/Ascension",
      "breaks/FlowingRiverBreak",
      "breaks/BoysEye",
      "breaks/30secondbreak",
      "breaks/30secondbreak",
      "breaks/ColdWindBreak",
      "middle/AlKadir"
    ],
  "brk_style6": // celtic *
    [
      "breaks/british", 
      "breaks/celt",  
      "breaks/ambientbreak1",
      "breaks/teuton",  
      "breaks/goth",  
      "breaks/hun",  
      "breaks/italian",  
      "breaks/magyar",  
      "breaks/viking",  
      "breaks/slav",
      "breaks/ShofarCall",
      "breaks/wardrumbreak",
      "breaks/celticdrum",
      "breaks/Ascension",
      "breaks/FlowingRiverBreak",
      "breaks/BoysEye",
      "breaks/30secondbreak",
      "breaks/30secondbreak",
      "breaks/ColdWindBreak"
    ],
    "tribal":
    [
      "ancient/AncientSoundtrack1",
      "ancient/AncientSoundtrack3",
      "ancient/AncientSoundtrack4",
      "ancient/music9",
      "ancient/Prophecy",
      "ancient/xMusic12",
      "ancient/xMusic14",
      "ancient/xMusic15",
      "ancient/scrolls",
      "ancient/SeaDragon",
      "ancient/WarDrums_Early",
      "ancient/Walrus",
      "tribal/anvildrumintro",
      "tribal/Touchee",
      "tribal/ArktauCove",
      "tribal/ArktauGeometry",
      "tribal/DreamGen",
      "tribal/Forever",
      "tribal/GrottoStrata",
      "tribal/LoveMagic",
      "tribal/LunaStrata",
      "tribal/Mica",
      "tribal/Mica",
      "tribal/Iguana",
      "tribal/CeremonyStrata",
      "tribal/EchoSmall",
      "tribal/SilkRidgeRoach",
      "tribal/RichMoss",
      "tribal/Paleo1",
      "tribal/Paleo2",
      "tribal/Paleo3",
      "tribal/Paleo4",
      "tribal/Paleo5",
      "tribal/Paleowolf",
      "tribal/Neolithic", 
      "tribal/AiwuDrums",
      "tribal/Mammoth",
      "tribal/Chant2",
      "tribal/OldEarth",
      "tribal/MoonChant",
      "tribal/Homeworld",
      "tribal/Fella",
      "tribal/Etmn",
      "tribal/DoruTree",
      "tribal/AncientCall",
      "tribal/TribalAwakening",
      "tribal/Humani",
      "tribal/Origins",
      "tribal/Echolalia",
      "tribal/MotherTongue",
      "tribal/MossCarpetSkyBlanket",
      "tribal/ProfligateEarth",
      "tribal/Raku",
      "tribal/VoiceOfRust",
      "tribal/SoftRainsFall",
      "tribal/Transpiration",
      "tribal/CorvidCollections",
      "tribal/AerialOnWarmSeas",
      "tribal/NeverHunger",
      "tribal/WhatWeLeftBehind",
      "tribal/SeekingEden",
      "tribal/TheGateIsOpen",
      "tribal/UndulatingTerrain",
      "tribal/Artifacts",
      "tribal/ClayWoodBoneDirt",
      "tribal/InTheEyesOfTheSpirit",
      "tribal/TheFaceInTheFire",
      "tribal/Hunter",
      "tribal/ErodingColumns",
      "tribal/FlowStone",
      "tribal/SuonoIpogeo",
      "tribal/UnderwaterFields",
      "tribal/EtherealAbyss"
    ],
  "ancient":
    [
      "tribal/anvildrumintro",
      "tribal/Foreigner",
      "ancient/Intro1",
      "ancient/Intro3",
      "ancient/lost",
      "ancient/music1",
      "ancient/music3",
      "ancient/music4",
      "ancient/music5",
      "ancient/music6",
      "ancient/music7",
      "ancient/music8",
      "ancient/music9",
      "ancient/won",
      "ancient/xlost",
      "ancient/xlost2",
      "ancient/xlost3",
      "ancient/xmusic2",
      "ancient/xmusic3",
      "ancient/xmusic4",
      "ancient/xmusic5",
      "ancient/xmusic6",
      "ancient/xmusic7",
      "ancient/xmusic8",
      "ancient/xmusic9",
      "ancient/xmusic10",
      "ancient/xMusic11",
      "ancient/xMusic12",
      "ancient/xMusic13",
      "ancient/xMusic14",
      "ancient/xMusic15",
      "ancient/xwon",
      "ancient/xwon2",
      "ancient/scrolls",
      "ancient/SeaDragon",
      "ancient/xwon3",
      "ancient/WarDrums_Early",
      "ancient/Prophecy",
      "ancient/AncientSoundtrack1",
      "ancient/AncientSoundtrack3",
      "ancient/AncientSoundtrack4",
      "ancient/TowerOfSet",
      "ancient/Hovern",
      "ancient/Walrus",
      "ancient/Attila",
      "ancient/Otrodinn",
      "ancient/PaleoWarrior",
      "ancient/DrakkarDrums",
      "ancient/Torment",
      "ancient/Animus",
      "ancient/Vigridr",
      "ancient/Carthage2",
      "ancient/Cavelion",
      "ancient/Helj",
      "ancient/Gripir",
      "ancient/Awakening",
      "ancient/DudukLove",
      "ancient/Artemis",
      "ancient/Nyx",
      "ancient/Hera",
      "ancient/Athena",
      "ancient/Hypnos",
      "ancient/Demeter",
      "ancient/Hades",
      "ancient/Persephone",
      "ancient/Marathon",
      "ancient/HouseHur",
      "ancient/EnterJerusalem",
      "ancient/ArriusParty",
      "ancient/Orgy",
      "ancient/Hector",
      "ancient/Sakura",
      "ancient/TombHorus",
      "ancient/TombOsiris",
      "ancient/TombIsis",
      "ancient/TombAnubis",
      "ancient/SongOfSophia",
      "ancient/RebirthsPortalUnveiled",
      "ancient/Saraghaz",
      "ancient/BeamOfSunlight",
      "ancient/Bija",
      "ancient/EnteringIntimateFragranceOfBeatitude",
      "ancient/IntroDiAde",
      "ancient/RoadToWirikuta"
    ],
  "middle":
    [
      "middle/battle-epic",               // GPL in AGPL
      "middle/AllegriMiserere",
      "middle/AnonymousAySantaMaria",
      "middle/AnonymousLaGamba",
      "middle/ChantLaudate",
      "middle/DeLaTorreAlta",
      "middle/OrtizRecercada",
      "middle/Illusion",
      "middle/PraetoriusBallet",
      "middle/PraetoriusBransle",
      "middle/PraetoriusVolte",
      "middle/lost",
      "middle/FuryGift",
      "middle/Palace2",
      "middle/lost_x2",
      "middle/town",
      "middle/Friendship",
      "middle/Kitchen",
      "middle/Dagoth",
      "middle/Theology",
      "middle/won2_x2",
      "middle/AlKadir",
      "middle/xmusic13",
      "middle/WeddingSupper",
      "middle/Poseidon",
      "middle/xmusic18",
      "middle/xmusic23",
      "middle/xtown",
      "middle/PalaceMusic",
      "middle/Alexander_Early",
      "middle/TheCourt",
      "middle/Alexander_Middle",
      "middle/Asoka_Late_Intro",
      "middle/Asoka_Late_Lp",
      "middle/Catherine_Early",
      "middle/WarDrums_Middle",
      "middle/FrogGalliard",
      "middle/Lohengrin",
      "middle/Steppes",
      "middle/Worldes",
      "middle/HeveneQuene",
      "middle/Bryd",
      "middle/Wyst",
      "middle/Soys",
      "middle/Aravot",
      "middle/LonelyRoad",
      "middle/OldEngland",
      "middle/Goelette",
      "middle/RingForFreedom",
      "middle/MountSermon",
      "middle/OrgyGuitar",
      "middle/BurningPast",
      "middle/EchoingWoods",
      "middle/WhisperingOaks",
      "middle/ForestWaltz",
      "middle/Innkeeper",
      "middle/PreludeLute",
      "middle/LuysDeMilan",
      "middle/CastleDance",
      "middle/Celebration1",
      "middle/Celebration2",
      "middle/Cobblestone",
      "middle/Harpy",
      "middle/Lute1",
      "middle/Lute2",
      "middle/Lute3",
      "middle/Lute4",
      "middle/Lute5",
      "middle/Mandolins",
      "middle/Minstrel",
      "middle/NightElf",
      "middle/OldTree",
      "middle/Summertide",
      "middle/TimberTown",
      "middle/RaptureRecall",
      "middle/Promentory",
      "middle/SpanishDance2",
      "middle/TearsOfMuses"
    ],
  "colonial":
    [
      "colonial/Washington_Middle",
      "colonial/DeliusAppalachia",
      "colonial/Khachaturian",
      "colonial/ColonialSong",
      "colonial/Swallowtail",
      "colonial/OldFiddleTune",
      "colonial/FortColonial",
      "colonial/FolkSuiteVW",
      "colonial/Andantino",
      "colonial/Omaha",
      "colonial/BlueWhale",
      "colonial/MarcelloAdagio",
      "colonial/RomanceVW",
      "colonial/Nimrod",
      "colonial/Brooks",
      "colonial/UnknownFuture",
      "colonial/Theology2",
      "colonial/WingAndAPrayer",
      "colonial/Sarabande",
      "colonial/Sarabande2",
      "colonial/Gigue",
      "colonial/PreludeTheorbo",
      "colonial/Fantasie",
      "colonial/Canarios",
      "colonial/Jotta",
      "colonial/SerenadeVW",
      "colonial/BingeSailing",
      "colonial/BingeWatermill",
      "colonial/DarkeFantasy",
      "colonial/Draught",
      "colonial/DrunkQ",
      "colonial/GreenWillow",
      "colonial/HaydnQ1-3",
      "colonial/HaydnQ59-2",
      "colonial/RhosyVW",
      "colonial/ThymeVW",
      "colonial/LoveRemembered",
      "middle/RingForFreedom",
      "middle/EchoingWoods",
      "industrial/into_the_shadows",      // GPL in AGPL
      "industrial/DvorakAmerican1",
      "industrial/Clownfish",
      "industrial/ManOfWar",
      "industrial/OceanDeep",
      "industrial/WarDrums_Late",
      "industrial/SibeliusKarelia",
      "industrial/Albatross",
      "industrial/Ducks",
      "industrial/NightWindow",
      "industrial/Coronation",
      "industrial/Esther",
      "industrial/Judea",
      "industrial/Eventide",
      "colonial/LaCatedral2",
      "colonial/HesAPriate",
      "colonial/HighlandSpirit",
      "colonial/HiddenFalls",
      "colonial/SongOfTimeAndStorms",
      "colonial/Wilderness",
      "colonial/Brothers",
      "colonial/YradierLaPaloma",
      "colonial/ChoroDaSaudade",
      "colonial/LegendaryGuardian",
      "colonial/lArpeggiata",
      "colonial/Elegie"
    ],
  "industrial":
    [
      "colonial/SerenadeVW",
      "colonial/DarkeFantasy",
      "industrial/into_the_shadows",      // GPL in AGPL
      "industrial/DvorakAmerican1",
      "industrial/Brahms32",
      "industrial/Brahms33",
      "industrial/Beethoven52",
      "industrial/Clownfish",
      "industrial/ManOfWar",
      "industrial/Beethoven62",
      "industrial/OceanDeep",
      "industrial/RimskyScheherazade3",
      "industrial/WarDrums_Late",
      "industrial/SibeliusKarelia",
      "industrial/BeforeTheConflict",
      "industrial/Albatross",
      "industrial/Ducks",
      "industrial/Saturn",
      "industrial/Venus",
      "industrial/BluePlanet",
      "industrial/NightWindow",
      "industrial/Coronation",
      "industrial/Esther",
      "industrial/Judea",
      "industrial/ReturnPromise",
      "industrial/Cronos",
      "industrial/Eventide",
      "industrial/ShropshireLad",
      "industrial/49thParallelVW",
      "industrial/AmericanInParis",
      "industrial/Antarctica1VW",
      "industrial/Antarctica3VW",
      "industrial/Chiron",
      "industrial/Clockwork",
      "industrial/FenCountryVW",
      "industrial/Hiraeth",
      "industrial/IntroitFinzi",
      "industrial/Libertalia",
      "industrial/Mahler11",
      "industrial/Mahler13",
      "industrial/Mahler21",
      "industrial/Mahler22",
      "industrial/Nightfall",
      "industrial/SolentVW",
      "industrial/Tallis1VW",
      "industrial/Tallis2VW",
      "industrial/GenerosityOfSolitude1",
      "industrial/NorthCountrySketchesWinter",
      "industrial/NorthCountrySketches3",
      "industrial/NorthCountrySketches1"
    ],
  "modern":
    [
      "tribal/ArktauCove",
      "tribal/ArktauGeometry",
      "tribal/Foreigner",
      "tribal/Touchee",
      "tribal/Origins",
      "tribal/GrottoStrata",
      "tribal/Forever",
      "tribal/Iguana",
      "tribal/CeremonyStrata",
      "tribal/Mammoth",
      "tribal/LunaStrata",
      "tribal/UnderwaterFields",
      "ancient/SeaDragon",
      "modern/Stellar",
      "modern/Chevaliers",
      "modern/Aurora",
      "modern/elvish-theme",                // GPL in AGPL
      "modern/Neptune",
      "modern/Kobudai",
      "modern/Scavenger",
      "modern/AnfortasWound",
      "modern/FTheme",
      "modern/Remember",
      "modern/Forest",
      "modern/ChristianZeal",
      "modern/DragonHome",
      "modern/Abyssal",
      "modern/Squid",
      "modern/SibeliusSwan",
      "modern/CommonTones",
      "modern/Souls",
      "modern/Lagoon",
      "modern/HymingSlews",
      "modern/Caution",
      "modern/DarkMother",
      "modern/Reminiscence",
      "modern/Nostalgia",
      "modern/Homecoming",
      "modern/MemoriesHatred",
      "modern/Aftermath",
      "modern/Lepers",
      "modern/RoadSorrow",
      "modern/ValleyDead",
      "modern/Procession",
      "modern/Oracle",
      "modern/Nightbird",
      "modern/Bryce",
      "modern/2049",
      "modern/ScienceMedicine",
      "modern/Wallace",
      "modern/Someone",
      "modern/Rain",
      "modern/Orphanage",
      "modern/Memory",
      "modern/Furnace",
      "modern/Flight",
      "modern/Earthbound",
      "modern/Afterprints",
      "modern/AllWay",
      "modern/Ares",
      "modern/Argonaut",
      "modern/Arkhmar",
      "modern/BehindClouds",
      "modern/Canyon",
      "modern/Cirrus",
      "modern/Distance",
      "modern/Divus",
      "modern/DreamRiver",
      "modern/DrumTrack",
      "modern/EmptyMass",
      "modern/EndRiver",
      "modern/Eon",
      "modern/FearlessStrata",
      "modern/ForgottenMagic",
      "modern/FuturePresent",
      "modern/GazingPool",
      "modern/GlowLight",
      "modern/Herald",
      "modern/Imperatrix",
      "modern/Infinite",
      "modern/Magma",
      "modern/Meraki",
      "modern/Microns",
      "modern/Mosaic4",
      "modern/Mountain",
      "modern/Nephalim",
      "modern/NewDimension",
      "modern/Nightscape",
      "modern/Nomads",
      "modern/ParallelLines",
      "modern/Passage2",
      "modern/Passage3",
      "modern/Passage4",
      "modern/PersistenceStrata",
      "modern/RavelPeak",
      "modern/Recurrence",
      "modern/ShadowLight",
      "modern/Shadows",
      "modern/Smoke",
      "modern/Solitary",
      "modern/Surrender",
      "modern/Terrain",
      "modern/TheDream",
      "modern/Umbra",
      "modern/Unreachable",
      "modern/Vapor",
      "modern/Venture2",
      "modern/Viewpoint",
      "modern/WayAhead1",
      "modern/Soul2",
      "modern/Cigar",
      "modern/DeadGirls",
      "modern/Deal",
      "modern/Foolish",
      "modern/Hands",
      "modern/HeartOffense",
      "modern/Mauvais",
      "modern/ScaredDark",
      "modern/TwoRun",
      "modern/Rhizome",
      "modern/AfterUs",
      "modern/MeetingFaceToFace",
      "modern/GlassMishimaQuartet",
      "modern/MemoriesOfWandering2",
      "modern/MemoriesOfHome",
      "modern/Erinacea",
      "modern/Flatlands",
      "modern/OutOfSource",
      "modern/DistantTraveler"
    ]
  };
  