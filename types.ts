
export interface ColoringTheme {
  id: string;
  name: string;
  description: string;
  prompt: string;
  previewUrl: string;
}

export type Tool = 'brush' | 'bucket' | 'eraser';

export interface CanvasState {
  color: string;
  lineWidth: number;
  tool: Tool;
}
