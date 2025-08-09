// Demo data for testing the analytics dashboards
export const demoMusicData = [
  {
    id: 'beat-1',
    title: 'Summer Vibes Hip Hop Beat',
    type: 'beat',
    category: 'Beats',
    slug: 'summer-vibes-hip-hop',
    date: '2024-12-15',
    price: 50,
    bpm: 140,
    musicalKey: 'C Major',
    featuredImage: null,
    audioUrl: '/demo-audio/summer-vibes.mp3',
    source: 'WordPress',
    beatsFields: {
      price: 50,
      bpm: 140,
      musicalKey: 'C Major'
    }
  },
  {
    id: 'beat-2',
    title: 'Dark Trap Energy',
    type: 'beat',
    category: 'Beats',
    slug: 'dark-trap-energy',
    date: '2024-12-10',
    price: 75,
    bpm: 180,
    musicalKey: 'F# Minor',
    featuredImage: null,
    audioUrl: '/demo-audio/dark-trap.mp3',
    source: 'WordPress',
    beatsFields: {
      price: 75,
      bpm: 180,
      musicalKey: 'F# Minor'
    }
  },
  {
    id: 'beat-3',
    title: 'R&B Smooth Groove',
    type: 'beat',
    category: 'Beats',
    slug: 'rnb-smooth-groove',
    date: '2024-12-08',
    price: 60,
    bpm: 95,
    musicalKey: 'Ab Major',
    featuredImage: null,
    audioUrl: '/demo-audio/rnb-groove.mp3',
    source: 'WordPress',
    beatsFields: {
      price: 60,
      bpm: 95,
      musicalKey: 'Ab Major'
    }
  },
  {
    id: 'mix-1',
    title: 'Live Mix - December 2024',
    type: 'mix',
    category: 'Mixes',
    slug: 'live-mix-december-2024',
    date: '2024-12-01',
    price: 0,
    featuredImage: null,
    audioUrl: '/demo-audio/live-mix-dec.mp3',
    source: 'WordPress'
  },
  {
    id: 'mix-2',
    title: 'Hip Hop Classics Mix',
    type: 'mix',
    category: 'Mixes',
    slug: 'hip-hop-classics-mix',
    date: '2024-11-25',
    price: 15,
    featuredImage: null,
    audioUrl: '/demo-audio/hip-hop-classics.mp3',
    source: 'WordPress'
  },
  {
    id: 'tutorial-1',
    title: 'How to Create Trap Beats in FL Studio',
    type: 'tutorial',
    category: 'Tutorials',
    slug: 'create-trap-beats-fl-studio',
    date: '2024-12-05',
    price: 25,
    difficulty: 'Intermediate',
    featuredImage: null,
    videoUrl: 'https://youtube.com/watch?v=demo1',
    source: 'WordPress',
    tutorialFields: {
      difficulty: 'Intermediate',
      price: 25,
      videoUrl: 'https://youtube.com/watch?v=demo1'
    }
  },
  {
    id: 'tutorial-2',
    title: 'Mixing Vocals Like a Pro',
    type: 'tutorial',
    category: 'Tutorials',
    slug: 'mixing-vocals-like-pro',
    date: '2024-11-30',
    price: 35,
    difficulty: 'Advanced',
    featuredImage: null,
    videoUrl: 'https://youtube.com/watch?v=demo2',
    source: 'WordPress',
    tutorialFields: {
      difficulty: 'Advanced',
      price: 35,
      videoUrl: 'https://youtube.com/watch?v=demo2'
    }
  },
  {
    id: 'tutorial-3',
    title: 'Music Theory Basics for Producers',
    type: 'tutorial',
    category: 'Tutorials',
    slug: 'music-theory-basics-producers',
    date: '2024-11-20',
    price: 20,
    difficulty: 'Beginner',
    featuredImage: null,
    videoUrl: 'https://youtube.com/watch?v=demo3',
    source: 'WordPress',
    tutorialFields: {
      difficulty: 'Beginner',
      price: 20,
      videoUrl: 'https://youtube.com/watch?v=demo3'
    }
  },
  {
    id: 'track-1',
    title: 'Midnight Dreams',
    type: 'track',
    category: 'Tracks',
    slug: 'midnight-dreams',
    date: '2024-12-12',
    price: 100,
    genre: 'Electronic',
    featuredImage: null,
    audioUrl: '/demo-audio/midnight-dreams.mp3',
    source: 'Contentful'
  },
  {
    id: 'track-2',
    title: 'Urban Nights',
    type: 'track',
    category: 'Tracks',
    slug: 'urban-nights',
    date: '2024-12-03',
    price: 120,
    genre: 'Hip Hop',
    featuredImage: null,
    audioUrl: '/demo-audio/urban-nights.mp3',
    source: 'Contentful'
  },
  {
    id: 'beat-4',
    title: 'Pop Anthem Instrumental',
    type: 'beat',
    category: 'Beats',
    slug: 'pop-anthem-instrumental',
    date: '2024-11-28',
    price: 85,
    bpm: 128,
    musicalKey: 'G Major',
    featuredImage: null,
    audioUrl: '/demo-audio/pop-anthem.mp3',
    source: 'WordPress',
    beatsFields: {
      price: 85,
      bpm: 128,
      musicalKey: 'G Major'
    }
  },
  {
    id: 'beat-5',
    title: 'Lo-Fi Study Beat',
    type: 'beat',
    category: 'Beats',
    slug: 'lo-fi-study-beat',
    date: '2024-11-22',
    price: 30,
    bpm: 85,
    musicalKey: 'D Minor',
    featuredImage: null,
    audioUrl: '/demo-audio/lo-fi-study.mp3',
    source: 'WordPress',
    beatsFields: {
      price: 30,
      bpm: 85,
      musicalKey: 'D Minor'
    }
  }
]

// Generate additional demo analytics data
export const generateAnalyticsMetrics = (data) => {
  return {
    totalViews: data.reduce((sum, item) => sum + Math.floor(Math.random() * 5000) + 500, 0),
    totalRevenue: data.reduce((sum, item) => sum + (item.price || 0), 0),
    averageEngagement: (Math.random() * 15 + 5).toFixed(1),
    totalSubscribers: Math.floor(Math.random() * 10000) + 2000,
    contentByType: data.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    }, {}),
    recentTrends: {
      viewsGrowth: (Math.random() * 30 + 5).toFixed(1),
      revenueGrowth: (Math.random() * 25 + 10).toFixed(1),
      engagementGrowth: (Math.random() * 20 + 3).toFixed(1)
    }
  }
}

export default demoMusicData
