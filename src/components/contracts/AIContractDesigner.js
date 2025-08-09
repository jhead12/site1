import React, { useState, useEffect } from 'react';
import './AIContractDesigner.css';

const AIContractDesigner = ({ onContractGenerated }) => {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Contract questions flow
  const questions = [
    {
      id: 'projectType',
      type: 'select',
      question: "What type of music project are you working on?",
      options: [
        { value: 'beat_licensing', label: 'Beat/Instrumental Licensing', description: 'License pre-made beats for your music' },
        { value: 'custom_production', label: 'Custom Music Production', description: 'Create original music from scratch' },
        { value: 'collaboration', label: 'Music Collaboration', description: 'Joint creative partnership' },
        { value: 'mixing_mastering', label: 'Mixing & Mastering Services', description: 'Audio post-production services' },
        { value: 'full_album', label: 'Full Album/EP Production', description: 'Complete project production' }
      ],
      aiPrompt: "I'm helping a client choose the right music service. They need guidance on:"
    },
    {
      id: 'budgetRange',
      type: 'range',
      question: "What's your budget range for this project?",
      min: 50,
      max: 10000,
      step: 50,
      unit: '$',
      aiPrompt: "Based on the budget, I need to recommend appropriate service levels:"
    },
    {
      id: 'copyrightOwnership',
      type: 'select',
      question: "What level of copyright ownership do you need?",
      options: [
        { 
          value: 'non_exclusive', 
          label: 'Non-Exclusive License', 
          description: 'Standard license, beat can be sold to others',
          priceMultiplier: 1.0 
        },
        { 
          value: 'exclusive', 
          label: 'Exclusive License', 
          description: 'Only you can use this beat commercially',
          priceMultiplier: 3.0 
        },
        { 
          value: 'buyout', 
          label: 'Complete Buyout', 
          description: 'Full ownership transfer, including stems',
          priceMultiplier: 5.0 
        },
        { 
          value: 'co_ownership', 
          label: 'Co-Ownership (50/50)', 
          description: 'Shared ownership and revenue split',
          priceMultiplier: 2.5 
        }
      ],
      aiPrompt: "Copyright ownership affects pricing significantly. Let me explain the differences:"
    },
    {
      id: 'commercialUse',
      type: 'multiselect',
      question: "What commercial uses do you need?",
      options: [
        { value: 'streaming', label: 'Streaming Platforms (Spotify, Apple Music, etc.)', price: 0 },
        { value: 'radio', label: 'Radio/Broadcast', price: 200 },
        { value: 'tv_film', label: 'TV/Film/Commercial', price: 500 },
        { value: 'live_performance', label: 'Live Performances', price: 100 },
        { value: 'youtube_monetization', label: 'YouTube Monetization', price: 150 },
        { value: 'unlimited', label: 'Unlimited Commercial Use', price: 1000 }
      ],
      aiPrompt: "Different commercial uses require different licensing terms. Here's what each includes:"
    },
    {
      id: 'deliverables',
      type: 'multiselect',
      question: "What deliverables do you need?",
      options: [
        { value: 'mixed_master', label: 'Mixed & Mastered Track', price: 0 },
        { value: 'stems', label: 'Individual Stems/Tracks', price: 200 },
        { value: 'midi_files', label: 'MIDI Files', price: 100 },
        { value: 'project_file', label: 'Original Project File', price: 300 },
        { value: 'alternate_versions', label: 'Alternate Versions (Instrumental, Acapella)', price: 150 },
        { value: 'custom_edits', label: 'Custom Length Edits', price: 100 }
      ],
      aiPrompt: "Let me help you choose the right deliverables for your project needs:"
    },
    {
      id: 'timeline',
      type: 'select',
      question: "What's your preferred timeline?",
      options: [
        { value: 'rush_24h', label: '24 Hour Rush', description: 'Premium rush service', priceMultiplier: 2.0 },
        { value: 'fast_3days', label: '3-5 Days', description: 'Fast turnaround', priceMultiplier: 1.5 },
        { value: 'standard_1week', label: '1-2 Weeks', description: 'Standard timeline', priceMultiplier: 1.0 },
        { value: 'flexible_1month', label: '1 Month+', description: 'Flexible timeline', priceMultiplier: 0.9 }
      ],
      aiPrompt: "Timeline affects both pricing and quality. Here are your options:"
    },
    {
      id: 'revisions',
      type: 'select',
      question: "How many revisions do you need?",
      options: [
        { value: 'none', label: 'No Revisions', description: 'As-is delivery', priceMultiplier: 0.8 },
        { value: 'basic_2', label: '2 Revisions', description: 'Standard package', priceMultiplier: 1.0 },
        { value: 'premium_5', label: '5 Revisions', description: 'Premium package', priceMultiplier: 1.3 },
        { value: 'unlimited', label: 'Unlimited Revisions', description: 'Until you\'re satisfied', priceMultiplier: 1.8 }
      ],
      aiPrompt: "Revision policy is important for your satisfaction. Let me explain each option:"
    },
    {
      id: 'additionalServices',
      type: 'multiselect',
      question: "Any additional services needed?",
      options: [
        { value: 'songwriting', label: 'Songwriting/Lyric Writing', price: 300 },
        { value: 'vocal_recording', label: 'Vocal Recording Session', price: 200 },
        { value: 'music_video', label: 'Music Video Production', price: 1500 },
        { value: 'artwork_design', label: 'Cover Art/Artwork Design', price: 150 },
        { value: 'distribution', label: 'Distribution Setup', price: 100 },
        { value: 'marketing_consultation', label: 'Marketing Strategy Consultation', price: 250 }
      ],
      aiPrompt: "These additional services can enhance your project. Here's what each includes:"
    }
  ];

  // AI responses for each question
  const aiResponses = {
    projectType: {
      beat_licensing: "Great choice! Beat licensing is perfect for artists who want high-quality instrumentals without the full production cost. You'll get professional beats that you can add your vocals to.",
      custom_production: "Excellent! Custom production means we'll create something completely unique for you. This gives you maximum creative control and originality.",
      collaboration: "Wonderful! Collaboration projects often produce the most creative results. We'll work together to blend our styles and create something special.",
      mixing_mastering: "Perfect! Professional mixing and mastering can transform your track from good to radio-ready. This is essential for commercial releases.",
      full_album: "Amazing! A full album project is a significant undertaking. We'll create a cohesive body of work that tells your story."
    },
    copyrightOwnership: {
      non_exclusive: "Non-exclusive licensing is cost-effective and perfect for independent artists. You get full commercial rights, but the beat may be licensed to others.",
      exclusive: "Exclusive licensing means you're the only one who can use this beat commercially. This is ideal for singles and important releases.",
      buyout: "Complete buyout gives you 100% ownership. You'll own the master recording and can even resell the beat to others if you choose.",
      co_ownership: "Co-ownership creates a partnership. We'll share both the ownership and any future revenue from the track."
    }
  };

  const basePrices = {
    beat_licensing: 100,
    custom_production: 500,
    collaboration: 300,
    mixing_mastering: 200,
    full_album: 2000
  };

  useEffect(() => {
    if (step < questions.length) {
      setCurrentQuestion(questions[step]);
    }
  }, [step]);

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      generateContract();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const calculatePrice = () => {
    const basePrice = basePrices[responses.projectType] || 100;
    let totalPrice = basePrice;

    // Apply copyright ownership multiplier
    const copyrightMultiplier = currentQuestion?.options?.find(opt => opt.value === responses.copyrightOwnership)?.priceMultiplier || 1;
    totalPrice *= copyrightMultiplier;

    // Apply timeline multiplier
    const timelineMultiplier = currentQuestion?.options?.find(opt => opt.value === responses.timeline)?.priceMultiplier || 1;
    totalPrice *= timelineMultiplier;

    // Apply revision multiplier
    const revisionMultiplier = currentQuestion?.options?.find(opt => opt.value === responses.revisions)?.priceMultiplier || 1;
    totalPrice *= revisionMultiplier;

    // Add commercial use fees
    if (responses.commercialUse && Array.isArray(responses.commercialUse)) {
      const commercialFees = responses.commercialUse.reduce((sum, use) => {
        const useOption = questions.find(q => q.id === 'commercialUse')?.options?.find(opt => opt.value === use);
        return sum + (useOption?.price || 0);
      }, 0);
      totalPrice += commercialFees;
    }

    // Add deliverables fees
    if (responses.deliverables && Array.isArray(responses.deliverables)) {
      const deliverableFees = responses.deliverables.reduce((sum, deliverable) => {
        const deliverableOption = questions.find(q => q.id === 'deliverables')?.options?.find(opt => opt.value === deliverable);
        return sum + (deliverableOption?.price || 0);
      }, 0);
      totalPrice += deliverableFees;
    }

    // Add additional services fees
    if (responses.additionalServices && Array.isArray(responses.additionalServices)) {
      const serviceFees = responses.additionalServices.reduce((sum, service) => {
        const serviceOption = questions.find(q => q.id === 'additionalServices')?.options?.find(opt => opt.value === service);
        return sum + (serviceOption?.price || 0);
      }, 0);
      totalPrice += serviceFees;
    }

    return Math.round(totalPrice);
  };

  const generateContract = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const finalPrice = calculatePrice();
    
    const contract = {
      id: `contract_${Date.now()}`,
      clientInfo: {
        projectType: responses.projectType,
        budgetRange: responses.budgetRange,
        timeline: responses.timeline
      },
      terms: {
        copyrightOwnership: responses.copyrightOwnership,
        commercialUse: responses.commercialUse || [],
        deliverables: responses.deliverables || [],
        revisions: responses.revisions,
        additionalServices: responses.additionalServices || []
      },
      pricing: {
        basePrice: basePrices[responses.projectType] || 100,
        finalPrice: finalPrice,
        breakdown: calculatePriceBreakdown()
      },
      generatedDate: new Date().toISOString(),
      aiRecommendations: generateAIRecommendations()
    };

    setGeneratedContract(contract);
    setIsGenerating(false);
    
    if (onContractGenerated) {
      onContractGenerated(contract);
    }
  };

  const calculatePriceBreakdown = () => {
    const breakdown = [];
    const basePrice = basePrices[responses.projectType] || 100;
    
    breakdown.push({
      item: `Base ${responses.projectType?.replace('_', ' ').toUpperCase()} Service`,
      amount: basePrice,
      type: 'base'
    });

    // Add multipliers
    const copyrightOption = questions.find(q => q.id === 'copyrightOwnership')?.options?.find(opt => opt.value === responses.copyrightOwnership);
    if (copyrightOption && copyrightOption.priceMultiplier !== 1) {
      breakdown.push({
        item: `${copyrightOption.label} (${copyrightOption.priceMultiplier}x)`,
        amount: basePrice * (copyrightOption.priceMultiplier - 1),
        type: 'multiplier'
      });
    }

    // Add fees
    if (responses.commercialUse) {
      responses.commercialUse.forEach(use => {
        const useOption = questions.find(q => q.id === 'commercialUse')?.options?.find(opt => opt.value === use);
        if (useOption && useOption.price > 0) {
          breakdown.push({
            item: useOption.label,
            amount: useOption.price,
            type: 'addon'
          });
        }
      });
    }

    return breakdown;
  };

  const generateAIRecommendations = () => {
    const recommendations = [];
    
    // Budget-based recommendations
    if (responses.budgetRange < 500) {
      recommendations.push({
        type: 'budget',
        message: "Consider starting with a non-exclusive license to maximize your budget. You can always upgrade later.",
        action: 'Suggest alternatives'
      });
    }

    // Copyright recommendations
    if (responses.copyrightOwnership === 'non_exclusive' && responses.commercialUse?.includes('tv_film')) {
      recommendations.push({
        type: 'copyright',
        message: "For TV/Film use, exclusive licensing is recommended to avoid conflicts with other placements.",
        action: 'Upgrade to exclusive'
      });
    }

    return recommendations;
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'select':
        return (
          <div className="question-container">
            <h3>{currentQuestion.question}</h3>
            <div className="options-grid">
              {currentQuestion.options.map(option => (
                <div 
                  key={option.value}
                  className={`option-card ${responses[currentQuestion.id] === option.value ? 'selected' : ''}`}
                  onClick={() => handleResponse(currentQuestion.id, option.value)}
                >
                  <div className="option-label">{option.label}</div>
                  <div className="option-description">{option.description}</div>
                  {option.priceMultiplier && (
                    <div className="price-multiplier">{option.priceMultiplier}x pricing</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'multiselect':
        return (
          <div className="question-container">
            <h3>{currentQuestion.question}</h3>
            <div className="options-grid">
              {currentQuestion.options.map(option => (
                <div 
                  key={option.value}
                  className={`option-card ${responses[currentQuestion.id]?.includes(option.value) ? 'selected' : ''}`}
                  onClick={() => {
                    const current = responses[currentQuestion.id] || [];
                    const newValue = current.includes(option.value) 
                      ? current.filter(v => v !== option.value)
                      : [...current, option.value];
                    handleResponse(currentQuestion.id, newValue);
                  }}
                >
                  <div className="option-label">{option.label}</div>
                  {option.price > 0 && (
                    <div className="option-price">+${option.price}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'range':
        return (
          <div className="question-container">
            <h3>{currentQuestion.question}</h3>
            <div className="range-container">
              <div className="range-display">
                {currentQuestion.unit}{responses[currentQuestion.id] || currentQuestion.min}
              </div>
              <input
                type="range"
                min={currentQuestion.min}
                max={currentQuestion.max}
                step={currentQuestion.step}
                value={responses[currentQuestion.id] || currentQuestion.min}
                onChange={(e) => handleResponse(currentQuestion.id, parseInt(e.target.value))}
                className="range-slider"
              />
              <div className="range-labels">
                <span>{currentQuestion.unit}{currentQuestion.min}</span>
                <span>{currentQuestion.unit}{currentQuestion.max}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderContract = () => {
    if (!generatedContract) return null;

    return (
      <div className="contract-preview">
        <h2>Your Custom Contract</h2>
        
        <div className="contract-summary">
          <div className="price-display">
            <div className="final-price">${generatedContract.pricing.finalPrice}</div>
            <div className="price-label">Total Project Cost</div>
          </div>
          
          <div className="contract-details">
            <h3>Project Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Project Type:</span>
                <span className="value">{generatedContract.clientInfo.projectType?.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Copyright:</span>
                <span className="value">{generatedContract.terms.copyrightOwnership?.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Timeline:</span>
                <span className="value">{generatedContract.clientInfo.timeline?.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="price-breakdown">
            <h3>Price Breakdown</h3>
            {generatedContract.pricing.breakdown.map((item, index) => (
              <div key={index} className="breakdown-item">
                <span className="item-name">{item.item}</span>
                <span className="item-amount">${item.amount}</span>
              </div>
            ))}
          </div>

          {generatedContract.aiRecommendations.length > 0 && (
            <div className="ai-recommendations">
              <h3>AI Recommendations</h3>
              {generatedContract.aiRecommendations.map((rec, index) => (
                <div key={index} className="recommendation">
                  <div className="rec-message">{rec.message}</div>
                  <button className="rec-action">{rec.action}</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="contract-actions">
          <button className="btn-primary" onClick={() => window.print()}>
            Download Contract
          </button>
          <button className="btn-secondary" onClick={() => setStep(0)}>
            Start Over
          </button>
          <button className="btn-success">
            Accept & Proceed to Payment
          </button>
        </div>
      </div>
    );
  };

  if (isGenerating) {
    return (
      <div className="ai-contract-designer">
        <div className="generating-container">
          <div className="ai-thinking">
            <div className="ai-avatar">🤖</div>
            <div className="thinking-text">
              <h3>AI Agent is designing your contract...</h3>
              <p>Analyzing your responses and calculating optimal pricing...</p>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  if (generatedContract) {
    return (
      <div className="ai-contract-designer">
        {renderContract()}
      </div>
    );
  }

  return (
    <div className="ai-contract-designer">
      <div className="ai-assistant">
        <div className="ai-avatar">🤖</div>
        <div className="ai-dialogue">
          <h2>AI Contract Designer</h2>
          <p>I'll help you create the perfect contract by asking a few questions. The more copyright ownership you need, the higher the investment - but also the greater your control and potential returns!</p>
        </div>
      </div>

      <div className="progress-indicator">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Question {step + 1} of {questions.length}
        </div>
      </div>

      {renderQuestion()}

      <div className="navigation-buttons">
        <button 
          className="btn-secondary" 
          onClick={prevStep}
          disabled={step === 0}
        >
          Previous
        </button>
        
        <button 
          className="btn-primary" 
          onClick={nextStep}
          disabled={!responses[currentQuestion?.id]}
        >
          {step === questions.length - 1 ? 'Generate Contract' : 'Next'}
        </button>
      </div>

      {Object.keys(responses).length > 0 && (
        <div className="current-price">
          <div className="price-preview">
            Estimated Price: ${calculatePrice()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContractDesigner;
