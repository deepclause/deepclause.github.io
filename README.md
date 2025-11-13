# DeepClause Microsite

This is a modern, responsive microsite for DeepClause built with vanilla HTML, CSS, and JavaScript.

## Features

- 📱 Fully responsive design
- 🎨 Modern gradient UI with smooth animations
- 🚀 Fast loading with no heavy frameworks
- ♿ Accessible navigation and semantic HTML
- 💫 Smooth scrolling and scroll-based animations
- 📋 Copy-to-clipboard functionality for code examples
- 🎯 Active navigation highlighting
- 🌊 Parallax effects on hero section

## Structure

```
microsite/
├── index.html      # Main HTML file
├── styles.css      # All styles and responsive design
├── script.js       # Interactive features and animations
└── README.md       # This file
```

## Development

To run locally, simply open `index.html` in a web browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Customization

### Colors
All colors are defined as CSS variables in `styles.css`. Edit the `:root` section to change the color scheme:

```css
:root {
    --primary-color: #6366f1;
    --primary-dark: #4f46e5;
    --secondary-color: #8b5cf6;
    /* ... */
}
```

### Fonts
The site uses Inter for body text and JetBrains Mono for code. These are loaded from Google Fonts in the `<head>` of `index.html`.

### Content
Edit `index.html` to update content. The structure is semantic and well-commented.

## Deployment

### GitHub Pages
1. Push the `microsite/` folder to your repository
2. Go to Settings > Pages
3. Select the branch and `/microsite` folder
4. Your site will be live at `https://username.github.io/repository-name/`

### Netlify
1. Drag and drop the `microsite/` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repository and set build directory to `microsite`

### Vercel
```bash
cd microsite
vercel
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- No external dependencies beyond fonts
- Minimal CSS and JavaScript
- Optimized images (use WebP where possible)
- Lazy loading for images can be added

## TODO

- [ ] Add actual video embeds when videos are hosted
- [ ] Add mobile menu implementation
- [ ] Add dark mode toggle
- [ ] Add search functionality
- [ ] Add blog/changelog section
- [ ] Optimize images and add lazy loading

## License

ISC License - Same as parent project
