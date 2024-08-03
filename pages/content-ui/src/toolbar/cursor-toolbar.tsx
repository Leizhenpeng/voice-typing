import React from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import OpenAIIcon from '@src/icons/openai.svg?react';
import ChromeIcon from '@src/icons/chrome.svg?react';

import TooltipWrap from '@src/components/tool-tip-wrap';

// Define the props type
interface CursorToolbarProps {
  visible: boolean;
  setMode: (mode: boolean) => void;
}

const CursorToolbar: React.FC<CursorToolbarProps> = ({ setMode }) => {
  // 默认选择 highlight 模型
  React.useEffect(() => {
    setMode(true);
  }, []);

  return (
    <Toolbar.Root className={'DrawingToolbar' + ' ' + 'show-toolbar'} aria-label="Cursor options" tabIndex={0}>
      <Toolbar.ToggleGroup type="single" className="ToolbarToggleGroup" defaultValue="highlight">
        <TooltipWrap content="Default">
          <div className="ToolbarToggleWrap">
            <Toolbar.ToggleItem className="ToolbarToggleItem" value="highlight" onClick={() => setMode(true)}>
              <OpenAIIcon />
            </Toolbar.ToggleItem>
          </div>
        </TooltipWrap>
        <Toolbar.Separator className="ToolbarSeparator" />

        <TooltipWrap content={chrome.i18n.getMessage('highlightCursorTooltip')}>
          <div className="ToolbarToggleWrap">
            <Toolbar.ToggleItem className="ToolbarToggleItem" value="none" onClick={() => setMode(false)}>
              <ChromeIcon />
            </Toolbar.ToggleItem>
          </div>
        </TooltipWrap>
      </Toolbar.ToggleGroup>
    </Toolbar.Root>
  );
};

export default CursorToolbar;
