ALTER TABLE `event_types` ADD COLUMN `price` integer DEFAULT 0;
ALTER TABLE `event_types` ADD COLUMN `priceType` text DEFAULT 'free';
ALTER TABLE `event_types` ADD COLUMN `currency` text DEFAULT 'USDC';
ALTER TABLE `event_types` ADD COLUMN `tipEnabled` integer DEFAULT 0;
ALTER TABLE `payments` ADD COLUMN `paymentType` text;
