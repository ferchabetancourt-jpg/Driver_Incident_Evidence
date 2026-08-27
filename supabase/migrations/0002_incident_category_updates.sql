-- Rename "support_instruction" to "support_call" (a call to the Amazon
-- Driver Support line), and add two new incident categories for email
-- correspondence with Amazon: email_to_amazon, email_from_amazon.

-- Drop the old constraint before touching the data: it doesn't allow
-- 'support_call' yet, so updating rows to that value first would fail.
alter table incidents drop constraint if exists incidents_category_check;

update incidents set category = 'support_call' where category = 'support_instruction';

alter table incidents add constraint incidents_category_check check (category in (
  'no_access_code',
  'gate_locked',
  'customer_unavailable',
  'unsafe_location',
  'damaged_package',
  'missing_package',
  'wrong_address',
  'delivery_instructions',
  'vehicle_route_issue',
  'weather_or_external',
  'support_call',
  'email_to_amazon',
  'email_from_amazon',
  'other'
));
