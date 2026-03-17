# Plataforma de Anuncios

## Current State
New project with no existing application logic.

## Requested Changes (Diff)

### Add
- Ad management system: ads have title, description, image, link, category, active status, and timestamp
- Owner admin panel (role-based access) to create, edit, delete, and toggle ads
- Image upload for ads via blob storage
- Public homepage with grid layout showcasing published ads
- Ad detail view with full info and external link
- Category filter on homepage
- Contact/advertiser inquiry form (name, email, company, message) stored on-chain
- Admin panel section to view contact requests

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Ad CRUD operations, contact request submission and retrieval, role-based owner access
2. Components: authorization (admin access), blob-storage (ad images)
3. Frontend: Homepage grid of active ads, category filter, ad detail modal/page, admin panel with tabs (ads management + contact requests), contact form for advertisers
