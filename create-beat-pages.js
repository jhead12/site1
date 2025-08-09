// gatsby-node.js addition for beat pages
exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  // Beat catalog data (in production, this would come from a CMS or database)
  const beats = [
    {
      id: 'dark-trap-001',
      title: 'Dark Trap Beat',
      bpm: 140,
      key: 'C Minor',
      genre: 'Trap',
      tags: ['Dark', 'Heavy', 'Melodic'],
      description: 'Hard-hitting trap beat with dark melodies and atmospheric elements',
      preview: '/audio/dark-trap-preview.mp3',
      artwork: null
    },
    {
      id: 'drill-beat-002',
      title: 'UK Drill Banger',
      bpm: 138,
      key: 'F# Minor',
      genre: 'Drill',
      tags: ['UK Drill', 'Hard', 'Street'],
      description: 'Aggressive UK drill beat with sliding 808s',
      preview: '/audio/drill-preview.mp3',
      artwork: null
    },
    {
      id: 'melodic-hiphop-003',
      title: 'Melodic Dreams',
      bpm: 85,
      key: 'G Major',
      genre: 'Hip Hop',
      tags: ['Melodic', 'Emotional', 'Smooth'],
      description: 'Smooth melodic hip hop with emotional chord progressions',
      preview: '/audio/melodic-preview.mp3',
      artwork: null
    },
    {
      id: 'afrobeat-004',
      title: 'Afro Vibes',
      bpm: 105,
      key: 'D Minor',
      genre: 'Afrobeat',
      tags: ['Afrobeat', 'Danceable', 'Global'],
      description: 'Infectious afrobeat with traditional percussion',
      preview: '/audio/afro-preview.mp3',
      artwork: null
    },
    {
      id: 'rage-type-005',
      title: 'Rage Energy',
      bpm: 150,
      key: 'E Minor',
      genre: 'Rage',
      tags: ['Rage', 'Distorted', 'Experimental'],
      description: 'High-energy rage beat with distorted elements',
      preview: '/audio/rage-preview.mp3',
      artwork: null
    }
  ];

  // Create individual beat pages
  beats.forEach((beat) => {
    createPage({
      path: `/beats/${beat.id}`,
      component: require.resolve('./src/templates/beat-page.js'),
      context: {
        beat,
        beatId: beat.id,
      },
    });
  });
};
