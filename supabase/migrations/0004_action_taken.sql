-- Separate "what happened" (category, the cause) from "what did you do
-- about it" (action_taken). The previous migration mistakenly folded
-- actions (support_call, email_to_amazon, email_from_amazon) into the
-- category enum; this corrects that.

alter table incidents add column if not exists action_taken text check (action_taken in (
  'marked_in_app',
  'called_support',
  'emailed_amazon',
  'returned_no_action',
  'other'
));

-- Backfill: rows that used an action as their category get the action
-- moved to action_taken, and their category reset to 'other' since the
-- real cause was never captured for them.
update incidents set action_taken = 'called_support', category = 'other' where category = 'support_call';
update incidents set action_taken = 'emailed_amazon', category = 'other' where category = 'email_to_amazon';
update incidents set action_taken = 'other', category = 'other' where category = 'email_from_amazon';

-- Restore category to only real causes (drop the old constraint first,
-- since it doesn't allow 'other' to already exist as a target the
-- updates above wrote into it -- 'other' was always valid, so this is
-- just re-establishing the clean list).
alter table incidents drop constraint if exists incidents_category_check;

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
  'other'
));
