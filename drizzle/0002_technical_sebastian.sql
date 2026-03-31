ALTER TABLE `event_types` ADD COLUMN `start_time` integer;
ALTER TABLE `event_types` ADD COLUMN `end_time` integer;
ALTER TABLE `event_types` ADD COLUMN `buffer_time` integer DEFAULT 0;