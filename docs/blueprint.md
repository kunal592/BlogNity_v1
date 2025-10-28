# **App Name**: Blognity SaaS
- authentication is working property so dont edit the auth logicError: ./src/app/(main)/contactus/page.tsx:19:1
Export [32msendContactMessage[39m doesn't exist in target module
[0m [90m 17 |[39m [36mimport[39m { [33mCard[39m[33m,[39m [33mCardContent[39m[33m,[39m [33mCardDescription[39m[33m,[39m [33mCardHeader[39m[33m,[39m [33mCardTitle[39m } [36mfrom[39m [32m'@/components/ui/card'[39m[33m;[39m[0m
[0m [90m 18 |[39m [36mimport[39m { useToast } [36mfrom[39m [32m'@/hooks/use-toast'[39m[33m;[39m[0m
[0m[31m[1m>[22m[39m[90m 19 |[39m [36mimport[39m { sendContactMessage } [36mfrom[39m [32m'@/lib/api'[39m[33m;[39m[0m
[0m [90m    |[39m [31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[0m
[0m [90m 20 |[39m [36mimport[39m { [33mLoader2[39m } [36mfrom[39m [32m'lucide-react'[39m[33m;[39m[0m
[0m [90m 21 |[39m[0m
[0m [90m 22 |[39m [36mconst[39m formSchema [33m=[39m z[33m.[39mobject({[0m

The export [32msendContactMessage[39m was not found in module [1m[31m[project]/src/lib/api.ts [app-client] (ecmascript) <exports>[39m[22m.
Did you mean to import [32mgetPosts[39m?
All exports of the module are statically known (It doesn't have dynamic exports). So it's known statically that the requested export doesn't exist.
    at BuildError (http://localhost:9002/_next/static/chunks/%5Broot-of-the-server%5D__e2c08166._.js:17395:41)
    at renderWithHooks (http://localhost:9002/_next/static/chunks/node_modules_react-dom_cjs_react-dom_development_ab7e073c.js:13260:28)
    at updateFunctionComponent (http://localhost:9002/_next/static/chunks/node_modules_react-dom_cjs_react-dom_development_ab7e073c.js:16755:32)
    at beginWork (http://localhost:9002/_next/static/chunks/node_modules_react-dom_cjs_react-dom_development_ab7e073c.js:18388:32)
    at beginWork$1 (http://localhost:9002/_next/static/chunks/node_modules_react-dom_cjs_react-dom_development_ab7e073c.js:23101:28)
    at performUnitOfWork (http://localhost:9002/_next/static/chunks/node_modules_react-dom_cjs_react-dom_development_ab7e073c.js:22402:24)
    at workLoopSync (http://localhost:9002/_next/static/chunks/node_modules_react-dom_cjs_react-dom_development_ab7e073c.js:22331:17)
    at renderRootSync (http://localhost:9002/_next/static/chunks/node_modules_react-dom_cjs_react-dom_development_ab7e073c.js:22308:21)
    at performConcurrentWorkOnRoot (http://localhost:9002/_next/static/chunks/node_modules_react-dom_cjs_react-dom_development_ab7e073c.js:21732:84)
    at workLoop (http://localhost:9002/_next/static/chunks/node_modules_3bfdc6a4._.js:291:48)
    at flushWork (http://localhost:9002/_next/static/chunks/node_modules_3bfdc6a4._.js:270:28)
    at MessagePort.performWorkUntilDeadline (http://localhost:9002/_next/static/chunks/node_modules_3bfdc6a4._.js:498:35)
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


