-- ============================================================================
-- DECISIONSHIELD AI: UNIVERSAL FINANCIAL DIGITAL TWIN & STRESS SIMULATOR
-- Supabase PostgreSQL Database Architecture & Security Schema
-- Schema Version: 1.0.0
-- Created for Hackathon Technical Review & Production Architecture Showcase
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROFILES TABLE: User Persona & Financial Baseline
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT NOT NULL DEFAULT 'Demo User',
    persona_type TEXT NOT NULL CHECK (persona_type IN ('salaried', 'freelancer', 'business')),
    cibil_credit_score INT CHECK (cibil_credit_score BETWEEN 300 AND 900) DEFAULT 700,
    current_balance NUMERIC(14, 2) NOT NULL DEFAULT 50000.00,
    monthly_income NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    locked_reserves NUMERIC(14, 2) NOT NULL DEFAULT 15000.00,
    detected_monthly_leaks NUMERIC(14, 2) DEFAULT 3000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user persona lookups
CREATE INDEX IF NOT EXISTS idx_profiles_persona ON public.profiles(persona_type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ============================================================================
-- 2. SCENARIOS TABLE: Financial Digital Twin Simulations & Rescues
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_id TEXT, -- Demo user ID fallback (e.g. 'demo-judge-001')
    name TEXT NOT NULL,
    persona_type TEXT NOT NULL CHECK (persona_type IN ('salaried', 'freelancer', 'business')),
    
    -- Simulation Parameters
    balance NUMERIC(14, 2) NOT NULL,
    monthly_income NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    locked_reserves NUMERIC(14, 2) NOT NULL,
    decision_cost NUMERIC(14, 2) NOT NULL,
    payment_delay_days INT NOT NULL DEFAULT 0,
    upfront_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    hidden_cost_buffer NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    split_batches INT NOT NULL DEFAULT 1,
    
    -- Stress Results & Risk Metrics
    projected_shortage NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    valley_days INT NOT NULL DEFAULT 0,
    stress_min_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    survival_probability NUMERIC(5, 2) DEFAULT 50.00,
    
    -- Metadata & Rescue Info
    source TEXT NOT NULL DEFAULT 'simulator' CHECK (source IN ('simulator', 'rescue', 'api')),
    applied_rescue_plan TEXT, -- 'planA', 'planB', 'planC', etc.
    rescue_savings NUMERIC(14, 2) DEFAULT 0.00,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning-fast retrieval of persona simulations
CREATE INDEX IF NOT EXISTS idx_scenarios_persona ON public.scenarios(persona_type);
CREATE INDEX IF NOT EXISTS idx_scenarios_created_at ON public.scenarios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scenarios_profile ON public.scenarios(profile_id);

-- ============================================================================
-- 3. AUDIT_LOGS TABLE: High-Fidelity Forensic Audit Trail
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_identifier TEXT DEFAULT 'demo_judge',
    event_type TEXT NOT NULL, -- 'SCENARIO_CREATED', 'DOCUMENT_SCANNED', 'RESCUE_APPLIED', 'SHOCK_TRIGGERED'
    event_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON public.audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ============================================================================
-- 4. SUPABASE STORAGE BUCKET: Documents Vault (Invoices, Receipts, Statements)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public read & insert policy for seamless hackathon evaluations
CREATE POLICY "Public Document Uploads Allowed"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Public Document Views Allowed"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'documents');

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow read/write access for demo judge reviews & authenticated users
CREATE POLICY "Allow anonymous read on profiles"
ON public.profiles FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Allow anonymous insert on profiles"
ON public.profiles FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow anonymous read on scenarios"
ON public.scenarios FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Allow anonymous insert on scenarios"
ON public.scenarios FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow anonymous read on audit_logs"
ON public.audit_logs FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Allow anonymous insert on audit_logs"
ON public.audit_logs FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- ============================================================================
-- 6. SEED DATA FOR DEMO & HACKATHON JUDGING
-- ============================================================================
-- 1. Salaried Persona Baseline
INSERT INTO public.profiles (id, full_name, email, persona_type, cibil_credit_score, current_balance, monthly_income, locked_reserves, detected_monthly_leaks)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Rahul Sharma', 'rahul.salaried@decisionshield.ai', 'salaried', 710, 65000.00, 45000.00, 18000.00, 4200.00),
    ('22222222-2222-2222-2222-222222222222', 'Priya Patel', 'priya.freelance@decisionshield.ai', 'freelancer', 650, 40000.00, 0.00, 8000.00, 2800.00),
    ('33333333-3333-3333-3333-333333333333', 'StarTech Garments', 'founder@startechgarments.in', 'business', 680, 50000.00, 0.00, 20000.00, 5000.00)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Scenario: Salaried Laptop Purchase
INSERT INTO public.scenarios (
    profile_id, user_id, name, persona_type,
    balance, monthly_income, locked_reserves, decision_cost,
    payment_delay_days, upfront_percent, hidden_cost_buffer, split_batches,
    projected_shortage, valley_days, stress_min_balance, survival_probability,
    source, metadata
)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'demo-judge-001',
    'MacBook Pro M3 Purchase Stress Test',
    'salaried',
    65000.00, 45000.00, 18000.00, 50000.00,
    0, 100.00, 10.00, 1,
    6640.00, 12, 11360.00, 42.50,
    'simulator',
    '{"item": "MacBook Pro", "vendor": "Apple Store India", "risk_rating": "warning"}'::jsonb
);

-- Seed Sample Scenario: Small Business OrderShield Rescue
INSERT INTO public.scenarios (
    profile_id, user_id, name, persona_type,
    balance, monthly_income, locked_reserves, decision_cost,
    payment_delay_days, upfront_percent, hidden_cost_buffer, split_batches,
    projected_shortage, valley_days, stress_min_balance, survival_probability,
    source, applied_rescue_plan, rescue_savings, metadata
)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    'demo-judge-001',
    'OrderShield ₹1L T-Shirt Milestone Plan C Rescue',
    'business',
    50000.00, 0.00, 20000.00, 92000.00,
    15, 30.00, 8.00, 2,
    0.00, 0, 21400.00, 94.20,
    'rescue',
    'planC',
    93000.00,
    '{"rescue_title": "Supplier Credit + 8% SKU Trim", "verified_pareto": true}'::jsonb
);
