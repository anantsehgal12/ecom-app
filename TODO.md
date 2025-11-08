# TODO: Update E-commerce App

- [x] 1. Update prisma/schema.prisma: Add Category model (id, name, products relation), add categoryId and category relation to Product, remove href, details, highlights, breadcrumbs fields from Product, remove Breadcrumb model entirely.
- [x] 2. Run `prisma migrate dev` to apply schema changes.
- [x] 3. Update app/shop/[id]/page.tsx: Remove rendering of details, highlights, breadcrumbs; add JSON-LD script tag for product schema (using name, price, description, category); generate breadcrumbs from category (e.g., ['Home', category.name, product.name]).
- [x] 4. Update app/seller-dashboard/add-product/page.tsx: Remove href, details, highlights, breadcrumbs fields; add category Select dropdown (fetch categories via API), with 'Create New Category' button opening a Dialog for name input; update variants form to allow multiple images (dynamic array of src and alt inputs).
- [x] 5. Update app/seller-dashboard/edit-product/[id]/page.tsx: Same changes as add-product.
- [x] 6. Update app/api/products/route.ts: Remove handling of href, details, highlights, breadcrumbs; add categoryId validation/creation; update variants to create multiple Image records (loop over imageUrls array).
- [x] 7. Update app/api/products/[id]/route.ts: Same updates for GET (remove fields), PUT (remove fields, add category), DELETE unchanged.
- [x] 8. Update app/seller-dashboard/products/page.tsx: Add category column to the table (fetch and display category.name).
- [x] 9. Test: Run the app, add/edit products with new fields, view individual page, check listing.
