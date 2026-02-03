

# Page Loading Animation Plan

## Overview
Add a smooth, professional page loading animation that displays while the website content loads. This will include an animated loader with the clinic branding, followed by a graceful fade-out transition to reveal the content.

## Implementation Approach

We'll create a loading screen that:
- Shows immediately when the page loads
- Features a medical-themed animation with the clinic logo
- Smoothly fades out once content is ready
- Uses existing Tailwind animations and the Skeleton component pattern

## Components to Create/Modify

### 1. Create PageLoader Component
**File: `src/components/PageLoader.tsx`**

A dedicated loading screen component with:
- Full-screen overlay with the clinic's primary color gradient background
- Animated logo/icon (pulsing stethoscope or heartbeat animation)
- "Dr. Deogade Clinic" text with subtle animation
- Loading progress indicator (animated dots or pulse ring)

### 2. Add Loading Animation Keyframes
**File: `tailwind.config.ts`**

Add new keyframes for:
- `spin-slow`: A slower spin for the loader icon
- `bounce-dots`: Bouncing animation for loading dots
- `fade-out`: Smooth fade-out for the loader screen
- `pulse-ring`: Expanding ring pulse effect

### 3. Update Index Page
**File: `src/pages/Index.tsx`**

Integrate the PageLoader:
- Add loading state management (`isLoading`)
- Show loader initially, hide after content loads
- Use `useEffect` to detect when page resources are ready
- Apply fade-in animation to main content after loading

### 4. Add CSS for Loader
**File: `src/index.css`**

Add loading animation styles:
- Loader container positioning
- Animation timing and easing
- Smooth transition effects

## Visual Design

The loader will feature:
- **Background**: Medical gradient (blue to teal) matching site theme
- **Center Element**: Animated heartbeat/pulse icon with the logo
- **Text**: "Dr. Deogade Clinic" with subtle fade-in
- **Loading Indicator**: Three bouncing dots or a pulse ring
- **Transition**: Smooth 0.5s fade-out when content is ready

## User Experience

- Loading screen shows for minimum 800ms (prevents flash for fast connections)
- Maximum wait time before force-showing content: 3 seconds
- Smooth transition preserves professional feel
- Works well on both mobile and desktop

## Technical Details

### PageLoader Component Structure
```text
+----------------------------------+
|                                  |
|     [Animated Medical Icon]      |
|                                  |
|     Dr. Deogade Clinic           |
|                                  |
|        . . . (loading dots)      |
|                                  |
+----------------------------------+
```

### Animation Timeline
1. Page loads -> Loader visible immediately
2. Content loads in background
3. After content ready (min 800ms, max 3s)
4. Loader fades out (500ms)
5. Main content fades in

### State Management
- `isLoading: boolean` - Controls loader visibility
- `contentReady: boolean` - Tracks when page content is loaded
- Uses `window.onload` and `setTimeout` for reliable detection

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/PageLoader.tsx` | Create | Loading screen component |
| `src/pages/Index.tsx` | Modify | Add loader state and integration |
| `tailwind.config.ts` | Modify | Add new animation keyframes |
| `src/index.css` | Modify | Add loader-specific styles |

## Benefits

- Professional first impression
- Smooth visual transition
- Prevents layout shift (FOUC)
- Medical-themed branding reinforcement
- Works on all devices and connection speeds

