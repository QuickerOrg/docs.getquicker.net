import {usePrismTheme} from '@docusaurus/theme-common';
import {Highlight} from 'prism-react-renderer';
import type {CSSProperties, ReactNode} from 'react';

export function ParamCodeText({
  code,
  language,
}: {
  code: string;
  language: string;
}): ReactNode {
  const theme = usePrismTheme();
  return (
    <Highlight theme={theme} code={code} language={language}>
      {({style, tokens, getLineProps, getTokenProps}) => {
        const preStyle: CSSProperties = {
          ...style,
          margin: 0,
          padding: 0,
          background: 'transparent',
          backgroundColor: 'transparent',
        };
        return (
          <pre className="qk-sr-param-code" style={preStyle}>
            {tokens.map((line, lineIndex) => (
              <div key={lineIndex} {...getLineProps({line})}>
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} {...getTokenProps({token})} />
                ))}
              </div>
            ))}
          </pre>
        );
      }}
    </Highlight>
  );
}
