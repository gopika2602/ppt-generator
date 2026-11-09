import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ configFile: './vite.config.ts', server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, entries: [] }, logLevel: 'silent' });
try {
  const { titleFromLyrics, detectSections, generateSlides } = await server.ssrLoadModule('/src/engine/lyrics.ts');
  const { selectDesign } = await server.ssrLoadModule('/src/engine/design.ts');
  const { exportProject } = await server.ssrLoadModule('/src/engine/pptx.ts');
  assert.equal(titleFromLyrics('\n\n  நன்றி இயேசுவே உம்மைத் துதிப்பேன்'), 'நன்றி இயேசுவே உம்மைத் துதிப்பேன்');
  assert.equal(titleFromLyrics('  Hope for the new dawn'), 'Hope for the new');
  assert.equal(titleFromLyrics('அன்பே'), 'அன்பே');
  const sections = detectSections('Verse 1\nGod of mercy\nYou are near\n\nChorus\nWe praise you\nYou are holy\n\nChorus\nWe praise you\nYou are holy');
  assert.equal(sections.length, 3);
  assert.equal(sections[2].label, 'Chorus (repeat)');
  assert.ok(sections[2].lines.join(' ').includes('We praise you'));
  const longSlides = generateSlides([{ id: 'x', label: 'Verse', lines: Array.from({ length: 8 }, (_, i) => `Line ${i + 1}`) }], 'sunrise-photo');
  assert.ok(longSlides.length >= 3, 'long stanzas must be divided across multiple slides');
  assert.equal(longSlides.map(slide => slide.text).join('\n').match(/Line \d/g)?.length, 8, 'all lines must retain order and count');
  const crossPicks = Array.from({ length: 20 }, () => selectDesign('At the cross of Calvary, your sacrifice and blood redeemed us').theme.category);
  assert.ok(crossPicks.filter(category => category === 'The Cross').length > 15, 'cross language should favor cross themes');
  const varied = new Set(Array.from({ length: 60 }, () => selectDesign('A song without a clear topic').theme.id));
  assert.ok(varied.size > 1, 'general lyrics should produce varied theme choices');
  const exportSections = detectSections('நன்றி இயேசுவே உம்மைத் துதிப்பேன்\nஉம் நாமத்தை உயர்த்திடுவேன்\n\nகர்த்தர் என் மேய்ப்பர்\nஎனக்கு குறைவில்லை\n\nThank you Jesus\nWe lift your name');
  const slides = generateSlides(exportSections, 'sunrise');
  const project = {
    id: 'acceptance-check', title: 'Peace Slides V4 Export Check', kind: 'song', updatedAt: new Date().toISOString(),
    lyrics: 'நன்றி இயேசுவே உம்மைத் துதிப்பேன்', sections: exportSections, slides, themeId: 'sunrise', font: 'Poppins', fontSize: 34,
    panelOpacity: 28, glow: 35, textColor: '#fffaf0', panel: true, bold: true, italic: false, textAlign: 'center', watermarkVisible: true, watermarkOpacity: 40,
  };
  await exportProject(project);
  console.log(JSON.stringify({ lyricTitle: titleFromLyrics('\nநன்றி இயேசுவே உம்மைத் துதிப்பேன்'), sections: sections.length, longSlides: longSlides.length, crossRelevantPicks: crossPicks.filter(category => category === 'The Cross').length, variedThemes: varied.size, pptx: 'Peace Slides V4 Export Check.pptx' }));
} finally {
  await server.close();
}
