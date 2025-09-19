import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RegionSelector } from '@/components/RegionSelector'
import { EditRegion } from '@/types'

// Mock the monitoring module
jest.mock('@/lib/monitoring', () => ({
  trackUserAction: jest.fn(),
  trackError: jest.fn()
}))

describe('RegionSelector', () => {
  const mockRegions: EditRegion[] = [
    { id: '1', name: 'Spine (Upper)', type: 'posture' },
    { id: '2', name: 'Shoulders', type: 'posture' }
  ]

  const defaultProps = {
    regions: mockRegions,
    selectedRegion: null,
    onRegionSelect: jest.fn(),
    onRegionAdd: jest.fn(),
    onRegionRemove: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders region selector with existing regions', () => {
    render(<RegionSelector {...defaultProps} />)
    
    expect(screen.getByText('Edit Regions')).toBeInTheDocument()
    expect(screen.getByText('Spine (Upper)')).toBeInTheDocument()
    expect(screen.getByText('Shoulders')).toBeInTheDocument()
  })

  it('prevents duplicate region addition', async () => {
    render(<RegionSelector {...defaultProps} />)
    
    // Click "Add" button to show form
    fireEvent.click(screen.getByText('Add'))
    
    // Try to add existing region
    const nameInput = screen.getByLabelText(/region name/i)
    fireEvent.change(nameInput, { target: { value: 'Spine (Upper)' } })
    
    fireEvent.click(screen.getByText('Add Region'))
    
    await waitFor(() => {
      expect(screen.getByText(/already exists/i)).toBeInTheDocument()
    })
    
    expect(defaultProps.onRegionAdd).not.toHaveBeenCalled()
  })

  it('validates region name input', async () => {
    render(<RegionSelector {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Add'))
    
    // Try to add region with invalid characters
    const nameInput = screen.getByLabelText(/region name/i)
    fireEvent.change(nameInput, { target: { value: 'Invalid<>Name' } })
    
    fireEvent.click(screen.getByText('Add Region'))
    
    await waitFor(() => {
      expect(screen.getByText(/invalid characters/i)).toBeInTheDocument()
    })
  })

  it('allows adding valid custom regions', async () => {
    render(<RegionSelector {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Add'))
    
    const nameInput = screen.getByLabelText(/region name/i)
    fireEvent.change(nameInput, { target: { value: 'Custom Region' } })
    
    fireEvent.click(screen.getByText('Add Region'))
    
    await waitFor(() => {
      expect(defaultProps.onRegionAdd).toHaveBeenCalledWith({
        name: 'Custom Region',
        type: 'posture'
      })
    })
  })

  it('prevents adding duplicate preset regions', async () => {
    render(<RegionSelector {...defaultProps} />)
    
    // Find and click a preset button for an existing region
    const presetButtons = screen.getAllByText('Spine (Upper)')
    const presetButton = presetButtons.find(button => 
      button.closest('button')?.getAttribute('disabled') === null
    )
    
    if (presetButton) {
      fireEvent.click(presetButton)
      
      await waitFor(() => {
        expect(screen.getByText(/already exists/i)).toBeInTheDocument()
      })
    }
  })

  it('allows selecting and re-selecting regions', () => {
    render(<RegionSelector {...defaultProps} />)
    
    const regionButton = screen.getByText('Spine (Upper)')
    fireEvent.click(regionButton)
    
    expect(defaultProps.onRegionSelect).toHaveBeenCalledWith('1')
    
    // Click again to re-select
    fireEvent.click(regionButton)
    expect(defaultProps.onRegionSelect).toHaveBeenCalledTimes(2)
  })

  it('allows removing regions', () => {
    render(<RegionSelector {...defaultProps} />)
    
    const removeButton = screen.getAllByRole('button').find(button => 
      button.querySelector('svg') // Trash icon
    )
    
    if (removeButton) {
      fireEvent.click(removeButton)
      expect(defaultProps.onRegionRemove).toHaveBeenCalled()
    }
  })

  it('shows error messages and allows dismissing them', async () => {
    render(<RegionSelector {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Add'))
    
    // Trigger validation error
    const nameInput = screen.getByLabelText(/region name/i)
    fireEvent.change(nameInput, { target: { value: '' } })
    fireEvent.click(screen.getByText('Add Region'))
    
    await waitFor(() => {
      expect(screen.getByText(/region name is required/i)).toBeInTheDocument()
    })
    
    // Dismiss error
    const dismissButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(dismissButton)
    
    await waitFor(() => {
      expect(screen.queryByText(/region name is required/i)).not.toBeInTheDocument()
    })
  })

  it('sanitizes input properly', async () => {
    render(<RegionSelector {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Add'))
    
    const nameInput = screen.getByLabelText(/region name/i)
    fireEvent.change(nameInput, { target: { value: '  Test Region  ' } })
    
    fireEvent.click(screen.getByText('Add Region'))
    
    await waitFor(() => {
      expect(defaultProps.onRegionAdd).toHaveBeenCalledWith({
        name: 'Test Region', // Should be trimmed
        type: 'posture'
      })
    })
  })

  it('tracks user actions for monitoring', async () => {
    const { trackUserAction } = require('@/lib/monitoring')
    
    render(<RegionSelector {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Add'))
    
    const nameInput = screen.getByLabelText(/region name/i)
    fireEvent.change(nameInput, { target: { value: 'Test Region' } })
    fireEvent.click(screen.getByText('Add Region'))
    
    await waitFor(() => {
      expect(trackUserAction).toHaveBeenCalledWith(
        'region_added',
        'RegionSelector',
        expect.objectContaining({
          regionName: 'Test Region',
          regionType: 'posture'
        })
      )
    })
  })
})
