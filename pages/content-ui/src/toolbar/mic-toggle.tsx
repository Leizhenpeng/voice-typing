import React from 'react';
import * as Toggle from '@radix-ui/react-toggle';
import MicIcon from '@src/icons/mic.svg?react';
import TooltipWrap from '@src/components/tool-tip-wrap';
// Components

// Context

const MicToggle: React.FC = () => {
  return (
    <TooltipWrap content={''}>
      <div className="ToolbarToggleWrap">
        <Toggle.Root className="ToolbarModeItemSingle" aria-label="Toggle microphone" disabled={false}>
          <MicIcon />
        </Toggle.Root>
      </div>
    </TooltipWrap>
  );
};

export default MicToggle;
