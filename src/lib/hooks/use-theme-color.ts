import { useEffect } from 'react';

function hexToRGB(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(2, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `${1} ${17} ${64}`;
}

export function useThemeColor(color: string) {
  useEffect(() => {
    const rgbColor = hexToRGB(color);

    document.documentElement.style.setProperty('--color-brand', rgbColor);
  }, [color]);
}
