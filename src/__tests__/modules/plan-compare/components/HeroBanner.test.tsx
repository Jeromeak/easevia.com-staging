import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeroBanner } from '@/app/plan-compare/components/HeroBanner';

describe('HeroBanner Component', () => {
  it('should render the component correctly', () => {
    render(<HeroBanner />);

    expect(screen.getByText('Check your affordable plane')).toBeInTheDocument();
    expect(screen.getByText('Plan Compare')).toBeInTheDocument();
  });

  it('should have correct text content', () => {
    render(<HeroBanner />);

    const affordableText = screen.getByText('Check your affordable plane');
    const planCompareText = screen.getByText('Plan Compare');

    expect(affordableText).toBeInTheDocument();
    expect(planCompareText).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    render(<HeroBanner />);

    const section = screen.getByText('Check your affordable plane').closest('section');
    expect(section).toBeInTheDocument();

    // The classes are on the div inside the section, not the section itself
    const containerDiv = section?.querySelector('div');
    // Match current classes while allowing responsive differences
    expect(containerDiv).toHaveClass('max-w-[90%]', 'mx-auto');
  });

  it('should render with proper structure', () => {
    render(<HeroBanner />);

    const section = document.querySelector('section');
    const container = section?.querySelector('.max-w-\\[90\\%\\]');
    const flexContainer = container?.querySelector('.flex.flex-col');

    expect(section).toBeInTheDocument();
    expect(container).toBeInTheDocument();
    expect(flexContainer).toBeInTheDocument();
  });

  it('should have responsive text sizing', () => {
    render(<HeroBanner />);

    const affordableText = screen.getByText('Check your affordable plane');
    const planCompareText = screen.getByText('Plan Compare');

    expect(affordableText).toHaveClass('md:text-2xl');
    expect(planCompareText).toHaveClass('text-5xl');
  });

  it('should have correct text styling', () => {
    render(<HeroBanner />);

    const affordableText = screen.getByText('Check your affordable plane');
    const planCompareText = screen.getByText('Plan Compare');

    expect(affordableText).toHaveClass('uppercase', 'tracking-[1.44px]');
    expect(planCompareText).toHaveClass('text-Teal-500', 'font-Neutra', 'uppercase');
  });

  it('should render without errors', () => {
    expect(() => render(<HeroBanner />)).not.toThrow();
  });

  it('should be accessible', () => {
    render(<HeroBanner />);

    // The section element should be present and accessible
    const section = screen.getByText('Check your affordable plane').closest('section');
    expect(section).toBeInTheDocument();
  });

  it('should have proper spacing', () => {
    render(<HeroBanner />);

    const planCompareText = screen.getByText('Plan Compare');
    // Current spacing uses negative margin on md and resets on lg
    expect(planCompareText).toHaveClass('mt-0');
  });
});
