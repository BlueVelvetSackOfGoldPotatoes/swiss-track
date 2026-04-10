import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Actor, ActorEvent } from '@/data/mockData';
import type { Tables } from '@/integrations/supabase/types';

type Politician = Tables<'politicians'>;
type PoliticalEvent = Tables<'political_events'>;

export function mapPoliticianToActor(p: Politician): Actor {
  return {
    id: p.id,
    name: p.name,
    partyId: p.party_abbreviation || 'unknown',
    party: p.party_abbreviation || p.party_name || 'Independent',
    canton: p.city || p.country_name,
    cityId: '',
    countryId: p.country_code.toLowerCase(),
    role: p.role || 'Politician',
    jurisdiction: (p.jurisdiction as Actor['jurisdiction']) || 'federal',
    committees: p.committees || [],
    recentVotes: [],
    revisionId: `rev-${p.id.slice(0, 6)}`,
    updatedAt: p.updated_at,
    photoUrl: p.photo_url || undefined,
    birthYear: p.birth_year || undefined,
    inOfficeSince: p.in_office_since || undefined,
    twitterHandle: p.twitter_handle || undefined,
    netWorth: p.net_worth || undefined,
    topDonors: p.top_donors || undefined,
    wikipediaUrl: p.wikipedia_url || undefined,
    wikipediaSummary: p.wikipedia_summary || undefined,
    biography: p.biography || undefined,
    wikipediaImageUrl: p.wikipedia_image_url || undefined,
    wikipediaData: (p.wikipedia_data as Record<string, any>) || undefined,
    enrichedAt: p.enriched_at || undefined,
  };
}

export function mapEventToActorEvent(e: PoliticalEvent): ActorEvent {
  return {
    id: e.id,
    actorId: e.politician_id,
    hash: e.hash,
    timestamp: e.event_timestamp,
    type: e.event_type as ActorEvent['type'],
    title: e.title,
    description: e.description || '',
    diff: e.diff_removed || e.diff_added
      ? { removed: e.diff_removed || undefined, added: e.diff_added || undefined }
      : undefined,
    evidenceCount: e.evidence_count || 1,
    sourceUrl: e.source_url || undefined,
    source: e.source as ActorEvent['source'] | undefined,
    sourceHandle: e.source_handle || undefined,
    sentiment: e.sentiment as ActorEvent['sentiment'] | undefined,
    entities: e.entities || undefined,
  };
}

export function usePoliticians() {
  return useQuery({
    queryKey: ['politicians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('politicians')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data || []).map(mapPoliticianToActor);
    },
  });
}

export function usePolitician(id: string | undefined) {
  return useQuery({
    queryKey: ['politician', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('politicians')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data ? mapPoliticianToActor(data) : null;
    },
    enabled: !!id,
  });
}

export interface PoliticianFinance {
  annual_salary: number | null;
  currency: string;
  side_income: number | null;
  declared_assets: number | null;
  property_value: number | null;
  declared_debt: number | null;
  salary_source: string | null;
  declaration_year: number;
}

export interface PoliticianInvestment {
  id: string;
  company_name: string;
  sector: string | null;
  investment_type: string;
  estimated_value: number | null;
  currency: string;
  is_active: boolean;
  notes: string | null;
}

export function usePoliticianFinances(politicianId: string | undefined) {
  return useQuery({
    queryKey: ['politician-finances', politicianId],
    queryFn: async () => {
      if (!politicianId) return null;
      const { data, error } = await supabase
        .from('politician_finances')
        .select('*')
        .eq('politician_id', politicianId)
        .order('declaration_year', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as PoliticianFinance | null;
    },
    enabled: !!politicianId,
  });
}

export function usePoliticianInvestments(politicianId: string | undefined) {
  return useQuery({
    queryKey: ['politician-investments', politicianId],
    queryFn: async () => {
      if (!politicianId) return [];
      const { data, error } = await supabase
        .from('politician_investments')
        .select('*')
        .eq('politician_id', politicianId)
        .order('estimated_value', { ascending: false });
      if (error) throw error;
      return (data || []) as PoliticianInvestment[];
    },
    enabled: !!politicianId,
  });
}

export function usePoliticianEvents(politicianId: string | undefined) {
  return useQuery({
    queryKey: ['politician-events', politicianId],
    queryFn: async () => {
      if (!politicianId) return [];
      const { data, error } = await supabase
        .from('political_events')
        .select('*')
        .eq('politician_id', politicianId)
        .order('event_timestamp', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapEventToActorEvent);
    },
    enabled: !!politicianId,
  });
}

export function usePoliticianPosition(politicianId: string | undefined) {
  return useQuery({
    queryKey: ['politician-position', politicianId],
    queryFn: async () => {
      if (!politicianId) return null;
      const { data, error } = await supabase
        .from('politician_positions')
        .select('*')
        .eq('politician_id', politicianId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!politicianId,
  });
}

export function useAllPositions() {
  return useQuery({
    queryKey: ['all-positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('politician_positions')
        .select('*, politicians!inner(name, party_abbreviation, country_code)');
      if (error) throw error;
      return (data || []).map((d: any) => ({
        ...d,
        name: d.politicians?.name,
        party: d.politicians?.party_abbreviation,
        country: d.politicians?.country_code,
      }));
    },
  });
}

export function usePoliticiansByCountry(countryCode: string | undefined) {
  return useQuery({
    queryKey: ['politicians-by-country', countryCode],
    queryFn: async () => {
      if (!countryCode) return [];
      const { data, error } = await supabase
        .from('politicians')
        .select('*')
        .eq('country_code', countryCode.toUpperCase())
        .order('name');
      if (error) throw error;
      return (data || []).map(mapPoliticianToActor);
    },
    enabled: !!countryCode,
  });
}

export function useCountryStats() {
  return useQuery({
    queryKey: ['country-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('politicians')
        .select('country_code, country_name, continent, party_name');
      if (error) throw error;
      
      const countries = new Map<string, { code: string; name: string; continent: string; actorCount: number; parties: Set<string> }>();
      for (const p of data || []) {
        const existing = countries.get(p.country_code) || {
          code: p.country_code,
          name: p.country_name,
          continent: p.continent || 'Unknown',
          actorCount: 0,
          parties: new Set<string>(),
        };
        existing.actorCount++;
        if (p.party_name) existing.parties.add(p.party_name);
        countries.set(p.country_code, existing);
      }
      
      return Array.from(countries.values()).map(c => ({
        ...c,
        partyCount: c.parties.size,
        parties: Array.from(c.parties),
      }));
    },
  });
}
