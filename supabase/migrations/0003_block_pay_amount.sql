-- Track the expected pay amount for a block, shown wherever the block appears.
alter table blocks add column if not exists pay_amount numeric(10, 2);
