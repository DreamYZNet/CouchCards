import React from 'react';
import './css/Main.css';
import GameLoader from './components/GameLoader';
import { Helmet } from 'react-helmet';

function App() {
  // style={{border:'solid blue 2px'}}
  return (
    <div className="App" style={{}}>
      <GameLoader/>
      <Helmet>
        <title>Couch Cards</title>
        <meta property="og:title" content="Couch Cards"/>
        <meta property="og:description" content="Play cards from ya couch!"/>
      </Helmet>
    </div>
  );
}

export default App;
