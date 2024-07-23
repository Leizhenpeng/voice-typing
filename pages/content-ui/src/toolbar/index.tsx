import { useRef } from 'react';
import AlterIcon from '@src/icons/grab.svg?react';
import Boundary from './boundary';
import { useToolBar } from '../contexts/toolbar-context';
import DraggableToolbar from './drag-warp';
import { cn } from 'classname-merge';
import * as Toolbar from '@radix-ui/react-toolbar';
import ToolTrigger from '@src/components/tool-triggle-wrap';
import MicToggle from './mic-toggle';

const ToolbarWarp = () => {
  const ToolbarRef = useRef<HTMLDivElement>(null);
  const { toolBarState } = useToolBar();

  return (
    <div className="toolbar-page">
      <Boundary />
      <DraggableToolbar ref={ToolbarRef}>
        <Toolbar.Root
          ref={ToolbarRef}
          className={cn(
            'ToolbarRoot',
            'grab',
            toolBarState.position.top ? 'ToolbarTop' : 'ToolbarBottom',
            toolBarState.style.hover && 'ToolbarTransparent',
            toolBarState.style.hidden && 'ForceTransparent',
            toolBarState.style.side,
          )}>
          <ToolTrigger grab type="button">
            <AlterIcon />
          </ToolTrigger>
          <Toolbar.Separator className="ToolbarSeparator" />
          <MicToggle />

          {/* <ToolTrigger grab type="button" content="">
            </ToolTrigger> */}
          {/* 其他内容 */}
        </Toolbar.Root>
      </DraggableToolbar>
    </div>
  );
};

export default ToolbarWarp;
