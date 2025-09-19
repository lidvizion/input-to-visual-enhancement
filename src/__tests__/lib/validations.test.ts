import { validateFile, validateRegion, sanitizeFileName, sanitizeRegionName } from '@/lib/validations'

describe('Validation Functions', () => {
  describe('validateFile', () => {
    it('should validate a valid image file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = validateFile(file)
      expect(result.success).toBe(true)
    })

    it('should reject files that are too large', () => {
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      const result = validateFile(largeFile)
      expect(result.success).toBe(false)
      expect(result.error).toContain('10MB')
    })

    it('should reject invalid file types', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const result = validateFile(file)
      expect(result.success).toBe(false)
      expect(result.error).toContain('JPEG, PNG, and WebP')
    })
  })

  describe('validateRegion', () => {
    it('should validate a valid region', () => {
      const region = { name: 'Test Region', type: 'posture' }
      const result = validateRegion(region)
      expect(result.success).toBe(true)
    })

    it('should reject regions with invalid names', () => {
      const region = { name: '', type: 'posture' }
      const result = validateRegion(region)
      expect(result.success).toBe(false)
      expect(result.error).toContain('required')
    })

    it('should reject regions with invalid types', () => {
      const region = { name: 'Test', type: 'invalid' }
      const result = validateRegion(region)
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid region type')
    })
  })

  describe('sanitizeFileName', () => {
    it('should sanitize file names with special characters', () => {
      const result = sanitizeFileName('test<>file.jpg')
      expect(result).toBe('test_file.jpg')
    })

    it('should convert to lowercase', () => {
      const result = sanitizeFileName('TEST.JPG')
      expect(result).toBe('test.jpg')
    })

    it('should remove multiple underscores', () => {
      const result = sanitizeFileName('test___file.jpg')
      expect(result).toBe('test_file.jpg')
    })
  })

  describe('sanitizeRegionName', () => {
    it('should trim whitespace', () => {
      const result = sanitizeRegionName('  Test Region  ')
      expect(result).toBe('Test Region')
    })

    it('should remove invalid characters', () => {
      const result = sanitizeRegionName('Test<>Region')
      expect(result).toBe('TestRegion')
    })

    it('should limit length', () => {
      const longName = 'A'.repeat(100)
      const result = sanitizeRegionName(longName)
      expect(result.length).toBe(50)
    })
  })
})
