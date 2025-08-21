import React from 'react';
import '../Style/offline.css';

const Offline = () => {
  return (
    <div className="offline-container">
      <div className="offline">
        <h1>You are currently Offline</h1>
        <p>We could not load the page. Please check your connection and try again.</p>
      </div>
    </div>
  );
}

export default Offline;
