import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash password for all admins
  const passwordHash = await bcrypt.hash('Admin@123', 10)

  // Create 5 admin accounts
  const admins = [
    {
      email: 'admin1@studio.com',
      name: 'Admin One',
      passwordHash,
    },
    {
      email: 'admin2@studio.com',
      name: 'Admin Two',
      passwordHash,
    },
    {
      email: 'admin3@studio.com',
      name: 'Admin Three',
      passwordHash,
    },
    {
      email: 'admin4@studio.com',
      name: 'Admin Four',
      passwordHash,
    },
    {
      email: 'admin5@studio.com',
      name: 'Admin Five',
      passwordHash,
    },
  ]

  for (const admin of admins) {
    await prisma.admin.upsert({
      where: { email: admin.email },
      update: {},
      create: admin,
    })
    console.log(`✅ Created admin: ${admin.email}`)
  }

  console.log('🎉 Seeding completed!')
  console.log('\n📧 Admin Credentials:')
  console.log('Email: admin1@studio.com (or admin2, admin3, admin4, admin5)')
  console.log('Password: Admin@123')
  console.log('\n⚠️  IMPORTANT: Change these passwords in production!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })