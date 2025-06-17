import React from 'react';
import { Navbar, Player, VideoCard } from '@jeldon-music/crtv4';
// Or import specific components from specific modules
import { LoginButton } from '@jeldon-music/crtv4/components';
// Or import utility functions
import { helpers } from '@jeldon-music/crtv4/lib';

/**
 * Example component showing how to use crtv4 components
 */
const Crtv4Example = () => {
  return (
    <div className="crtv4-example">
      <h2>CRTV4 Components Example</h2>
      
      {/* Using the Navbar component */}
      <div className="example-section">
        <h3>Navbar Component</h3>
        <Navbar />
      </div>
      
      {/* Using the Player component */}
      <div className="example-section">
        <h3>Player Component</h3>
        <Player 
          src={[{ type: 'video', url: 'https://example.com/video.mp4' }]} 
          title="Example Video" 
        />
      </div>
      
      {/* Using the VideoCard component */}
      <div className="example-section">
        <h3>VideoCard Component</h3>
        <VideoCard 
          title="Example Video"
          thumbnail="https://example.com/thumbnail.jpg"
          views={1000}
          creator="Example Creator"
        />
      </div>
      
      {/* Using the LoginButton component */}
      <div className="example-section">
        <h3>LoginButton Component</h3>
        <LoginButton />
      </div>
    </div>
  );
};

export default Crtv4Example;