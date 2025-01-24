import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import {
  usersTable,
  organizationTable,
  walletTable,
  organizationMemberTable,
  wabaNumberTable,
  waBusinessProfileTable,
  NewUser,
  NewWallet,
  NewOrganization,
  NewOrganizationMember,
  NewWaBusinessProfile,
} from "./schema";
import { db } from ".";
import { sql } from "drizzle-orm";

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = "password123";

const MIN_RANGE = 20;
const MAX_RANGE = 100;

const generatedEmails = new Set<string>();
const generatedPhoneNumbers = new Set<string>();

const generateEmail = () => {
  let email = faker.internet.email();
  while (generatedEmails.has(email)) {
    email = faker.internet.email();
  }
  generatedEmails.add(email);
  return email;
};

const generatePhoneNumber = () => {
  let phone = faker.phone.number({ style: "international" });
  while (generatedPhoneNumbers.has(phone)) {
    phone = faker.phone.number({ style: "international" });
  }
  generatedPhoneNumbers.add(phone);
  return phone;
};

const clearPhoneNumber = (phone: string) => {
  // replace everything other than numbers with empty string
  return phone.replace(/\D/g, "");
};

async function seedDatabase() {
  const [hashedPassword] = await Promise.all([
    bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS),
  ]);

  // Create admin users
  const admin: NewUser = {
    name: faker.person.fullName(),
    email: generateEmail(),
    password: hashedPassword,
    phone: clearPhoneNumber(generatePhoneNumber()),
    role: "ADMIN",
    status: "ACTIVE",
    currency: "INR",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const admins = await db.insert(usersTable).values(admin).returning();

  // Create reseller users
  const resellerUsers = Array.from({
    length: faker.number.int({ min: MIN_RANGE, max: MAX_RANGE }),
  }).map(
    (): NewUser => ({
      name: faker.person.fullName(),
      email: generateEmail(),
      password: hashedPassword,
      phone: clearPhoneNumber(generatePhoneNumber()),
      role: "RESELLER",
      status: "ACTIVE",
      currency: "INR",
      resellerId: admins[0]!.id,
    })
  );

  const resellers = await db
    .insert(usersTable)
    .values(resellerUsers)
    .returning();

  // Create reseller wallets
  const resellerWallets = resellers.map(
    (reseller): NewWallet => ({
      balance: faker.number.float({ min: MAX_RANGE, max: MAX_RANGE }),
      walletType: "RESELLER",
      resellerId: reseller.id,
    })
  );

  await db.insert(walletTable).values(resellerWallets);

  // Create regular users under resellers
  const regularUsers = resellers.flatMap((reseller): NewUser[] =>
    Array.from({
      length: faker.number.int({ min: MIN_RANGE, max: MAX_RANGE }),
    }).map(() => ({
      name: faker.person.fullName(),
      email: generateEmail(),
      password: hashedPassword,
      phone: clearPhoneNumber(generatePhoneNumber()),
      role: "USER",
      resellerId: reseller.id,
      status: "ACTIVE",
      currency: "INR",
    }))
  );

  const users = await db.insert(usersTable).values(regularUsers).returning();

  // Create organizations
  const organizations = users.map(
    (): NewOrganization => ({
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      industry: "Other",
      logo: faker.image.url(),
      currency: "INR",
    })
  );

  const orgs = await db
    .insert(organizationTable)
    .values(organizations)
    .returning();

  // Add each user as admin of their own organization
  const adminOrganizationMembers = orgs.map(
    (org, index): NewOrganizationMember => ({
      userId: users[index]!.id,
      orgId: org.id,
      role: "ADMIN",
    })
  );

  await db.insert(organizationMemberTable).values(adminOrganizationMembers);

  // Create organization wallets
  const orgWallets = orgs.map(
    (org): NewWallet => ({
      balance: faker.number.float({ min: MAX_RANGE, max: MAX_RANGE }),
      walletType: "ORGANIZATION",
      organizationId: org.id,
    })
  );

  await db.insert(walletTable).values(orgWallets);

  await Promise.all(
    orgs.map(async (org) => {
      const members = Array.from({
        length: faker.number.int({ min: MIN_RANGE, max: MAX_RANGE }),
      }).map(
        (): NewUser => ({
          name: faker.person.fullName(),
          email: generateEmail(),
          password: hashedPassword,
          phone: clearPhoneNumber(generatePhoneNumber()),
          role: "MEMBER",
          status: "ACTIVE",
          currency: "INR",
        })
      );

      const orgMembers = await db
        .insert(usersTable)
        .values(members)
        .returning();

      // Create organization members entries
      const orgMemberships = orgMembers.map(
        (member): NewOrganizationMember => ({
          userId: member.id,
          orgId: org.id,
          role: "MEMBER",
        })
      );

      // Insert the memberships
      await db.insert(organizationMemberTable).values(orgMemberships);
    })
  );

  // Create WABA business profiles
  const businessProfiles = orgs.map(
    (): NewWaBusinessProfile => ({
      about: faker.company.catchPhrase(),
      address: faker.location.streetAddress(),
      description: faker.company.buzzPhrase(),
      email: generateEmail(),
      profilePictureUrl: faker.image.avatar(),
      websites: [faker.internet.url()],
      vertical: faker.company.buzzNoun(),
      messagingProduct: "whatsapp",
    })
  );

  const profiles = await db
    .insert(waBusinessProfileTable)
    .values(businessProfiles)
    .returning();

  // Create WABA numbers
  const wabaNumbers = profiles.map((profile, idx) => ({
    displayName: faker.company.name(),
    verifiedName: faker.company.name(),
    number: clearPhoneNumber(generatePhoneNumber()),
    displayNumber: clearPhoneNumber(generatePhoneNumber()),
    apiKey: faker.string.alphanumeric(32),
    organizationId: orgs[idx]!.id,
    businessProfileId: profile.id,
  }));

  await db.insert(wabaNumberTable).values(wabaNumbers);

  console.log("Database seeded successfully");

  await db.execute(sql`REFRESH MATERIALIZED VIEW user_hierarchy`);

  console.log("User hierarchy materialized view refreshed");
}

seedDatabase().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
