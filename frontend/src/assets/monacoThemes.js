// monacoThemes.js

export const registerMonacoThemes = (monaco) => {
  if (!monaco) return;

  // ====== DARK THEMES ======

  monaco.editor.defineTheme('evalytics-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '7C7C7C', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'FF5370' },
      { token: 'string', foreground: 'C3E88D' },
      { token: 'variable', foreground: 'F78C6C' },
    ],
    colors: {
      'editor.background': '#1A1A2E',
      'editor.lineHighlightBackground': '#2E2E3E',
      'editorCursor.foreground': '#FFFFFF',
    },
  });

  monaco.editor.defineTheme('monokai', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '75715E' },
      { token: 'keyword', foreground: 'F92672' },
      { token: 'string', foreground: 'E6DB74' },
      { token: 'variable', foreground: 'A6E22E' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#F8F8F2',
    },
  });

  monaco.editor.defineTheme('dracula', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272a4' },
      { token: 'keyword', foreground: 'ff79c6' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'variable', foreground: '50fa7b' },
    ],
    colors: {
      'editor.background': '#282A36',
      'editorCursor.foreground': '#FF79C6',
    },
  });

  monaco.editor.defineTheme('nord', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '616E88' },
      { token: 'keyword', foreground: '81A1C1' },
      { token: 'string', foreground: 'A3BE8C' },
    ],
    colors: {
      'editor.background': '#2E3440',
      'editor.foreground': '#D8DEE9',
    },
  });

  monaco.editor.defineTheme('solarized-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '586e75' },
      { token: 'keyword', foreground: '859900' },
      { token: 'string', foreground: '2aa198' },
    ],
    colors: {
      'editor.background': '#002b36',
      'editor.foreground': '#839496',
    },
  });

  monaco.editor.defineTheme('github-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6a737d' },
      { token: 'keyword', foreground: 'f97583' },
      { token: 'string', foreground: '9ecbff' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#c9d1d9',
    },
  });

  monaco.editor.defineTheme('one-dark-pro', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5c6370' },
      { token: 'keyword', foreground: 'c678dd' },
      { token: 'string', foreground: '98c379' },
    ],
    colors: {
      'editor.background': '#282c34',
      'editor.foreground': '#abb2bf',
    },
  });

  // ====== LIGHT THEMES ======

  monaco.editor.defineTheme('solarized-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '93a1a1' },
      { token: 'keyword', foreground: '859900' },
      { token: 'string', foreground: '2aa198' },
    ],
    colors: {
      'editor.background': '#fdf6e3',
      'editor.foreground': '#657b83',
    },
  });

  monaco.editor.defineTheme('github-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6a737d' },
      { token: 'keyword', foreground: 'd73a49' },
      { token: 'string', foreground: '032f62' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#24292e',
    },
  });

  monaco.editor.defineTheme('one-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: 'a0a1a7' },
      { token: 'keyword', foreground: 'a626a4' },
      { token: 'string', foreground: '50a14f' },
    ],
    colors: {
      'editor.background': '#fafafa',
      'editor.foreground': '#383a42',
    },
  });
};

export const themeOptions = [
  // Monaco built-in
  'vs-dark', 'vs', 'light', 'hc-black',

  // Custom
  'evalytics-dark',
  'monokai',
  'dracula',
  'nord',
  'solarized-dark',
  'github-dark',
  'one-dark-pro',
  'solarized-light',
  'github-light',
  'one-light',
];
