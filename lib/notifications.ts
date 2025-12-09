import { prisma } from "@/lib/prisma"

type UpsertPayload = {
  email: string
  workout?: string | null
  calories?: string | null
  timezone?: string | null
}

export async function upsertPlanNotification({
  email,
  workout,
  calories,
  timezone,
}: UpsertPayload) {
  if (!email) return null

  const tz = timezone || "Asia/Kolkata"

  return prisma.planNotification.upsert({
    where: { email },
    create: {
      email,
      workout: workout ?? null,
      calories: calories ?? null,
      timezone: tz,
    },
    update: {
      workout: workout ?? undefined,
      calories: calories ?? undefined,
      timezone: tz,
    },
  })
}

