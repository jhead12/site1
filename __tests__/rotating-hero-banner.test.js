import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RotatingHeroBanner from '../src/components/hero/rotating-hero-banner';

// Mock gatsby-plugin-image
jest.mock('gatsby-plugin-image', () => {
  return {
    GatsbyImage: jest.fn().mockImplementation(({ image, alt }) => (
      <img data-testid="gatsby-image" alt={alt || 'Mock image'} src="test-image" />
    )),
    getImage: jest.fn().mockImplementation(input => input),
    StaticImage: jest.fn().mockImplementation(({ alt }) => (
      <img data-testid="static-image" alt={alt || 'Mock static image'} src="test-static-image" />
    ))
  };
});

describe('RotatingHeroBanner', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders without crashing', () => {
    render(<RotatingHeroBanner />);
    expect(screen.getByTestId('gatsby-image')).toBeInTheDocument();
  });

  test('displays hero content correctly', () => {
    render(<RotatingHeroBanner />);
    expect(screen.getByText('Test Hero')).toBeInTheDocument();
    expect(screen.getByText('Test Kicker')).toBeInTheDocument();
    expect(screen.getByText('Test Hero Description')).toBeInTheDocument();
  });

  test('navigation controls work', () => {
    render(<RotatingHeroBanner />);
    const nextButton = screen.getByLabelText('Next slide');
    const prevButton = screen.getByLabelText('Previous slide');
    
    act(() => {
      fireEvent.click(nextButton);
      jest.advanceTimersByTime(500);
    });

    act(() => {
      fireEvent.click(prevButton);
      jest.advanceTimersByTime(500);
    });
  });

  test('autoplay can be toggled', () => {
    render(<RotatingHeroBanner />);
    const playPauseButton = screen.getByLabelText('Pause slideshow');
    
    act(() => {
      fireEvent.click(playPauseButton);
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByLabelText('Play slideshow')).toBeInTheDocument();
    
    act(() => {
      fireEvent.click(playPauseButton);
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByLabelText('Pause slideshow')).toBeInTheDocument();
  });
});
