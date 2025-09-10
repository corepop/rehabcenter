## Brief overview
Technical guidelines for Astro development on the Enköpings Rehabcenter website, focusing on performance, SEO, and static site generation best practices.

## Page creation standards
- Use `export const prerender = true;` for all new pages to enable static site generation
- Include proper metadata objects with title and description for each page
- Use Swedish titles and descriptions for user-facing pages
- Follow consistent naming conventions for page files

## Component architecture
- Create reusable components in appropriate directories under `src/components/`
- Use TypeScript interfaces for component props when applicable
- Always follow Tailwind CSS conventions for styling (use utility-first approach, responsive prefixes, and consistent class naming)
- Maintain consistent styling with Tailwind CSS classes
- Ensure components are responsive and support dark mode

## Performance optimization
- Implement lazy loading for heavy components when needed
- Use Astro's built-in optimization features for images and assets
- Minimize JavaScript bundle size by using Astro components over framework components
- Leverage static generation for better performance and SEO

## SEO and accessibility
- Include comprehensive metadata for all pages
- Use semantic HTML structure in layouts and components
- Ensure proper heading hierarchy (h1, h2, h3, etc.)
- Add alt text for images and proper ARIA labels where needed

## Content management
- Store static content in appropriate page files or data directories
- Use consistent Swedish terminology across all user-facing content
- Maintain healthcare-appropriate language for physiotherapy context
- Keep content structure simple and scannable with bullet points

## Development workflow
- Test components in different viewport sizes for responsiveness
- Verify GDPR compliance when adding new features
- Use TypeScript for better code reliability and developer experience
- Follow established patterns for similar functionality
