import { PrismaClient, EventCategory, JoinMode, EventLifecycle } from "@prisma/client";

const db = new PrismaClient();

export async function seedGuwahatiData() {
  console.log("🌱 Seeding Guwahati foundational data...");

  // 1. Venues in key Guwahati hubs
  const cafeWoodland = await db.venue.upsert({
    where: { slug: "woodland-cafe-uzan-bazaar" },
    update: {},
    create: {
      name: "The Woodland Artisanal Cafe",
      slug: "woodland-cafe-uzan-bazaar",
      description: "Cozy specialty coffee house with outdoor seating near the Brahmaputra riverfront.",
      address: "MG Road, Riverside, Uzan Bazaar",
      neighbourhood: "Uzan Bazaar",
      city: "Guwahati",
      state: "Assam",
      postalCode: "781001",
      facilities: ["wifi", "outdoor_seating", "board_games", "specialty_tea"],
      verificationStatus: "VERIFIED",
    },
  });

  const cafeRoasters = await db.venue.upsert({
    where: { slug: "brahmaputra-roasters-christian-basti" },
    update: {},
    create: {
      name: "Brahmaputra Roasters & Co.",
      slug: "brahmaputra-roasters-christian-basti",
      description: "Spacious community cafe featuring single-origin Assam roasts and communal seating tables.",
      address: "GS Road, Near Dona Planet, Christian Basti",
      neighbourhood: "Christian Basti",
      city: "Guwahati",
      state: "Assam",
      postalCode: "781005",
      facilities: ["wifi", "ac", "communal_tables", "parking"],
      verificationStatus: "VERIFIED",
    },
  });

  const panBazaarSpace = await db.venue.upsert({
    where: { slug: "dighalipukhuri-creative-studio-pan-bazaar" },
    update: {},
    create: {
      name: "Dighalipukhuri Open Studio",
      slug: "dighalipukhuri-creative-studio-pan-bazaar",
      description: "Heritage art and cultural hub overlooking the scenic Dighalipukhuri tank.",
      address: "Opposite Handique Girls College, Pan Bazaar",
      neighbourhood: "Pan Bazaar",
      city: "Guwahati",
      state: "Assam",
      postalCode: "781001",
      facilities: ["natural_light", "drawing_easels", "shaded_veranda"],
      verificationStatus: "VERIFIED",
    },
  });

  // 2. Verified Founding Hosts
  const hostUser1 = await db.user.upsert({
    where: { email: "ananya.host@beyondmeet.in" },
    update: {},
    create: {
      email: "ananya.host@beyondmeet.in",
      name: "Ananya Barua",
      role: "HOST",
      roles: ["HOST", "PARTICIPANT"],
      isAgeEligible: true,
      profile: {
        create: {
          displayName: "Ananya B.",
          bio: "Specialty coffee nerd and community organizer. Love bringing curious minds together.",
          city: "Guwahati",
          neighbourhood: "Uzan Bazaar",
          isOnboarded: true,
        },
      },
      hostProfile: {
        create: {
          publicBio: "Hosting conversational coffee clubs in Guwahati since 2023. Facilitator of zero-awkwardness meetups.",
          specialties: ["Coffee Conversations", "Creative Workshops"],
          isVerified: true,
          ratingAverage: 4.95,
          totalEventsHosted: 18,
        },
      },
    },
  });

  const hostUser2 = await db.user.upsert({
    where: { email: "priyam.host@beyondmeet.in" },
    update: {},
    create: {
      email: "priyam.host@beyondmeet.in",
      name: "Priyam Das",
      role: "HOST",
      roles: ["HOST", "PARTICIPANT"],
      isAgeEligible: true,
      profile: {
        create: {
          displayName: "Priyam D.",
          bio: "Board game collector and urban walker. Ask me about Settlers of Catan or Guwahati's heritage lanes.",
          city: "Guwahati",
          neighbourhood: "Christian Basti",
          isOnboarded: true,
        },
      },
      hostProfile: {
        create: {
          publicBio: "Board game connoisseur with over 50 strategy & party games. Friendly host for beginners and pros.",
          specialties: ["Board Games", "Food Walks"],
          isVerified: true,
          ratingAverage: 4.9,
          totalEventsHosted: 24,
        },
      },
    },
  });

  // 3. Founding Circles
  const coffeeCircle = await db.circle.upsert({
    where: { slug: "guwahati-coffee-thinkers" },
    update: {},
    create: {
      name: "Guwahati Coffee & Deep Talks",
      slug: "guwahati-coffee-thinkers",
      purpose: "A weekend ritual for open-minded people to discuss books, philosophy, life questions, and local culture over single origins.",
      rules: "1. No unsolicited business pitches. 2. Respect diverse opinions. 3. Be on time.",
      category: EventCategory.COFFEE_CONVERSATION,
      city: "Guwahati",
      ownerId: hostUser1.id,
      capacity: 30,
    },
  });

  const boardGameCircle = await db.circle.upsert({
    where: { slug: "assam-board-gamers-society" },
    update: {},
    create: {
      name: "Brahmaputra Board Gamers",
      slug: "brahmaputra-board-gamers",
      purpose: "Casual strategy games, cooperative missions, and icebreakers every Saturday afternoon.",
      rules: "Be welcoming to beginners. Learn rules together. Good sportsmanship always.",
      category: EventCategory.BOARD_GAMES,
      city: "Guwahati",
      ownerId: hostUser2.id,
      capacity: 40,
    },
  });

  // 4. Seed Scheduled Events (Next 7-14 days)
  const now = new Date();
  
  // Event 1: Coffee conversation this upcoming Saturday
  const event1Start = new Date(now);
  event1Start.setDate(event1Start.getDate() + 3);
  event1Start.setHours(17, 0, 0, 0); // 5:00 PM
  const event1End = new Date(event1Start);
  event1End.setHours(18, 30, 0, 0);

  await db.event.upsert({
    where: { slug: "saturday-coffee-talks-uzan-bazaar" },
    update: {},
    create: {
      title: "Riverside Saturday: Meaningful Conversations & Pour-Overs",
      slug: "saturday-coffee-talks-uzan-bazaar",
      description: "Join a small circle of 6-8 people to talk about personal projects, transitions, and the books that changed how we view things. Host prompts provided to break the ice naturally.",
      category: EventCategory.COFFEE_CONVERSATION,
      lifecycle: EventLifecycle.PUBLISHED,
      hostId: hostUser1.id,
      venueId: cafeWoodland.id,
      circleId: coffeeCircle.id,
      startTime: event1Start,
      endTime: event1End,
      capacity: 8,
      joinMode: JoinMode.IMMEDIATE,
      bookingDeadline: new Date(event1Start.getTime() - 2 * 60 * 60 * 1000), // 2 hours prior
      cancellationDeadline: new Date(event1Start.getTime() - 4 * 60 * 60 * 1000),
      priceInPaise: 0,
      rules: "Bring your favorite book or quote. Cafe beverages are self-ordered.",
    },
  });

  // Event 2: Board game afternoon this Sunday
  const event2Start = new Date(now);
  event2Start.setDate(event2Start.getDate() + 4);
  event2Start.setHours(15, 30, 0, 0);
  const event2End = new Date(event2Start);
  event2End.setHours(18, 0, 0, 0);

  await db.event.upsert({
    where: { slug: "catan-and-codenames-christian-basti" },
    update: {},
    create: {
      title: "Board Game Social: Codenames, Catan & Party Games",
      slug: "catan-and-codenames-christian-basti",
      description: "Whether you've never rolled a 20-sided die or you're a seasoned strategist, this Sunday meetup is built to make you laugh and think. We split into 2 small tables of 6.",
      category: EventCategory.BOARD_GAMES,
      lifecycle: EventLifecycle.PUBLISHED,
      hostId: hostUser2.id,
      venueId: cafeRoasters.id,
      circleId: boardGameCircle.id,
      startTime: event2Start,
      endTime: event2End,
      capacity: 12,
      joinMode: JoinMode.IMMEDIATE,
      bookingDeadline: new Date(event2Start.getTime() - 3 * 60 * 60 * 1000),
      cancellationDeadline: new Date(event2Start.getTime() - 6 * 60 * 60 * 1000),
      priceInPaise: 0,
      rules: "Arrive on time for the rules walkthrough. Friendly, respectful vibe only.",
    },
  });

  // Event 3: Photography Walk around Dighalipukhuri
  const event3Start = new Date(now);
  event3Start.setDate(event3Start.getDate() + 5);
  event3Start.setHours(16, 30, 0, 0);
  const event3End = new Date(event3Start);
  event3End.setHours(18, 15, 0, 0);

  await db.event.upsert({
    where: { slug: "dighalipukhuri-golden-hour-photo-walk" },
    update: {},
    create: {
      title: "Golden Hour Photo Walk: Heritage & Brahmaputra Shadows",
      slug: "dighalipukhuri-golden-hour-photo-walk",
      description: "Grab your smartphone or mirrorless camera. We will walk from Dighalipukhuri through historical Pan Bazaar down to the riverbank, capturing street scenes and golden light.",
      category: EventCategory.PHOTOGRAPHY_WALK,
      lifecycle: EventLifecycle.PUBLISHED,
      hostId: hostUser1.id,
      venueId: panBazaarSpace.id,
      startTime: event3Start,
      endTime: event3End,
      capacity: 10,
      joinMode: JoinMode.IMMEDIATE,
      bookingDeadline: new Date(event3Start.getTime() - 2 * 60 * 60 * 1000),
      cancellationDeadline: new Date(event3Start.getTime() - 4 * 60 * 60 * 1000),
      priceInPaise: 0,
      rules: "Smartphone cameras completely welcome! Wear comfortable walking shoes.",
    },
  });

  console.log("✅ Seed completed successfully!");
}

