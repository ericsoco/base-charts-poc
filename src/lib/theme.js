// @flow
import React, { createContext, useContext, type Node } from 'react';

export type Theme = $ReadOnly<{|
  colors: $ReadOnlyArray<string>,
|}>;
type Props = $ReadOnly<{|
  children: Node,
  theme?: Theme,
|}>;

export const baseTheme = {
  colors: [
    // Primary color palette
    '#5b91f4',
    '#3ccece',
    '#ffc043',
    '#e28454',
    '#174291',
    // First five of Secondary color palette
    '#ff5b8c',
    '#abf0ff',
    '#6c78d3',
    '#6a126a',
    '#f7df90',
  ],
};

const ThemeContext = createContext<Theme>(baseTheme);

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children, theme = baseTheme }: Props) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
