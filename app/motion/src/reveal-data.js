// Reveal pathways. Every date comes from the Stage 3 pack facts (V1, one opened source) and is labelled as such on screen.
// Years are astronomical (196 BCE = -195). Steps say what to look at; the camera moves there. Dates are in the text too: motion is never the only channel.
export const REVEALS = {
  'case-05': {
    title: 'The world around 1799: the Rosetta Stone',
    kind: 'Made, found, read: three different dates',
    events: [
      { year: -195, label: 'Decree issued (196 BCE)', src: ['wp-rosetta_stone'] },
      { year: 1799, label: 'Found by French soldiers (July; the day varies by source)', src: ['wp-rosetta_stone'] },
      { year: 1803, label: 'First translation of the Greek text published', src: ['wp-rosetta_stone'] },
      { year: 1822, label: 'Champollion announces the Egyptian scripts transliterated', src: ['wp-rosetta_stone'] },
    ],
    steps: [
      { range: [-215, -175], title: 'The words are older than the stone is famous', text: 'The decree on the stone was issued in 196 BCE. That is the date of the text, not of the discovery.' },
      { range: [-215, 1830], title: 'Almost two thousand years pass', text: 'Between the decree and the day the stone was found, nearly two thousand years go by. Zoomed out, only centuries are labelled.' },
      { range: [1792, 1806], title: '1799: found, not made', text: 'French soldiers found the stone in July 1799, during the French invasion of Egypt. Sources disagree on the day; they agree on the year.' },
      { range: [1796, 1826], title: '1803 and 1822: read', text: 'The Greek text was first translated and published in 1803. Champollion announced the transliteration of the Egyptian scripts in Paris in 1822.' },
      { range: [-215, 1830], title: 'Three questions, three dates', text: 'When was it made? When was it found? When was it read? The answers are 196 BCE, 1799, and 1803 to 1822. A case that asks "when" has to say which.' },
    ],
    sources: ['wp-rosetta_stone'],
    honest: 'Dates are from one opened source (Wikipedia) and are marked V1 in the pack. Not yet verified by a second independent source.',
  },
  'case-07': {
    title: 'The world around 1325: a road in 1325',
    kind: 'Surprising coexistence. Simultaneous is not causal.',
    events: [
      { year: 1324, label: 'Marco Polo dies (8 January)', src: ['wp-marco_polo'] },
      { year: 1324.5, label: 'Mansa Musa on pilgrimage through Cairo (1324)', src: ['wp-mansa_musa'] },
      { year: 1325.45, label: 'Ibn Battuta leaves Tangier (14 June 1325)', src: ['wp-ibn_battuta'] },
      { year: 1327.05, label: 'Edward II deposed (January 1327)', src: ['wp-edward_ii_of_england'] },
    ],
    steps: [
      { range: [1320, 1330], title: 'One decade, four places', text: 'Between 1324 and 1327 an Italian merchant-traveller dies, a Malian king crosses Egypt on pilgrimage, a young Moroccan sets out for Mecca, and an English king loses his throne.' },
      { range: [1323.5, 1325.9], title: '1324 to 1325', text: 'Polo dies in January 1324. Mansa Musa travels in 1324. Ibn Battuta sets out in June 1325, the year after Polo died.' },
      { range: [1320, 1330], title: 'What this is, and is not', text: 'These events overlap in time. Nothing here says one caused another. The page lists them together because a puzzle selected them, not because history linked them.' },
    ],
    sources: ['wp-marco_polo', 'wp-mansa_musa', 'wp-ibn_battuta', 'wp-edward_ii_of_england'],
    honest: 'Mansa Musa 1324 rests on one source and is marked HOLD in the pack. Tenochtitlan 1325 is deliberately not shown because its date is traditional.',
  },
};
