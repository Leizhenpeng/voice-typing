/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState, forwardRef, RefObject } from 'react';
import { Rnd } from 'react-rnd';
import { useToolBar, ToolBarPosition } from './context';
import { cn } from 'classname-merge';

interface DraggableToolbarProps {
  children: React.ReactNode;
  onPositionChange?: (newPosition: ToolBarPosition) => void;
}

const DraggableToolbar = forwardRef<HTMLDivElement, DraggableToolbarProps>(
  ({ children, onPositionChange }, ToolbarRef) => {
    const DragRef = useRef<Rnd>(null);
    const [, setSide] = React.useState('ToolbarTop');
    const [dragging, setDragging] = useState('');
    const { toolBarState, setToolBarState } = useToolBar();

    const handleDragStart = () => {
      setDragging('ToolbarDragging');
    };

    const updateShake = (shake = true) => {
      setToolBarState(prevState => ({
        ...prevState,
        style: {
          ...prevState.style,
          shake,
        },
      }));
    };

    const updateElastic = (elastic = true) => {
      setToolBarState(prevState => ({
        ...prevState,
        style: {
          ...prevState.style,
          elastic,
        },
      }));
    };

    const handleDrag = (e: any, d: { x: number; y: number }) => {
      if (!ToolbarRef || !(ToolbarRef as RefObject<HTMLDivElement>).current) return;

      const { width, height } = (ToolbarRef as RefObject<HTMLDivElement>).current!.getBoundingClientRect();

      if (d.y < 130) {
        setSide('ToolbarBottom');
      } else {
        setSide('ToolbarTop');
      }

      if (d.x < -25 || d.x + width > window.innerWidth || d.y < 60 || d.y + height - 80 > window.innerHeight) {
        updateShake();
      } else {
        updateShake(false);
      }
    };

    const handleDrop = (e: any, d: { x: number; y: number }) => {
      setDragging('');
      updateShake(false);
      updateElastic(false);

      if (!ToolbarRef || !(ToolbarRef as RefObject<HTMLDivElement>).current) return;

      let { x, y } = d;
      const { width, height } = (ToolbarRef as RefObject<HTMLDivElement>).current!.getBoundingClientRect();

      if (y < 130) {
        setSide('ToolbarBottom');
      } else {
        setSide('ToolbarTop');
      }

      if (x < -10) {
        updateElastic();
        x = -10;
      }
      if (x + width + 30 > window.innerWidth) {
        updateElastic();
        x = window.innerWidth - width - 30;
      }
      if (y < 80) {
        updateElastic();
        y = 80;
      }
      if (y + height - 60 > window.innerHeight) {
        updateElastic();
        y = window.innerHeight - height + 60;
      }

      setTimeout(() => {
        updateElastic(false);
      }, 250);

      const left = x < window.innerWidth / 2;
      const top = y < window.innerHeight / 2;

      const newPosition: ToolBarPosition = {
        offsetX: left ? x : window.innerWidth - x,
        offsetY: top ? y : window.innerHeight - y,
        left,
        right: !left,
        top,
        bottom: !top,
      };

      setToolBarState(prevState => ({
        ...prevState,
        position: newPosition,
      }));

      if (onPositionChange) {
        onPositionChange(newPosition);
      }

      if (DragRef.current) {
        DragRef.current.updatePosition({ x: newPosition.offsetX, y: newPosition.offsetY });
      }
    };

    useEffect(() => {
      const setToolbarPosition = () => {
        if (!ToolbarRef || !(ToolbarRef as RefObject<HTMLDivElement>).current) return;

        const { width, height } = (ToolbarRef as RefObject<HTMLDivElement>).current!.getBoundingClientRect();
        let { offsetX: x, offsetY: y } = toolBarState.position;

        if (toolBarState.position.right) x = window.innerWidth - x;
        if (toolBarState.position.bottom) y = window.innerHeight - y;

        if (x + width + 30 > window.innerWidth) x = window.innerWidth - width - 30;
        if (y + height - 60 > window.innerHeight) y = window.innerHeight - height + 60;

        if (DragRef.current) {
          DragRef.current.updatePosition({ x, y });
        }
      };

      window.addEventListener('resize', setToolbarPosition);
      setToolbarPosition();
      return () => window.removeEventListener('resize', setToolbarPosition);
    }, [toolBarState.position]);

    useEffect(() => {
      const { offsetX: x, offsetY: y, right, bottom } = toolBarState.position;

      const initialX = right ? window.innerWidth - x : x;
      const initialY = bottom ? window.innerHeight - y : y;

      if (DragRef.current) {
        DragRef.current.updatePosition({ x: initialX, y: initialY });
      }
      handleDrop(null, { x: initialX, y: initialY });
    }, []);

    return (
      <Rnd
        default={{
          x: 0,
          y: 500,
          width: 'auto',
          height: 'auto',
        }}
        className={cn(
          'react-draggable',
          {
            ToolbarShake: toolBarState.style.shake,
            ToolbarElastic: toolBarState.style.elastic,
          },
          dragging,
        )}
        dragHandleClassName="grab"
        enableResizing={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDrop}
        ref={DragRef}>
        <div ref={ToolbarRef} className="ToolbarContainer">
          {children}
        </div>
      </Rnd>
    );
  },
);

DraggableToolbar.displayName = 'DraggableToolbar';

export default DraggableToolbar;
