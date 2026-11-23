"""Daily Ten draft pack 001: the editorial data. Source of truth for docs/pack/*.

Years are astronomical integers (1 BCE = 0, 2 BCE = -1). Display labels never show a year zero.
Dating convention for every clue: true on 31 December of the target year (D-009).
Verification levels (D-011): V0 unverified, V1 one source page opened by the editor, V2 two independent
pages opened, V3 reviewed by a named human. The agent sets V0 to V2 only.

Only facts the editor opened or saw quoted are recorded. Anything else is marked HOLD.
"""

RETRIEVED = "2026-11-23"

# ---------------------------------------------------------------------------------------------------------
# Sources. opened=True means the editor opened and read the page in this stage.
# ---------------------------------------------------------------------------------------------------------
def wp(slug, title, note=""):
    return dict(id="wp-" + slug.lower(), title=title + " (Wikipedia)", publisher="Wikimedia Foundation",
                url="https://en.wikipedia.org/wiki/" + slug, kind="encyclopedia", opened=True, retrieved=RETRIEVED, note=note)


SOURCES = [
    wp("Concorde", "Concorde", "Infobox 'First flight 2 March 1969', 'Introduction date 21 January 1976'; section on 001 and André Turcat."),
    wp("Boeing_737", "Boeing 737", "Infobox: first flight April 9, 1967; introduction February 10, 1968."),
    wp("Boeing_747", "Boeing 747", "Infobox: first flight February 9, 1969; introduction January 22, 1970 with Pan Am."),
    wp("Apollo_8", "Apollo 8", "Launch December 21, 1968; landing date December 27, 1968."),
    wp("Women%27s_suffrage_in_New_Zealand", "Women's suffrage in New Zealand", "Royal assent 19 September 1893; first vote 28 November 1893; petitions 1891, 1892, 1893."),
    wp("Eiffel_Tower", "Eiffel Tower", "Infobox: completed 31 March 1889."),
    wp("Lumi%C3%A8re_brothers", "Lumière brothers", "First paid public screening 28 December 1895."),
    wp("World%27s_Columbian_Exposition", "World's Columbian Exposition", "Opening May 1, 1893; closure October 30, 1893."),
    wp("Andr%C3%A9s_de_Urdaneta", "Andrés de Urdaneta", "Fleet sailed from La Navidad November 21, 1564; left Cebu 1 June 1565; reached Acapulco on 8 October 1565."),
    wp("Miguel_L%C3%B3pez_de_Legazpi", "Miguel López de Legazpi", "Capital moved to Manila in 1571; died 20 August 1572."),
    wp("Manila_galleon", "Manila galleon", "Route 'From 1565 to 1815'; inaugurated 1565 after Urdaneta pioneered the tornaviaje."),
    wp("Mercator_1569_world_map", "Mercator 1569 world map", "Map dated 1569."),
    wp("Armistice_of_11_November_1918", "Armistice of 11 November 1918", "Title and lead."),
    wp("Beer_Hall_Putsch", "Beer Hall Putsch", "Date 8-9 November 1923."),
    wp("Treaty_of_Versailles", "Treaty of Versailles", "Signed 28 June 1919."),
    wp("Magnus_Hirschfeld", "Magnus Hirschfeld", "Institute opened 6 July 1919; film premiered May 1919; beaten by völkisch activists in 1920; 1933 looting and book burning."),
    wp("Institut_f%C3%BCr_Sexualwissenschaft", "Institut für Sexualwissenschaft", "Established July 6, 1919; founders Hirschfeld, Kronfeld, Wertheim; confiscations 6 May 1933."),
    wp("Rosetta_Stone", "Rosetta Stone", "Decree of 196 BC; found July 1799 by Pierre-François Bouchard; Greek translation 1803; Champollion 1822."),
    wp("French_campaign_in_Egypt_and_Syria", "French invasion of Egypt and Syria", "Date 28 June 1798 - 2 September 1801; Napoleon in command till 23 August 1799."),
    wp("Battle_of_the_Nile", "Battle of the Nile", "Date 1-3 August 1798."),
    wp("Battle_of_Marengo", "Battle of Marengo", "Date 14 June 1800."),
    wp("Ali_Maow_Maalin", "Ali Maow Maalin", "Last person known infected with naturally occurring Variola minor; diagnosed October 1977."),
    wp("Rahima_Banu", "Rahima Banu", "Last known naturally occurring Variola major case, reported 16 October 1975."),
    wp("Janet_Parker", "Janet Parker and the 1978 smallpox outbreak in the United Kingdom", "Laboratory-acquired outbreak in 1978; last recorded smallpox death."),
    wp("Viking_1", "Viking 1", "Lander touched down on Mars July 20, 1976."),
    wp("Star_Wars_(film)", "Star Wars (film)", "Release date May 25, 1977."),
    wp("Ibn_Battuta", "Ibn Battuta", "'On 2 Rajab 725 AH (14 June 1325 AD), Ibn Battuta set off from his home town at the age of 21'."),
    wp("Marco_Polo", "Marco Polo", "Died 8 January 1324."),
    wp("Mansa_Musa", "Mansa Musa", "'Musa went on Hajj to Mecca in 1324'; spent time in Cairo."),
    wp("Edward_II_of_England", "Edward II of England", "Reign ended 21 January 1327; Isabella invaded England in 1326."),
    wp("Tenochtitlan", "Tenochtitlan", "Foundation 1325; infobox 'Unclear date, declared 13 March 1325'."),
    wp("Hunminjeongeum", "Hunminjeongeum", "Published around October 1446 (9th lunar month); alphabet introduced 12th month of 1443 (30 Dec 1443 - 28 Jan 1444)."),
    wp("Cheugugi", "Ch'ŭgugi (rain gauge)", "Invented August 1441 (lunar); standardised 1442."),
    wp("Yongbi_eocheonga", "Yongbiŏch'ŏn'ga", "'The book was published in 1447'; first work written in Hangul."),
    wp("Sejong_the_Great", "Sejong the Great", "Reigned 1418 to his death on April 8, 1450."),
    wp("Battle_of_Varna", "Battle of Varna", "Date November 10, 1444."),
    wp("Han_dynasty", "Han dynasty", "'The first nationwide census in Chinese history was taken in 2 AD ... 57,671,400 individuals across 12,366,470 households.'"),
    wp("Emperor_Ping_of_Han", "Emperor Ping of Han", "Reign 17 October 1 BC to 3 February 6 AD; era Yuanshi 1-5 AD."),
    wp("Voyager_1", "Voyager 1", "Launch September 5, 1977; Jupiter closest approach March 5, 1979."),
    wp("Voyager_2", "Voyager 2", "Launch August 20, 1977."),
    dict(id="who-smallpox", title="History of smallpox vaccination", publisher="World Health Organization", kind="institutional", opened=True,
         url="https://www.who.int/news-room/spotlight/history-of-vaccination/history-of-smallpox-vaccination", retrieved=RETRIEVED,
         note="'smallpox was eliminated from South America in 1971, Asia in 1975 and Africa in 1977 ... In 1980, WHO declared smallpox officially eradicated'."),
    dict(id="cdc-smallpox", title="About smallpox", publisher="US Centers for Disease Control and Prevention", kind="institutional", opened=True,
         url="https://www.cdc.gov/smallpox/about/index.html", retrieved=RETRIEVED, note="'Smallpox has been eradicated, with no cases occurring since 1977.'"),
    dict(id="nasa-voyager", title="Voyager", publisher="NASA Science", kind="institutional", opened=True,
         url="https://science.nasa.gov/mission/voyager/", retrieved=RETRIEVED, note="Mission page: 'LAUNCH 1977'."),
    # Seen quoted in search summaries only, NOT opened (blocked by bot protection). Used for corroboration, never as V1.
    dict(id="q-airbus-concorde", title="The day Concorde flew into the history books", publisher="Airbus", kind="institutional", opened=False,
         url="https://www.airbus.com/en/newsroom/stories/2019-03-the-day-concorde-flew-into-the-history-books", retrieved=RETRIEVED, note="Quoted in search summary: takeoff 2 March 1969."),
    dict(id="q-museeairespace", title="BAC-Sud Aviation Concorde prototype 001 F-WTSS", publisher="Musée de l'Air et de l'Espace", kind="institutional", opened=False,
         url="https://museeairespace.fr/en/collections/bac-sud-aviation-concorde-prototype-001-f-wtss", retrieved=RETRIEVED, note="Blocked (403). Search summary only."),
    dict(id="q-nzhistory", title="Women's suffrage: how New Zealand voted first", publisher="NZHistory (Ministry for Culture and Heritage)", kind="institutional", opened=False,
         url="https://nzhistory.govt.nz/politics/womens-suffrage", retrieved=RETRIEVED, note="Blocked (403). Search summary: assent 19 Sept 1893, vote 28 Nov 1893, 'first self-governing country'."),
    dict(id="q-ushmm", title="Magnus Hirschfeld", publisher="US Holocaust Memorial Museum, Holocaust Encyclopedia", kind="institutional", opened=False,
         url="https://encyclopedia.ushmm.org/content/en/article/magnus-hirschfeld-2", retrieved=RETRIEVED, note="Connection failed. Search summary: May 1933 looting; does not give the 1919 opening date."),
    dict(id="q-britannica-rosetta", title="Rosetta Stone", publisher="Encyclopaedia Britannica", kind="encyclopedia", opened=False,
         url="https://www.britannica.com/print/article/509988", retrieved=RETRIEVED, note="Blocked. Search summary gives August 1799, an outlier against July in other sources."),
    dict(id="q-unesco-hunmin", title="Hunminjeongum Manuscript (nomination)", publisher="UNESCO Memory of the World", kind="institutional", opened=False,
         url="https://en.unesco.org/silkroad/silk-road-themes/documentary-heritage/hunminjeongum-manuscript", retrieved=RETRIEVED, note="Not opened. Search summary: published in the ninth lunar month of 1446 (9 October 1446)."),
    dict(id="q-aramco-battuta", title="The longest hajj: the journeys of Ibn Battuta", publisher="Aramco World", kind="news", opened=False,
         url="https://www.aramcoworld.com/en/articles/2000/the-longest-hajj-the-journeys-of-ibn-battuta-intro", retrieved=RETRIEVED, note="Search summary: set out in 1325, the year after Polo died; Thursday 14 June 1325 (2 Rajab 725 AH)."),
    dict(id="q-historyofinfo-han", title="The first census of which records are preserved (China, Han dynasty)", publisher="historyofinformation.com", kind="news", opened=False,
         url="https://historyofinformation.com/detail.php?id=148", retrieved=RETRIEVED, note="Search summary: first census with preserved records, 2 AD. Figures vary across sources."),
    dict(id="q-nlm-mmwr-smallpox", title="Last natural smallpox case: NLM and CDC MMWR accounts", publisher="NLM and CDC", kind="institutional", opened=False,
         url="https://www.cdc.gov/Mmwr/preview/mmwrhtml/00049694.htm", retrieved=RETRIEVED, note="Search summary: dates for the Somali case vary (22, 26, 31 October 1977), all in October 1977."),
    dict(id="q-nasa-golden", title="Greetings to the universe in 55 different languages", publisher="NASA Science", kind="institutional", opened=False,
         url="https://science.nasa.gov/mission/voyager/golden-record-contents/greetings/", retrieved=RETRIEVED, note="Search summary: greetings in 55 languages."),
]
SOURCE_INDEX = {s["id"]: s for s in SOURCES}


# ---------------------------------------------------------------------------------------------------------
# Helpers to keep the cases compact
# ---------------------------------------------------------------------------------------------------------
def anchor(label, date, year, month=None, day=None, region="Europe"):
    return dict(label=label, date=date, year=year, region=region)


def bound(fid, text, anc, direction, src, corr=None, note=""):
    """direction 'had_happened' -> lo = anchor year; 'not_yet' -> hi = anchor year - 1."""
    return dict(id=fid, kind="bound", text=text, anchor=anc, direction=direction, sources=src, corroboration=corr or [], note=note)


def relation(fid, text, anc, rtype, n, src, corr=None, note="", era_start=None):
    return dict(id=fid, kind="relation", text=text, anchor=anc, type=rtype, n=n, era_start=era_start, sources=src, corroboration=corr or [], note=note)


def paid(pid, tier, cost, category, text, anc, direction, src, note=""):
    return dict(id=pid, tier=tier, cost=cost, category=category, text=text, anchor=anc, direction=direction, sources=src, corroboration=[], note=note)


def fact(claim, value, precision, level, opened, corr=None, note="", calendar="Gregorian"):
    return dict(claim=claim, value=value, precision=precision, level=level, opened=opened, corroborated_by=corr or [], note=note, calendar=calendar)


# ---------------------------------------------------------------------------------------------------------
# The ten cases
# ---------------------------------------------------------------------------------------------------------
CASES = []

# 1 ------------------------------------------------------------------------------------------------------
CASES.append(dict(
    id="case-01", order=1, slug="concorde-001", title="A very fast prototype",
    lens="A curious invention", region=["Europe"], era="modern", reveal_form="Object drawing: tap the parts",
    difficulty="entry", corridor=[1960, 1985],
    question="In which year did the first Concorde prototype make its first flight?",
    target=dict(year=1969, event="First flight of Concorde prototype 001 from Toulouse",
                definition="The year of the first flight of prototype 001, not of supersonic flight (1 October 1969) and not of passenger service (1976).",
                precision="day known (2 March); year used", calendar="Gregorian",
                discovery_vs_event="Event: first flight. Not the first supersonic flight, not certification, not scheduled service."),
    free=[
        bound("f1", "By the end of that year, the Boeing 737 had already made its first flight (9 April 1967).",
              anchor("Boeing 737 first flight", "9 April 1967", 1967, region="North America"), "had_happened", ["wp-boeing_737"]),
        bound("f2", "By the end of that year, the Boeing 747 had not yet carried passengers (first passenger service 22 January 1970).",
              anchor("Boeing 747 enters passenger service", "22 January 1970", 1970, region="North America"), "not_yet", ["wp-boeing_747"]),
        relation("f3", "It flew one calendar year after Apollo 8 first took people into lunar orbit (21 to 27 December 1968).",
                 anchor("Apollo 8 lunar orbit mission", "21-27 December 1968", 1968, region="North America"), "years_after", 1, ["wp-apollo_8"]),
    ],
    paid=[
        paid("p1", "nudge", 1, "Aviation", "By the end of that year, the Boeing 737 had already entered airline service (10 February 1968).",
             anchor("Boeing 737 enters service", "10 February 1968", 1968, region="North America"), "had_happened", ["wp-boeing_737"]),
        paid("p2", "deep", 2, "Aviation", "By the end of that year, the Boeing 747 had already made its first flight (9 February 1969).",
             anchor("Boeing 747 first flight", "9 February 1969", 1969, region="North America"), "had_happened", ["wp-boeing_747"]),
    ],
    context_free=[dict(text="Concorde entered scheduled passenger service on 21 January 1976.", sources=["wp-concorde"])],
    facts=[
        fact("Concorde 001 made its first flight from Toulouse on 2 March 1969, piloted by André Turcat.", "2 March 1969", "day", "V1", ["wp-concorde"],
             ["q-airbus-concorde", "q-museeairespace"], "Some sources give 1 March; most give 2 March. Year is unaffected."),
        fact("Concorde entered service on 21 January 1976.", "21 January 1976", "day", "V1", ["wp-concorde"]),
        fact("Concorde 001 first went supersonic on 1 October 1969.", "1 October 1969", "day", "V1", ["wp-concorde"]),
    ],
    reveal=[
        dict(form="Object drawing", title="Prototype 001, F-WTSS", text="Concorde 001 first flew from Toulouse on 2 March 1969 with André Turcat at the controls. It first went supersonic on 1 October 1969.", sources=["wp-concorde"]),
        dict(form="Timeline", title="Two bets, one month apart", text="The Boeing 747 first flew on 9 February 1969, three weeks before Concorde 001 (2 March 1969).", sources=["wp-boeing_747", "wp-concorde"]),
    ],
    sample_player=[
        "The two dated anchors give a corridor of 1967 to 1969. The 737 had flown by 1967, and the 747 was not yet carrying passengers by the end of the year in question (that happened in January 1970).",
        "The third fragment says one calendar year after Apollo 8, which was in December 1968. One year after 1968 is 1969.",
        "1967 and 1968 fail the third fragment. Lock 1969.",
    ],
    miss_explanation="1967 and 1968 fit the two bounds, but only 1969 is one calendar year after Apollo 8 (December 1968). The date known to historians is 2 March 1969.",
    hold=[],
))

# 2 ------------------------------------------------------------------------------------------------------
CASES.append(dict(
    id="case-02", order=2, slug="nz-women-vote", title="The first nation where women voted",
    lens="A political turning point", region=["Oceania"], era="modern", reveal_form="Annotated timeline of petitions, law and first vote",
    difficulty="entry", corridor=[1880, 1905],
    question="In which year did New Zealand pass the law giving women the right to vote in parliamentary elections?",
    target=dict(year=1893, event="Royal assent to the Electoral Act 1893 (19 September 1893)",
                definition="The year the Act received royal assent. Women first voted in the general election of 28 November 1893, the same year. Women could vote before they could stand for Parliament; this case is about the vote.",
                precision="day known (19 September); year used", calendar="Gregorian",
                discovery_vs_event="Event: assent to the Act. Not the first vote, and not women standing for Parliament."),
    free=[
        bound("f1", "By the end of that year, the Eiffel Tower had been completed in Paris (31 March 1889).",
              anchor("Eiffel Tower completed", "31 March 1889", 1889), "had_happened", ["wp-eiffel_tower"]),
        bound("f2", "By the end of that year, the Lumière brothers had not yet held their first paid public film screening (28 December 1895).",
              anchor("Lumière first paid screening", "28 December 1895", 1895), "not_yet", ["wp-lumi%c3%a8re_brothers"]),
        relation("f3", "It happened one calendar year after the second of three suffrage petitions was delivered to Parliament (1892).",
                 anchor("Second suffrage petition delivered to Parliament", "1892", 1892, region="Oceania"), "years_after", 1, ["wp-women%27s_suffrage_in_new_zealand"]),
    ],
    paid=[
        paid("p1", "nudge", 1, "Politics", "By the end of that year, the first suffrage petition had already been delivered to Parliament (1891).",
             anchor("First suffrage petition delivered", "1891", 1891, region="Oceania"), "had_happened", ["wp-women%27s_suffrage_in_new_zealand"]),
        paid("p2", "deep", 2, "World events", "By the end of that year, the World's Columbian Exposition had opened in Chicago (1 May 1893).",
             anchor("Chicago World's Columbian Exposition opens", "1 May 1893", 1893, region="North America"), "had_happened", ["wp-world%27s_columbian_exposition"]),
    ],
    context_free=[],
    facts=[
        fact("The Electoral Act 1893 received royal assent on 19 September 1893.", "19 September 1893", "day", "V1",
             ["wp-women%27s_suffrage_in_new_zealand"], ["q-nzhistory"]),
        fact("Women voted for the first time on 28 November 1893.", "28 November 1893", "day", "V1", ["wp-women%27s_suffrage_in_new_zealand"], ["q-nzhistory"]),
        fact("Suffrage petitions were delivered to Parliament in 1891, 1892 and 1893.", "1891, 1892, 1893", "year", "V1", ["wp-women%27s_suffrage_in_new_zealand"],
             note="Signature counts (about 9,000, 20,000, 32,000) are seen on the page but vary between sources; HOLD, not used."),
        fact("The Act enfranchised women aged 21 and over, including Māori women, who voted in the Māori seats.", "1893", "year", "V1", [], ["q-nzhistory"],
             note="Seen in a search summary of NZHistory; Wikipedia's wording was not checked for Māori women. HOLD before use in the reveal."),
    ],
    reveal=[
        dict(form="Timeline", title="Three petitions, one law", text="Petitions were delivered to Parliament in 1891, 1892 and 1893, each larger than the one before (counts HOLD). The Act received royal assent on 19 September 1893.", sources=["wp-women%27s_suffrage_in_new_zealand"]),
        dict(form="Note on terms", title="Vote, not candidacy", text="The 1893 Act gave women the vote. Women's right to stand for Parliament came later. The date of the law and the date of the first vote are different facts: 19 September and 28 November 1893.", sources=["wp-women%27s_suffrage_in_new_zealand"]),
    ],
    sample_player=[
        "The Eiffel Tower is 1889 and the first Lumière screening is 1895. The Act must be after 1889 and before 1895, so 1889 to 1894.",
        "The petition of almost 20,000 signatures was in 1892. The third fragment says one calendar year after that, so 1893.",
        "Lock 1893.",
    ],
    miss_explanation="1889 to 1894 all fit the two bounds. Only 1893 is one calendar year after the 1892 petition.",
    hold=["Māori women's inclusion: second opened source needed (NZHistory blocked)."],
))

# 3 ------------------------------------------------------------------------------------------------------
CASES.append(dict(
    id="case-03", order=3, slug="pacific-return-route", title="The way back across the Pacific",
    lens="Food and trade routes", region=["Asia", "Americas"], era="early modern", reveal_form="Trade-route map, drawn with uncertainty",
    difficulty="medium", corridor=[1555, 1580],
    question="In which year did a Spanish ship first complete the return voyage across the Pacific from the Philippines to Mexico?",
    target=dict(year=1565, event="Urdaneta's ship reaches Acapulco on 8 October 1565",
                definition="The year of arrival at Acapulco of the first successful eastbound crossing (the tornaviaje). Not the year of the outward voyage and not the year Manila became the colony's capital.",
                precision="day known (8 October); year used", calendar="Gregorian",
                discovery_vs_event="Event: the arrival that proved the return route. The route was then used until 1815."),
    free=[
        bound("f1", "By the end of that year, a Spanish fleet under Legazpi had already sailed from La Navidad in Mexico (21 November 1564).",
              anchor("Legazpi's fleet sails from La Navidad", "21 November 1564", 1564, region="Americas"), "had_happened", ["wp-andr%c3%a9s_de_urdaneta"]),
        bound("f2", "By the end of that year, Mercator had not yet published his world map (1569).",
              anchor("Mercator's world map", "1569", 1569), "not_yet", ["wp-mercator_1569_world_map"]),
        relation("f3", "The return voyage reached Mexico one calendar year after the fleet sailed from La Navidad.",
                 anchor("Fleet sails from La Navidad", "21 November 1564", 1564, region="Americas"), "years_after", 1, ["wp-andr%c3%a9s_de_urdaneta"]),
    ],
    paid=[
        paid("p1", "nudge", 1, "Exploration", "By the end of that year, the Spanish fleet had already reached the Philippines (Samar, 13 February 1565).",
             anchor("Fleet reaches Samar", "13 February 1565", 1565, region="Asia"), "had_happened", ["wp-andr%c3%a9s_de_urdaneta"],
             note="Thin ladder: cuts one year. Needs a stronger clue (HOLD)."),
    ],
    context_free=[],
    facts=[
        fact("Urdaneta left Cebu on 1 June 1565 and reached Acapulco on 8 October 1565.", "8 October 1565", "day", "V1", ["wp-andr%c3%a9s_de_urdaneta"],
             ["wp-manila_galleon"], "Several search results agree. Urdaneta's birth year is given as 1498 and 1508; not used."),
        fact("The fleet sailed from La Navidad on 21 November 1564.", "21 November 1564", "day", "V1", ["wp-andr%c3%a9s_de_urdaneta"]),
        fact("The route operated from 1565 to 1815.", "1565 to 1815", "year", "V1", ["wp-manila_galleon"]),
        fact("The Spanish colonial capital moved to Manila in 1571.", "1571", "year", "V1", ["wp-miguel_l%c3%b3pez_de_legazpi"]),
    ],
    reveal=[
        dict(form="Route map (schematic)", title="Why the way back was the hard part", text="Reaching the Philippines from Mexico was the easier direction. The hard part was finding a way back. Urdaneta left Cebu on 1 June 1565 and reached Acapulco on 8 October.", sources=["wp-andr%c3%a9s_de_urdaneta"]),
        dict(form="Trade rhythm", title="A route that lasted", text="The Manila galleon route operated from 1565 to 1815.", sources=["wp-manila_galleon"]),
    ],
    sample_player=[
        "The fleet sailed in November 1564, so the target is 1564 or later. Mercator's map is 1569, so the target is before that: 1564 to 1568.",
        "The third fragment says one calendar year after the fleet sailed, which is 1565.",
        "Lock 1565.",
    ],
    miss_explanation="1564 to 1568 fit the bounds. Only 1565 is one calendar year after the fleet sailed in November 1564.",
    hold=["Clue ladder is thin: one paid clue that cuts one year. Find a verified event dated 1566 or 1567."],
))

# 4 ------------------------------------------------------------------------------------------------------
CASES.append(dict(
    id="case-04", order=4, slug="berlin-institute", title="A research institute in Berlin",
    lens="Queer communities and institutions", region=["Europe"], era="modern", reveal_form="Source excerpts and a map of the Institute's neighbourhood",
    difficulty="medium", corridor=[1910, 1935],
    question="In which year did the Institute for Sexual Science open in Berlin?",
    target=dict(year=1919, event="The Institut für Sexualwissenschaft opens in Berlin (6 July 1919)",
                definition="The year the Institute opened. Some sources mention an inauguration speech on 1 July; the year is the same.",
                precision="day (6 July per Wikipedia); year used", calendar="Gregorian",
                discovery_vs_event="Event: opening of the Institute. Not its destruction in 1933."),
    free=[
        bound("f1", "By the end of that year, the armistice that ended fighting in the First World War had been signed (11 November 1918).",
              anchor("Armistice of 11 November 1918", "11 November 1918", 1918), "had_happened", ["wp-armistice_of_11_november_1918"]),
        bound("f2", "By the end of that year, the Beer Hall Putsch in Munich had not yet taken place (8 to 9 November 1923).",
              anchor("Beer Hall Putsch", "8-9 November 1923", 1923), "not_yet", ["wp-beer_hall_putsch"]),
        relation("f3", "It opened one calendar year after the armistice of November 1918.",
                 anchor("Armistice", "11 November 1918", 1918), "years_after", 1, ["wp-armistice_of_11_november_1918"]),
    ],
    paid=[
        paid("p1", "nudge", 1, "Film and culture", "By the end of that year, Hirschfeld's film 'Anders als die Andern' had premiered (May 1919).",
             anchor("Premiere of 'Anders als die Andern'", "May 1919", 1919), "had_happened", ["wp-magnus_hirschfeld"]),
        paid("p2", "deep", 2, "Biography", "By the end of that year, Hirschfeld had not yet been beaten by völkisch activists (1920).",
             anchor("Hirschfeld beaten by völkisch activists", "1920", 1920), "not_yet", ["wp-magnus_hirschfeld"]),
    ],
    context_free=[dict(text="It was founded by Magnus Hirschfeld together with Arthur Kronfeld and Friedrich Wertheim.", sources=["wp-institut_f%c3%bcr_sexualwissenschaft"])],
    facts=[
        fact("The Institut für Sexualwissenschaft opened on 6 July 1919.", "6 July 1919", "day", "V1",
             ["wp-institut_f%c3%bcr_sexualwissenschaft", "wp-magnus_hirschfeld"], [], "Both are Wikipedia. The USHMM article, seen in a search summary, does not give the opening date. One entry mentions a speech on 1 July. Year-level only."),
        fact("The Institute was looted and its books burned by Nazis in May 1933.", "May 1933", "month", "V1", ["wp-magnus_hirschfeld"], ["q-ushmm"],
             "USHMM confirms May 1933 in a search summary; the page could not be opened."),
        fact("Hirschfeld and the Institute issued passes to trans people to prevent police harassment.", "1920s", "decade", "V1", ["wp-magnus_hirschfeld"], [],
             "Single source. HOLD before use in the reveal."),
    ],
    reveal=[
        dict(form="Source excerpts", title="Founders and date", text="Founded by Magnus Hirschfeld with Arthur Kronfeld and Friedrich Wertheim, the Institute opened on 6 July 1919.", sources=["wp-institut_f%c3%bcr_sexualwissenschaft"]),
        dict(form="Note on language", title="Words of the period", text="The Institute used the vocabulary of its time. Those terms are not current self-descriptions. The reveal quotes the sources' wording, marks it as period language, and makes no claim about any individual's identity.", sources=[]),
        dict(form="What survived", title="May 1933", text="In May 1933 the Institute was looted and its books were burned.", sources=["wp-magnus_hirschfeld"]),
    ],
    sample_player=[
        "The armistice is 1918 and the putsch is 1923, so the Institute opened from 1918 to 1922.",
        "The third fragment says one calendar year after the armistice. One year after 1918 is 1919.",
        "Lock 1919.",
    ],
    miss_explanation="1918 to 1922 fit the bounds. Only 1919 is one calendar year after the November 1918 armistice.",
    hold=["Second opened source for the 6 July 1919 date (USHMM could not be opened). Identity-language note needs a named sensitivity review before release; the agent cannot supply one."],
))

# 5 ------------------------------------------------------------------------------------------------------
CASES.append(dict(
    id="case-05", order=5, slug="rosetta-stone", title="A slab found by soldiers",
    lens="Archaeology: found, made, decoded", region=["Africa", "Europe"], era="early modern", reveal_form="Layered object investigation: three scripts, one decree",
    difficulty="medium", corridor=[1790, 1815],
    question="In which year was the Rosetta Stone found?",
    target=dict(year=1799, event="French soldiers find the stone at Rashid (Rosetta) during the French invasion",
                definition="The year of discovery. The decree on the stone dates from 196 BC; the Greek text was first translated in 1803; Champollion announced decipherment in 1822. Sources disagree on the day in July.",
                precision="month (July); year used", calendar="Gregorian",
                discovery_vs_event="Discovery of the object. Not the date of the decree, not the decipherment."),
    free=[
        bound("f1", "By the end of that year, the French campaign in Egypt had already begun (28 June 1798).",
              anchor("French invasion of Egypt begins", "28 June 1798", 1798, region="Africa"), "had_happened", ["wp-french_campaign_in_egypt_and_syria"]),
        bound("f2", "By the end of that year, the French campaign in Egypt had not yet ended (2 September 1801).",
              anchor("End of the French campaign in Egypt", "2 September 1801", 1801, region="Africa"), "not_yet", ["wp-french_campaign_in_egypt_and_syria"]),
        relation("f3", "It was found one calendar year after the Battle of the Nile (1 to 3 August 1798).",
                 anchor("Battle of the Nile", "1-3 August 1798", 1798, region="Africa"), "years_after", 1, ["wp-battle_of_the_nile"]),
    ],
    paid=[
        paid("p1", "nudge", 1, "Politics", "By the end of that year, Napoleon had already left Egypt (23 August 1799).",
             anchor("Napoleon leaves Egypt", "23 August 1799", 1799, region="Africa"), "had_happened", ["wp-french_campaign_in_egypt_and_syria"]),
        paid("p2", "deep", 2, "War", "By the end of that year, the Battle of Marengo had not yet been fought (14 June 1800).",
             anchor("Battle of Marengo", "14 June 1800", 1800), "not_yet", ["wp-battle_of_marengo"]),
    ],
    context_free=[dict(text="The stone carries one decree in three scripts: Egyptian hieroglyphs, Demotic and Ancient Greek.", sources=["wp-rosetta_stone"])],
    facts=[
        fact("The stone was found in July 1799 by Pierre-François Bouchard during France's invasion of Egypt.", "July 1799", "month", "V1", ["wp-rosetta_stone"],
             ["q-britannica-rosetta"], "Search results give 15 July, 19 July and, in Britannica, August 1799. The year is stable; the day is not. Only the year is used."),
        fact("The decree on the stone was issued in 196 BC under Ptolemy V Epiphanes.", "196 BC", "year", "V1", ["wp-rosetta_stone"]),
        fact("The first complete translation of the Greek text was published in 1803.", "1803", "year", "V1", ["wp-rosetta_stone"]),
        fact("Champollion announced the transliteration of the Egyptian scripts in Paris in 1822.", "1822", "year", "V1", ["wp-rosetta_stone"]),
        fact("The French campaign ran from 28 June 1798 to 2 September 1801; Napoleon commanded until 23 August 1799.", "1798 to 1801", "day", "V1", ["wp-french_campaign_in_egypt_and_syria"]),
    ],
    reveal=[
        dict(form="Layered object", title="Found, made, read", text="Three dates, three different questions. The decree was made in 196 BC. The stone was found in July 1799. Its text was first read in translation in 1803, and the Egyptian scripts were transliterated in 1822.", sources=["wp-rosetta_stone"]),
        dict(form="Note on dates", title="Why the day is missing", text="Accounts give 15 July, 19 July and, in one encyclopedia, August 1799. We only say 1799.", sources=["q-britannica-rosetta"]),
    ],
    sample_player=[
        "The French invaded in 1798, so the stone was found in 1798 or later. They surrendered in 1801, so it was found by 1800. The candidates are 1798, 1799 and 1800.",
        "The Battle of the Nile was in August 1798. One calendar year after is 1799.",
        "Lock 1799.",
    ],
    miss_explanation="1798, 1799 and 1800 fit the bounds. Only 1799 is one calendar year after the Battle of the Nile (August 1798).",
    hold=["Second opened source for the 1799 year (Britannica and the British Museum are blocked)."],
))

# 6 ------------------------------------------------------------------------------------------------------
CASES.append(dict(
    id="case-06", order=6, slug="last-natural-smallpox", title="The last case that was not a laboratory's",
    lens="Medicine and public health", region=["Africa", "Asia"], era="modern", reveal_form="Careful, plain data graphic of where and when smallpox ended",
    difficulty="medium", corridor=[1965, 1990],
    question="In which year was the last naturally occurring case of smallpox diagnosed?",
    target=dict(year=1977, event="Diagnosis of Ali Maow Maalin in Somalia (October 1977), the last known natural case",
                definition="The year of the last known naturally occurring case (the milder variola minor). Not the last case of any kind (a laboratory-acquired case in Birmingham in 1978) and not the year eradication was declared (1980).",
                precision="month (October); year used", calendar="Gregorian",
                discovery_vs_event="Event: the last natural case. Three other dates answer different questions: 1975 (last variola major case), 1978 (last case of any kind), 1980 (eradication declared)."),
    free=[
        bound("f1", "By the end of that year, the last known case of the deadlier form of smallpox, variola major, had been reported (Bangladesh, 16 October 1975).",
              anchor("Last variola major case reported", "16 October 1975", 1975, region="Asia"), "had_happened", ["wp-rahima_banu"], ["who-smallpox"]),
        bound("f2", "By the end of that year, the laboratory-acquired smallpox outbreak in Birmingham, England, had not yet happened (1978).",
              anchor("Birmingham laboratory outbreak", "1978", 1978), "not_yet", ["wp-janet_parker"]),
        relation("f3", "It happened two calendar years after the last variola major case of October 1975.",
                 anchor("Last variola major case", "16 October 1975", 1975, region="Asia"), "years_after", 2, ["wp-rahima_banu"], ["who-smallpox"]),
    ],
    paid=[
        paid("p1", "nudge", 1, "Space", "By the end of that year, the Viking 1 lander had already touched down on Mars (20 July 1976).",
             anchor("Viking 1 lands on Mars", "20 July 1976", 1976, region="North America"), "had_happened", ["wp-viking_1"]),
        paid("p2", "deep", 2, "Film", "By the end of that year, the film Star Wars had already been released (25 May 1977).",
             anchor("Star Wars released", "25 May 1977", 1977, region="North America"), "had_happened", ["wp-star_wars_(film)"]),
    ],
    context_free=[dict(text="WHO declared smallpox eradicated in 1980.", sources=["who-smallpox"])],
    facts=[
        fact("Ali Maow Maalin, in Somalia, was diagnosed in October 1977 and is the last person known to have been infected with naturally occurring smallpox (variola minor).", "October 1977", "month", "V2",
             ["wp-ali_maow_maalin", "who-smallpox", "cdc-smallpox"], ["q-nlm-mmwr-smallpox"],
             "WHO: eliminated from Africa in 1977. CDC: no cases since 1977. Sources give the day as 22, 26 or 31 October; all October 1977. Year-level only."),
        fact("The last known naturally occurring case of variola major was reported on 16 October 1975 in Bangladesh.", "16 October 1975", "day", "V1", ["wp-rahima_banu"], ["who-smallpox"],
             "WHO says smallpox was eliminated from Asia in 1975."),
        fact("A laboratory-acquired outbreak in the United Kingdom in 1978 killed Janet Parker, the last recorded smallpox death.", "1978", "year", "V1", ["wp-janet_parker"]),
        fact("WHO declared smallpox eradicated in 1980.", "1980", "year", "V1", ["who-smallpox"], [], "Single opened source for this claim."),
    ],
    reveal=[
        dict(form="Plain data graphic", title="Four dates, four questions", text="1975: the last variola major case. 1977: the last natural case, in Somalia. 1978: a laboratory outbreak in England, the last recorded death. 1980: WHO declared smallpox eradicated.", sources=["wp-rahima_banu", "wp-ali_maow_maalin", "wp-janet_parker", "who-smallpox"]),
        dict(form="Note on terms", title="'Last' needs a definition", text="The last case of any kind, the last natural case and the declaration of eradication fall in three different years. The case asks for the natural case, and says so.", sources=["cdc-smallpox"]),
    ],
    sample_player=[
        "The last variola major case was reported in October 1975, so the last natural case is 1975 or later. The Birmingham outbreak was 1978, so the last natural case was before that: 1975 to 1977.",
        "The third fragment says two calendar years after 1975, which is 1977.",
        "Lock 1977.",
    ],
    miss_explanation="1975, 1976 and 1977 fit the bounds. Only 1977 is two calendar years after the October 1975 case.",
    hold=["Rahima Banu's case date has one source (Wikipedia). WHO's 'Asia 1975' supports the year; a second page naming the case is HOLD."],
))

# 7 ------------------------------------------------------------------------------------------------------
CASES.append(dict(
    id="case-07", order=7, slug="three-travellers-one-decade", title="Who was on the road?",
    lens="Surprising coexistence", region=["Africa", "Europe", "Asia"], era="medieval", reveal_form="Synchronised biographical bands across regions",
    difficulty="medium", corridor=[1310, 1340],
    question="In which year did Ibn Battuta set out from Tangier on his first pilgrimage?",
    target=dict(year=1325, event="Ibn Battuta leaves Tangier on 2 Rajab 725 AH, which is 14 June 1325",
                definition="The year he set out. The source gives the Islamic date and its Gregorian equivalent (Julian-calendar era, shown as 14 June 1325).",
                precision="day known (14 June); year used", calendar="Hijri 725 AH to Julian/Gregorian 1325",
                discovery_vs_event="Event: departure on the first pilgrimage, not the end of his travels (1354)."),
    free=[
        bound("f1", "By the end of that year, Marco Polo had already died (8 January 1324).",
              anchor("Marco Polo dies", "8 January 1324", 1324), "had_happened", ["wp-marco_polo"]),
        bound("f2", "By the end of that year, Edward II of England had not yet been deposed (January 1327).",
              anchor("Edward II deposed", "January 1327", 1327), "not_yet", ["wp-edward_ii_of_england"]),
        relation("f3", "He set out one calendar year after Mansa Musa of Mali made his pilgrimage through Cairo (1324).",
                 anchor("Mansa Musa's pilgrimage", "1324", 1324, region="Africa"), "years_after", 1, ["wp-mansa_musa"]),
    ],
    paid=[
        paid("p1", "nudge", 1, "Politics", "By the end of that year, Queen Isabella had not yet invaded England (1326).",
             anchor("Isabella invades England", "1326", 1326), "not_yet", ["wp-edward_ii_of_england"]),
    ],
    context_free=[dict(text="He was about 21 years old when he set out.", sources=["wp-ibn_battuta"])],
    facts=[
        fact("On 2 Rajab 725 AH (14 June 1325) Ibn Battuta set off from Tangier at about age 21.", "14 June 1325", "day", "V1", ["wp-ibn_battuta"], ["q-aramco-battuta"],
             "Aramco World (seen in a search summary) agrees and says he set out the year after Polo died.", calendar="Hijri 725 AH / Julian-Gregorian 1325"),
        fact("Marco Polo died on 8 January 1324.", "8 January 1324", "day", "V1", ["wp-marco_polo"], ["q-aramco-battuta"]),
        fact("Mansa Musa went on hajj in 1324 and spent time in Cairo.", "1324", "year", "V1", ["wp-mansa_musa"], [],
             "Single source. HOLD for a second opened page; do not publish the 1324 boundary until then."),
        fact("Edward II's reign ended on 21 January 1327 when he was deposed; Isabella invaded in 1326.", "1326 to 1327", "year", "V1", ["wp-edward_ii_of_england"]),
        fact("Tenochtitlan's foundation is dated 1325 by tradition; the infobox says 'unclear date, declared 13 March 1325'.", "1325 (traditional)", "year", "V0", ["wp-tenochtitlan"], [],
             "Contested. May appear in the reveal as a traditional date, never as a boundary."),
    ],
    reveal=[
        dict(form="Synchronised bands", title="Four regions, three years", text="Marco Polo died in Venice in January 1324. Mansa Musa travelled to Mecca through Cairo in 1324. Ibn Battuta left Tangier in June 1325. In England, Edward II was deposed in January 1327. They overlap in time and did not cause one another.", sources=["wp-marco_polo", "wp-mansa_musa", "wp-ibn_battuta", "wp-edward_ii_of_england"]),
        dict(form="Note on dates", title="A traditional date", text="Tenochtitlan is traditionally said to have been founded in 1325. That date is uncertain, so it is shown as tradition, not as a fact.", sources=["wp-tenochtitlan"]),
        dict(form="Note on calendars", title="Two calendars", text="Ibn Battuta's own date is 2 Rajab 725 in the Islamic calendar. The Gregorian equivalent shown is 14 June 1325.", sources=["wp-ibn_battuta"]),
    ],
    sample_player=[
        "Marco Polo died in January 1324, so the departure was 1324 or later. Edward II was deposed in January 1327, so it was before the end of 1326: 1324 to 1326.",
        "The third fragment says one calendar year after Mansa Musa's pilgrimage, which was in 1324. So 1325.",
        "Lock 1325.",
    ],
    miss_explanation="1324 to 1326 fit the bounds. Only 1325 is one calendar year after Mansa Musa's 1324 pilgrimage.",
    hold=["Mansa Musa 1324: second opened source required before this boundary can ship (blocked pages)."],
))

# 8 ------------------------------------------------------------------------------------------------------
CASES.append(dict(
    id="case-08", order=8, slug="correct-sounds", title="Sounds for the people",
    lens="A moment outside the usual chronology", region=["Asia"], era="medieval", reveal_form="Source excerpt and a calendar conversion, shown plainly",
    difficulty="hard", corridor=[1430, 1460],
    question="In which year was the Hunminjeongeum, the document that introduced the Korean alphabet, published?",
    target=dict(year=1446, event="Publication of the Hunminjeongeum, about the ninth lunar month of 1446 (around October)",
                definition="The year of publication. The alphabet was devised earlier: it was introduced to the court in the 12th lunar month of 1443, which spans 30 December 1443 to 28 January 1444 in the Gregorian calendar, so the creation year is ambiguous and is not used.",
                precision="month (ninth lunar month); year used", calendar="Joseon lunisolar calendar, converted to Gregorian",
                discovery_vs_event="Publication, not invention. Invention falls across a Gregorian year boundary (1443 or 1444)."),
    free=[
        bound("f1", "By the end of that year, the rain gauge had already been invented at Sejong's court (August 1441 by the lunar calendar).",
              anchor("Rain gauge invented", "1441", 1441, region="Asia"), "had_happened", ["wp-cheugugi"]),
        bound("f2", "By the end of that year, Yongbi eocheonga, the first book written in the new alphabet, had not yet been published (1447).",
              anchor("Yongbi eocheonga published", "1447", 1447, region="Asia"), "not_yet", ["wp-yongbi_eocheonga"]),
        relation("f3", "It was published four calendar years after the rain gauge was standardised (1442).",
                 anchor("Rain gauge standardised", "1442", 1442, region="Asia"), "years_after", 4, ["wp-cheugugi"]),
    ],
    paid=[
        paid("p1", "nudge", 1, "World events", "By the end of that year, the Battle of Varna had already been fought (10 November 1444).",
             anchor("Battle of Varna", "10 November 1444", 1444), "had_happened", ["wp-battle_of_varna"]),
    ],
    context_free=[dict(text="The name means 'The Correct Sounds for the Instruction of the People'.", sources=["wp-hunminjeongeum"])],
    facts=[
        fact("The base Hunminjeongeum was first published around October 1446 (Gregorian), in the 9th month of 1446 in the Korean calendar.", "about October 1446", "month", "V1", ["wp-hunminjeongeum"], ["q-unesco-hunmin"],
             "UNESCO's nomination, seen in a search summary, says 9 October 1446. Wikipedia says the exact day is not known and that 9 October is an assumption. Year-level only.", calendar="Korean lunisolar to Gregorian"),
        fact("The alphabet was introduced to the court in the 12th month of 1443 (30 December 1443 to 28 January 1444).", "12th month 1443", "month", "V1", ["wp-hunminjeongeum"], [], "Crosses a Gregorian year boundary. Not used as a boundary."),
        fact("The rain gauge was invented in August 1441 (lunar) and standardised from 1442.", "1441, 1442", "year", "V1", ["wp-cheugugi"]),
        fact("Yongbi eocheonga, the first work written in Hangul, was published in 1447.", "1447", "year", "V1", ["wp-yongbi_eocheonga"]),
        fact("The Battle of Varna was fought on 10 November 1444.", "10 November 1444", "day", "V1", ["wp-battle_of_varna"]),
    ],
    reveal=[
        dict(form="Source excerpt", title="Two ways to date a script", text="The alphabet was devised and shown to the court in the 12th lunar month of 1443. It was published in the ninth lunar month of 1446. The first is split across two Gregorian years; the second is not. The case asks for the publication.", sources=["wp-hunminjeongeum"]),
        dict(form="Note on calendars", title="Lunar months and Gregorian years", text="Joseon dated events by the lunar calendar. The same lunar month can fall in two Gregorian years, which is why 1443 or 1444 would both be defensible for the alphabet's creation.", sources=["wp-hunminjeongeum"]),
    ],
    sample_player=[
        "The rain gauge was invented in 1441, so the publication was in 1441 or later. The first book in the alphabet was published in 1447, so the publication was by 1446: 1441 to 1446.",
        "The third fragment says four calendar years after 1442, which is 1446.",
        "Lock 1446.",
    ],
    miss_explanation="1441 to 1446 fit the bounds. Only 1446 is four calendar years after the 1442 rain-gauge standard.",
    hold=["Second opened source for the publication year (UNESCO nomination not opened). Clue ladder has one clue."],
))

# 9 ------------------------------------------------------------------------------------------------------
CASES.append(dict(
    id="case-09", order=9, slug="han-census", title="The first count of a whole empire",
    lens="Numbers and records", region=["Asia"], era="ancient", reveal_form="Inspectable chart that shows its own uncertainty",
    difficulty="hard", corridor=[-19, 20],
    question="In which year was the first nationwide census of Han China taken?",
    target=dict(year=2, event="The registration of households and persons recorded for the year 2 CE (Yuanshi 2)",
                definition="The year of the first nationwide census in Chinese history that left records. Exact totals are not used: sources disagree.",
                precision="year", calendar="Han lunisolar era year Yuanshi 2, equal to 2 CE",
                discovery_vs_event="The count was recorded under era year Yuanshi 2."),
    free=[
        bound("f1", "By the end of that year, Emperor Ping had already taken the throne (17 October, 1 BCE).",
              anchor("Emperor Ping takes the throne", "17 October 1 BCE", 0, region="Asia"), "had_happened", ["wp-emperor_ping_of_han"]),
        bound("f2", "By the end of that year, Emperor Ping had not yet died (3 February, 6 CE).",
              anchor("Emperor Ping dies", "3 February 6 CE", 6, region="Asia"), "not_yet", ["wp-emperor_ping_of_han"]),
        relation("f3", "It was recorded in the second year of the Yuanshi era, an era that began in 1 CE.",
                 anchor("Yuanshi era begins", "1 CE", 1, region="Asia"), "era_year", 2, ["wp-emperor_ping_of_han"], era_start=1),
    ],
    paid=[
        paid("p1", "nudge", 1, "Government", "By the end of that year, the Yuanshi era name had already been proclaimed (1 CE).",
             anchor("Yuanshi era begins", "1 CE", 1, region="Asia"), "had_happened", ["wp-emperor_ping_of_han"]),
    ],
    context_free=[dict(text="There is no year 0 in BCE and CE dating: 1 BCE is followed directly by 1 CE.", sources=[])],
    facts=[
        fact("The first nationwide census in Chinese history was taken in 2 AD.", "2 CE", "year", "V1", ["wp-han_dynasty"], ["q-historyofinfo-han"],
             "Seen in a search summary of historyofinformation.com and a reference to Bielenstein's 1947 study."),
        fact("Wikipedia gives 57,671,400 people and 12,366,470 households. Other sources give about 59.6 million people and 12,233,062 households.", "57.7 to 59.6 million", "estimated", "V0", ["wp-han_dynasty"], ["q-historyofinfo-han"],
             "Sources disagree. HOLD: needs the primary text (Book of Han ch. 28) via a source the editor can open. Shown as a range with a stated disagreement."),
        fact("Emperor Ping reigned from 17 October 1 BC to 3 February 6 AD; era name Yuanshi 1 to 5 AD.", "1 BCE to 6 CE", "day", "V1", ["wp-emperor_ping_of_han"]),
    ],
    reveal=[
        dict(form="Inspectable chart", title="A count with its disagreement showing", text="The 2 CE registration is the first nationwide census in Chinese history. Accounts give about 57.7 million people in one source and about 59.6 million in another. The chart shows both and says the figures are registrations, not a modern headcount.", sources=["wp-han_dynasty"]),
        dict(form="Note on dating", title="BCE and CE", text="Year numbers jump from 1 BCE to 1 CE with no year 0, so the corridor 20 BCE to 20 CE has 40 years, not 41.", sources=[]),
    ],
    sample_player=[
        "Emperor Ping took the throne in 1 BCE and died in 6 CE, so the census was between 1 BCE and 5 CE. That is six years: 1 BCE, then 1, 2, 3, 4 and 5 CE. There is no year zero.",
        "The third fragment says the second year of the Yuanshi era, which began in 1 CE. The first year is 1 CE, so the second is 2 CE.",
        "Lock 2 CE.",
    ],
    miss_explanation="1 BCE and 1 to 5 CE fit the bounds. Only 2 CE is the second year of an era whose first year was 1 CE.",
    hold=["Exact totals: HOLD (sources disagree, primary text not opened). Only the year is used.", "Second opened source for the 2 CE census year."],
))

# 10 -----------------------------------------------------------------------------------------------------
CASES.append(dict(
    id="case-10", order=10, slug="greetings-and-the-last-case", title="Greetings to the universe",
    lens="The convergence", region=["North America", "Global"], era="modern", reveal_form="The Daily Trail, with the ten marks on one strata",
    difficulty="finale", corridor=[1970, 1985],
    question="In which year were the two Voyager spacecraft launched?",
    target=dict(year=1977, event="Voyager 2 launches on 20 August 1977 and Voyager 1 on 5 September 1977",
                definition="The year both spacecraft launched. Voyager 2 launched first, on 20 August; Voyager 1 followed on 5 September.",
                precision="day known; year used", calendar="Gregorian",
                discovery_vs_event="Event: launches. Not the Jupiter flybys (1979) and not leaving the heliosphere."),
    free=[
        bound("f1", "By the end of that year, the Viking 1 lander had already touched down on Mars (20 July 1976).",
              anchor("Viking 1 lands on Mars", "20 July 1976", 1976, region="North America"), "had_happened", ["wp-viking_1"]),
        bound("f2", "By the end of that year, Voyager 1 had not yet made its closest approach to Jupiter (5 March 1979).",
              anchor("Voyager 1 at Jupiter", "5 March 1979", 1979, region="North America"), "not_yet", ["wp-voyager_1"]),
        relation("f3", "They launched one calendar year after Concorde began scheduled passenger service (21 January 1976).",
                 anchor("Concorde enters scheduled service", "21 January 1976", 1976), "years_after", 1, ["wp-concorde"]),
    ],
    paid=[
        paid("p1", "nudge", 1, "Medicine", "By the end of that year, the last naturally occurring case of smallpox had already been diagnosed (October 1977).",
             anchor("Last natural smallpox case", "October 1977", 1977, region="Africa"), "had_happened", ["wp-ali_maow_maalin", "who-smallpox"]),
        paid("p2", "deep", 2, "Medicine", "By the end of that year, the 1978 laboratory smallpox outbreak in England had not yet happened.",
             anchor("Birmingham laboratory outbreak", "1978", 1978), "not_yet", ["wp-janet_parker"]),
    ],
    context_free=[dict(text="Voyager 2 launched first, on 20 August; Voyager 1 followed on 5 September.", sources=["wp-voyager_1", "wp-voyager_2"])],
    facts=[
        fact("Voyager 2 launched on 20 August 1977 and Voyager 1 on 5 September 1977.", "20 August and 5 September 1977", "day", "V2", ["wp-voyager_2", "wp-voyager_1", "nasa-voyager"], [],
             "NASA's mission page opened and states launch 1977; the days come from Wikipedia."),
        fact("Voyager 1's closest approach to Jupiter was on 5 March 1979.", "5 March 1979", "day", "V1", ["wp-voyager_1"]),
        fact("Each spacecraft carries a record with greetings in 55 languages.", "55 languages", "count", "V0", [], ["q-nasa-golden"], "NASA page seen in a search summary; page not opened. HOLD: not used anywhere in the pack."),
        fact("The last known naturally occurring smallpox case was diagnosed in October 1977.", "October 1977", "month", "V2", ["wp-ali_maow_maalin", "who-smallpox", "cdc-smallpox"], []),
    ],
    reveal=[
        dict(form="The Daily Trail", title="Two things happened in 1977", text="In 1977 two spacecraft left for the outer solar system, and the last natural case of smallpox was diagnosed in Somalia. Both are documented. Neither caused the other.", sources=["wp-voyager_2", "wp-voyager_1", "wp-ali_maow_maalin", "who-smallpox"]),
        dict(form="Timeline of your ten marks", title="Your ten years on one core", text="The ten marks span two thousand years. Two of them, from different cases, fall in 1977. The gaps between neighbouring marks shrink from more than thirteen centuries to a few decades. The pack was selected by editors, so the pattern says as much about what is recorded as about the past.", sources=[]),
    ],
    sample_player=[
        "The Viking 1 landing was in 1976, so the launches were in 1976 or later. Voyager 1's closest approach to Jupiter was in 1979, so the launches were by the end of 1978: 1976, 1977 or 1978.",
        "The third fragment says one calendar year after Concorde began service in January 1976. One year after 1976 is 1977.",
        "Lock 1977.",
    ],
    miss_explanation="1976 to 1978 fit the bounds. Only 1977 is one calendar year after Concorde began scheduled service in January 1976.",
    hold=["The finale reuses 1977 from case 6; see AUDITS (cross-case leakage)."],
))

# ---------------------------------------------------------------------------------------------------------
# Pack-level material
# ---------------------------------------------------------------------------------------------------------
PACK = dict(
    pack_id="daily-draft-001", version="0.1.0-draft", status="DRAFT_NOT_PUBLISHABLE",
    date_convention="end-of-year",
    theme="The world was doing other things",
    finale_thesis=("Place the ten answers on one core and two of them land in the same year, 1977, for unrelated reasons: two spacecraft left for the "
                   "outer solar system while the last natural case of smallpox was diagnosed. The Daily Trail shows simultaneity without "
                   "claiming cause, and shows that our ten marks are a selection, not a sample of history."),
    connections=[dict(after_case=4), dict(after_case=7)],
)
