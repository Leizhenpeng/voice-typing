import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

export type ToolBarSide = 'ToolbarTop' | 'ToolbarBottom';

export interface ToolBarPosition {
  left: boolean;
  right: boolean;
  bottom: boolean;
  top: boolean;
  offsetX: number;
  offsetY: number;
}

export interface ToolBarStyle {
  shake: boolean;
  elastic: boolean;
  hover: boolean;
  hidden: boolean;
  side: ToolBarSide;
}

interface ToolBarState {
  position: ToolBarPosition;
  style: ToolBarStyle;
  hideUI: boolean;
}

interface ToolBarContextProps {
  toolBarState: ToolBarState;
  setToolBarState: React.Dispatch<React.SetStateAction<ToolBarState>>;
}

const defaultToolBarState: ToolBarState = {
  position: {
    left: true,
    right: false,
    bottom: true,
    top: false,
    offsetX: 800,
    offsetY: 100,
  },
  style: {
    shake: false,
    elastic: false,
    hover: false,
    hidden: false,
    side: 'ToolbarBottom',
  },
  hideUI: false,
};

export const ToolBarContext = createContext<ToolBarContextProps | undefined>(undefined);

export const ToolBarProvider = ({ children }: { children: ReactNode }) => {
  const [toolBarState, setToolBarState] = useState<ToolBarState>(defaultToolBarState);
  useEffect(() => {
    chrome.storage.local.get(['toolBarState'], function (result) {
      if (result.toolBarState) {
        setToolBarState(result.toolBarState);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ toolBarState }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving toolBarState:', chrome.runtime.lastError);
      } else {
        console.log('toolBarState saved successfully.');
      }
    });
  }, [toolBarState]);

  return <ToolBarContext.Provider value={{ toolBarState, setToolBarState }}>{children}</ToolBarContext.Provider>;
};

export const useToolBar = (): ToolBarContextProps => {
  const context = useContext(ToolBarContext);
  if (!context) {
    throw new Error('useToolBar must be used within a ToolBarProvider');
  }
  return context;
};
