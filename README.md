# QTA Simple Todo App

A clean, responsive todo list web application built with vanilla HTML, CSS, and JavaScript, powered by Supabase for data persistence.

## Features

- ✅ Add, edit, and delete todos
- ✅ Mark todos as completed
- ✅ Filter todos (All, Pending, Completed)
- ✅ Real-time statistics
- ✅ Responsive design
- ✅ Data persistence with Supabase
- ✅ Clean, modern UI

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Custom CSS with gradients and animations
- **Hosting**: Ready for deployment on Vercel, Netlify, or GitHub Pages

## Database Schema

The app uses a Supabase table `qta_todo_items` with the following structure:

```sql
CREATE TABLE qta_todo_items (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Setup

1. Clone the repository
2. Open `index.html` in your browser
3. The app is pre-configured to use the QTA Supabase instance

## Deployment

This is a static web app that can be deployed to:
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop the files or connect via Git
- **GitHub Pages**: Enable Pages in repository settings

## Usage

1. **Add Todo**: Type in the input field and click "Add Task" or press Enter
2. **Complete Todo**: Check the checkbox next to any todo item
3. **Edit Todo**: Click the "Edit" button and modify the text
4. **Delete Todo**: Click the "Delete" button (with confirmation)
5. **Filter**: Use the filter buttons to view All, Pending, or Completed todos

## Features in Detail

### Responsive Design
- Mobile-first approach
- Adapts to different screen sizes
- Touch-friendly interface

### Data Persistence
- All todos are saved to Supabase
- Real-time synchronization
- Handles offline scenarios gracefully

### User Experience
- Smooth animations and transitions
- Loading states and error handling
- Empty state messaging
- Confirmation dialogs for destructive actions

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - feel free to use this code for your projects!