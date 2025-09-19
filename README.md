# 🧍 Input to Visual Enhancement

**Transform real-world inputs into enhanced visual representations**

A comprehensive application that simulates visual transformations from photos or scans, supporting before/after comparisons, region-based editing, and optional 3D model generation.

## ✨ Features

### Core Capabilities
- **Photo/Scan Upload**: Support for JPG, PNG, and WebP formats
- **Visual Editing**: Simulate posture correction, cosmetic changes, and product repairs
- **Before/After Comparison**: Interactive slider to compare original and enhanced images
- **Region-Based Controls**: Select specific areas for targeted enhancements
- **Effect Sliders**: Fine-tune enhancement parameters with real-time preview
- **3D Model Generation**: Optional GLB model export for 3D visualization
- **Report Export**: Generate PDF reports with processing analytics

### UI Highlights
- **Split View**: Before vs After comparison with draggable slider
- **Region Selector**: Interactive region selection with preset options
- **Effect Controls**: Intuitive sliders for various enhancement effects
- **Export Options**: Multiple format support (JPG, PNG, GLB, PDF)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd input-to-visual-enhancement
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_LV_API_URL=https://api.lidvizion.com
   NEXT_PUBLIC_LV_API_KEY=your_api_key_here
   NEXT_PUBLIC_STORAGE_BUCKET=visual-enhancement-bucket
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Use Cases

### Health & Wellness
- **Posture Correction**: Preview physical therapy outcomes
- **Cosmetic Dentistry**: Show before/after dental improvements
- **Physical Therapy**: Visualize treatment progress

### Product & Industrial
- **Part Restoration**: Simulate repair outcomes
- **Design Improvements**: Preview product enhancements
- **Quality Control**: Visual defect correction

### Design & Styling
- **Fashion**: Clothing fit adjustments
- **Interior Design**: Room layout improvements
- **Architecture**: Building modification previews

## 🛠️ Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js with React Three Fiber
- **File Handling**: React Dropzone
- **PDF Generation**: jsPDF
- **State Management**: Zustand
- **UI Components**: Custom component library

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── FileUpload.tsx    # File upload component
│   ├── BeforeAfterViewer.tsx # Image comparison
│   ├── RegionSelector.tsx # Region selection
│   ├── EffectSlider.tsx  # Effect controls
│   └── ModelViewer.tsx   # 3D model viewer
├── lib/                   # Utility libraries
│   ├── api.ts            # API client
│   ├── export.ts         # Export utilities
│   └── utils.ts          # General utilities
└── types/                 # TypeScript definitions
    └── index.ts          # Type definitions
```

## 🔧 API Integration

The application integrates with the Lid Vizion API for image processing:

### Endpoints
- `POST /api/upload` - Upload images for processing
- `POST /api/process` - Process images with specified edits

### Mock Data
For development, the app includes mock data in `/public/mock/response.json`:

```json
{
  "before_after": {
    "before": "posture_before.jpg",
    "after": "posture_after.jpg"
  },
  "edits": [
    { "region": "spine_upper", "effect": "straighten", "intensity": 0.7 }
  ],
  "report": "report_stub.pdf",
  "artifact": "enhanced_model.glb"
}
```

## 🎨 Customization

### Adding New Effects
1. Update the `EditEffect` type in `src/types/index.ts`
2. Add effect configuration in the main page component
3. Implement effect logic in the processing API

### Adding New Regions
1. Extend the `EditRegion` type
2. Add preset regions in `RegionSelector.tsx`
3. Update region handling logic

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/app/globals.css` for global styles
- Customize component styles in individual files

## 📦 Export Options

### Image Formats
- **JPG**: High-quality compressed images
- **PNG**: Lossless format with transparency support

### 3D Models
- **GLB**: Binary glTF format for 3D visualization
- Compatible with most 3D viewers and game engines

### Reports
- **PDF**: Comprehensive processing reports
- Includes before/after images, processing metrics, and edit summaries

## 🔒 Security & Privacy

- File uploads are validated for type and size
- No persistent storage of uploaded images (configurable)
- API keys are environment-specific
- CORS protection enabled

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker
```bash
docker build -t visual-enhancement .
docker run -p 3000:3000 visual-enhancement
```

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in `/docs`
- Review the API documentation

## 🔮 Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced AI model integration
- [ ] Batch processing capabilities
- [ ] Mobile app development
- [ ] Cloud storage integration
- [ ] Advanced 3D editing tools

---

**Built with ❤️ by Lid Vizion**