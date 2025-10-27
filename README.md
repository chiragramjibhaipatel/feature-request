# Feature Request Web Component

A custom web component for managing feature requests with upvoting functionality.

## Features

- ✅ Display feature request cards
- ✅ Add new feature requests
- ✅ Upvote/downvote requests
- ✅ Tag support
- ✅ Status tracking (pending, approved, assigned, in-progress, done, archived)
- ✅ Shadow DOM for style encapsulation
- ✅ Responsive design
- ✅ Mock data fallback when API is unavailable

## File Structure

```
/home/claude/
├── services/
│   └── feature-request-service.js    # API service layer
├── feature-request-component.js      # Main web component
└── index.html                        # Demo page
```

## Usage

### Basic HTML Usage

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <feature-request-component></feature-request-component>
  
  <script type="module" src="feature-request-component.js"></script>
</body>
</html>
```

## API Endpoints

The component expects the following API endpoints at `https://www.example.com/api`:

### GET `/feature-requests`
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

### POST `/feature-requests`
Create a new feature request
```json
Request Body: {
  "title": "string",
  "description": "string",
  "tags": ["string"]
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

### POST `/feature-requests/:id/upvote`
Toggle upvote for a feature request
```json
Request Body: {
  "userId": "string"
}

Response: {
  // Updated feature request object
}
```

### PATCH `/feature-requests/:id/status`
Update feature request status
```json
Request Body: {
  "status": "pending" | "approved" | "assigned" | "in-progress" | "done" | "archived"
}

Response: {
  // Updated feature request object
}
```

### DELETE `/feature-requests/:id`
Delete a feature request

## Updating the API Domain

To change the API domain from `www.example.com`, edit `services/feature-request-service.js`:

```javascript
const API_BASE_URL = 'https://your-domain.com/api';
```

## Features in Detail

### Shadow DOM
The component uses Shadow DOM for style encapsulation, preventing CSS conflicts with the parent page.

### User ID Management
User IDs are automatically generated and stored in localStorage to track user upvotes across sessions.

### Mock Data Fallback
If the API is unavailable, the component automatically uses mock data for demonstration purposes.

### Responsive Design
The component is fully responsive and works on mobile, tablet, and desktop devices.

## Customization

### Styling
All styles are embedded in the Shadow DOM. To customize, edit the `<style>` section in `feature-request-component.js`.

### Status Colors
Modify the status badge colors in the CSS:
```css
.status-pending { background: #fef3c7; color: #92400e; }
.status-approved { background: #dbeafe; color: #1e40af; }
.status-in-progress { background: #ddd6fe; color: #5b21b6; }
.status-done { background: #d1fae5; color: #065f46; }
```

## Browser Support

- Chrome/Edge 67+
- Firefox 63+
- Safari 10.1+
- Opera 54+

## Development

To test locally:
1. Open `index.html` in a web browser
2. The component will load with mock data if the API is unavailable
3. Try adding new requests and upvoting

## Future Enhancements

Potential features to add:
- Search and filter functionality
- Sorting options (by upvotes, date, status)
- Comment system
- User authentication
- Real-time updates with WebSockets
- Admin panel for status management
