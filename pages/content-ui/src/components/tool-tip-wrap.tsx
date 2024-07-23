import React, { useState, CSSProperties, ReactNode } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface TooltipWrapProps {
  name?: string;
  style?: CSSProperties;
  content?: string;
  children: ReactNode;
  override?: string;
  hide?: string;
}

const TooltipWrap: React.FC<TooltipWrapProps> = props => {
  const classname = props.name ? props.name : '';
  const [override] = useState<string>('');

  return (
    <div className={classname} style={props.style}>
      {props.content === '' ? (
        <div>{props.children}</div>
      ) : (
        <Tooltip.Provider>
          <Tooltip.Root delayDuration={700} defaultOpen={false}>
            <Tooltip.Trigger asChild>{props.children}</Tooltip.Trigger>
            <Tooltip.Portal container={document.getElementsByClassName('shadow-dom')[0] as HTMLElement}>
              <Tooltip.Content
                className={'TooltipContent' + ' ' + (props.override || '') + ' ' + (props.hide || '') + ' ' + override}
                style={{
                  display: override === 'override' ? 'none' : 'block',
                }}>
                {props.content}
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </div>
  );
};

export default TooltipWrap;
