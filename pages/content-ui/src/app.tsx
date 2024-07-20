import { useEffect } from 'react';
import Toolbar from './toolbar';
export default function App() {
  useEffect(() => {
    console.log('content ui loaded');
  }, []);

  return <Toolbar />;
}
