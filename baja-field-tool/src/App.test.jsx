import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'

test('shows app title', () => {
  render(<BrowserRouter><App /></BrowserRouter>)
  expect(screen.getByText('Sur Compass')).toBeInTheDocument()
})
