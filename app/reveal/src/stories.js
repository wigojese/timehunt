// Reveal content scripts. Every factual statement carries source ids from the Stage 3 pack (docs/pack/BIBLIOGRAPHY.md).
// Dates: Gregorian unless a beat says otherwise. V-levels are computed at run time from the sources (two opened publishers = V2).
// `editorial` beats make no new factual claim; they only compare what earlier beats already sourced.
const ev = (lane, label, when, src, extra = {}) => ({ lane, label, src, ...when, ...extra });

export const LANES_1324 = {
  lo: 1323, hi: 1328, unit: 'year',
  lanes: [{ id: 'it', label: 'Italy' }, { id: 'ml', label: 'Mali and Egypt' }, { id: 'ma', label: 'Morocco to Mecca' }, { id: 'en', label: 'England' }, { id: 'mx', label: 'Tenochtitlan, by tradition' }],
  events: [
    ev('it', 'Marco Polo dies', { at: { y: 1324, m: 1, d: 8 } }, ['wp-marco_polo']),
    ev('ml', 'Mansa Musa goes on pilgrimage, through Cairo', { at: { y: 1324 } }, ['wp-mansa_musa'], { note: 'One source. Marked HOLD in the pack: a second opened page is needed.' }),
    ev('ma', 'Ibn Battuta leaves Tangier (2 Rajab 725 AH)', { at: { y: 1325, m: 6, d: 14 } }, ['wp-ibn_battuta'], { note: 'The source gives the Islamic date and its Gregorian equivalent.' }),
    ev('en', 'Queen Isabella invades England', { at: { y: 1326 } }, ['wp-edward_ii_of_england']),
    ev('en', 'Edward II’s reign ends: deposed', { at: { y: 1327, m: 1, d: 21 } }, ['wp-edward_ii_of_england']),
    ev('mx', 'Foundation of Tenochtitlan, by tradition', { at: { y: 1325 } }, ['wp-tenochtitlan'], { uncertain: true, note: 'A traditional date. The source calls the date unclear. Shown dashed, never as a fact.' }),
  ],
};
export const LANES_1969 = {
  lo: 1969, hi: 1970, unit: 'month',
  lanes: [{ id: 'air', label: 'Air' }, { id: 'space', label: 'Space' }, { id: 'afr', label: 'Culture in Africa' }],
  events: [
    ev('air', 'Boeing 747 first flight', { at: { y: 1969, m: 2, d: 9 } }, ['wp-boeing_747']),
    ev('air', 'Concorde 001 first flight, Toulouse', { at: { y: 1969, m: 3, d: 2 } }, ['wp-concorde'], { note: 'Some sources give 1 March; the year is not in doubt.' }),
    ev('afr', 'Pan-African Cultural Festival opens in Algiers, for eight days', { from: { y: 1969, m: 7, d: 21 }, to: { y: 1969, m: 7, d: 28 } }, ['wp-pan-africanism'], { note: 'The source says it began on 21 July and continued for eight days. The end date here is counted from that.' }),
    ev('space', 'Apollo 11 lands on the Moon', { at: { y: 1969, m: 7, d: 20 } }, ['wp-apollo_11']),
  ],
};
export const LANES_1977 = {
  lo: 1977, hi: 1978, unit: 'month',
  lanes: [{ id: 'afr', label: 'Culture in Africa' }, { id: 'film', label: 'Film' }, { id: 'space', label: 'Space' }, { id: 'health', label: 'Health' }],
  events: [
    ev('afr', 'FESTAC 77, Lagos: about 16,000 participants from 56 African nations and the diaspora', { from: { y: 1977, m: 1, d: 15 }, to: { y: 1977, m: 2, d: 12 } }, ['wp-festac_77']),
    ev('film', 'Star Wars released (a clue in case 6)', { at: { y: 1977, m: 5, d: 25 } }, ['wp-star_wars_(film)']),
    ev('space', 'Voyager 2 launched', { at: { y: 1977, m: 8, d: 20 } }, ['wp-voyager_2']),
    ev('space', 'Voyager 1 launched', { at: { y: 1977, m: 9, d: 5 } }, ['wp-voyager_1']),
    ev('health', 'Last known natural smallpox case diagnosed, Somalia', { at: { y: 1977, m: 10 } }, ['wp-ali_maow_maalin', 'who-smallpox', 'cdc-smallpox'], { note: 'Sources give 22, 26 or 31 October, so a month band is drawn.' }),
  ],
};
export const LANES_1441 = {
  lo: 1441, hi: 1448, unit: 'year',
  lanes: [{ id: 'ko', label: 'Sejong’s Korea' }, { id: 'eu', label: 'Europe and the Ottomans' }],
  events: [
    ev('ko', 'Rain gauge invented (August by the lunar calendar)', { at: { y: 1441 } }, ['wp-cheugugi']),
    ev('ko', 'Rain gauge standardised', { at: { y: 1442 } }, ['wp-cheugugi']),
    ev('ko', 'The alphabet is introduced to the court, 12th lunar month', { from: { y: 1443, m: 12, d: 30 }, to: { y: 1444, m: 1, d: 28 } }, ['wp-hunminjeongeum'], { note: 'Crosses a Gregorian year boundary.' }),
    ev('eu', 'Battle of Varna', { at: { y: 1444, m: 11, d: 10 } }, ['wp-battle_of_varna']),
    ev('ko', 'Hunminjeongeum published, about October (9th lunar month)', { at: { y: 1446, m: 10 } }, ['wp-hunminjeongeum'], { note: 'The exact day is not known; only the month is drawn.' }),
    ev('ko', 'Yongbi eocheonga published, the first work written in the new alphabet', { at: { y: 1447 } }, ['wp-yongbi_eocheonga']),
  ],
};

export const STORIES = [
  { id: 'rosetta', caseId: 'case-05', year: 1799, title: 'A slab found by soldiers', form: 'Inspect an object', where: 'Egypt, France, Britain', beats: [
    { id: 'found', form: 'text', title: 'Found, not made', text: 'In July 1799, during France’s invasion of Egypt, soldiers found a slab of dark stone at Rashid, which Europeans called Rosetta. It carries a decree issued in 196 BCE.', src: ['wp-rosetta_stone', 'wp-french_campaign_in_egypt_and_syria'] },
    { id: 'inspect', form: 'inspect', title: 'Look at the stone', text: 'Tap a register to see what it holds. Each band is drawn as tall as its number of lines. This is a diagram, not a photograph, and it is not to scale across the width.', src: ['wp-rosetta_stone'] },
    { id: 'reading', form: 'stonetime', title: 'Reading it took decades', text: 'Move the year. The stone was found in 1799; its Greek text was first fully translated in 1803; the Egyptian scripts were not transliterated until 1822.', src: ['wp-rosetta_stone'] },
    { id: 'day', form: 'compare', title: 'How sure is the day?', text: 'The year is stable. The day is not. Compare what different accounts say, and filter to the ones the editor actually opened.', src: ['wp-rosetta_stone'] },
    { id: 'take', form: 'takeaway', editorial: true, title: 'Three questions, three dates', text: 'When was it made? 196 BCE. When was it found? 1799. When was it read? 1803 for the Greek, 1822 for the Egyptian scripts. A case that asks “when” has to say which.', src: ['wp-rosetta_stone'] },
  ] },
  { id: 'smallpox', caseId: 'case-06', year: 1977, title: 'The last case that was not a laboratory’s', form: 'Scrub a chart', where: 'Africa, Asia, South America', beats: [
    { id: 'last', form: 'text', title: 'October 1977, Somalia', text: 'The last known naturally occurring case of smallpox was diagnosed in Somalia in October 1977. The CDC says there have been no cases since 1977.', src: ['wp-ali_maow_maalin', 'who-smallpox', 'cdc-smallpox'] },
    { id: 'regions', form: 'smallpox', title: 'Region by region', text: 'Move the year. WHO says smallpox was eliminated from South America in 1971, Asia in 1975 and Africa in 1977. These are the only regions its page names.', src: ['who-smallpox'] },
    { id: 'cost', form: 'isep', title: 'Who paid', text: 'The Intensified Smallpox Eradication Programme cost about US$300 million. WHO says two thirds came from the endemic countries’ own eradication efforts. Tap a part to read it.', src: ['who-smallpox'] },
    { id: 'defs', form: 'defs', title: 'Four dates, four questions', text: 'Choose a question. “The last case” means a different year depending on what you ask.', src: ['wp-rahima_banu', 'wp-ali_maow_maalin', 'wp-janet_parker', 'who-smallpox'] },
    { id: 'take', form: 'takeaway', editorial: true, title: '“Last” needs a definition', text: 'The last case of the deadlier form, the last natural case, the last case of any kind and the declaration of eradication fall in 1975, 1977, 1978 and 1980. A fair question names which one it means.', src: ['who-smallpox', 'wp-ali_maow_maalin'] },
  ] },
  { id: 'galleon', caseId: 'case-03', year: 1565, title: 'The way back across the Pacific', form: 'Follow a route', where: 'Mexico, the Philippines', beats: [
    { id: 'arrive', form: 'text', title: '8 October 1565', text: 'Andrés de Urdaneta’s ship reached Acapulco on 8 October 1565. It had left Cebu on 1 June. Urdaneta and Alonso de Arellano made the first successful round trips that year, taking advantage of the Kuroshio Current.', src: ['wp-andr%c3%a9s_de_urdaneta', 'wp-manila_galleon'] },
    { id: 'route', form: 'route', title: 'Out, and back', text: 'Choose a leg and move along it. The fleet sailed from La Navidad on 21 November 1564 and reached Samar on 13 February 1565. The way back left Cebu on 1 June 1565 and reached Acapulco on 8 October. The days are counted from those dates. The drawing shows no coastline and no track.', src: ['wp-andr%c3%a9s_de_urdaneta'] },
    { id: 'span', form: 'span', title: 'A route that lasted', text: 'The Manila galleon route ran from 1565 to 1815. The Spanish colonial capital moved to Manila in 1571. Tap a marker.', src: ['wp-manila_galleon', 'wp-miguel_l%c3%b3pez_de_legazpi'] },
    { id: 'take', form: 'takeaway', editorial: true, title: 'Finding the way back', text: 'Urdaneta was given the task of finding a return route from the Philippines to Mexico. The Manila galleon route was inaugurated in 1565, once that return had worked, and 1565 is the year the case asks for.', src: ['wp-andr%c3%a9s_de_urdaneta', 'wp-manila_galleon'] },
  ] },
  { id: 'hangul', caseId: 'case-08', year: 1446, title: 'Sounds for the people', form: 'Convert a calendar', where: 'Korea', beats: [
    { id: 'pub', form: 'text', title: 'About October 1446', text: 'The Hunminjeongeum, the document that introduced the Korean alphabet, was published around October 1446, in the ninth month of the Korean lunar calendar. The exact day is not known.', src: ['wp-hunminjeongeum'] },
    { id: 'cal', form: 'calendar', title: 'When was it made?', text: 'The alphabet was introduced to the court in the 12th lunar month of 1443. Move through that month and watch the Gregorian year change in the middle of it.', src: ['wp-hunminjeongeum'] },
    { id: 'lanes', form: 'lanes', lanes: 'LANES_1441', title: 'Seven years at one court', text: 'Filter the lanes. Korean dates are by the lunar calendar and converted; a month or a year band shows how precisely each is known. Varna is drawn for contrast: a battle on the other side of Eurasia, in the same years.', src: ['wp-cheugugi', 'wp-hunminjeongeum', 'wp-yongbi_eocheonga', 'wp-battle_of_varna'] },
    { id: 'take', form: 'takeaway', editorial: true, title: 'Made or published?', text: 'The alphabet’s creation falls across two Gregorian years, 1443 and 1444, so a fair question cannot ask for it. Its publication, in 1446, sits inside one.', src: ['wp-hunminjeongeum'] },
  ] },
  { id: 'road', caseId: 'case-07', year: 1325, title: 'Who was on the road?', form: 'Compare lanes', where: 'Morocco, Mali, Italy, England', beats: [
    { id: 'leave', form: 'text', title: '14 June 1325', text: 'Ibn Battuta set off from Tangier on 2 Rajab 725 in the Islamic calendar, which the source gives as 14 June 1325. He was about 21.', src: ['wp-ibn_battuta'] },
    { id: 'lanes', form: 'lanes', lanes: 'LANES_1324', title: 'One decade, four places', text: 'Filter the lanes and tap an event. A year band means only the year is known. The dashed band is a tradition, not a fact.', src: ['wp-marco_polo', 'wp-mansa_musa', 'wp-ibn_battuta', 'wp-edward_ii_of_england', 'wp-tenochtitlan'] },
    { id: 'rel', form: 'relation', editorial: true, title: 'What this is, and is not', text: 'These events overlap in time. No source here says one caused another. They sit together because a puzzle picked them.', src: ['wp-marco_polo', 'wp-ibn_battuta'] },
  ] },
  { id: 'y1969', caseId: 'case-01', year: 1969, title: 'A very fast prototype', form: 'Compare lanes', where: 'France, the United States, Algeria', beats: [
    { id: 'first', form: 'text', title: '2 March 1969', text: 'Concorde prototype 001 made its first flight from Toulouse on 2 March 1969. It first went supersonic on 1 October.', src: ['wp-concorde'] },
    { id: 'lanes', form: 'lanes', lanes: 'LANES_1969', title: 'Three lanes of 1969', text: 'Filter the lanes. The aircraft and the Moon landing are what our sources made easy to find. The Algiers festival came from a page that mentions it in passing.', src: ['wp-boeing_747', 'wp-concorde', 'wp-apollo_11', 'wp-pan-africanism'] },
    { id: 'bias', form: 'relation', editorial: true, title: 'Who is missing from this list?', text: 'A list built from what could be opened leans on aircraft and space. This pack found one African event for 1969 and could open only one page about it. That is a limit of the pack, not of 1969.', src: ['wp-pan-africanism', 'wp-concorde'] },
  ] },
];
export const finaleLanes = LANES_1977;
export const LANE_SETS = { LANES_1324, LANES_1969, LANES_1977, LANES_1441 };
