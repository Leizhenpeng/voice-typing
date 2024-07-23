import { FunctionComponent } from 'react';
import { cn } from 'classname-merge';
import { useToolBar } from '../contexts/toolbar-context';

const Boundary: FunctionComponent = () => {
  const { toolBarState } = useToolBar();
  return <div className={cn('ToolbarBounds', { ToolbarShake: toolBarState.style.shake })}></div>;
};

export default Boundary;
