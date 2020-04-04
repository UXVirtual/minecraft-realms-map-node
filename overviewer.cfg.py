import os

def filterByProfession(poi, profession):
    if (poi['id'] != 'minecraft:villager'):
        return False
    profession2 = poi['VillagerData']['profession'].replace('minecraft:', '')
    if profession2 != profession:
        return False

    return True


def villagerData(poi):
    #print repr(poi)
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
    "minzoom": 16,
    'manualpois': [
        {'id': 'Town',
             'x': 0,
             'y': 64,
             'z': 0,
         'name': "Test town"}
    ],
    'markers': [
        dict(name="Towns", filterFunction=townFilter,
             icon="icons/marker_town.png"),
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
renders["Caves"] = {
    "title": "Caves",
    "dimension": "overworld",
    "rendermode": "cave",
    "world": "Moria",
    "minzoom": 16
}
renders["Woria"] = {
    "title": "Woria (Nether)",
    "rendermode": "nether",
    "dimension": "nether",
    "world": "Moria",
    "minzoom": 16
}
renders["End"] = {
    "title": "The End",
    "rendermode": "smooth_lighting",
    "dimension": "end",
    "world": "Moria",
    "minzoom": 16
}
