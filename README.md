# Avazkon AI Creator

A modern, professional React-based image fusion web application powered by fal.ai's FLUX.1 Kontext technology. Combine and transform two images using AI-driven creative composition with natural language prompts.

## ✨ Features

- **AI-Powered Image Fusion**: Combine two images using advanced FLUX.1 Kontext model
- **Natural Language Control**: Describe your creative vision with simple text prompts
- **Dual Image Upload**: Easy drag-and-drop interface for uploading two source images
- **Modern UI/UX**: Beautiful, responsive interface with smooth animations and visual feedback
- **Creative Composition**: Generate unique combinations and modifications of your images
- **High-Quality Output**: Professional-grade results powered by state-of-the-art AI
- **Future-Ready**: Built with React for easy Android export via Capacitor

## 🚀 Technology Stack

- **Frontend**: React 18 with Hooks
- **Styling**: CSS3 with CSS Variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Processing**: fal.ai API (FLUX.1 Kontext Max Multi model)
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- fal.ai API key (get one at [fal.ai](https://fal.ai/dashboard))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd avazkon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API key**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your fal.ai API key:
   ```
   REACT_APP_FAL_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage

1. **Upload Images**: Upload two images using the drag-and-drop interface
   - **First Image**: Your primary/base image
   - **Second Image**: The image you want to combine or integrate
2. **Write Prompt**: Describe what you want to create in the text area
   - Be specific about how you want to combine the images
   - Example: "Put the little duckling on top of the woman's t-shirt"
3. **Create**: Click "Create Image" to start the AI processing
4. **Download**: Save your new creation once processing is complete

### Creative Prompt Guide

- **Be Specific**: Clearly describe how you want the images combined
- **Use Action Words**: "Put", "Place", "Combine", "Merge", "Replace"
- **Describe Positioning**: "on top of", "next to", "in front of", "behind"
- **Add Style Instructions**: "in a realistic style", "as a cartoon", "seamlessly blended"

#### Example Prompts:
- "Place the cat from the second image sitting on the chair in the first image"
- "Replace the sky in the first image with the sunset from the second image"
- "Combine both people into a single group photo"
- "Put the object from image two into the scene from image one"

## Project Structure

```
src/
├── components/
│   ├── ImageUploader.js      # Drag-and-drop image upload
│   ├── ParameterControl.js   # Visual parameter controls
│   ├── ProcessingStatus.js   # Processing progress display
│   └── ResultDisplay.js      # Enhanced image display
├── services/
│   └── falAI.js             # fal.ai API integration
├── App.js                   # Main application component
├── App.css                  # Application styles
├── index.js                 # React entry point
└── index.css                # Global styles
```

## 🔧 API Integration

The application integrates with fal.ai's FLUX.1 Kontext API:

- **Model**: `fal-ai/flux-pro/kontext/max/multi`
- **Input**: Two image files + text prompt + parameters
- **Output**: AI-generated fusion image
- **Authentication**: API key via environment variable

The integration includes:

- Automatic file-to-base64 conversion
- Real-time processing status updates
- Error handling and fallbacks
- Development mode mock responses

## Development

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

### Environment Variables

- `REACT_APP_FAL_KEY`: Your fal.ai API key (required)

## Deployment

### Web Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your hosting service

3. Ensure environment variables are set in production

### Future Mobile Export

The application is designed to be easily exportable to mobile platforms using:
- React Native
- Capacitor
- Cordova

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the [fal.ai documentation](https://fal.ai/docs)
- Review the code comments
- Open an issue in this repository

## Roadmap

- [ ] Additional AI models integration
- [ ] Batch processing capabilities
- [ ] Advanced editing tools
- [ ] Mobile app export
- [ ] User accounts and history
- [ ] Custom model training

---

**Built with ❤️ using React and fal.ai**