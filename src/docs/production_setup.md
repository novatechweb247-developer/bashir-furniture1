# Bashir Furniture production setup

## 1. Supabase schema
The isolated Bashir tables have been created in the existing Supabase project. They use the `bashir_` prefix so the Tatari Furniture tables remain separate.

## 2. Create the administrator account
1. In Supabase, open **Authentication → Users**.
2. Create an account for the person who will manage Bashir Furniture. Use their own email and a strong password.
3. Copy that user's UUID from the Users page.
4. Open **SQL Editor** and run the following after replacing the placeholder with that UUID:

```sql
insert into public.bashir_admin_users (user_id)
values ('PASTE-AUTH-USER-UUID-HERE')
on conflict (user_id) do nothing;
```

Do not add an account you do not control. The admin dashboard checks this membership table after password sign-in.

## 3. Configure Vercel
Set these environment variables for the Bashir Furniture Vercel project in Preview and Production:
- `VITE_SUPABASE_URL` = the Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` = the project's publishable/anon key

Never put a Supabase service-role key in a `VITE_*` variable or in browser code.

## 4. Before publishing
- Replace the example contact details in the Site Settings tab with the real business phone, WhatsApp, email, address, and social links.
- Verify the product names, images, availability, and prices with the business owner.
- Test public enquiry submission, admin login, and catalog/settings updates.
- Confirm the Vercel production deployment is Ready before sharing it with customers.
