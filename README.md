# Winter Golf League Dashboard - React App

A modern, interactive golf league dashboard built with React and Bootstrap.

## 🎉 Features

- ✅ **Interactive Score Entry** - Submit scores directly from any device
- ✅ **Real-time Leaderboard** - Live standings and statistics
- ✅ **Team Management** - View all teams and player rosters
- ✅ **Course Information** - Course details with handicap calculations
- ✅ **USGA Handicap Calculator** - Automatic course handicap calculations
- ✅ **Persistent Data** - All data saved in browser localStorage
- ✅ **Mobile Responsive** - Works perfectly on phones and tablets
- ✅ **No Backend Required** - Pure frontend application

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- npm or yarn

### Installation

```bash
cd golf-league-dashboard
npm install
```

### Running Locally

```bash
npm start
```

The app will open at:
- **Local:** http://localhost:3000
- **Network:** http://10.1.13.172:3000

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder that you can:
- Host on any web server
- Deploy to Netlify, Vercel, GitHub Pages
- Serve from a simple HTTP server

## 📱 Accessing on Your Network

Once running, share this URL with your league members:
```
http://10.1.13.172:3000
```

Everyone on the same WiFi network can access the dashboard!

## 🎯 How to Use

1. **Teams Tab** - View all team rosters
2. **Scorecard Tab** - Submit scores and view history
3. **Courses & Handicaps** - See course info and handicap calculations
4. **Leaderboard** - Check live standings
5. **Rules** - Review league rules

## 💾 Data Management

All data is stored in your browser's localStorage:
- Teams
- Courses
- Scores
- Handicaps

**Note:** Data persists in the browser but is local to each device. For multi-device sync, you'll need to add a backend (see below).

## 🌐 Deployment Options

### Option 1: Netlify (Easiest)
1. Create account at netlify.com
2. Drag and drop the `build/` folder
3. Get instant URL to share

### Option 2: Vercel
```bash
npm install -g vercel
vercel
```

### Option 3: GitHub Pages
```bash
npm install --save gh-pages
# Add to package.json: "homepage": "https://yourusername.github.io/golf-league"
npm run deploy
```

### Option 4: Any Web Host
Upload the `build/` folder contents to your web server.

## 🔧 Customization

### Editing Initial Data

Edit `src/App.js` to change default teams, courses, or handicaps:

```javascript
const initialTeams = [
  { id: 1, name: 'Your Team', player1: 'Player A', player2: 'Player B' },
  // Add more teams...
];
```

### Styling

Modify `src/App.css` to change colors and styling.

## 📊 Adding a Backend (Optional)

To sync data across devices, you can add a backend:

1. **Firebase** - Easy real-time database
2. **Supabase** - Open-source Firebase alternative
3. **Custom API** - Node.js/Express backend

## 🐛 Troubleshooting

**Blank page:**
- Check browser console for errors (F12)
- Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Clear browser cache

**Data not saving:**
- Check if localStorage is enabled in browser
- Try a different browser
- Check browser privacy settings

**Can't access from other devices:**
- Ensure all devices on same WiFi
- Check firewall settings
- Try http://localhost:3000 on the same computer

## 📦 Dependencies

- React 18
- React Bootstrap 2.x
- Bootstrap 5
- React Icons

## 🎮 Development

```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Analyze bundle size
npm run build -- --stats
```

## 📝 License

MIT

## 🆘 Support

For issues or questions:
1. Check the browser console (F12)
2. Review this README
3. Check React documentation: https://react.dev

---

**Current Status:** ✅ Running on http://localhost:3000

Enjoy your golf league season! ⛳️
# winter-golf-dashboard-v2
