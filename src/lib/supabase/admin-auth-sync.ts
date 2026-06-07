import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'

interface SyncAdminAuthInput {
  email: string
  password: string
  userMetadata?: Record<string, unknown>
}

interface SyncAdminAuthResult {
  action: 'created' | 'updated'
  userId: string
}

function createServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing')
  }

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing')
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

async function findUserByEmail(client: SupabaseClient, email: string) {
  const normalizedEmail = email.toLowerCase().trim()
  const perPage = 100

  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage })

    if (error) {
      throw error
    }

    const match = data.users.find(
      (user) => user.email?.toLowerCase().trim() === normalizedEmail
    )

    if (match) {
      return match
    }

    if (data.users.length < perPage) {
      break
    }
  }

  return null
}

export async function syncSupabaseAdminAuthUser(
  input: SyncAdminAuthInput
): Promise<SyncAdminAuthResult> {
  const client = createServiceClient()
  const normalizedEmail = input.email.toLowerCase().trim()

  const createResult = await client.auth.admin.createUser({
    email: normalizedEmail,
    password: input.password,
    email_confirm: true,
    user_metadata: input.userMetadata,
  })

  if (!createResult.error && createResult.data.user) {
    return {
      action: 'created',
      userId: createResult.data.user.id,
    }
  }

  const existingUser = await findUserByEmail(client, normalizedEmail)
  if (!existingUser) {
    throw createResult.error ?? new Error('Supabase Auth user not found')
  }

  const updateResult = await client.auth.admin.updateUserById(existingUser.id, {
    password: input.password,
    email_confirm: true,
    user_metadata: input.userMetadata,
  })

  if (updateResult.error || !updateResult.data.user) {
    throw updateResult.error ?? new Error('Supabase Auth user update failed')
  }

  return {
    action: 'updated',
    userId: updateResult.data.user.id,
  }
}
