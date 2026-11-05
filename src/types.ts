export type Theme = { id: string; name: string; category: string; style: string; background: string; accent: string; text: string; image?: string };
export type Section = { id: string; label: string; lines: string[] };
export type Slide = { id: string; text: string; themeId: string; transition: string };
export type Project = { id: string; title: string; kind: 'song'|'verse'; updatedAt: string; lyrics: string; sections: Section[]; slides: Slide[]; themeId: string; font: string; fontSize: number; panelOpacity: number; glow: number; textColor: string; panel: boolean; verseRef?: string; backgroundDataUrl?: string; bold?: boolean; italic?: boolean; textAlign?: 'left'|'center'|'right'; watermarkVisible?: boolean; watermarkOpacity?: number };
