// src/App.tsx
import React from 'react';
import NotificationComponent from './components/NotificationComponent';
import 'bootstrap/dist/css/bootstrap.min.css';


const App: React.FC = () => {
  return (
    <div className="App">
      <NotificationComponent />
    </div>
  );
}

export default App;
