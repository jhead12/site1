/**
 * Persistent Music Player Component
 * 
 * A SoundCloud-style persistent audio player that stays fixed at the bottom of the screen
 * and maintains playback state across page navigation.
 */
import React, { useState, useEffect, useRef } from 'react';
import './persistent-player.css';

// Player Context to share state across components
export const PlayerContext = React.createContext({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  addToQueue: () => {},
  clearQueue: () => {},
});

// Main Provider Component
export const PersistentPlayerProvider = ({ children }) => {
  // Player state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // References
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  
  // Initialize player with Samply playlist
  useEffect(() => {
    // Fetch tracks from Samply API or use embedded data
    const initializeSamplyPlaylist = async () => {
      try {
        // This is a placeholder for the actual Samply API integration
        // You might need to adjust this based on how Samply's API works
        const samplyPlaylistId = 'pXJcoEICbOorz8If1Yly';
        const response = await fetch(`https://samply.app/api/embed/${samplyPlaylistId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.tracks) {
            setQueue(data.tracks);
          }
        }
      } catch (error) {
        console.error("Failed to load Samply playlist:", error);
        
        // Fallback - use demo tracks
        const demoTracks = [
          {
            id: 'demo1',
            title: 'Demo Track 1',
            artist: 'J.Eldon',
            audioUrl: '/static/audio/demo-track-1.mp3',
            coverUrl: '/static/images/demo-cover-1.jpg',
            duration: 180, // in seconds
          },
          {
            id: 'demo2',
            title: 'Demo Track 2',
            artist: 'J.Eldon',
            audioUrl: '/static/audio/demo-track-2.mp3',
            coverUrl: '/static/images/demo-cover-2.jpg',
            duration: 210, // in seconds
          }
        ];
        
        setQueue(demoTracks);
      }
    };
    
    initializeSamplyPlaylist();
  }, []);

  // Play track function
  const playTrack = (track) => {
    if (track) {
      setCurrentTrack(track);
      setIsPlaying(true);
      setIsVisible(true);
      
      // If audio element exists, load and play the track
      if (audioRef.current) {
        // Check if the track URL contains a real audio file or a placeholder
        const isPlaceholder = track.audioUrl && 
          (track.audioUrl.includes('demo-track-1.mp3') || 
           track.audioUrl.includes('demo-track-2.mp3'));
        
        if (isPlaceholder) {
          // For placeholder tracks, just simulate playback without trying to load
          console.log("Playing placeholder track:", track.title);
          setIsPlaying(true);
          // Simulate track duration
          setDuration(track.duration || 180);
          // Start a fake progress timer
          let fakeProgress = 0;
          const progressInterval = setInterval(() => {
            fakeProgress += 1;
            if (fakeProgress >= (track.duration || 180)) {
              clearInterval(progressInterval);
              handleTrackEnd();
            } else {
              setProgress(fakeProgress);
            }
          }, 1000);
          return;
        }
        
        // Normal playback for real audio files
        audioRef.current.src = track.audioUrl;
        audioRef.current.load();
        audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err);
          // Handle autoplay restrictions
          setIsPlaying(false);
        });
      }
      
      // Save to localStorage for persistence
      localStorage.setItem('jeldon_player_current_track', JSON.stringify(track));
    }
  };
  
  // Handle existing track playback
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(err => {
          console.error("Error resuming audio:", err);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };
  
  // Next track function
  const nextTrack = () => {
    if (queue.length > 0) {
      const currentIndex = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : -1;
      const nextIndex = currentIndex + 1 < queue.length ? currentIndex + 1 : 0;
      playTrack(queue[nextIndex]);
    }
  };
  
  // Previous track function
  const prevTrack = () => {
    if (queue.length > 0) {
      const currentIndex = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : -1;
      // Go to previous track, or go to the end of the queue if at the beginning
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
      playTrack(queue[prevIndex]);
    }
  };
  
  // Add to queue
  const addToQueue = (track) => {
    setQueue(prevQueue => [...prevQueue, track]);
    
    // If nothing is currently playing, start playing the added track
    if (!currentTrack) {
      playTrack(track);
    }
  };
  
  // Add multiple tracks to queue
  const addMultipleToQueue = (tracks) => {
    if (tracks && tracks.length > 0) {
      setQueue(prevQueue => [...prevQueue, ...tracks]);
      
      // If nothing is currently playing, start the first track
      if (!currentTrack) {
        playTrack(tracks[0]);
      }
    }
  };
  
  // Clear queue
  const clearQueue = () => {
    setQueue([]);
    setCurrentTrack(null);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  // Handle progress bar updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 0;
      const progressPercentage = (currentTime / duration) * 100;
      
      setProgress(progressPercentage);
      setDuration(duration);
    }
  };
  
  // Handle seeking
  const handleSeek = (e) => {
    if (progressBarRef.current && audioRef.current) {
      const progressBar = progressBarRef.current;
      const bounds = progressBar.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const width = bounds.width;
      const percentage = x / width;
      
      // Set the current time based on percentage
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const value = e.target.value;
    setVolume(value);
    
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };
  
  // Handle track end
  const handleTrackEnd = () => {
    nextTrack();
  };
  
  // Format time function (converts seconds to MM:SS format)
  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Prepare player context values
  const playerContextValue = {
    currentTrack,
    isPlaying,
    queue,
    playTrack,
    togglePlayPause,
    nextTrack,
    prevTrack,
    addToQueue,
    addMultipleToQueue,
    clearQueue,
  };
  
  // Restore state from localStorage when component mounts
  useEffect(() => {
    const savedTrack = localStorage.getItem('jeldon_player_current_track');
    if (savedTrack) {
      try {
        const parsedTrack = JSON.parse(savedTrack);
        setCurrentTrack(parsedTrack);
        setIsVisible(true);
      } catch (error) {
        console.error("Error parsing saved track:", error);
      }
    }
    
    // Set initial volume
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, []);
  
  // Show the player when we have a track
  useEffect(() => {
    if (currentTrack) {
      setIsVisible(true);
    }
  }, [currentTrack]);
  
  // Render the player and provider
  return (
    <PlayerContext.Provider value={playerContextValue}>
      {children}
      
      {isVisible && (
        <div className={`persistent-player ${isMinimized ? 'minimized' : ''}`}>
          {/* Audio element (hidden) */}
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleTrackEnd}
          />
          
          {/* Minimize/Maximize toggle */}
          <button 
            className="player-toggle"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          
          {/* Album Art and Track Info */}
          <div className="player-info">
            {currentTrack?.coverUrl && (
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title} 
                className="player-cover"
              />
            )}
            <div className="player-track-info">
              <div className="player-title">{currentTrack?.title || 'No track selected'}</div>
              <div className="player-artist">{currentTrack?.artist || 'Artist'}</div>
            </div>
          </div>
          
          {/* Player Controls */}
          <div className="player-controls">
            <button className="player-control" onClick={prevTrack}>
              ◄◄
            </button>
            <button className="player-control play-pause" onClick={togglePlayPause}>
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <button className="player-control" onClick={nextTrack}>
              ►►
            </button>
          </div>
          
          {/* Seek Bar */}
          <div className="player-progress-container">
            <div className="player-time">{formatTime(audioRef.current?.currentTime || 0)}</div>
            <div 
              className="player-progress-bar" 
              ref={progressBarRef}
              onClick={handleSeek}
            >
              <div 
                className="player-progress" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="player-time">{formatTime(duration)}</div>
          </div>
          
          {/* Volume Control */}
          <div className="player-volume">
            <span className="volume-icon">🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      )}
    </PlayerContext.Provider>
  );
};

// Hook to access player context
export const usePlayer = () => {
  const context = React.useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PersistentPlayerProvider");
  }
  return context;
};

// Play Button Component for use throughout the app
export const PlayButton = ({ track, text = "Play", className = "" }) => {
  const { playTrack } = usePlayer();
  
  return (
    <button 
      className={`play-button ${className}`}
      onClick={() => playTrack(track)}
    >
      {text}
    </button>
  );
};

// Queue Button Component
export const QueueButton = ({ track, text = "Add to Queue", className = "" }) => {
  const { addToQueue } = usePlayer();
  
  return (
    <button 
      className={`queue-button ${className}`}
      onClick={() => addToQueue(track)}
    >
      {text}
    </button>
  );
};

// Playlist Button Component
export const PlaylistButton = ({ tracks, text = "Play All", className = "" }) => {
  const { addMultipleToQueue } = usePlayer();
  
  return (
    <button 
      className={`playlist-button ${className}`}
      onClick={() => addMultipleToQueue(tracks)}
    >
      {text}
    </button>
  );
};

// Default export for direct usage
export default PersistentPlayerProvider;
