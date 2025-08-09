-- Database Schema for Exclusive Release Deals with AI Contract System
-- Part of Phase 8.3: AI-Powered Exclusive Release Deals

-- Exclusive Release Deals Table
CREATE TABLE exclusive_release_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES users(id),
  collaborator_id UUID REFERENCES users(id),
  beat_id UUID,
  deal_type VARCHAR(50) CHECK (deal_type IN ('exclusive_release', 'premium_collaboration', 'label_partnership')),
  
  -- Contract Details
  copyright_transfer BOOLEAN DEFAULT false,
  ownership_percentage_artist DECIMAL(5,2) DEFAULT 50.00,
  ownership_percentage_collaborator DECIMAL(5,2) DEFAULT 50.00,
  revenue_split_artist DECIMAL(5,2) DEFAULT 50.00,
  revenue_split_collaborator DECIMAL(5,2) DEFAULT 50.00,
  territorial_rights VARCHAR(50) DEFAULT 'worldwide',
  exclusivity_duration VARCHAR(50) DEFAULT 'perpetual',
  
  -- Music Details
  beat_title VARCHAR(200),
  genre VARCHAR(100),
  bpm INTEGER,
  musical_key VARCHAR(10),
  stems_included BOOLEAN DEFAULT true,
  master_files_included BOOLEAN DEFAULT true,
  
  -- AI Contract System
  eliza_agent_id TEXT DEFAULT 'MusicContractAI',
  contract_status VARCHAR(30) DEFAULT 'pending' CHECK (
    contract_status IN ('pending', 'generating', 'review', 'compliance_check', 'ready_to_sign', 'signed', 'active', 'completed', 'terminated')
  ),
  contract_hash TEXT, -- Blockchain hash for immutable storage
  generated_contract JSONB, -- Full AI-generated contract
  contract_summary JSONB, -- Key terms summary
  
  -- Legal & Compliance
  legal_review_status VARCHAR(30) DEFAULT 'pending' CHECK (
    legal_review_status IN ('pending', 'approved', 'requires_changes', 'rejected')
  ),
  compliance_score DECIMAL(3,2), -- 0.00 to 1.00
  compliance_flags JSONB, -- Array of compliance issues
  legal_reviewer TEXT,
  
  -- Signatures & Execution
  signature_artist_timestamp TIMESTAMPTZ,
  signature_collaborator_timestamp TIMESTAMPTZ,
  artist_signature_hash TEXT,
  collaborator_signature_hash TEXT,
  contract_execution_date TIMESTAMPTZ,
  
  -- Financial Terms
  deal_value DECIMAL(12,2), -- Total deal value in USD
  upfront_payment DECIMAL(12,2) DEFAULT 0.00,
  royalty_percentage DECIMAL(5,2) DEFAULT 10.00,
  publishing_split_artist DECIMAL(5,2) DEFAULT 50.00,
  publishing_split_collaborator DECIMAL(5,2) DEFAULT 50.00,
  
  -- Distribution & Rights
  streaming_rights BOOLEAN DEFAULT true,
  synchronization_rights BOOLEAN DEFAULT false,
  commercial_use_rights BOOLEAN DEFAULT true,
  radio_promotion_rights BOOLEAN DEFAULT false,
  video_production_rights BOOLEAN DEFAULT false,
  
  -- Marketing & Promotion
  marketing_budget DECIMAL(10,2) DEFAULT 0.00,
  promotion_commitment TEXT,
  social_media_rights JSONB,
  cross_promotion_agreement BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  notes TEXT
);

-- AI Contract Generation Logs
CREATE TABLE ai_contract_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES exclusive_release_deals(id),
  eliza_agent_id TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  generation_timestamp TIMESTAMPTZ DEFAULT NOW(),
  processing_time_ms INTEGER,
  model_used VARCHAR(50) DEFAULT 'gpt-4-turbo',
  success BOOLEAN NOT NULL,
  error_message TEXT,
  contract_version INTEGER DEFAULT 1,
  token_usage JSONB, -- Track API usage
  cost_usd DECIMAL(8,4) -- Track generation costs
);

-- Contract Templates for AI Generation
CREATE TABLE ai_contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name VARCHAR(100) NOT NULL,
  deal_type VARCHAR(50) NOT NULL,
  template_content TEXT NOT NULL,
  variables JSONB, -- Template variables and descriptions
  legal_reviewed BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Royalty Distribution Tracking
CREATE TABLE royalty_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES exclusive_release_deals(id),
  distribution_period VARCHAR(20), -- 'monthly', 'quarterly', 'annually'
  period_start DATE,
  period_end DATE,
  
  -- Revenue Sources
  streaming_revenue DECIMAL(10,2) DEFAULT 0.00,
  sync_revenue DECIMAL(10,2) DEFAULT 0.00,
  mechanical_revenue DECIMAL(10,2) DEFAULT 0.00,
  performance_revenue DECIMAL(10,2) DEFAULT 0.00,
  other_revenue DECIMAL(10,2) DEFAULT 0.00,
  total_revenue DECIMAL(10,2) GENERATED ALWAYS AS (
    streaming_revenue + sync_revenue + mechanical_revenue + performance_revenue + other_revenue
  ) STORED,
  
  -- Distribution Amounts
  artist_payout DECIMAL(10,2),
  collaborator_payout DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  
  -- Processing
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  transaction_hash TEXT, -- Blockchain transaction hash
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Copyright Ownership Records
CREATE TABLE copyright_ownership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES exclusive_release_deals(id),
  beat_id UUID NOT NULL,
  
  -- Ownership Details
  owner_type VARCHAR(20) CHECK (owner_type IN ('artist', 'collaborator', 'joint')),
  owner_id UUID REFERENCES users(id),
  ownership_percentage DECIMAL(5,2) NOT NULL,
  
  -- Rights Details
  master_recording_rights BOOLEAN DEFAULT false,
  composition_rights BOOLEAN DEFAULT false,
  publishing_rights BOOLEAN DEFAULT false,
  synchronization_rights BOOLEAN DEFAULT false,
  
  -- Legal Documentation
  copyright_registration_number VARCHAR(100),
  registration_date DATE,
  registration_country VARCHAR(3), -- ISO country code
  
  -- Transfer Details
  transferred_from UUID REFERENCES users(id),
  transfer_date TIMESTAMPTZ,
  transfer_consideration DECIMAL(10,2), -- Amount paid for transfer
  
  -- Blockchain Records
  nft_contract_address VARCHAR(42),
  nft_token_id BIGINT,
  blockchain_network VARCHAR(20),
  ownership_proof_hash TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contract Amendment History
CREATE TABLE contract_amendments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES exclusive_release_deals(id),
  amendment_number INTEGER NOT NULL,
  amendment_type VARCHAR(50), -- 'revenue_split', 'rights_change', 'term_extension', etc.
  
  -- Amendment Details
  previous_terms JSONB,
  new_terms JSONB,
  reason_for_change TEXT,
  
  -- AI Processing
  ai_generated BOOLEAN DEFAULT false,
  eliza_session_id TEXT,
  
  -- Approval
  artist_approved BOOLEAN DEFAULT false,
  collaborator_approved BOOLEAN DEFAULT false,
  artist_approval_timestamp TIMESTAMPTZ,
  collaborator_approval_timestamp TIMESTAMPTZ,
  
  -- Legal Review
  legal_reviewed BOOLEAN DEFAULT false,
  legal_reviewer TEXT,
  legal_review_timestamp TIMESTAMPTZ,
  
  effective_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_exclusive_deals_artist ON exclusive_release_deals(artist_id);
CREATE INDEX idx_exclusive_deals_collaborator ON exclusive_release_deals(collaborator_id);
CREATE INDEX idx_exclusive_deals_status ON exclusive_release_deals(contract_status);
CREATE INDEX idx_exclusive_deals_type ON exclusive_release_deals(deal_type);
CREATE INDEX idx_ai_logs_deal ON ai_contract_logs(deal_id);
CREATE INDEX idx_royalty_distributions_deal ON royalty_distributions(deal_id);
CREATE INDEX idx_copyright_ownership_deal ON copyright_ownership(deal_id);
CREATE INDEX idx_contract_amendments_deal ON contract_amendments(deal_id);

-- Triggers for Updated Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_exclusive_deals_updated_at BEFORE UPDATE ON exclusive_release_deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_copyright_ownership_updated_at BEFORE UPDATE ON copyright_ownership FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data for Testing
INSERT INTO ai_contract_templates (template_name, deal_type, template_content, variables) VALUES 
(
  'Exclusive Release Deal Standard',
  'exclusive_release', 
  'EXCLUSIVE MUSIC RELEASE AGREEMENT\n\nThis agreement between {{artist_name}} and {{collaborator_name}} grants exclusive rights to {{beat_title}}...',
  '{"artist_name": "Artist name", "collaborator_name": "Collaborator name", "beat_title": "Beat title", "deal_value": "Deal value in USD"}'
),
(
  'Premium Collaboration Agreement',
  'premium_collaboration',
  'PREMIUM MUSIC COLLABORATION AGREEMENT\n\nThis collaboration agreement establishes joint ownership and revenue sharing...',
  '{"artist_name": "Primary artist", "collaborator_name": "Collaborating artist", "revenue_split": "Revenue split percentage"}'
);
