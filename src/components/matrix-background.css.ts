import { style } from '@vanilla-extract/css';

export const matrixContainer = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: -999999,
  pointerEvents: 'none',
  overflow: 'hidden',
  background: 'transparent',
});

export const matrixCanvas = style({
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'block',
  width: '100vw',
  height: '100vh',
  opacity: 0.08,
  filter: 'blur(0.3px)',
  zIndex: -999999,
  pointerEvents: 'none',
  background: 'transparent',
  
  '@media': {
    // Dark theme override for better visibility
    '(prefers-color-scheme: dark)': {
      opacity: 0.12,
    },
    // Mobile optimization
    '(max-width: 768px)': {
      opacity: 0.06,
    },
  },
});
