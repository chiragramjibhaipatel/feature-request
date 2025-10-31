# Feature Request Widget

An embeddable widget for managing feature requests with upvoting functionality. Built with React and Shopify Polaris.

## Features

- 📊 Kanban-style board with customizable status columns
- 👍 Upvote/downvote functionality
- 🏷️ Tag support for categorizing requests
- 📱 Responsive design
- 🎨 Shopify Polaris UI components
- 🔌 Easy integration into any project
- 📦 Lightweight and performant

## Installation

### Option 1: NPM/Yarn (Recommended)

```bash
npm install feature-request-widget
```

or

```bash
yarn add feature-request-widget
```

### Option 2: CDN

Include the widget script and styles in your HTML:

```html
<link rel="stylesheet" href="https://unpkg.com/feature-request-widget@1.0.0/dist/feature-request-widget.css">
<script src="https://unpkg.com/feature-request-widget@1.0.0/dist/feature-request-widget.umd.js"></script>
```

## Usage

### Basic Usage (HTML + CDN)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="https://unpkg.com/feature-request-widget@1.0.0/dist/feature-request-widget.css">
</head>
<body>
  <!-- Widget container -->
  <div id="feature-requests"></div>

  <!-- Widget script -->
  <script src="https://unpkg.com/feature-request-widget@1.0.0/dist/feature-request-widget.umd.js"></script>

  <!-- Initialize widget -->
  <script>
    window.FeatureRequestWidget.init({
      elementId: 'feature-requests',
      customerId: 'user@example.com'
    });
  </script>
</body>
</html>
```

### ES Module Usage

```javascript
import FeatureRequestWidget from 'feature-request-widget';
import 'feature-request-widget/dist/feature-request-widget.css';

FeatureRequestWidget.init({
  elementId: 'feature-requests',
  customerId: 'user@example.com',
  config: {
    // Additional configuration options
  }
});
```

### React Integration

```javascript
import { useEffect } from 'react';
import FeatureRequestWidget from 'feature-request-widget';
import 'feature-request-widget/dist/feature-request-widget.css';

function MyComponent() {
  useEffect(() => {
    FeatureRequestWidget.init({
      elementId: 'feature-requests',
      customerId: currentUser.id
    });

    return () => {
      FeatureRequestWidget.destroy('feature-requests');
    };
  }, []);

  return <div id="feature-requests"></div>;
}
```

### Vue Integration

```vue
<template>
  <div id="feature-requests"></div>
</template>

<script>
import FeatureRequestWidget from 'feature-request-widget';
import 'feature-request-widget/dist/feature-request-widget.css';

export default {
  mounted() {
    FeatureRequestWidget.init({
      elementId: 'feature-requests',
      customerId: this.currentUser.id
    });
  },
  beforeUnmount() {
    FeatureRequestWidget.destroy('feature-requests');
  }
}
</script>
```

### Angular Integration

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import FeatureRequestWidget from 'feature-request-widget';
import 'feature-request-widget/dist/feature-request-widget.css';

@Component({
  selector: 'app-feature-requests',
  template: '<div id="feature-requests"></div>'
})
export class FeatureRequestsComponent implements OnInit, OnDestroy {
  ngOnInit() {
    FeatureRequestWidget.init({
      elementId: 'feature-requests',
      customerId: this.currentUser.id
    });
  }

  ngOnDestroy() {
    FeatureRequestWidget.destroy('feature-requests');
  }
}
```

## Configuration

### `init(options)`

Initialize the widget with the following options:

```javascript
FeatureRequestWidget.init({
  elementId: 'feature-requests',  // Required: DOM element ID
  customerId: 'user@example.com', // Required: Unique user identifier
  config: {
    // Optional configuration object
  }
});
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `elementId` | string | Yes | The ID of the DOM element where the widget will be rendered |
| `customerId` | string | Yes | Unique identifier for the current user (for upvoting) |
| `config` | object | No | Additional configuration options |

## API Methods

### `destroy(elementId)`

Unmount a specific widget instance:

```javascript
FeatureRequestWidget.destroy('feature-requests');
```

### `destroyAll()`

Unmount all widget instances:

```javascript
FeatureRequestWidget.destroyAll();
```

## Status Options

The widget supports the following statuses out of the box:

- ⏱️ Pending
- 👍 Approved
- 📋 Assigned
- ⚙️ In Progress
- ✅ Done
- ❌ Archived

## Backend Integration

The widget expects a backend API with the following endpoints:

### GET `/api/feature-requests`
Fetch all feature requests
```json
Response: [
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "tags": ["string"],
    "upvotes": ["string"],
    "status": "pending" | "approved" | "assigned" | "in-progress" | "done" | "archived"
  }
]
```

### POST `/api/feature-requests`
Create a new feature request
```json
Request Body: {
  "title": "string",
  "description": "string",
  "tags": ["string"],
  "customerId": "string"
}

Response: {
  "id": "string",
  "title": "string",
  "description": "string",
  "tags": ["string"],
  "upvotes": [],
  "status": "pending"
}
```

### POST `/api/feature-requests/:id/upvote`
Toggle upvote for a feature request
```json
Request Body: {
  "customerId": "string",
  "hasUpvoted": boolean
}

Response: {
  "upvotes": ["string"]
}
```

**Note:** If the API is unavailable, the widget will automatically fall back to demo data.

## Development

### Build the widget

```bash
npm run build
```

This will create the distributable files in the `dist/` directory:
- `feature-request-widget.umd.js` - UMD format for browser/CDN usage
- `feature-request-widget.es.js` - ES module format for bundlers
- `feature-request-widget.css` - Widget styles

### Run development server

```bash
npm run dev
```

The development server will start at `http://localhost:3001`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
