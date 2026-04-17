import { prisma } from '../src/infra/prisma/client';
import { JoseAuthService } from '../src/infra/auth/JoseAuthService';

const authService = new JoseAuthService();

const USERS = [
  {
    email: 'alice@example.com',
    username: 'alice_dev',
    displayName: 'Alice Johnson',
    bio: 'Full-stack developer. Coffee enthusiast.',
  },
  {
    email: 'bob@example.com',
    username: 'bob_smith',
    displayName: 'Bob Smith',
    bio: 'Backend engineer at scale. Rust & Go.',
  },
  {
    email: 'carol@example.com',
    username: 'carol_codes',
    displayName: 'Carol Williams',
    bio: 'Open source contributor. TypeScript lover.',
  },
  {
    email: 'dave@example.com',
    username: 'dave_ops',
    displayName: 'Dave Martinez',
    bio: 'DevOps & cloud infrastructure. K8s all day.',
  },
  {
    email: 'emma@example.com',
    username: 'emma_design',
    displayName: 'Emma Chen',
    bio: 'UI/UX designer turned frontend dev.',
  },
  {
    email: 'frank@example.com',
    username: 'frank_ml',
    displayName: 'Frank Lee',
    bio: 'Machine learning engineer. Python & PyTorch.',
  },
  {
    email: 'grace@example.com',
    username: 'grace_sec',
    displayName: 'Grace Kim',
    bio: 'Application security. Bug bounty hunter.',
  },
  {
    email: 'henry@example.com',
    username: 'henry_data',
    displayName: 'Henry Brown',
    bio: 'Data engineer. SQL is not dead.',
  },
  {
    email: 'iris@example.com',
    username: 'iris_mobile',
    displayName: 'Iris Patel',
    bio: 'React Native & Flutter. Cross-platform FTW.',
  },
  {
    email: 'jack@example.com',
    username: 'jack_arch',
    displayName: 'Jack Taylor',
    bio: 'Software architect. Clean code advocate.',
  },
  {
    email: 'kate@example.com',
    username: 'kate_qa',
    displayName: 'Kate Wilson',
    bio: 'QA engineer. If it can break, I will find it.',
  },
  {
    email: 'leo@example.com',
    username: 'leo_web3',
    displayName: 'Leo Garcia',
    bio: 'Web3 explorer. Solidity & smart contracts.',
  },
];

const TWEETS = [
  'Just shipped a new feature using Next.js App Router. The DX is incredible!',
  'Hot take: TypeScript strict mode should be the default for all projects.',
  'Been diving into Rust lately. The borrow checker is tough but rewarding.',
  'Docker Compose has saved me countless hours in dev environment setup.',
  'The best code is the code you never had to write. Keep it simple.',
  'Pair programming session today was incredibly productive. Two minds > one.',
  'Refactored our entire auth system to use JWTs. Security matters!',
  'PostgreSQL is underrated. The query planner is a work of art.',
  'Just discovered cursor-based pagination. Never going back to offset.',
  'Clean architecture is not about following rules blindly. It is about intent.',
  'Code review tip: focus on the why, not the what. The diff tells you what changed.',
  'Deployed to production on a Friday. Living dangerously.',
  'Unit tests caught a regression today. Past me is a hero.',
  'GraphQL vs REST debate is tired. Use what fits your use case.',
  'TDD is not about testing. It is about design.',
  'Just optimized a query from 2s to 50ms. Indexes are magic.',
  'The best meetings are the ones that could have been a message.',
  'Accessibility is not optional. Screen readers matter.',
  'Started learning Go this week. The simplicity is refreshing.',
  'Microservices are not always the answer. Monoliths can be beautiful.',
  'CI/CD pipeline just saved us from a broken deploy. Automation wins.',
  'Reading "Designing Data-Intensive Applications" for the third time. Still learning.',
  'Tailwind CSS converted me. Utility-first just clicks.',
  'Open source contribution merged today. Small step, big feeling.',
  'The hardest part of programming is naming things. And cache invalidation.',
  'Hexagonal architecture keeps our codebase clean. Ports and adapters FTW.',
  'Just wrote my first Playwright E2E test. Browser automation is powerful.',
  'Remember: premature optimization is the root of all evil.',
  'Spent 3 hours debugging a typo. Classic.',
  'Functional programming concepts made me a better OOP developer.',
];

const REPLIES = [
  'Totally agree! The App Router is a game changer.',
  'Strict mode saved me from so many bugs.',
  'Rust ownership model is mind-bending at first but worth it.',
  'Docker Compose + PostgreSQL is my go-to stack.',
  'KISS principle never fails.',
  'I love pair programming for complex problems.',
  'JWTs with httpOnly cookies is the way to go.',
  'PostgreSQL EXPLAIN ANALYZE is your best friend.',
];

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.like.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.tweet.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const password = await authService.hashPassword('Password123');
  const users = [];

  for (const userData of USERS) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        displayName: userData.displayName,
        bio: userData.bio,
        passwordHash: password,
      },
    });
    users.push(user);
    console.log(`  Created user: @${user.username}`);
  }

  // Create tweets (distribute among users)
  const tweets = [];
  for (let i = 0; i < TWEETS.length; i++) {
    const author = users[i % users.length];
    const tweet = await prisma.tweet.create({
      data: {
        content: TWEETS[i],
        authorId: author.id,
        createdAt: new Date(Date.now() - (TWEETS.length - i) * 3600000), // 1 hour apart
      },
    });
    tweets.push(tweet);
  }
  console.log(`  Created ${tweets.length} tweets`);

  // Create replies on first few tweets
  for (let i = 0; i < REPLIES.length; i++) {
    const parentTweet = tweets[i % 5]; // Replies on first 5 tweets
    const author = users[(i + 3) % users.length]; // Different authors
    await prisma.tweet.create({
      data: {
        content: REPLIES[i],
        authorId: author.id,
        parentId: parentTweet.id,
        createdAt: new Date(Date.now() - (REPLIES.length - i) * 1800000),
      },
    });
  }
  console.log(`  Created ${REPLIES.length} replies`);

  // Create follows (create a social graph)
  let followCount = 0;
  for (let i = 0; i < users.length; i++) {
    // Each user follows 3-5 others
    const followCount_target = 3 + (i % 3);
    for (let j = 1; j <= followCount_target; j++) {
      const targetIdx = (i + j) % users.length;
      if (targetIdx !== i) {
        await prisma.follow.create({
          data: { followerId: users[i].id, followingId: users[targetIdx].id },
        });
        followCount++;
      }
    }
  }
  console.log(`  Created ${followCount} follows`);

  // Create likes (spread across tweets)
  let likeCount = 0;
  for (let i = 0; i < users.length; i++) {
    // Each user likes 5-8 tweets
    const likeTarget = 5 + (i % 4);
    for (let j = 0; j < likeTarget; j++) {
      const tweetIdx = (i * 3 + j) % tweets.length;
      try {
        await prisma.like.create({
          data: { userId: users[i].id, tweetId: tweets[tweetIdx].id },
        });
        likeCount++;
      } catch {
        // Skip duplicate likes
      }
    }
  }
  console.log(`  Created ${likeCount} likes`);

  console.log('\nSeed complete!');
  console.log('\nTest credentials (all users share the same password):');
  console.log('  Email: alice@example.com');
  console.log('  Password: Password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
