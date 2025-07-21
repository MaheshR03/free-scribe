# � Free-Scribe

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF.svg)](https://vitejs.dev/)

A modern, browser-based transcription and translation application built with React. Free-Scribe leverages cutting-edge machine learning models running entirely in your browser via Web Workers, ensuring privacy and eliminating the need for server-side processing.

## ✨ Features

- **🎯 Audio Transcription**: Convert speech to text using OpenAI's Whisper models
- **🌍 Multi-language Translation**: Translate transcribed text into 22+ supported languages
- **🔒 Privacy-First**: All processing happens locally in your browser - no data leaves your device
- **⚡ Real-time Processing**: Powered by Web Workers for non-blocking UI performance
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices
- **🚀 No Installation Required**: Run directly in your web browser

## 🚀 Live Demo

Experience Free-Scribe in action: [https://free-scribe-alpha.vercel.app/](https://free-scribe-alpha.vercel.app/)

## 📷 Screenshots

### Main Interface
<img width="1920" height="907" alt="Free-Scribe main interface showing transcription capabilities" src="https://github.com/user-attachments/assets/3a841c7e-3593-468b-bd8a-aa8b5f3be3c2" />

### Translation Features
<img width="1920" height="908" alt="Free-Scribe translation interface with multiple language support" src="https://github.com/user-attachments/assets/93ca83d9-58ed-45c1-9d86-0ccab6e8ef48" />

## 🛠️ Technology Stack

- **Frontend**: React 18 with modern hooks and functional components
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS for responsive and modern UI design
- **ML Models**: 
  - OpenAI Whisper for speech-to-text transcription
  - Helsinki-NLP OPUS-MT models for translation
- **Runtime**: Web Workers for background ML model processing
- **Package Manager**: npm

## 🌐 Supported Languages

Free-Scribe supports translation to the following languages:

**European Languages**: French, Spanish, German, Italian, Portuguese, Russian, Dutch, Polish, Czech, Finnish, Swedish, Danish, Norwegian Bokmål, Hungarian, Romanian, Ukrainian, Turkish

**Asian Languages**: Chinese (Simplified), Japanese, Korean, Hindi

**Middle Eastern Languages**: Arabic

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Modern web browser with Web Workers support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MaheshR03/free-scribe.git
   cd free-scribe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to start using Free-Scribe

### Building for Production

```bash
npm run build
```

The built application will be available in the `dist` directory.

## 📖 Usage

1. **Upload Audio**: Click to upload an audio file or record directly in the browser
2. **Transcribe**: The app will automatically transcribe your audio using Whisper models
3. **Translate**: Select your target language and click translate to convert the text
4. **Export**: Copy or download your transcribed and translated content

## 🏗️ Project Structure

```
free-scribe/
├── src/
│   ├── components/          # React components
│   │   ├── FileDisplay.jsx  # Audio file handling
│   │   ├── Header.jsx       # Application header
│   │   ├── HomePage.jsx     # Landing page
│   │   ├── Information.jsx  # Main app container
│   │   ├── Transcribing.jsx # Transcription UI
│   │   ├── Transcription.jsx# Transcription results
│   │   └── Translation.jsx  # Translation interface
│   ├── utils/              # Utility functions and workers
│   │   ├── presets.js      # Language definitions and constants
│   │   ├── translate.worker.js # Translation Web Worker
│   │   └── whisper.worker.js   # Transcription Web Worker
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Application entry point
├── public/                 # Static assets
├── package.json           # Project dependencies
└── README.md              # This file
```

## 🤝 Contributing

We welcome contributions to Free-Scribe! Please feel free to submit issues, feature requests, or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI Whisper](https://github.com/openai/whisper) for speech-to-text capabilities
- [Hugging Face Transformers](https://huggingface.co/transformers/) for browser-based ML model inference
- [Helsinki-NLP](https://huggingface.co/Helsinki-NLP) for high-quality translation models
- [Xenova Transformers.js](https://github.com/xenova/transformers.js) for running transformers in the browser

## 📞 Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

---

Made with ❤️ for the open-source community
