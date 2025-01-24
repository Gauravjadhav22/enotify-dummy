import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  pgEnum,
  timestamp,
  text,
  real,
  pgMaterializedView,
  AnyPgColumn,
} from "drizzle-orm/pg-core";

import { cuid2 } from "drizzle-cuid2/postgres";

export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "RESELLER",
  "USER",
  "MEMBER",
]);

export const userStatusEnum = pgEnum("user_status", [
  "ACTIVE",
  "INACTIVE",
  "PENDING",
  "SUSPENDED",
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "CREDIT",
  "DEBIT",
]);

export const industryEnum = pgEnum("industry", [
  "Automotive",
  "Beauty, Spa and Salon",
  "Clothing and Apparel",
  "Education",
  "Entertainment",
  "Online Gambling & Gaming",
  "Non-Online Gambling & Gaming (E.g. Brick and mortar)",
  "Event Planning and Service",
  "Finance and Banking",
  "Food and Grocery",
  "Alcoholic Beverages",
  "Public Service",
  "Hotel and Lodging",
  "Medical and Health",
  "Over-the-Counter Drugs",
  "Non-profit",
  "Professional Services",
  "Shopping and Retail",
  "Travel and Transportation",
  "Restaurant",
  "Other",
]);

export const userOrganizationRoleEnum = pgEnum("user_organization_role", [
  "ADMIN",
  "MEMBER",
]);

export const walletCurrencyEnum = pgEnum("wallet_currency", [
  "USD",
  "EUR",
  "INR",
]);

export const walletTypeEnum = pgEnum("wallet_type", [
  "ORGANIZATION",
  "RESELLER",
]);

export const wabaNumberThroghtputEnum = pgEnum("waba_number_throghtput", [
  "HIGH",
  "MEDIUM",
  "LOW",
]);

export const wabaLimitTierEnum = pgEnum("waba_limit_tier", [
  "TIER_1K",
  "TIER_10K",
  "TIER_100K",
  "UNLIMITED",
]);

export const wabaNumberStatusEnum = pgEnum("waba_number_status", [
  "CONNECTED",
  "PENDING",
  "RESTRICTED",
  "FLAGGED",
  "BANNED",
  "ACTIVE",
]);

export const messageTemplateCategoryEnum = pgEnum("message_template_category", [
  "MARKETING",
  "UTILITY",
  "AUTHENTICATION",
]);

export const messageTemplateTypeEnum = pgEnum("message_template_type", [
  "TEXT",
  "IMAGE",
  "VIDEO",
  "AUDIO",
  "DOCUMENT",
]);

export const messageTriggerEnum = pgEnum("message_trigger", [
  "API",
  "UI",
  "CHATBOT",
  "TEAM",
  "INTEGRATION",
]);

export const messageChargeTypeEnum = pgEnum("message_charge_type", [
  "MIC", // Marketing initiated conversation
  "UIC", // Utility initiated conversation
  "AIC", // Authentication initiated conversation
  "SIC", // Service initiated conversation
]);

// Existing users table with modifications
export const usersTable = pgTable("users", {
  id: cuid2("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name"),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  phone: varchar("phone").unique(),
  role: userRoleEnum("role").default("USER").notNull(),
  resellerId: cuid2("reseller_id").references((): AnyPgColumn => usersTable.id),
  currency: walletCurrencyEnum("currency").default("INR").notNull(),
  status: userStatusEnum("status").default("ACTIVE").notNull(),
  resellerWalletId: cuid2("reseller_wallet_id").references(
    () => walletTable.id
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// New tables
export const profileTable = pgTable("profile", {
  id: cuid2("id").primaryKey().defaultRandom().notNull(),
  userId: cuid2("user_id")
    .defaultRandom()
    .notNull()
    .unique()
    .references(() => usersTable.id),
  address: text("address"),
  avatar: text("avatar"),
  bio: text("bio"),
  city: varchar("city"),
  country: varchar("country"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const walletTable = pgTable("wallet", {
  id: cuid2("id").primaryKey().defaultRandom().notNull(),
  balance: real("balance").default(0).notNull(),
  walletType: walletTypeEnum("wallet_type").default("ORGANIZATION").notNull(),
  organizationId: cuid2("organization_id")
    .unique()
    .references((): AnyPgColumn => organizationTable.id),
  resellerId: cuid2("reseller_id")
    .unique()
    .references((): AnyPgColumn => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const walletTransactionTable = pgTable("wallet_transaction", {
  id: cuid2("id").primaryKey().defaultRandom().notNull(),
  amount: real("amount").notNull(),
  type: transactionTypeEnum("type").notNull(),
  organizationId: cuid2("organization_id").references(
    () => organizationTable.id
  ),
  resellerId: cuid2("reseller_id").references(() => usersTable.id),
  rechargedById: cuid2("recharged_by_id").references(() => usersTable.id),
  description: text("description"),
  quotaBefore: real("quota_before").notNull(),
  quotaAfter: real("quota_after").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const organizationTable = pgTable("organization", {
  id: cuid2("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  industry: industryEnum("industry").default("Other").notNull(),
  logo: text("logo"),
  currency: walletCurrencyEnum("currency").default("INR").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizationMemberTable = pgTable("organization_member", {
  id: cuid2("id").primaryKey().defaultRandom().notNull(),
  userId: cuid2("user_id")
    .defaultRandom()
    .notNull()
    .references(() => usersTable.id),
  orgId: cuid2("org_id")
    .defaultRandom()
    .notNull()
    .references(() => organizationTable.id),
  role: userOrganizationRoleEnum("role").default("MEMBER").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wabaNumberTable = pgTable("waba_number", {
  id: cuid2("id").primaryKey().defaultRandom().notNull(),
  displayName: varchar("display_name").notNull(),
  verifiedName: varchar("verified_name").notNull(),
  number: varchar("number").notNull(),
  displayNumber: varchar("display_number").notNull(),
  apiKey: varchar("api_key").notNull(),
  throughput: wabaNumberThroghtputEnum("throughput").default("LOW").notNull(),
  organizationId: cuid2("organization_id")
    .notNull()
    .references(() => organizationTable.id),
  limitTier: wabaLimitTierEnum("limit_tier").default("TIER_1K").notNull(),
  businessProfileId: cuid2("business_profile_id").references(
    () => waBusinessProfileTable.id
  ),
  numberStatus: wabaNumberStatusEnum("number_status")
    .default("ACTIVE")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const waBusinessProfileTable = pgTable("wa_business_profile", {
  id: cuid2("id").primaryKey().defaultRandom().notNull(),
  about: text("about"),
  address: text("address"),
  description: text("description"),
  email: varchar("email"),
  profilePictureUrl: text("profile_picture_url"),
  websites: text("websites").array(),
  vertical: varchar("vertical"),
  messagingProduct: varchar("messaging_product").default("whatsapp").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const waTemplateTable = pgTable("wa_template", {
  id: cuid2("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name").notNull(),
  category: messageTemplateCategoryEnum("category").notNull(),
  language: varchar("language").notNull(),
  description: text("description"),
  wabaNumberId: cuid2("waba_number_id")
    .notNull()
    .references(() => wabaNumberTable.id),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const waMessageTable = pgTable("wa_message", {
  id: cuid2("id").primaryKey().defaultRandom().notNull(),
  messageId: varchar("message_id").unique().notNull(),
  organizationId: cuid2("organization_id").references(
    () => organizationTable.id
  ),
  wabaNumberId: cuid2("waba_number_id")
    .notNull()
    .references(() => wabaNumberTable.id),
  trigger: varchar("trigger").notNull(),
  chargeAmount: real("charge_amount").default(0).notNull(),
  chargeType: varchar("charge_type").notNull(),
  chargeCurrency: walletCurrencyEnum("charge_currency")
    .default("INR")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userHierarchyView = pgMaterializedView("user_hierarchy", {
  ancestorId: cuid2("ancestor_id").notNull(),
  descendantId: cuid2("descendant_id").notNull(),
  depth: integer("depth").notNull(),
}).as(sql`
  WITH RECURSIVE hierarchy AS (
    -- Base case: direct relationships
    SELECT 
      reseller_id as ancestor_id,
      id as descendant_id,
      1 AS depth
    FROM users
    WHERE reseller_id IS NOT NULL
    
    UNION ALL
    
    -- Recursive case: join with existing hierarchy
    SELECT 
      h.ancestor_id,  -- Keep the original ancestor
      u.id as descendant_id,
      h.depth + 1
    FROM hierarchy h
    JOIN users u ON u.reseller_id = h.descendant_id  -- Join on descendant instead of ancestor
  )
  SELECT ancestor_id, descendant_id, depth FROM hierarchy
`);

export type User = typeof usersTable.$inferSelect;
export type Organization = typeof organizationTable.$inferSelect;
export type OrganizationMember = typeof organizationMemberTable.$inferSelect;
export type WabaNumber = typeof wabaNumberTable.$inferSelect;
export type WaBusinessProfile = typeof waBusinessProfileTable.$inferSelect;
export type WaTemplate = typeof waTemplateTable.$inferSelect;
export type WaMessage = typeof waMessageTable.$inferSelect;
export type Wallet = typeof walletTable.$inferSelect;
export type WalletTransaction = typeof walletTransactionTable.$inferSelect;

export type NewUser = typeof usersTable.$inferInsert;
export type NewOrganization = typeof organizationTable.$inferInsert;
export type NewOrganizationMember = typeof organizationMemberTable.$inferInsert;
export type NewWabaNumber = typeof wabaNumberTable.$inferInsert;
export type NewWaBusinessProfile = typeof waBusinessProfileTable.$inferInsert;
export type NewWaTemplate = typeof waTemplateTable.$inferInsert;
export type NewWaMessage = typeof waMessageTable.$inferInsert;
export type NewWallet = typeof walletTable.$inferInsert;
export type NewWalletTransaction = typeof walletTransactionTable.$inferInsert;
