CREATE TABLE `academy_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`academy` enum('cricket','badminton') NOT NULL,
	`studentName` varchar(200) NOT NULL,
	`studentAge` int,
	`phone` varchar(20) NOT NULL,
	`email` varchar(320),
	`level` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
	`message` text,
	`status` enum('pending','enrolled','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `academy_enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blocked_slots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courtId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`reason` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blocked_slots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courtId` int NOT NULL,
	`sport` enum('cricket','football','badminton','box_cricket') NOT NULL,
	`date` varchar(10) NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`amount` int NOT NULL,
	`status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
	`paymentId` varchar(200),
	`paymentStatus` enum('pending','paid','refunded','failed') NOT NULL DEFAULT 'pending',
	`customerName` varchar(200),
	`customerPhone` varchar(20),
	`customerEmail` varchar(320),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`subject` varchar(500),
	`message` text NOT NULL,
	`status` enum('new','read','replied') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`sport` enum('cricket','football','badminton','box_cricket') NOT NULL,
	`description` text,
	`weekdayPrice` int NOT NULL DEFAULT 1800,
	`weekendPrice` int NOT NULL DEFAULT 2000,
	`openTime` varchar(5) NOT NULL DEFAULT '06:00',
	`closeTime` varchar(5) NOT NULL DEFAULT '23:00',
	`slotDurationMinutes` int NOT NULL DEFAULT 60,
	`isActive` boolean NOT NULL DEFAULT true,
	`amenities` json,
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `golf_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `golf_notifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `golf_notifications_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);