import { REVISION } from 'three';
import './style.css';

declare const __BUILD_INFO__: { buildId: string; commit: string; builtAt: string };

function setText(id: string, value: string): void {
  const element = document.getElementById(id);
  if (!element) throw new Error(`起動ページの要素がありません: ${id}`);
  element.textContent = value;
}

setText('status', `起動しました · Three.js r${REVISION}`);
setText('build-id', __BUILD_INFO__.buildId);
setText('commit', __BUILD_INFO__.commit);
setText('built-at', __BUILD_INFO__.builtAt || '開発中');
