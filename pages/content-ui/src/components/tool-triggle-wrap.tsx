import React from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import TooltipWrap from './tool-tip-wrap';
import { cn } from 'classname-merge';

interface ToolTriggerProps {
  grab?: boolean;
  resume?: boolean;
  content?: string;
  type: 'button' | 'mode' | 'toggle';
  onClick?: () => void;
  disabled?: boolean;
  value?: string;
  children: React.ReactNode;
}

const ToolTrigger: React.FC<ToolTriggerProps> = ({
  grab,
  resume,
  content,
  type,
  onClick,
  disabled,
  value,
  children,
}) => {
  const renderToolbarItem = () => {
    const toolbarConfig = {
      button: (
        <Toolbar.Button
          className={cn('ToolbarButton', { grab: grab, resume: resume })}
          onClick={onClick}
          disabled={disabled}>
          {children}
        </Toolbar.Button>
      ),
      mode: (
        <div className="ToolbarToggleWrap">
          <Toolbar.ToggleItem className="ToolbarModeItem" value={value!} disabled={disabled}>
            {children}
          </Toolbar.ToggleItem>
        </div>
      ),
      toggle: (
        <div className="ToolbarToggleWrap">
          <Toolbar.ToggleItem className="ToolbarToggleItem" value={value!} disabled={disabled}>
            {children}
          </Toolbar.ToggleItem>
        </div>
      ),
    };

    return toolbarConfig[type];
  };

  return <TooltipWrap content={content}>{renderToolbarItem()}</TooltipWrap>;
};

export default ToolTrigger;
