import { useRef } from 'react';
import AlterIcon from './alert-icon.svg?react';
import Boundary from './boundary';
import { useToolBar } from './context';
import DraggableToolbar from './drag-warp';
import { cn } from 'classname-merge';
import * as Toolbar from '@radix-ui/react-toolbar';

const ToolbarWarp = () => {
  const ToolbarRef = useRef<HTMLDivElement>(null);
  const { toolBarState } = useToolBar();

  return (
    <div className="toolbar-page">
      <Boundary />
      <DraggableToolbar
        ref={ToolbarRef}
        // onPositionChange={handlePositionChange}
      >
        <Toolbar.Root
          ref={ToolbarRef}
          className={cn(
            'ToolbarRoot',
            'grab',
            toolBarState.position.top ? 'ToolbarTop' : 'ToolbarBottom',
            toolBarState.style.hover && 'ToolbarTransparent',
            toolBarState.style.hidden && 'ForceTransparent',
          )}>
          <Toolbar.ToggleGroup type="multiple" aria-label="Text formatting">
            <Toolbar.ToggleItem
              className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
              value="bold"
              aria-label="Bold">
              <AlterIcon />
            </Toolbar.ToggleItem>
          </Toolbar.ToggleGroup>

          {/* <ToolTrigger grab type="button" content="">
            </ToolTrigger> */}
          {/* 其他内容 */}
        </Toolbar.Root>
      </DraggableToolbar>
    </div>
  );
};

export default ToolbarWarp;
