# Getting Started with Visual Enhancement

## 🚀 Quick Start Guide

### 1. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd input-to-visual-enhancement

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 2. Development
```bash
# Start the development server
npm run dev

# Open your browser to http://localhost:3000
```

### 3. Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🎯 How to Use

### Step 1: Upload an Image
1. Click on the upload area or drag and drop an image
2. Supported formats: JPG, PNG, WebP
3. Maximum file size: 10MB

### Step 2: Select Regions
1. Use the "Quick Add" buttons for common regions
2. Or create custom regions with the "Add Region" button
3. Click on regions to select them for editing

### Step 3: Adjust Effects
1. Use the effect sliders to fine-tune enhancements
2. Effects include:
   - **Straighten**: Correct alignment and posture
   - **Align**: Horizontal/vertical alignment
   - **Brightness**: Adjust lighting and contrast
   - **Smoothness**: Smooth textures and surfaces

### Step 4: Process Image
1. Click "Process Image" to generate the enhanced version
2. Use the slider to compare before/after results
3. Toggle the 3D model viewer if available

### Step 5: Export Results
1. Choose your export format:
   - **JPG/PNG**: High-quality images
   - **GLB**: 3D model for visualization
   - **PDF**: Comprehensive report with analytics

## 🛠️ Development Tips

### Adding New Effects
1. Update `src/types/index.ts` with new effect types
2. Add effect configuration in the main page
3. Implement processing logic in the API

### Customizing Regions
1. Modify preset regions in `RegionSelector.tsx`
2. Add new region types in the type definitions
3. Update the region handling logic

### Styling Changes
1. Modify `tailwind.config.js` for theme updates
2. Update component styles in individual files
3. Use the design system in `src/components/ui/`

## 🔧 API Integration

### Mock Mode (Development)
The app runs in mock mode by default, using sample data from `/public/mock/response.json`.

### Production Mode
Set up your API keys in `.env.local`:
```env
NEXT_PUBLIC_LV_API_URL=https://api.lidvizion.com
NEXT_PUBLIC_LV_API_KEY=your_actual_api_key
NEXT_PUBLIC_STORAGE_BUCKET=your_bucket_name
```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Using Docker
```bash
# Build the image
docker build -t visual-enhancement .

# Run the container
docker run -p 3000:3000 visual-enhancement
```

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Tablet devices

## 🔍 Troubleshooting

### Common Issues

**Build Errors**
- Ensure Node.js 18+ is installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Upload Issues**
- Check file size (max 10MB)
- Verify file format (JPG, PNG, WebP only)
- Ensure stable internet connection

**3D Model Not Loading**
- Check browser WebGL support
- Try refreshing the page
- Verify GLB file is accessible

**API Errors**
- Verify environment variables are set
- Check API endpoint URLs
- Ensure API keys are valid

### Getting Help
1. Check the console for error messages
2. Review the API documentation
3. Create an issue in the repository
4. Check the health endpoint: `/api/health`

## 🎨 Customization Examples

### Adding a New Effect Type
```typescript
// In src/types/index.ts
export interface EditEffect {
  // ... existing properties
  type: 'straighten' | 'align' | 'position' | 'brightness' | 'smoothness' | 'color' | 'your_new_effect'
}
```

### Custom Region Presets
```typescript
// In src/components/RegionSelector.tsx
const PRESET_REGIONS = [
  // ... existing regions
  { name: 'Your Custom Region', type: 'enhancement' },
]
```

### Theme Customization
```javascript
// In tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom color palette
        }
      }
    }
  }
}
```

## 📊 Performance Tips

- Use image compression for large uploads
- Enable browser caching for static assets
- Optimize 3D models for web delivery
- Use CDN for global distribution

## 🔒 Security Considerations

- Validate all file uploads
- Sanitize user inputs
- Use HTTPS in production
- Implement rate limiting
- Regular security audits

---

**Happy enhancing! 🎨✨**
