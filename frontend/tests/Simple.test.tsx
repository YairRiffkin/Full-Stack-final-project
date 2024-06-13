// HelloWorld.test.jsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { HelloWorld } from './HelloWorld.tsx';
import React from 'react';

describe('HelloWorld Component', () => {
  it('renders correctly', () => {
    render(<HelloWorld />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
});
});