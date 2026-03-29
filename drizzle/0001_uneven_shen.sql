CREATE TABLE `event_types` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`duration` integer NOT NULL,
	`color` text DEFAULT '#000000' NOT NULL,
	`location` text,
	`booking_url` text,
	`booking_window_start` integer,
	`booking_window_end` integer,
	`seat_limit` integer DEFAULT 1,
	`requires_confirmation` integer DEFAULT false,
	`cancellation_policy` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`wallet_address`) ON UPDATE no action ON DELETE no action
);
