import pptxgen from 'pptxgenjs';
import type { Project } from '../types.ts';
import { getTheme, watermarkColor } from './themes.ts';

function themeBackgroundSvg(themeId: string) {
  const theme = getTheme(themeId);
  const colors = theme.background.match(/#[0-9a-f]{6}/gi) ?? ['#17263b', '#202c44', '#927ca1'];
  const [a, b, c] = colors;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><defs><radialGradient id="g" cx="50%" cy="52%" r="72%"><stop offset="0%" stop-color="${a}"/><stop offset="48%" stop-color="${b ?? a}"/><stop offset="100%" stop-color="${c ?? b ?? a}"/></radialGradient><linearGradient id="shade" x2="0" y2="1"><stop stop-color="#080b14" stop-opacity=".04"/><stop offset="1" stop-color="#080b14" stop-opacity=".35"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/><rect width="1600" height="900" fill="url(#shade)"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export async function exportProject(project: Project) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'PEACE SLIDES';
  pptx.subject = project.kind === 'verse' ? 'Scripture presentation' : 'Worship presentation';
  pptx.title = project.title;
  pptx.theme = { headFontFace: project.font, bodyFontFace: project.font };
  const backgroundCache = new Map<string, string>();
  const getBackground = async (themeId: string) => {
    if (project.backgroundDataUrl) return project.backgroundDataUrl;
    const theme = getTheme(themeId);
    if (!theme.image) return themeBackgroundSvg(theme.id);
    if (!backgroundCache.has(theme.image)) {
      const response = await fetch(theme.image);
      if (!response.ok) throw new Error(`Could not load background: ${theme.name}`);
      const blob = await response.blob();
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader(); reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Image conversion failed')); reader.onerror = () => reject(reader.error); reader.readAsDataURL(blob);
      });
      backgroundCache.set(theme.image, data);
    }
    return backgroundCache.get(theme.image)!;
  };
  for (const slideData of project.slides) {
    const slide = pptx.addSlide();
    const theme = getTheme(slideData.themeId || project.themeId);
    slide.addImage({ data: await getBackground(slideData.themeId || project.themeId), x: 0, y: 0, w: 13.333, h: 7.5 });
    if (project.panel) slide.addShape(pptx.ShapeType.roundRect, { x: 1.05, y: 1.48, w: 11.23, h: 4.54, rectRadius: .12, fill: { color: '10131D', transparency: 100 - project.panelOpacity }, line: { color: 'FFFFFF', transparency: 84, width: .7 } });
    slide.addText(slideData.text, { x: 1.1, y: 1.45, w: 11.13, h: 4.6, fontFace: project.font, fontSize: project.fontSize, color: project.textColor.replace('#', ''), bold: project.bold ?? true, italic: project.italic ?? false, align: project.textAlign || 'center', valign: 'middle', fit: 'shrink', margin: .12, breakLine: false, shadow: project.glow > 0 ? { type: 'outer', color: theme.accent.replace('#', ''), blur: 4, angle: 45, offset: 1, opacity: Math.min(project.glow / 100, .55) } : undefined });
    if (project.watermarkVisible ?? true) slide.addText('PEACE SLIDES', { x: 10.05, y: 7.08, w: 2.85, h: .18, fontFace: 'Aptos', fontSize: 8, color: watermarkColor(theme.id).replace('#',''), transparency: 100 - (project.watermarkOpacity ?? 40), charSpacing: 2, align: 'right', valign: 'middle', margin: 0, breakLine: false, fit: 'shrink' });
  }
  const safeName = project.title.replace(/[\\/:*?"<>|]/g, '-').trim() || 'Worship';
  await pptx.writeFile({ fileName: `${safeName}.pptx` });
}
