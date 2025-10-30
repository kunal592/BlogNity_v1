# **App Name**: Blognity SaaS
- authentication is working property so dont edit the auth logic.


## Core Features:

- Public Blog Display: Displays all public blogs in grid or list view with title, author, likes, tags, excerpt, and thumbnail. Includes like, bookmark, share, summarize, follow, and comment buttons.
- Personalized Feed: Custom feed for logged-in users, displaying posts from followed authors and recommended writers.
- Markdown Editor with AI SEO: Dual-screen markdown editor with toolbar and 'AI SEO Optimize' tool using mock AI text.
- Profile Management: User profile with avatar, name, bio, follower/following count, tabs for 'My Blogs', 'Bookmarked', 'Following', and editable profile info.
- Blog Dashboard: Full CRUD for author’s blogs with published/unpublished tabs, edit/delete buttons, and blog analytics (mock views, likes, comments).
- Admin Panel: Exclusive admin panel for user management (ban, delete, view posts) and blog management (feature, archive, remove) with metrics visualization (mock data).
- Backend Placeholder: A /lib/backendSetup.ts file including backend endpoints for future NestJS API connection. Simulate API latency using setTimeout() in mock fetchers

## Style Guidelines:

- Primary color: Deep purple (#6750A4) for a sophisticated and modern feel, inspired by themes of knowledge and premium access.
- Background color: Light lavender (#E6E0EA), a desaturated tint of the primary purple, creating a soft and unobtrusive backdrop.
- Accent color: Muted blue (#49777D), an analogous color to the purple, offering a contrasting, sophisticated call-to-action.
- Body font: 'Inter', a grotesque-style sans-serif for a modern, machined, objective, neutral look, that ensures excellent readability and a contemporary feel.
- Headline font: 'Space Grotesk', a proportional sans-serif with a computerized, techy, scientific feel for headlines.
- Use Lucide React icons for a consistent and clean look across the platform.
- Premium SaaS layout with sidebar navigation that hides on toggle. Responsive design for mobile, tablet, and desktop.
- Smooth transitions via Framer Motion for all UI elements. Use toasts for all success operations (like, follow, bookmark, etc.).




## problems to fix:
#only implement/improve logics dont edit alter UI and other logic of the project.


- check comment section, if user comment on blog it should list there wihout manual refreshing the site.

- search bar is not working.

- implement serch user feature in this project.

- check the self follow and remove it user should not follow herself.

- on profile section, at edit the updated values/data from user is not working means user enter updated avtar and bio but it doesnot reflect in there profile.

- one user one view: now at dasboard total views counter there is a count of views where i want that if a user view a blog (ntimes) it's view count should be taken 1 only no more from that user at a blog.
