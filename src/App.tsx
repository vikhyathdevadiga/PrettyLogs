import * as React from 'react';
import {Theme} from '@twilio-paste/core/theme';
import { Route, Routes } from 'react-router-dom';
import MessagingLogs from './MessagingLogs';
import Login from './Login';

const App: React.FC = () => {
  return <Theme.Provider theme="default">
    <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/logs" element={<MessagingLogs/>}/>
        </Routes>
  </Theme.Provider>;
};

App.displayName = 'App';

export default App;
