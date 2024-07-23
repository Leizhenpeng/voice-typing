import { useEffect } from 'react';
import ToolbarWarp from './toolbar';
import { ToolBarProvider } from './contexts/toolbar-context';
export default function App() {
  useEffect(() => {
    console.log('content ui loaded');
  }, []);

  return (
    <ToolBarProvider>
      <ToolbarWarp />
    </ToolBarProvider>
  );
}
