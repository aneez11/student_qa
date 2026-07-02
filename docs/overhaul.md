# UI Overhaul: Student QA Platform

This plan outlines the complete UI overhaul to transform the current application into a modern, responsive, and aesthetic learning platform.

## 1. Design Direction: "The Learning Hub"
- **Aesthetic**: Clean, airy, and professional. Uses glassmorphism (translucent blurs), soft shadows, and high-quality typography.
- **Color Palette**: Deep Indigo primary, Emerald/Teal accents for success (answers), and Slate for text.
- **Interactivity**: Smooth transitions, scale-on-hover effects, and intuitive navigation.

## 2. Global Enhancements
- [ ] **Dark Mode**: Add support for a system-aware dark theme with a toggle.
- [ ] **Navigation**: Implement a sticky `Navbar` with breadcrumbs and a theme toggle.
- [ ] **Layout**: Wrap the application in a main container with consistent padding and max-width.

## 3. Page-Specific Changes

### Home Page
- [ ] Add a **Hero Section** with a headline and an illustration or icon.
- [ ] Redesign **Grade Cards** to include:
    - Subject count and question count badges.
    - Illustrative icons (e.g., Graduation Cap).
    - "Pulse" effect on the primary action button.

### Grade View
- [ ] **Subject Sidebar**: Turn into a modern navigation list with active states.
- [ ] **Chapter Cards**: Redesign as compact cards with "Chapter N" badges and horizontal progress-like markers.

### Chapter View (Reading Experience)
- [ ] **Question Cards**:
    - "Q" and "A" indicators with distinct color coding.
    - Side-border accents to separate question from answer.
    - "Copy" and "Bookmark" action buttons for every question.
- [ ] **Filter Bar**: Make it sticky and add a "Clear All" floating action if filters are active.
- [ ] **Mobile Optimization**: Ensure tables and code blocks have proper overflow handling and touch-friendly controls.

## 4. Implementation Steps

### Phase 1: Foundation (Theme & Global)
- Update `index.css` with improved OKLCH variables.
- Create `ThemeToggle.tsx` and `Navbar.tsx`.
- Update `App.tsx` to include global layout components.

### Phase 2: Components (The Building Blocks)
- Overhaul `QuestionCard.tsx`.
- Update `ui/card.tsx` and `ui/button.tsx` if needed for custom variants.

### Phase 3: Page Redesign (Visuals)
- Redesign `Home.tsx`.
- Redesign `Grade.tsx`.
- Redesign `Chapter.tsx`.

### Phase 4: Polish & Interaction
- Add entrance animations.
- Implement the "Bookmark" system via local storage.

## 5. Verification
- Test on Mobile (375px), Tablet (768px), and Desktop (1280px+).
- Validate accessibility (contrast ratios, keyboard navigation).
- Ensure math (KaTeX) and code highlighting look sharp in both light and dark modes.
