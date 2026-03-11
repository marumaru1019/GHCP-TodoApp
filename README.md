# Todo App with Advanced Theme System

This is a modern Todo application built with Next.js, TypeScript, and Tailwind CSS, featuring an advanced theme customization system.

## ✨ Features

- **📋 Todo Management**: Add, edit, delete, and mark tasks as complete
- **🎨 Advanced Theme System**: Multiple preset themes and custom theme creation
- **🌙 Dark Mode Support**: Automatic system preference detection
- **♿ Accessibility Features**: High contrast mode, font size adjustment, reduced motion
- **💾 Persistent Settings**: Theme preferences saved to localStorage
- **📱 Responsive Design**: Works seamlessly across all devices

## 🎨 Theme System

### Preset Themes
- **ライト (Light)**: Clean and bright design
- **ダーク (Dark)**: Eye-friendly dark theme
- **ハイコントラスト (High Contrast)**: Accessibility-focused high contrast
- **ブルー (Blue)**: Calming blue color scheme
- **グリーン (Green)**: Nature-inspired green theme
- **ピンク (Pink)**: Warm pink color palette

### Custom Themes
- Create your own themes with custom color palettes
- Real-time preview of theme changes
- Save and manage multiple custom themes
- Export/import theme configurations

### Accessibility
- Font size customization (Small, Medium, Large)
- Reduced motion support for users with vestibular disorders
- High contrast mode for better visibility
- Automatic dark mode detection based on system preferences

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS Variables
- **Theme Management**: React Context + Custom Hooks
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint
- **Package Manager**: npm

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation & Development

1. Clone the repository:
```bash
git clone https://github.com/marumaru1019/GHCP-TodoApp.git
cd GHCP-TodoApp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test files
npm test -- --testPathPattern="theme"
```

### Linting

```bash
npm run lint
```

## 🎯 Usage

### Basic Todo Operations
1. **Add Todo**: Type in the input field and press Enter or click "追加"
2. **Complete Todo**: Click the checkbox to mark as complete
3. **Edit Todo**: Double-click on a todo item to edit
4. **Delete Todo**: Click the delete button (×) on any todo item
5. **Filter Todos**: Use the filter buttons (すべて/アクティブ/完了済み)

### Theme Customization
1. **Access Theme Settings**: Click the theme icon (sun symbol) in the top-right corner
2. **Select Preset Theme**: Choose from 6 preset themes in the grid
3. **Create Custom Theme**: 
   - Click the "+ カスタム" button
   - Use color pickers to customize each color
   - Preview changes in real-time
   - Name and save your custom theme
4. **Adjust Settings**:
   - Font size: Small, Medium, Large
   - Reduce animations for accessibility
   - Enable high contrast mode

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Color Contrast**: High contrast mode available
- **Reduced Motion**: Respects user's motion preferences
- **Scalable Text**: Customizable font sizes

## 📁 Project Structure

```
GHCP-TodoApp/
├── public/              # Static assets
├── src/
│   ├── app/            # App Router pages and layouts
│   ├── components/     # Reusable UI components
│   │   ├── TodoApp.tsx           # Main todo application
│   │   ├── TodoItem.tsx          # Individual todo item
│   │   ├── TodoInput.tsx         # Todo input form
│   │   ├── TodoFilter.tsx        # Todo filtering controls
│   │   └── ThemeSettings.tsx     # Theme customization UI
│   ├── contexts/       # React contexts
│   │   └── ThemeContext.tsx      # Theme state management
│   ├── hooks/          # Custom React hooks
│   │   └── useTheme.ts           # Theme management hook
│   ├── lib/            # Utility functions and configurations
│   │   └── themes.ts             # Preset theme definitions
│   └── types/          # TypeScript type definitions
│       ├── todo.ts               # Todo-related types
│       └── theme.ts              # Theme system types
├── .github/            # GitHub configurations
└── package.json        # Dependencies and scripts
```

## 🔧 Theme System Architecture

The theme system is built around several key components:

### Core Types (`src/types/theme.ts`)
- `ThemeColors`: Defines the color palette structure
- `Theme`: Complete theme configuration including metadata
- `ThemeSettings`: User preferences and custom themes

### Theme Management (`src/hooks/useTheme.ts`)
- Centralized theme state management
- localStorage persistence
- CSS variable application
- System preference detection

### UI Components
- `ThemeSettings`: Main theme configuration interface
- `ThemeProvider`: Context provider for theme state
- Integrated theme switcher in the main app header

## 📚 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Theme System Implementation
- CSS Variables for dynamic theming
- React Context for state management
- localStorage for persistence
- Tailwind CSS integration
- TypeScript for type safety

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
