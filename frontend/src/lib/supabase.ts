// src/lib/supabase.ts
// Supabase client configuration & offline-first cloud sync engine for FINVEXA
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'placeholder-key'

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    !supabaseUrl.includes('placeholder') &&
    Boolean(supabasePublishableKey) &&
    !supabasePublishableKey.includes('placeholder')
  )
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)

export interface ScenarioRecord {
  id?: string
  profile_id?: string
  user_id?: string
  name: string
  persona_type: string
  balance: number
  monthly_income: number
  locked_reserves: number
  decision_cost: number
  payment_delay_days: number
  upfront_percent: number
  hidden_cost_buffer: number
  split_batches: number
  projected_shortage: number
  valley_days: number
  stress_min_balance?: number
  survival_probability?: number
  source?: 'simulator' | 'rescue' | 'api'
  applied_rescue_plan?: string
  rescue_savings?: number
  metadata?: Record<string, any>
  created_at?: string
}

const LOCAL_STORAGE_KEY = 'finvexa_scenarios'

/**
 * Saves a financial twin scenario to Supabase PostgreSQL table 'scenarios'
 * and simultaneously saves to localStorage so it never fails if offline.
 */
export async function saveScenario(
  scenario: ScenarioRecord
): Promise<{ success: boolean; cloud: boolean; data?: any; error?: string }> {
  const timestamp = new Date().toISOString()
  const localId = scenario.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
  
  const recordToSave: ScenarioRecord = {
    ...scenario,
    id: localId,
    created_at: scenario.created_at || timestamp,
  }

  // 1. Always save to LocalStorage first (Zero-failure offline guarantee)
  try {
    const existingRaw = localStorage.getItem(LOCAL_STORAGE_KEY)
    const existing: ScenarioRecord[] = existingRaw ? JSON.parse(existingRaw) : []
    const updated = [recordToSave, ...existing.filter(s => s.id !== localId)].slice(0, 50)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.warn('LocalStorage save failed:', err)
  }

  // 2. If Supabase credentials are configured, sync to Cloud PostgreSQL
  if (isSupabaseConfigured()) {
    try {
      const dbPayload = {
        name: recordToSave.name,
        persona_type: recordToSave.persona_type,
        balance: recordToSave.balance,
        monthly_income: recordToSave.monthly_income,
        locked_reserves: recordToSave.locked_reserves,
        decision_cost: recordToSave.decision_cost,
        payment_delay_days: recordToSave.payment_delay_days,
        upfront_percent: recordToSave.upfront_percent,
        hidden_cost_buffer: recordToSave.hidden_cost_buffer,
        split_batches: recordToSave.split_batches,
        projected_shortage: recordToSave.projected_shortage,
        valley_days: recordToSave.valley_days,
        stress_min_balance: recordToSave.stress_min_balance || 0,
        survival_probability: recordToSave.survival_probability || 50,
        source: recordToSave.source || 'simulator',
        applied_rescue_plan: recordToSave.applied_rescue_plan || null,
        rescue_savings: recordToSave.rescue_savings || 0,
        metadata: recordToSave.metadata || {},
        user_id: recordToSave.user_id || 'demo-judge-001'
      }

      const { data, error } = await supabase.from('scenarios').insert([dbPayload]).select()

      if (error) {
        console.warn('Supabase scenario insert warning:', error.message)
        return { success: true, cloud: false, data: recordToSave, error: error.message }
      }

      return { success: true, cloud: true, data: data?.[0] || recordToSave }
    } catch (err: any) {
      console.warn('Supabase network error, fallback to local storage:', err)
      return { success: true, cloud: false, data: recordToSave, error: err?.message || 'Network error' }
    }
  }

  return { success: true, cloud: false, data: recordToSave }
}

/**
 * Retrieves saved scenarios from Supabase (or localStorage fallback)
 */
export async function getSavedScenarios(): Promise<ScenarioRecord[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (!error && data && data.length > 0) {
        return data as ScenarioRecord[]
      }
    } catch (e) {
      console.warn('Error fetching from Supabase, loading from localStorage:', e)
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Uploads an invoice/receipt file to Supabase Storage bucket 'finvexa-documents'
 * If unconfigured or offline, safely caches metadata locally.
 */
export async function uploadDocument(
  file: File,
  bucket = 'finvexa-documents'
): Promise<{ success: boolean; cloud: boolean; path?: string; publicUrl?: string; error?: string }> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `uploads/${Date.now()}_${sanitizedName}`

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

      if (error) {
        console.warn('Supabase storage upload warning:', error.message)
        return { success: true, cloud: false, path: sanitizedName, error: error.message }
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data?.path || filePath)

      return {
        success: true,
        cloud: true,
        path: data?.path || filePath,
        publicUrl: publicUrlData?.publicUrl,
      }
    } catch (err: any) {
      console.warn('Storage upload exception, fallback to local safe cache:', err)
      return { success: true, cloud: false, path: sanitizedName, error: err?.message }
    }
  }

  return { success: true, cloud: false, path: sanitizedName }
}

/**
 * Uploads UI illustrations, team logos, and images to 'finvexa-assets' bucket
 */
export async function uploadAsset(
  file: File,
  bucket = 'finvexa-assets'
): Promise<{ success: boolean; cloud: boolean; path?: string; publicUrl?: string; error?: string }> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `assets/${Date.now()}_${sanitizedName}`

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

      if (error) {
        console.warn('Supabase asset upload warning:', error.message)
        return { success: true, cloud: false, path: sanitizedName, error: error.message }
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data?.path || filePath)

      return {
        success: true,
        cloud: true,
        path: data?.path || filePath,
        publicUrl: publicUrlData?.publicUrl,
      }
    } catch (err: any) {
      console.warn('Asset upload exception:', err)
      return { success: true, cloud: false, path: sanitizedName, error: err?.message }
    }
  }

  return { success: true, cloud: false, path: sanitizedName }
}

/**
 * Lists uploaded assets from 'finvexa-assets'
 */
export async function listAssets(bucket = 'finvexa-assets'): Promise<Array<{ name: string; publicUrl: string; created_at?: string | null; size?: number }>> {
  if (!isSupabaseConfigured()) return []
  try {
    const { data, error } = await supabase.storage.from(bucket).list('assets', {
      limit: 50,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (!error && data && data.length > 0) {
      return data
        .filter(item => item.name !== '.emptyFolderPlaceholder')
        .map(item => {
          const { data: pUrl } = supabase.storage.from(bucket).getPublicUrl(`assets/${item.name}`)
          return {
            name: item.name,
            publicUrl: pUrl?.publicUrl || '',
            created_at: item.created_at,
            size: item.metadata?.size,
          }
        })
    }

    // Fallback: check root of bucket
    const rootRes = await supabase.storage.from(bucket).list('', {
      limit: 50,
      sortBy: { column: 'created_at', order: 'desc' },
    })
    if (!rootRes.error && rootRes.data) {
      return rootRes.data
        .filter(item => item.name !== '.emptyFolderPlaceholder' && item.name !== 'assets')
        .map(item => {
          const { data: pUrl } = supabase.storage.from(bucket).getPublicUrl(item.name)
          return {
            name: item.name,
            publicUrl: pUrl?.publicUrl || '',
            created_at: item.created_at,
            size: item.metadata?.size,
          }
        })
    }

    return []
  } catch (err) {
    console.warn('Error listing assets from Supabase:', err)
    return []
  }
}

/**
 * Audit log helper
 */
export async function logAuditEvent(
  eventType: string,
  details: Record<string, any>,
  userIdentifier = 'demo_judge'
) {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('audit_logs').insert([
        {
          event_type: eventType,
          event_details: details,
          user_identifier: userIdentifier,
        },
      ])
    } catch (e) {
      console.warn('Audit log write error:', e)
    }
  }
}

