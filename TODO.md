# TODO: Change Product ID to Alphanumeric Code

## Steps to Complete

1. **Update Prisma Schema**
   - Change `id` in `Product` model from `Int` to `String`
   - Remove `@default(autoincrement())`
   - Ensure `@id` is present

2. **Generate Prisma Client**
   - Run `npx prisma generate` to update the client

3. **Update API Routes**
   - Modify `app/api/products/route.ts` to generate alphanumeric ID on POST
   - Modify `app/api/products/[id]/route.ts` to handle string ID

4. **Update Frontend Pages**
   - Update `app/shop/[id]/page.tsx` to handle string ID in params
   - Update `app/shop/page.tsx` if needed (likely no changes)
   - Update `app/admin/add-product/page.tsx` if needed (likely no changes)

5. **Run Database Migration**
   - Run `npx prisma migrate dev` to apply schema changes

6. **Test the Changes**
   - Verify product creation with new ID format
   - Verify product fetching by ID
   - Check shop pages display correctly

## Notes
- Existing products may need ID conversion if data exists
- Ensure alphanumeric codes are unique
- Use a utility function for ID generation (e.g., random alphanumeric string)
