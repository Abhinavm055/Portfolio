import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type CursorType = 'default' | 'hover' | 'magnetic' | 'hidden' | 'text' | 'link';

interface CursorContextProps {
  cursorType: CursorType;
  setCursorType: (type: CursorType) => void;
  cursorText: string;
  setCursorText: (text: string) => void;
}

const CursorContext = createContext<CursorContextProps>({
  cursorType: 'default',
  setCursorType: () => {},
  cursorText: '',
  setCursorText: () => {},
});

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [cursorText, setCursorText] = useState<string>('');

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType, cursorText, setCursorText }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);
