import { useRef, useState } from 'react';
import AlterIcon from '@src/icons/grab.svg?react';
// import StopIcon from '@src/icons/stop.svg?react';
// import RestartIcon from '@src/icons/restart.svg?react';
// import PauseIcon from '@src/icons/pause.svg?react';
// import ResumeIcon from '@src/icons/resume.svg?react';
// import DiscardIcon from '@src/icons/discard.svg?react';
import CursorIcon from '@src/icons/cursor.svg?react';
import Boundary from './boundary';
import { useToolBar } from '../contexts/toolbar-context';
import DraggableToolbar from './drag-warp';
import { cn } from 'classname-merge';
import * as Toolbar from '@radix-ui/react-toolbar';
import ToolTrigger from '@src/components/tool-triggle-wrap';
import MicToggle from './mic-toggle';
import CursorToolbar from './cursor-toolbar';
import AudioRecorder from './AudioRecorder';

const ToolbarWarp = () => {
  const ToolbarRef = useRef<HTMLDivElement>(null);
  const { toolBarState } = useToolBar();
  const [transcript, setTranscript] = useState('');
  const [useApiTranscription, setUseApiTranscription] = useState(true);

  return (
    <div className="toolbar-page">
      <div className="fixed bottom-10 w-full text-center text-3xl py-2 rounded z-50">
        <span className="text-black">{transcript}</span>
      </div>
      <Boundary />
      <DraggableToolbar ref={ToolbarRef}>
        <Toolbar.Root
          ref={ToolbarRef}
          className={cn(
            'ToolbarRoot',
            toolBarState.position.top ? 'ToolbarTop' : 'ToolbarBottom',
            toolBarState.style.hover && 'ToolbarTransparent',
            toolBarState.style.hidden && 'ForceTransparent',
            toolBarState.style.side,
          )}>
          <ToolTrigger grab type="button">
            <AlterIcon />
          </ToolTrigger>
          <div className={'ToolbarRecordingControls'}>
            <AudioRecorder onFinalTranscript={setTranscript} useApiTranscription={useApiTranscription} />
            {/* <ToolTrigger type="button" content={chrome.i18n.getMessage('finishRecordingTooltip')}>
              <StopIcon width="20" height="20" />
            </ToolTrigger>
            <div className="ToolbarRecordingTime">{'22:22'}</div>
            <ToolTrigger type="button" content={chrome.i18n.getMessage('restartRecordingTooltip')}>
              <RestartIcon />
            </ToolTrigger> */}
            {/* {!false && (
              <ToolTrigger type="button" content={chrome.i18n.getMessage('pauseRecordingTooltip')}>
                <PauseIcon />
              </ToolTrigger>
            )}
            {true && (
              <ToolTrigger type="button" resume content={chrome.i18n.getMessage('resumeRecordingTooltip')}>
                <ResumeIcon />
              </ToolTrigger>
            )}
            <ToolTrigger type="button" content={chrome.i18n.getMessage('cancelRecordingTooltip')}>
              <DiscardIcon />
            </ToolTrigger> */}
          </div>
          <Toolbar.Separator className="ToolbarSeparator" />
          <Toolbar.ToggleGroup type="single" className="ToolbarToggleGroup" value={''} onValueChange={() => {}}>
            <div className="ToolbarToggleWrap">
              <ToolTrigger type="mode" content={chrome.i18n.getMessage('toggleCursorOptionsTooltip')} value="cursor">
                {/* {<TargetCursorIcon />} */}

                {<CursorIcon />}
              </ToolTrigger>
              <CursorToolbar visible={true} setMode={setUseApiTranscription} />
            </div>
          </Toolbar.ToggleGroup>

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
