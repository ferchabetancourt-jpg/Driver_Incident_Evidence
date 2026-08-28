-- Separate "when Amazon scheduled this block to end" (end_time, never
-- touched automatically) from "when the driver actually finished it"
-- (closed_at). The dashboard's "active block" logic now depends only
-- on closed_at being null, not on any time-of-day math.

alter table blocks add column if not exists closed_at timestamptz;

-- One-time backfill: blocks that already had an end_time were
-- presumably meant to be closed already.
update blocks
set closed_at = (block_date || ' ' || end_time)::timestamp
where end_time is not null and closed_at is null;
