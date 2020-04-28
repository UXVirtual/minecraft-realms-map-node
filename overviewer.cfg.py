import os

# Custom Render Modes 
#   "Note the lack of quotes". From http://docs.overviewer.org/en/latest/config/

# End tweak as recommended on config page "urn down the strength of the shadows, as you’d otherwise end up with a very dark result."
#   smooth_lighting = [Base(), EdgeLines(), SmoothLighting()]
end_smooth_lighting = [Base(), EdgeLines()]

# Removing the nether ceiling based on original render mode. Can be carved further if we have a L5 or L60 trnsit system. NoBase might be more appropriete later.
# nether_smooth_lighting =       [Base(), EdgeLines(), Nether(), SmoothLighting()]
nether_smooth_lighting_bottom  = [Base(), EdgeLines(), Nether(), Depth(max=126)]
nether_smooth_lighting_ceiling = [Base(), EdgeLines(), Nether(), Depth(min=126)]



def filterByProfession(poi, profession):
    if (poi['id'] != 'minecraft:villager'):
        return False
    profession2 = poi['VillagerData']['profession'].replace('minecraft:', '')
    if profession2 != profession:
        return False

    return True


def villagerData(poi):
    #print(repr(poi))
    profession = poi['VillagerData']['profession'].replace('minecraft:', '')
    tradeText = ''

    if 'Offers' in poi:
        # Check villager has offers
        recipes = poi['Offers']['Recipes']

        i = 0
        tradeText += '<ul>'
        while i < len(recipes):
            tradeA = recipes[i]['sell']
            tradeB = recipes[i]['buy']
            tradeText += '<li>Offer ' + str(i+1) + ': ' + tradeA['id'].replace('minecraft:', '') + '(' + str(
                tradeA['Count']) + ')' + ' for ' + tradeB['id'].replace('minecraft:', '') + '(' + str(tradeB['Count']) + ')' + '</li>'
            i += 1
        tradeText += '</ul>'
    if profession == 'none':
        shortText = 'Villager'
        text = '<p>Villager (unemployed)</p>' + tradeText
    else:
        shortText = profession
        text = '<p>Villager (' + profession + ')</p>' + tradeText
    
    return (shortText, text)


def villagerArmorerFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'armorer')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerButcherFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'butcher')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerCartographerFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'cartographer')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerClericFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'cleric')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerFarmerFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'farmer')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerFishermanFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'fisherman')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerFletcherFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'fletcher')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerLeatherworkerFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'leatherworker')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerLibrarianFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'librarian')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerMasonFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'mason')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerNitwitFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'nitwit')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerNoneFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'none')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerShepherdFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'shepherd')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerToolsmithFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'toolsmith')
    if (filterResult == False):
        return
    return villagerData(poi)


def villagerWeaponsmithFilter(poi):
    global filterByProfession
    global villagerData

    filterResult = filterByProfession(poi, 'weaponsmith')
    if (filterResult == False):
        return
    return villagerData(poi)


def townFilter(poi):
    if poi['id'] == 'Town':
        return poi['name']


worlds["Moria"] = os.environ['IN_DIR']
world = "Moria"
outputdir = os.environ['OUT_DIR']
texturepath = os.environ['TEXTURE_PATH']
renders["Overworld"] = {
    "title": "Overworld",
    "rendermode": "smooth_lighting",
    "dimension": "overworld",
    "world": "Moria",
    "minzoom": 14,
    'manualpois': [
        {'id': 'Town',
             'x': 0,
             'y': 64,
             'z': 0,
         'name': "Mooshroom Island"},
        {'id': 'Town',
             'x': 1750,
             'y': 64,
             'z': -1950,
         'name': "Cy's End Portal"},
         {'id': 'Town',
             'x': 22,
             'y': 64,
             'z': -4527,
         'name': "CrimsonEbony's Town"},
         {'id': 'Town',
             'x': -1430,
             'y': 64,
             'z': 760,
         'name': "TheSocrates Forest Town"},
         {'id': 'Town',
             'x': 3288,
             'y': 64,
             'z': -1967,
         'name': "generrosity's Town"},
         {'id': 'Town',
             'x': 100,
             'y': 64,
             'z': -3400,
         'name': "cy-bob's Desert Town"},
         {'id': 'Town',
             'x': 1136,
             'y': 64,
             'z': -2668,
         'name': "darkling's Base"},
         {'id': 'Town',
             'x': -6200,
             'y': 64,
             'z': 4200,
         'name': "Jaxak's Base"},
         {'id': 'Town',
             'x': 4400,
             'y': 64,
             'z': -2200,
         'name': "Verona's Town"},
         {'id': 'Town',
             'x': 770,
             'y': 64,
             'z': 880,
         'name': "smallpooka's Desert Town"},
         {'id': 'Town',
             'x': -615,
             'y': 64,
             'z': 133,
         'name': "generic_mine's Base"},
         {'id': 'Town',
             'x': 770,
             'y': 64,
             'z': -5530,
         'name': "punkhole's Base"}
    ],
    'markers': [
        dict(name="Towns", filterFunction=townFilter,
             icon="icons/marker_town.png", checked=True),
        dict(name="Villagers - Armorer",
             filterFunction=villagerArmorerFilter,
             icon="icons/marker_profession_armorer.png"),
        dict(name="Villagers - Butcher",
             filterFunction=villagerButcherFilter,
             icon="icons/marker_profession_butcher.png"),
        dict(name="Villagers - Cartographer",
             filterFunction=villagerCartographerFilter,
             icon="icons/marker_profession_cartographer.png"),
        dict(name="Villagers - Cleric",
             filterFunction=villagerClericFilter,
             icon="icons/marker_profession_cleric.png"),
        dict(name="Villagers - Farmer",
             filterFunction=villagerFarmerFilter,
             icon="icons/marker_profession_farmer.png"),
        dict(name="Villagers - Fisherman",
             filterFunction=villagerFishermanFilter,
             icon="icons/marker_profession_fisherman.png"),
        dict(name="Villagers - Fletcher",
             filterFunction=villagerFletcherFilter,
             icon="icons/marker_profession_fletcher.png"),
        dict(name="Villagers - Leatherworker",
             filterFunction=villagerLeatherworkerFilter,
             icon="icons/marker_profession_leatherworker.png"),
        dict(name="Villagers - Librarian",
             filterFunction=villagerLibrarianFilter,
             icon="icons/marker_profession_librarian.png"),
        dict(name="Villagers - Mason",
             filterFunction=villagerMasonFilter,
             icon="icons/marker_profession_mason.png"),
        dict(name="Villagers - Nitwit",
             filterFunction=villagerNitwitFilter,
             icon="icons/marker_profession_nitwit.png"),
        dict(name="Villagers - Unemployed",
             filterFunction=villagerNoneFilter,
             icon="icons/marker_profession_none.png"),
        dict(name="Villagers - Shepherd",
             filterFunction=villagerShepherdFilter,
             icon="icons/marker_profession_shepherd.png"),
        dict(name="Villagers - Toolsmith",
             filterFunction=villagerToolsmithFilter,
             icon="icons/marker_profession_toolsmith.png"),
        dict(name="Villagers - Weaponsmith",
             filterFunction=villagerWeaponsmithFilter,
             icon="icons/marker_profession_weaponsmith.png")
    ],
}
renders["Woria"] = {
    "title": "Woria (Nether)",
    "rendermode": nether_smooth_lighting_bottom,
    "dimension": "nether",
    "world": "Moria",
    "minzoom": 16
}
renders["WoriaCeiling"] = {
    "title": "Woria Ceiling",
    "rendermode": nether_smooth_lighting_ceiling,
    "dimension": "nether",
    "world": "Moria",
    "minzoom": 16,
    "overlay": ['Woria']
}
renders["End"] = {
    "title": "The End",
    "rendermode": end_smooth_lighting,
    "dimension": "end",
    "world": "Moria",
    "minzoom": 16
}
