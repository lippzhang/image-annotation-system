import React from 'react';
import AnnotationEditor from './components/AnnotationEditor';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <AnnotationEditor />
    </div>
  );
};

export default App;