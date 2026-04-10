// ==================== TYPES ====================

export interface Continent {
  id: string;
  name: string;
  code: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  continentId: string;
}

export interface City {
  id: string;
  name: string;
  countryId: string;
  isCapital: boolean;
}

export interface ActorEvent {
  id: string;
  actorId: string;
  hash: string;
  timestamp: string;
  type:
    | 'vote'
    | 'speech'
    | 'committee_join'
    | 'committee_leave'
    | 'election'
    | 'appointment'
    | 'resignation'
    | 'scandal'
    | 'policy_change'
    | 'party_switch'
    | 'legislation_sponsored'
    | 'foreign_meeting'
    | 'lobbying_meeting'
    | 'corporate_event'
    | 'financial_disclosure'
    | 'social_media'
    | 'travel'
    | 'donation_received'
    | 'public_statement'
    | 'court_case'
    | 'media_appearance';
  title: string;
  description: string;
  diff?: { removed?: string; added?: string };
  evidenceCount: number;
  sourceUrl?: string;
  source?: 'twitter' | 'official_record' | 'news' | 'financial_filing' | 'parliamentary_record' | 'court_filing' | 'lobby_register';
  sourceHandle?: string; // e.g. @username for twitter
  sentiment?: 'positive' | 'negative' | 'neutral';
  entities?: string[]; // companies, people, orgs mentioned
}

export interface Relationship {
  id: string;
  sourceId: string;
  sourceType: 'actor' | 'party';
  targetId: string;
  targetType: 'actor' | 'party';
  type: 'coalition' | 'opposition' | 'mentor' | 'ally' | 'rival' | 'ideological_alignment' | 'committee_co_member' | 'cross_border_alliance' | 'lobbying' | 'corporate_board' | 'donor';
  strength: number;
  description: string;
  since?: string;
}

export interface Party {
  id: string;
  name: string;
  abbreviation: string;
  countryId: string;
  ideology: string;
  color: string;
  foundedYear: number;
  familyId: string;
}

export interface ChangeLogEntry {
  id: string;
  timestamp: string;
  type: 'proposal_added' | 'revision' | 'correction' | 'ingestion' | 'forecast_update';
  title: string;
  subject: string;
  subjectType: 'proposal' | 'actor' | 'legal_document';
  subjectId: string;
  revisionId: string;
  evidenceCount: number;
  summary: string;
  countryId?: string;
}

export interface Actor {
  id: string;
  name: string;
  partyId: string;
  party: string;
  canton: string;
  cityId: string;
  countryId: string;
  role: string;
  jurisdiction: 'federal' | 'state' | 'city';
  committees: string[];
  recentVotes: { date: string; proposal: string; vote: 'yes' | 'no' | 'abstain' }[];
  revisionId: string;
  updatedAt: string;
  photoUrl?: string;
  birthYear?: number;
  inOfficeSince?: string;
  twitterHandle?: string;
  netWorth?: string;
  topDonors?: string[];
}

export interface Proposal {
  id: string;
  title: string;
  officialTitle: string;
  status: 'consultation' | 'parliamentary_deliberation' | 'pending_vote' | 'accepted' | 'rejected';
  type: 'referendum' | 'initiative' | 'counter_proposal' | 'bill';
  jurisdiction: 'federal' | 'state' | 'city';
  countryId: string;
  voteDate?: string;
  submittedDate: string;
  sponsors: string[];
  affectedLaws: string[];
  evidenceCount: number;
  revisionId: string;
  summary: string;
}

// ==================== GEOGRAPHY ====================

export const continents: Continent[] = [
  { id: 'cont-eu', name: 'Europe', code: 'EU' },
  { id: 'cont-na', name: 'North America', code: 'NA' },
  { id: 'cont-sa', name: 'South America', code: 'SA' },
  { id: 'cont-as', name: 'Asia', code: 'AS' },
  { id: 'cont-af', name: 'Africa', code: 'AF' },
  { id: 'cont-oc', name: 'Oceania', code: 'OC' },
];

export const countries: Country[] = [
  { id: 'ch', name: 'Switzerland', code: 'CH', continentId: 'cont-eu' },
  { id: 'de', name: 'Germany', code: 'DE', continentId: 'cont-eu' },
  { id: 'fr', name: 'France', code: 'FR', continentId: 'cont-eu' },
  { id: 'us', name: 'United States', code: 'US', continentId: 'cont-na' },
  { id: 'br', name: 'Brazil', code: 'BR', continentId: 'cont-sa' },
  { id: 'jp', name: 'Japan', code: 'JP', continentId: 'cont-as' },
  { id: 'ke', name: 'Kenya', code: 'KE', continentId: 'cont-af' },
  { id: 'au', name: 'Australia', code: 'AU', continentId: 'cont-oc' },
];

export const cities: City[] = [
  { id: 'city-zurich', name: 'Zürich', countryId: 'ch', isCapital: false },
  { id: 'city-bern', name: 'Bern', countryId: 'ch', isCapital: true },
  { id: 'city-berlin', name: 'Berlin', countryId: 'de', isCapital: true },
  { id: 'city-munich', name: 'Munich', countryId: 'de', isCapital: false },
  { id: 'city-paris', name: 'Paris', countryId: 'fr', isCapital: true },
  { id: 'city-dc', name: 'Washington D.C.', countryId: 'us', isCapital: true },
  { id: 'city-nyc', name: 'New York', countryId: 'us', isCapital: false },
  { id: 'city-brasilia', name: 'Brasília', countryId: 'br', isCapital: true },
  { id: 'city-saopaulo', name: 'São Paulo', countryId: 'br', isCapital: false },
  { id: 'city-tokyo', name: 'Tokyo', countryId: 'jp', isCapital: true },
  { id: 'city-nairobi', name: 'Nairobi', countryId: 'ke', isCapital: true },
  { id: 'city-sydney', name: 'Sydney', countryId: 'au', isCapital: false },
  { id: 'city-canberra', name: 'Canberra', countryId: 'au', isCapital: true },
];

// ==================== PARTIES ====================

export const parties: Party[] = [
  { id: 'party-sp', name: 'Social Democratic Party', abbreviation: 'SP', countryId: 'ch', ideology: 'Social Democracy', color: '#E53935', foundedYear: 1888, familyId: 'fam-socdem' },
  { id: 'party-fdp', name: 'FDP.The Liberals', abbreviation: 'FDP', countryId: 'ch', ideology: 'Classical Liberalism', color: '#1E88E5', foundedYear: 2009, familyId: 'fam-liberal' },
  { id: 'party-svp', name: 'Swiss People\'s Party', abbreviation: 'SVP', countryId: 'ch', ideology: 'National Conservatism', color: '#2E7D32', foundedYear: 1971, familyId: 'fam-conserv' },
  { id: 'party-spd', name: 'Social Democratic Party of Germany', abbreviation: 'SPD', countryId: 'de', ideology: 'Social Democracy', color: '#E53935', foundedYear: 1863, familyId: 'fam-socdem' },
  { id: 'party-cdu', name: 'Christian Democratic Union', abbreviation: 'CDU', countryId: 'de', ideology: 'Christian Democracy', color: '#212121', foundedYear: 1945, familyId: 'fam-conserv' },
  { id: 'party-dem', name: 'Democratic Party', abbreviation: 'DEM', countryId: 'us', ideology: 'Liberalism', color: '#1565C0', foundedYear: 1828, familyId: 'fam-liberal' },
  { id: 'party-gop', name: 'Republican Party', abbreviation: 'GOP', countryId: 'us', ideology: 'Conservatism', color: '#C62828', foundedYear: 1854, familyId: 'fam-conserv' },
  { id: 'party-lrem', name: 'Renaissance', abbreviation: 'RE', countryId: 'fr', ideology: 'Centrism', color: '#FFB300', foundedYear: 2016, familyId: 'fam-liberal' },
  { id: 'party-pt', name: 'Workers\' Party', abbreviation: 'PT', countryId: 'br', ideology: 'Democratic Socialism', color: '#C62828', foundedYear: 1980, familyId: 'fam-socdem' },
  { id: 'party-ldp', name: 'Liberal Democratic Party', abbreviation: 'LDP', countryId: 'jp', ideology: 'Liberal Conservatism', color: '#1E88E5', foundedYear: 1955, familyId: 'fam-conserv' },
];

export const partyFamilies: Record<string, string> = {
  'fam-socdem': 'Social Democracy',
  'fam-liberal': 'Liberalism',
  'fam-conserv': 'Conservatism',
  'fam-green': 'Green Politics',
};

// ==================== ACTORS ====================

export const mockActors: Actor[] = [
  {
    id: 'actor-001', name: 'Maria Schneider', partyId: 'party-sp', party: 'SP', canton: 'Zürich',
    cityId: 'city-zurich', countryId: 'ch', role: 'National Councillor', jurisdiction: 'federal',
    committees: ['GPK', 'SGK'], recentVotes: [
      { date: '2026-03-18', proposal: 'BVG-Reform', vote: 'yes' },
      { date: '2026-03-15', proposal: 'Energiegesetz Revision', vote: 'no' },
      { date: '2026-03-12', proposal: 'Armeebotschaft 2026', vote: 'abstain' },
    ], revisionId: 'rev-j0k1l2', updatedAt: '2026-04-02T16:40:00Z', birthYear: 1978, inOfficeSince: '2019-12-02',
    twitterHandle: '@MSchneiderSP', topDonors: ['Unia Trade Union', 'SP Zürich'],
  },
  {
    id: 'actor-002', name: 'Thomas Müller', partyId: 'party-fdp', party: 'FDP', canton: 'Bern',
    cityId: 'city-bern', countryId: 'ch', role: 'Council of States', jurisdiction: 'federal',
    committees: ['FK', 'APK'], recentVotes: [
      { date: '2026-03-20', proposal: 'Steuerreform 2026', vote: 'yes' },
      { date: '2026-03-18', proposal: 'BVG-Reform', vote: 'no' },
    ], revisionId: 'rev-s9t0u1', updatedAt: '2026-04-01T09:00:00Z', birthYear: 1965, inOfficeSince: '2015-11-30',
    twitterHandle: '@TMuellerFDP', topDonors: ['Economiesuisse', 'Credit Suisse PAC'],
  },
  {
    id: 'actor-003', name: 'Friedrich Weber', partyId: 'party-cdu', party: 'CDU', canton: 'Berlin',
    cityId: 'city-berlin', countryId: 'de', role: 'Member of Bundestag', jurisdiction: 'federal',
    committees: ['Finance Committee', 'EU Affairs'], recentVotes: [
      { date: '2026-03-10', proposal: 'Energy Transition Act', vote: 'yes' },
      { date: '2026-02-28', proposal: 'Digital Infrastructure Bill', vote: 'yes' },
    ], revisionId: 'rev-de001', updatedAt: '2026-04-01T10:00:00Z', birthYear: 1972, inOfficeSince: '2017-10-24',
    twitterHandle: '@FWeberCDU', topDonors: ['Siemens AG', 'Deutsche Bank'],
  },
  {
    id: 'actor-004', name: 'Sarah Mitchell', partyId: 'party-dem', party: 'DEM', canton: 'Washington D.C.',
    cityId: 'city-dc', countryId: 'us', role: 'Senator', jurisdiction: 'federal',
    committees: ['Foreign Relations', 'Judiciary'], recentVotes: [
      { date: '2026-03-22', proposal: 'Infrastructure Renewal Act', vote: 'yes' },
      { date: '2026-03-15', proposal: 'AI Governance Framework', vote: 'yes' },
      { date: '2026-03-01', proposal: 'Defense Budget 2027', vote: 'no' },
    ], revisionId: 'rev-us001', updatedAt: '2026-04-03T08:00:00Z', birthYear: 1980, inOfficeSince: '2021-01-03',
    twitterHandle: '@SenMitchell', topDonors: ['ActBlue', 'Google LLC', 'Microsoft Corp'],
  },
  {
    id: 'actor-005', name: 'James Crawford', partyId: 'party-gop', party: 'GOP', canton: 'New York',
    cityId: 'city-nyc', countryId: 'us', role: 'Representative', jurisdiction: 'federal',
    committees: ['Ways and Means', 'Armed Services'], recentVotes: [
      { date: '2026-03-22', proposal: 'Infrastructure Renewal Act', vote: 'no' },
      { date: '2026-03-01', proposal: 'Defense Budget 2027', vote: 'yes' },
    ], revisionId: 'rev-us002', updatedAt: '2026-04-02T12:00:00Z', birthYear: 1968, inOfficeSince: '2019-01-03',
    twitterHandle: '@RepCrawford', topDonors: ['Koch Industries', 'NRA', 'Lockheed Martin'],
  },
  {
    id: 'actor-006', name: 'Luísa Ferreira', partyId: 'party-pt', party: 'PT', canton: 'São Paulo',
    cityId: 'city-saopaulo', countryId: 'br', role: 'Federal Deputy', jurisdiction: 'federal',
    committees: ['Education Committee', 'Human Rights'], recentVotes: [
      { date: '2026-03-18', proposal: 'Universal Education Reform', vote: 'yes' },
      { date: '2026-03-05', proposal: 'Amazon Protection Act', vote: 'yes' },
    ], revisionId: 'rev-br001', updatedAt: '2026-04-01T14:00:00Z', birthYear: 1985, inOfficeSince: '2023-02-01',
    twitterHandle: '@LuisaFerreira', topDonors: ['CUT Brasil', 'MST'],
  },
  {
    id: 'actor-007', name: 'Takeshi Yamamoto', partyId: 'party-ldp', party: 'LDP', canton: 'Tokyo',
    cityId: 'city-tokyo', countryId: 'jp', role: 'Member of House of Representatives', jurisdiction: 'federal',
    committees: ['Budget Committee', 'Foreign Affairs'], recentVotes: [
      { date: '2026-03-20', proposal: 'Defense Modernization Bill', vote: 'yes' },
      { date: '2026-03-12', proposal: 'Digital Economy Act', vote: 'yes' },
    ], revisionId: 'rev-jp001', updatedAt: '2026-04-02T06:00:00Z', birthYear: 1970, inOfficeSince: '2012-12-16',
    twitterHandle: '@TYamamotoLDP', topDonors: ['Toyota Motor Corp', 'Keidanren'],
  },
  {
    id: 'actor-008', name: 'Claire Dupont', partyId: 'party-lrem', party: 'RE', canton: 'Paris',
    cityId: 'city-paris', countryId: 'fr', role: 'Deputy', jurisdiction: 'federal',
    committees: ['Finance', 'European Affairs'], recentVotes: [
      { date: '2026-03-19', proposal: 'Pension Reform Amendment', vote: 'yes' },
      { date: '2026-03-10', proposal: 'Climate Adaptation Act', vote: 'yes' },
    ], revisionId: 'rev-fr001', updatedAt: '2026-04-03T09:00:00Z', birthYear: 1982, inOfficeSince: '2022-06-19',
    twitterHandle: '@CDupontRE', topDonors: ['LVMH', 'TotalEnergies'],
  },
];

// ==================== ACTOR EVENTS (GIT-LIKE HISTORY) ====================

export const actorEvents: ActorEvent[] = [
  // ===== Maria Schneider (actor-001) – Swiss SP =====
  { id: 'ev-001', actorId: 'actor-001', hash: 'a3f7c2', timestamp: '2026-04-02T16:40:00Z', type: 'vote', title: 'Correction: GPK membership date', description: 'Committee membership start date corrected from 2024 to 2025.', diff: { removed: 'GPK member since 2024', added: 'GPK member since 2025' }, evidenceCount: 3, source: 'parliamentary_record' },
  { id: 'ev-002', actorId: 'actor-001', hash: 'b8e1d4', timestamp: '2026-03-18T14:00:00Z', type: 'vote', title: 'Voted YES on BVG-Reform', description: 'Supported pension reform bill in National Council plenary session.', evidenceCount: 5, source: 'parliamentary_record' },
  { id: 'ev-003', actorId: 'actor-001', hash: 'c9f2e5', timestamp: '2026-03-15T11:00:00Z', type: 'vote', title: 'Voted NO on Energiegesetz Revision', description: 'Opposed energy law revision citing insufficient renewable targets.', evidenceCount: 2, source: 'parliamentary_record' },
  { id: 'ev-050', actorId: 'actor-001', hash: 'x1a2b3', timestamp: '2026-03-14T19:22:00Z', type: 'social_media', title: 'Tweet: "Corporate lobbying must be transparent"', description: '"Just left meeting w/ pharma reps. We need full lobby transparency NOW. Citizens deserve to know who\'s influencing policy. #Transparency #SwissPolitics"', evidenceCount: 1, source: 'twitter', sourceHandle: '@MSchneiderSP', sentiment: 'negative', entities: ['Pharma industry'] },
  { id: 'ev-004', actorId: 'actor-001', hash: 'd0a3f6', timestamp: '2026-03-12T10:00:00Z', type: 'vote', title: 'ABSTAINED on Armeebotschaft 2026', description: 'Abstained on military spending bill.', evidenceCount: 1, source: 'parliamentary_record' },
  { id: 'ev-051', actorId: 'actor-001', hash: 'x2b3c4', timestamp: '2026-03-10T10:00:00Z', type: 'lobbying_meeting', title: 'Meeting with Novartis representatives', description: 'Registered lobby meeting with Novartis AG policy team re: drug pricing regulation.', evidenceCount: 2, source: 'lobby_register', entities: ['Novartis AG'] },
  { id: 'ev-052', actorId: 'actor-001', hash: 'x3c4d5', timestamp: '2026-02-28T08:30:00Z', type: 'financial_disclosure', title: 'Annual financial disclosure filed', description: 'Declared CHF 245,000 income from parliamentary role. No side-board positions.', evidenceCount: 1, source: 'financial_filing', diff: { removed: 'Net income: CHF 238,000', added: 'Net income: CHF 245,000' } },
  { id: 'ev-053', actorId: 'actor-001', hash: 'x4d5e6', timestamp: '2026-02-15T14:00:00Z', type: 'media_appearance', title: 'SRF Arena: Healthcare debate', description: 'Appeared on SRF Arena debating healthcare costs with FDP and SVP representatives.', evidenceCount: 3, source: 'news', entities: ['SRF Arena', 'FDP', 'SVP'] },
  { id: 'ev-005', actorId: 'actor-001', hash: 'e1b4g7', timestamp: '2025-12-02T09:00:00Z', type: 'committee_join', title: 'Joined SGK committee', description: 'Appointed to Commission for Social Security and Health.', evidenceCount: 2, source: 'parliamentary_record' },
  { id: 'ev-054', actorId: 'actor-001', hash: 'x5e6f7', timestamp: '2025-11-20T16:00:00Z', type: 'travel', title: 'Official trip to Brussels', description: 'Parliamentary delegation visit to EU institutions. Met with EU Health Commissioner.', evidenceCount: 2, source: 'official_record', entities: ['EU Commission', 'EU Health Commissioner'] },
  { id: 'ev-055', actorId: 'actor-001', hash: 'x6f7g8', timestamp: '2025-10-05T12:00:00Z', type: 'social_media', title: 'Tweet thread on housing crisis', description: '"🧵 Zürich\'s housing crisis in 5 charts. Rents up 34% since 2015. Corporate landlords buying up entire blocks. Time for action. #Wohnungsnot"', evidenceCount: 1, source: 'twitter', sourceHandle: '@MSchneiderSP', sentiment: 'negative', entities: ['Real estate industry'] },
  { id: 'ev-1001', actorId: 'actor-001', hash: 'ms01a1', timestamp: '2025-09-15T10:00:00Z', type: 'vote', title: 'Voted YES on Mietrecht Revision', description: 'Supported tenant protection law amendment in National Council.', evidenceCount: 4, source: 'parliamentary_record' },
  { id: 'ev-1002', actorId: 'actor-001', hash: 'ms02b2', timestamp: '2025-08-20T11:00:00Z', type: 'lobbying_meeting', title: 'Meeting with Roche Pharma lobbyists', description: 'Registered meeting with Roche Basel on healthcare pricing framework.', evidenceCount: 2, source: 'lobby_register', entities: ['Roche Holding AG'] },
  { id: 'ev-1003', actorId: 'actor-001', hash: 'ms03c3', timestamp: '2025-07-10T09:00:00Z', type: 'speech', title: 'Parliamentary speech on wealth inequality', description: '25-minute address on growing wealth gap in Switzerland, cited Credit Suisse Global Wealth Report.', evidenceCount: 3, source: 'parliamentary_record', entities: ['Credit Suisse'] },
  { id: 'ev-1004', actorId: 'actor-001', hash: 'ms04d4', timestamp: '2025-06-01T14:00:00Z', type: 'vote', title: 'Voted YES on CO₂-Gesetz revision', description: 'Supported strengthened CO₂ law with building renovation mandates.', evidenceCount: 5, source: 'parliamentary_record' },
  { id: 'ev-1005', actorId: 'actor-001', hash: 'ms05e5', timestamp: '2025-04-20T10:00:00Z', type: 'social_media', title: 'Tweet: Praised Zurich rent cap decision', description: '"Zurich city council voted for rent caps in new public housing. A model for the country! 🏠 #Wohnpolitik"', evidenceCount: 1, source: 'twitter', sourceHandle: '@MSchneiderSP', sentiment: 'positive' },
  { id: 'ev-1006', actorId: 'actor-001', hash: 'ms06f6', timestamp: '2025-03-15T12:00:00Z', type: 'vote', title: 'Voted NO on Steuervorlage 25', description: 'Opposed corporate tax reform package citing insufficient redistribution.', evidenceCount: 3, source: 'parliamentary_record' },
  { id: 'ev-1007', actorId: 'actor-001', hash: 'ms07g7', timestamp: '2025-02-01T08:00:00Z', type: 'donation_received', title: 'CHF 12,000 from Unia Trade Union', description: 'Annual campaign contribution from Unia, Switzerland\'s largest trade union.', evidenceCount: 1, source: 'financial_filing', entities: ['Unia Trade Union'] },
  { id: 'ev-1008', actorId: 'actor-001', hash: 'ms08h8', timestamp: '2024-11-10T14:00:00Z', type: 'foreign_meeting', title: 'Met Austrian SPÖ delegation', description: 'Bilateral discussion on cross-border healthcare worker agreements.', evidenceCount: 2, source: 'official_record', entities: ['SPÖ Austria'] },
  { id: 'ev-006', actorId: 'actor-001', hash: 'f2c5h8', timestamp: '2025-01-15T09:00:00Z', type: 'committee_join', title: 'Joined GPK committee', description: 'Appointed to Control Committee.', evidenceCount: 2, source: 'parliamentary_record' },
  { id: 'ev-007', actorId: 'actor-001', hash: 'g3d6i9', timestamp: '2024-06-14T09:00:00Z', type: 'legislation_sponsored', title: 'Sponsored climate protection motion', description: 'Filed motion 24.3456 for enhanced CO₂ reduction targets.', evidenceCount: 4, source: 'parliamentary_record' },
  { id: 'ev-1009', actorId: 'actor-001', hash: 'ms09i9', timestamp: '2024-03-01T10:00:00Z', type: 'vote', title: 'Voted YES on 13th AHV pension', description: 'Supported popular initiative for 13th monthly AHV/AVS pension payment.', evidenceCount: 12, source: 'parliamentary_record' },
  { id: 'ev-1010', actorId: 'actor-001', hash: 'ms10j0', timestamp: '2023-09-20T09:00:00Z', type: 'vote', title: 'Voted YES on Klimaschutzgesetz', description: 'Supported net-zero 2050 climate protection act in referendum.', evidenceCount: 8, source: 'parliamentary_record' },
  { id: 'ev-008', actorId: 'actor-001', hash: 'h4e7j0', timestamp: '2019-12-02T10:00:00Z', type: 'election', title: 'Elected to National Council', description: 'Won seat in 2019 federal elections for SP, Canton Zürich.', evidenceCount: 8, source: 'official_record' },

  // ===== Thomas Müller (actor-002) – Swiss FDP =====
  { id: 'ev-120', actorId: 'actor-002', hash: 's1a2b3', timestamp: '2026-03-20T14:00:00Z', type: 'vote', title: 'Voted YES on Steuerreform 2026', description: 'Supported corporate tax reform in Council of States.', evidenceCount: 3, source: 'parliamentary_record' },
  { id: 'ev-121', actorId: 'actor-002', hash: 's2b3c4', timestamp: '2026-03-18T14:00:00Z', type: 'vote', title: 'Voted NO on BVG-Reform', description: 'Opposed pension reform citing excessive regulation.', evidenceCount: 4, source: 'parliamentary_record' },
  { id: 'ev-122', actorId: 'actor-002', hash: 's3c4d5', timestamp: '2026-03-05T10:00:00Z', type: 'lobbying_meeting', title: 'Meeting with UBS Group policy team', description: 'Registered meeting with UBS government affairs. Topic: banking regulation framework.', evidenceCount: 2, source: 'lobby_register', entities: ['UBS Group'] },
  { id: 'ev-123', actorId: 'actor-002', hash: 's4d5e6', timestamp: '2026-02-20T19:00:00Z', type: 'corporate_event', title: 'WEF Davos side meeting', description: 'Attended private dinner at WEF with pharma and banking CEOs.', evidenceCount: 4, source: 'news', entities: ['WEF', 'Roche', 'UBS'] },
  { id: 'ev-124', actorId: 'actor-002', hash: 's5e6f7', timestamp: '2026-02-01T08:00:00Z', type: 'social_media', title: 'Tweet: Pro-business stance', description: '"Switzerland\'s competitiveness depends on smart regulation, not more bureaucracy. Proud to fight for our SMEs. #Wirtschaft #FDP"', evidenceCount: 1, source: 'twitter', sourceHandle: '@TMuellerFDP', sentiment: 'positive', entities: ['SME industry'] },
  { id: 'ev-125', actorId: 'actor-002', hash: 's6f7g8', timestamp: '2025-12-15T12:00:00Z', type: 'financial_disclosure', title: 'Interests register update', description: 'Updated Parliament interest register: Board member at SwissRe advisory council, Economiesuisse board.', evidenceCount: 2, source: 'official_record', entities: ['SwissRe', 'Economiesuisse'], diff: { removed: 'Board positions: Economiesuisse', added: 'Board positions: Economiesuisse, SwissRe Advisory Council' } },
  { id: 'ev-2001', actorId: 'actor-002', hash: 'tm01a1', timestamp: '2025-11-01T10:00:00Z', type: 'vote', title: 'Voted YES on Rahmenabkommen 2.0 discussion', description: 'Supported reopening bilateral framework negotiations with EU.', evidenceCount: 6, source: 'parliamentary_record' },
  { id: 'ev-2002', actorId: 'actor-002', hash: 'tm02b2', timestamp: '2025-09-20T14:00:00Z', type: 'lobbying_meeting', title: 'Meeting with Swiss Bankers Association', description: 'Private briefing on FINMA regulatory proposals.', evidenceCount: 2, source: 'lobby_register', entities: ['Swiss Bankers Association', 'FINMA'] },
  { id: 'ev-2003', actorId: 'actor-002', hash: 'tm03c3', timestamp: '2025-08-10T09:00:00Z', type: 'corporate_event', title: 'Zurich Insurance Group reception', description: 'Attended annual political reception hosted by Zurich Insurance.', evidenceCount: 3, source: 'news', entities: ['Zurich Insurance Group'] },
  { id: 'ev-2004', actorId: 'actor-002', hash: 'tm04d4', timestamp: '2025-07-01T11:00:00Z', type: 'vote', title: 'Voted NO on Prämienentlastungsinitiative', description: 'Opposed health insurance premium subsidy initiative.', evidenceCount: 4, source: 'parliamentary_record' },
  { id: 'ev-2005', actorId: 'actor-002', hash: 'tm05e5', timestamp: '2025-05-15T10:00:00Z', type: 'speech', title: 'Council speech on Finanzplatz Schweiz', description: 'Argued for competitive tax rates to maintain Swiss financial center attractiveness.', evidenceCount: 3, source: 'parliamentary_record', entities: ['Swiss Financial Center'] },
  { id: 'ev-2006', actorId: 'actor-002', hash: 'tm06f6', timestamp: '2025-03-01T09:00:00Z', type: 'vote', title: 'Voted NO on 13th AHV pension', description: 'Opposed 13th AHV pension citing fiscal unsustainability.', evidenceCount: 6, source: 'parliamentary_record' },
  { id: 'ev-2007', actorId: 'actor-002', hash: 'tm07g7', timestamp: '2024-12-10T14:00:00Z', type: 'donation_received', title: 'CHF 50,000 from Economiesuisse', description: 'Major campaign contribution from Swiss business federation.', evidenceCount: 2, source: 'financial_filing', entities: ['Economiesuisse'] },
  { id: 'ev-2008', actorId: 'actor-002', hash: 'tm08h8', timestamp: '2024-09-01T10:00:00Z', type: 'travel', title: 'Official trip to Singapore', description: 'Trade delegation visit focused on fintech cooperation agreements.', evidenceCount: 2, source: 'official_record', entities: ['Singapore MAS'] },
  { id: 'ev-2009', actorId: 'actor-002', hash: 'tm09i9', timestamp: '2024-06-01T08:00:00Z', type: 'social_media', title: 'Tweet: Criticized excessive regulation', description: '"New EU CSRD reporting rules will cost Swiss companies CHF 800M/year. Bureaucracy gone mad. We need a Swiss solution. #DigitalFirst #FDP"', evidenceCount: 1, source: 'twitter', sourceHandle: '@TMuellerFDP', sentiment: 'negative', entities: ['EU Commission'] },
  { id: 'ev-2010', actorId: 'actor-002', hash: 'tm10j0', timestamp: '2015-11-30T10:00:00Z', type: 'election', title: 'Elected to Council of States', description: 'Won Council of States seat for FDP, Canton Bern.', evidenceCount: 10, source: 'official_record' },

  // ===== Friedrich Weber (actor-003) – German CDU =====
  { id: 'ev-030', actorId: 'actor-003', hash: 'r4o7t0', timestamp: '2026-03-10T14:00:00Z', type: 'vote', title: 'Voted YES on Energy Transition Act', description: 'Supported landmark German energy transition legislation.', evidenceCount: 8, source: 'parliamentary_record' },
  { id: 'ev-070', actorId: 'actor-003', hash: 'z1a2b3', timestamp: '2026-03-05T18:00:00Z', type: 'social_media', title: 'Tweet: Energy transition vote', description: '"Voted for #Energiewende today. Germany must lead on climate. But we also need nuclear back on the table. Controversial? Yes. Necessary? Absolutely."', evidenceCount: 1, source: 'twitter', sourceHandle: '@FWeberCDU', sentiment: 'neutral', entities: ['Nuclear energy industry'] },
  { id: 'ev-071', actorId: 'actor-003', hash: 'z2b3c4', timestamp: '2026-02-20T10:00:00Z', type: 'lobbying_meeting', title: 'Meeting with Siemens Energy leadership', description: 'Private meeting with Siemens Energy CEO. Topic: hydrogen infrastructure investment.', evidenceCount: 3, source: 'lobby_register', entities: ['Siemens Energy'] },
  { id: 'ev-072', actorId: 'actor-003', hash: 'z3c4d5', timestamp: '2026-02-10T14:00:00Z', type: 'corporate_event', title: 'Munich Security Conference panel', description: 'Panelist on "Energy Security in a Multipolar World" at MSC. Shared stage with Shell CEO.', evidenceCount: 4, source: 'news', entities: ['Munich Security Conference', 'Shell plc'] },
  { id: 'ev-073', actorId: 'actor-003', hash: 'z4d5e6', timestamp: '2026-01-15T12:00:00Z', type: 'financial_disclosure', title: 'Nebeneinkünfte disclosure Q4 2025', description: 'Declared €18,500 in speaking fees from industry events. Board seat at Deutsche Telekom advisory council.', evidenceCount: 2, source: 'financial_filing', entities: ['Deutsche Telekom'], diff: { removed: 'No board positions', added: 'Advisory board: Deutsche Telekom' } },
  { id: 'ev-3001', actorId: 'actor-003', hash: 'fw01a1', timestamp: '2025-12-10T14:00:00Z', type: 'vote', title: 'Voted YES on Bürgergeld reform', description: 'Supported tightening citizen income benefit requirements.', evidenceCount: 5, source: 'parliamentary_record' },
  { id: 'ev-3002', actorId: 'actor-003', hash: 'fw02b2', timestamp: '2025-11-05T10:00:00Z', type: 'lobbying_meeting', title: 'Meeting with Volkswagen AG', description: 'Discussed EV subsidy policy and automotive industry transition.', evidenceCount: 3, source: 'lobby_register', entities: ['Volkswagen AG'] },
  { id: 'ev-3003', actorId: 'actor-003', hash: 'fw03c3', timestamp: '2025-10-01T09:00:00Z', type: 'vote', title: 'Voted YES on Sondervermögen Bundeswehr extension', description: 'Supported continued €100B special defense fund.', evidenceCount: 7, source: 'parliamentary_record' },
  { id: 'ev-3004', actorId: 'actor-003', hash: 'fw04d4', timestamp: '2025-08-15T16:00:00Z', type: 'social_media', title: 'Tweet: Criticized Ampel coalition', description: '"The traffic-light coalition has failed on economic policy. Germany needs leadership, not ideological experiments. #CDU #Wirtschaftswende"', evidenceCount: 1, source: 'twitter', sourceHandle: '@FWeberCDU', sentiment: 'negative', entities: ['SPD', 'Grüne', 'FDP Germany'] },
  { id: 'ev-3005', actorId: 'actor-003', hash: 'fw05e5', timestamp: '2025-06-20T14:00:00Z', type: 'corporate_event', title: 'BASF annual reception', description: 'Attended BASF political reception in Ludwigshafen. Chemical industry concerns on energy costs.', evidenceCount: 3, source: 'news', entities: ['BASF SE'] },
  { id: 'ev-3006', actorId: 'actor-003', hash: 'fw06f6', timestamp: '2025-04-10T10:00:00Z', type: 'speech', title: 'Bundestag speech on Standort Deutschland', description: 'Major address on German economic competitiveness, called for corporate tax reduction.', evidenceCount: 4, source: 'parliamentary_record' },
  { id: 'ev-3007', actorId: 'actor-003', hash: 'fw07g7', timestamp: '2025-02-01T12:00:00Z', type: 'donation_received', title: '€30,000 from Siemens AG employees', description: 'Annual donations from Siemens-linked contributors.', evidenceCount: 2, source: 'financial_filing', entities: ['Siemens AG'] },
  { id: 'ev-031', actorId: 'actor-003', hash: 's5p8u1', timestamp: '2025-09-20T10:00:00Z', type: 'party_switch', title: 'Considered leaving CDU', description: 'Reports surfaced of disagreements with party leadership on climate policy. Ultimately remained.', diff: { removed: 'Full CDU alignment', added: 'CDU member with public dissent on climate' }, evidenceCount: 6, source: 'news' },
  { id: 'ev-074', actorId: 'actor-003', hash: 'z5e6f7', timestamp: '2025-07-01T09:00:00Z', type: 'donation_received', title: '€25,000 from Siemens AG employees', description: 'Bundestag records show accumulated donations from Siemens AG employees and PAC.', evidenceCount: 2, source: 'financial_filing', entities: ['Siemens AG'] },
  { id: 'ev-3008', actorId: 'actor-003', hash: 'fw08h8', timestamp: '2024-10-01T10:00:00Z', type: 'foreign_meeting', title: 'Met French economy minister', description: 'Franco-German economic cooperation discussions on industrial policy.', evidenceCount: 3, source: 'official_record', entities: ['French Ministry of Economy'] },
  { id: 'ev-3009', actorId: 'actor-003', hash: 'fw09i9', timestamp: '2017-10-24T10:00:00Z', type: 'election', title: 'Elected to Bundestag', description: 'Won direct mandate in 2017 federal election, Berlin constituency.', evidenceCount: 10, source: 'official_record' },

  // ===== Sarah Mitchell (actor-004) – US Democrat =====
  { id: 'ev-020', actorId: 'actor-004', hash: 'k7h0m3', timestamp: '2026-03-22T16:00:00Z', type: 'vote', title: 'Voted YES on Infrastructure Renewal Act', description: 'Supported bipartisan infrastructure bill in Senate floor vote.', evidenceCount: 12, source: 'parliamentary_record' },
  { id: 'ev-060', actorId: 'actor-004', hash: 'y1a2b3', timestamp: '2026-03-20T20:15:00Z', type: 'social_media', title: 'Tweet: Infrastructure bill passes', description: '"Today we passed the Infrastructure Renewal Act with bipartisan support. Roads, bridges, broadband for every American. This is what governing looks like. 🇺🇸"', evidenceCount: 1, source: 'twitter', sourceHandle: '@SenMitchell', sentiment: 'positive' },
  { id: 'ev-061', actorId: 'actor-004', hash: 'y2b3c4', timestamp: '2026-03-18T10:00:00Z', type: 'lobbying_meeting', title: 'Meeting with Google Public Policy team', description: 'Scheduled lobby meeting with Google\'s VP of Public Policy. Topic: AI safety regulation impact on innovation.', evidenceCount: 3, source: 'lobby_register', entities: ['Google LLC', 'Alphabet Inc'] },
  { id: 'ev-062', actorId: 'actor-004', hash: 'y3c4d5', timestamp: '2026-03-17T14:00:00Z', type: 'corporate_event', title: 'Attended TechForward Summit (keynote)', description: 'Keynote speaker at TechForward Summit. Event sponsored by Microsoft, Meta, and OpenAI.', evidenceCount: 5, source: 'news', entities: ['Microsoft', 'Meta', 'OpenAI', 'TechForward Summit'] },
  { id: 'ev-021', actorId: 'actor-004', hash: 'l8i1n4', timestamp: '2026-03-15T14:00:00Z', type: 'vote', title: 'Voted YES on AI Governance Framework', description: 'Co-sponsored and voted for landmark AI regulation bill.', evidenceCount: 18, source: 'parliamentary_record' },
  { id: 'ev-063', actorId: 'actor-004', hash: 'y4d5e6', timestamp: '2026-03-12T09:00:00Z', type: 'donation_received', title: '$50,000 from Google LLC PAC', description: 'Campaign finance filing shows $50,000 contribution from Google LLC PAC for 2026 cycle.', evidenceCount: 2, source: 'financial_filing', entities: ['Google LLC'], sentiment: 'neutral' },
  { id: 'ev-064', actorId: 'actor-004', hash: 'y5e6f7', timestamp: '2026-03-08T19:00:00Z', type: 'social_media', title: 'Tweet: Called out oil lobby', description: '"Big Oil spent $124M lobbying Congress last year. They don\'t want climate action. We do. Follow the money. #ClimateAction"', evidenceCount: 1, source: 'twitter', sourceHandle: '@SenMitchell', sentiment: 'negative', entities: ['Oil & Gas industry'] },
  { id: 'ev-022', actorId: 'actor-004', hash: 'm9j2o5', timestamp: '2026-03-01T11:00:00Z', type: 'vote', title: 'Voted NO on Defense Budget 2027', description: 'Opposed military spending increase, citing domestic priorities.', evidenceCount: 7, source: 'parliamentary_record' },
  { id: 'ev-065', actorId: 'actor-004', hash: 'y6f7g8', timestamp: '2026-02-20T15:30:00Z', type: 'financial_disclosure', title: 'Annual financial disclosure 2025', description: 'Disclosed $3.2M net worth. Holdings include index funds, no individual tech stocks.', evidenceCount: 1, source: 'financial_filing', diff: { removed: 'Net worth: $2.8M', added: 'Net worth: $3.2M' } },
  { id: 'ev-023', actorId: 'actor-004', hash: 'n0k3p6', timestamp: '2026-02-10T10:00:00Z', type: 'speech', title: 'Senate floor speech on AI ethics', description: 'Delivered 45-minute address on responsible AI development.', evidenceCount: 3, source: 'parliamentary_record' },
  { id: 'ev-4001', actorId: 'actor-004', hash: 'sm01a1', timestamp: '2026-01-28T14:00:00Z', type: 'vote', title: 'Voted YES on Child Tax Credit expansion', description: 'Supported expanding CTC to $3,600/child.', evidenceCount: 5, source: 'parliamentary_record' },
  { id: 'ev-066', actorId: 'actor-004', hash: 'y7g8h9', timestamp: '2026-01-15T10:00:00Z', type: 'lobbying_meeting', title: 'Meeting with Lockheed Martin lobbyists', description: 'Registered meeting with Lockheed Martin government affairs. Topic: defense contract oversight.', evidenceCount: 2, source: 'lobby_register', entities: ['Lockheed Martin'] },
  { id: 'ev-4002', actorId: 'actor-004', hash: 'sm02b2', timestamp: '2025-12-15T16:00:00Z', type: 'social_media', title: 'Tweet: Year-end legislative recap', description: '"2025 by the numbers: 12 bills co-sponsored, 3 signed into law, 47 committee hearings. Accountability matters. Full report: senate.gov/mitchell 📊"', evidenceCount: 1, source: 'twitter', sourceHandle: '@SenMitchell', sentiment: 'positive' },
  { id: 'ev-024', actorId: 'actor-004', hash: 'o1l4q7', timestamp: '2025-11-15T09:00:00Z', type: 'foreign_meeting', title: 'Met with EU Digital Commissioner', description: 'Bilateral meeting in Brussels on transatlantic AI standards.', evidenceCount: 5, source: 'official_record', entities: ['EU Commission'] },
  { id: 'ev-4003', actorId: 'actor-004', hash: 'sm03c3', timestamp: '2025-10-20T10:00:00Z', type: 'vote', title: 'Voted YES on Insulin Price Cap Act', description: 'Supported $35/month insulin price cap.', evidenceCount: 9, source: 'parliamentary_record' },
  { id: 'ev-4004', actorId: 'actor-004', hash: 'sm04d4', timestamp: '2025-10-05T11:00:00Z', type: 'lobbying_meeting', title: 'Meeting with Pfizer Government Affairs', description: 'Discussed drug pricing reform impact on R&D investment.', evidenceCount: 2, source: 'lobby_register', entities: ['Pfizer Inc'] },
  { id: 'ev-4005', actorId: 'actor-004', hash: 'sm05e5', timestamp: '2025-09-01T14:00:00Z', type: 'legislation_sponsored', title: 'Introduced AI Governance Framework', description: 'Primary sponsor of the Artificial Intelligence Governance and Safety Act.', evidenceCount: 15, source: 'parliamentary_record' },
  { id: 'ev-067', actorId: 'actor-004', hash: 'y8h9i0', timestamp: '2025-09-20T16:00:00Z', type: 'travel', title: 'Congressional delegation to Taiwan', description: 'Part of 5-member Senate delegation. Met with President and tech industry leaders.', evidenceCount: 8, source: 'official_record', entities: ['Taiwan', 'TSMC'] },
  { id: 'ev-4006', actorId: 'actor-004', hash: 'sm06f6', timestamp: '2025-08-10T20:00:00Z', type: 'social_media', title: 'Tweet: Climate emergency', description: '"July 2025 was the hottest month in recorded history. We don\'t have time for debate. We need action NOW. #ClimateEmergency"', evidenceCount: 1, source: 'twitter', sourceHandle: '@SenMitchell', sentiment: 'negative' },
  { id: 'ev-4007', actorId: 'actor-004', hash: 'sm07g7', timestamp: '2025-07-15T10:00:00Z', type: 'vote', title: 'Voted YES on CHIPS Act extension', description: 'Supported extending semiconductor manufacturing subsidies.', evidenceCount: 6, source: 'parliamentary_record' },
  { id: 'ev-4008', actorId: 'actor-004', hash: 'sm08h8', timestamp: '2025-06-01T14:00:00Z', type: 'donation_received', title: '$75,000 from ActBlue small donors', description: 'Q2 FEC filing: $75,000 from small-dollar donations via ActBlue.', evidenceCount: 1, source: 'financial_filing', entities: ['ActBlue'] },
  { id: 'ev-4009', actorId: 'actor-004', hash: 'sm09i9', timestamp: '2025-04-15T10:00:00Z', type: 'media_appearance', title: 'CNN Town Hall on AI', description: 'Hosted CNN town hall discussing AI risks and opportunities with constituents.', evidenceCount: 4, source: 'news', entities: ['CNN'] },
  { id: 'ev-025', actorId: 'actor-004', hash: 'p2m5r8', timestamp: '2025-06-01T09:00:00Z', type: 'committee_join', title: 'Joined Judiciary Committee', description: 'Appointed to Senate Judiciary Committee.', evidenceCount: 2, source: 'parliamentary_record' },
  { id: 'ev-068', actorId: 'actor-004', hash: 'y9i0j1', timestamp: '2025-03-01T12:00:00Z', type: 'social_media', title: 'Retweeted criticism of pharma pricing', description: 'RT @PatientRights: "Americans pay 3x more for insulin than Canadians. @SenMitchell is one of few senators fighting to change this."', evidenceCount: 1, source: 'twitter', sourceHandle: '@SenMitchell', entities: ['Pharmaceutical industry'] },
  { id: 'ev-4010', actorId: 'actor-004', hash: 'sm10j0', timestamp: '2024-11-05T10:00:00Z', type: 'vote', title: 'Voted YES on Electoral Count Reform Act', description: 'Supported bipartisan election reform legislation.', evidenceCount: 8, source: 'parliamentary_record' },
  { id: 'ev-4011', actorId: 'actor-004', hash: 'sm11k1', timestamp: '2024-06-01T14:00:00Z', type: 'lobbying_meeting', title: 'Meeting with Amazon Public Policy', description: 'Discussed antitrust regulation and warehouse worker conditions.', evidenceCount: 3, source: 'lobby_register', entities: ['Amazon.com Inc'] },
  { id: 'ev-4012', actorId: 'actor-004', hash: 'sm12l2', timestamp: '2024-03-01T10:00:00Z', type: 'vote', title: 'Voted NO on TikTok ban bill', description: 'Opposed outright ban, argued for regulatory framework instead.', evidenceCount: 11, source: 'parliamentary_record' },
  { id: 'ev-026', actorId: 'actor-004', hash: 'q3n6s9', timestamp: '2021-01-03T12:00:00Z', type: 'election', title: 'Sworn in as Senator', description: 'Took oath of office after winning 2020 Senate race.', evidenceCount: 15, source: 'official_record' },

  // ===== James Crawford (actor-005) – US GOP =====
  { id: 'ev-080', actorId: 'actor-005', hash: 'w1a2b3', timestamp: '2026-03-25T21:00:00Z', type: 'social_media', title: 'Tweet: "Woke AI regulations kill jobs"', description: '"Democrats want to regulate AI into the ground. The AI Governance Framework is a job killer. We should be LEADING, not regulating. America First! 🇺🇸"', evidenceCount: 1, source: 'twitter', sourceHandle: '@RepCrawford', sentiment: 'negative', entities: ['AI Governance Framework'] },
  { id: 'ev-081', actorId: 'actor-005', hash: 'w2b3c4', timestamp: '2026-03-22T16:00:00Z', type: 'vote', title: 'Voted NO on Infrastructure Renewal Act', description: 'Opposed spending bill citing fiscal concerns.', evidenceCount: 4, source: 'parliamentary_record' },
  { id: 'ev-082', actorId: 'actor-005', hash: 'w3c4d5', timestamp: '2026-03-15T11:00:00Z', type: 'lobbying_meeting', title: 'NRA leadership briefing', description: 'Private briefing with NRA executive VP on Second Amendment legislation.', evidenceCount: 2, source: 'lobby_register', entities: ['NRA'] },
  { id: 'ev-083', actorId: 'actor-005', hash: 'w4d5e6', timestamp: '2026-03-10T10:00:00Z', type: 'corporate_event', title: 'Koch Industries donor retreat', description: 'Attended Koch Industries annual donor/policy retreat in Palm Springs.', evidenceCount: 6, source: 'news', entities: ['Koch Industries'] },
  { id: 'ev-084', actorId: 'actor-005', hash: 'w5e6f7', timestamp: '2026-03-01T16:00:00Z', type: 'vote', title: 'Voted YES on Defense Budget 2027', description: 'Supported $886B defense spending bill.', evidenceCount: 3, source: 'parliamentary_record' },
  { id: 'ev-085', actorId: 'actor-005', hash: 'w6f7g8', timestamp: '2026-02-15T14:00:00Z', type: 'donation_received', title: '$75,000 from defense contractors', description: 'FEC filings show $75,000 in contributions from Lockheed Martin, Raytheon, and Boeing PACs.', evidenceCount: 3, source: 'financial_filing', entities: ['Lockheed Martin', 'Raytheon', 'Boeing'] },
  { id: 'ev-086', actorId: 'actor-005', hash: 'w7g8h9', timestamp: '2026-01-20T20:00:00Z', type: 'social_media', title: 'Tweet: Dinner with Elon Musk', description: '"Great dinner with @elonmusk tonight. Discussed deregulation and American innovation. The future is bright! 🚀"', evidenceCount: 1, source: 'twitter', sourceHandle: '@RepCrawford', sentiment: 'positive', entities: ['Elon Musk', 'Tesla'] },
  { id: 'ev-5001', actorId: 'actor-005', hash: 'jc01a1', timestamp: '2025-12-10T16:00:00Z', type: 'vote', title: 'Voted YES on Tax Cuts Extension Act', description: 'Supported extending 2017 TCJA individual tax provisions.', evidenceCount: 5, source: 'parliamentary_record' },
  { id: 'ev-5002', actorId: 'actor-005', hash: 'jc02b2', timestamp: '2025-11-15T10:00:00Z', type: 'lobbying_meeting', title: 'Meeting with ExxonMobil lobbyists', description: 'Discussed federal land drilling permits and LNG export regulations.', evidenceCount: 3, source: 'lobby_register', entities: ['ExxonMobil'] },
  { id: 'ev-5003', actorId: 'actor-005', hash: 'jc03c3', timestamp: '2025-10-20T20:00:00Z', type: 'social_media', title: 'Tweet: Border security rally', description: '"Just spoke to 5,000 patriots in El Paso. The border crisis is real. Build the wall. Secure America. 🇺🇸 #BorderSecurity"', evidenceCount: 1, source: 'twitter', sourceHandle: '@RepCrawford', sentiment: 'positive' },
  { id: 'ev-5004', actorId: 'actor-005', hash: 'jc04d4', timestamp: '2025-09-05T14:00:00Z', type: 'vote', title: 'Voted NO on Climate Emergency Resolution', description: 'Opposed declaring national climate emergency.', evidenceCount: 4, source: 'parliamentary_record' },
  { id: 'ev-5005', actorId: 'actor-005', hash: 'jc05e5', timestamp: '2025-07-20T10:00:00Z', type: 'corporate_event', title: 'Heritage Foundation policy dinner', description: 'Keynote at Heritage Foundation annual gala. Discussed deregulation agenda.', evidenceCount: 4, source: 'news', entities: ['Heritage Foundation'] },
  { id: 'ev-5006', actorId: 'actor-005', hash: 'jc06f6', timestamp: '2025-06-01T09:00:00Z', type: 'donation_received', title: '$100,000 from Koch network', description: 'Q2 FEC filing shows $100,000 from Americans for Prosperity Action.', evidenceCount: 2, source: 'financial_filing', entities: ['Koch Industries', 'Americans for Prosperity'] },
  { id: 'ev-5007', actorId: 'actor-005', hash: 'jc07g7', timestamp: '2025-04-01T11:00:00Z', type: 'vote', title: 'Voted YES on REINS Act', description: 'Supported requiring congressional approval for major regulations.', evidenceCount: 3, source: 'parliamentary_record' },
  { id: 'ev-087', actorId: 'actor-005', hash: 'w8h9i0', timestamp: '2025-11-01T09:00:00Z', type: 'financial_disclosure', title: 'Annual financial disclosure 2025', description: 'Disclosed $8.5M net worth. Holdings include Raytheon, Lockheed Martin stock.', evidenceCount: 1, source: 'financial_filing', diff: { removed: 'Net worth: $7.2M', added: 'Net worth: $8.5M' }, entities: ['Raytheon', 'Lockheed Martin'] },
  { id: 'ev-5008', actorId: 'actor-005', hash: 'jc08h8', timestamp: '2025-02-15T14:00:00Z', type: 'media_appearance', title: 'Fox News interview on spending', description: 'Primetime Fox News interview attacking Democratic spending proposals.', evidenceCount: 2, source: 'news', entities: ['Fox News'] },
  { id: 'ev-5009', actorId: 'actor-005', hash: 'jc09i9', timestamp: '2019-01-03T12:00:00Z', type: 'election', title: 'Sworn in as Representative', description: 'Took oath of office for New York congressional district.', evidenceCount: 8, source: 'official_record' },

  // ===== Luísa Ferreira (actor-006) – Brazilian PT =====
  { id: 'ev-040', actorId: 'actor-006', hash: 't6q9v2', timestamp: '2026-03-18T15:00:00Z', type: 'vote', title: 'Voted YES on Universal Education Reform', description: 'Supported expansion of public education funding.', evidenceCount: 4, source: 'parliamentary_record' },
  { id: 'ev-090', actorId: 'actor-006', hash: 'v1a2b3', timestamp: '2026-03-16T22:00:00Z', type: 'social_media', title: 'Tweet: Amazon deforestation data', description: '"BREAKING: Satellite data shows 23% increase in illegal deforestation in Pará. Mining companies are destroying our lungs. Thread 🧵👇 #SaveTheAmazon"', evidenceCount: 1, source: 'twitter', sourceHandle: '@LuisaFerreira', sentiment: 'negative', entities: ['Mining industry', 'Pará'] },
  { id: 'ev-041', actorId: 'actor-006', hash: 'u7r0w3', timestamp: '2026-03-05T11:00:00Z', type: 'legislation_sponsored', title: 'Sponsored Amazon Protection Act', description: 'Primary sponsor of environmental protection legislation for Amazon region.', evidenceCount: 9, source: 'parliamentary_record' },
  { id: 'ev-091', actorId: 'actor-006', hash: 'v2b3c4', timestamp: '2026-02-25T10:00:00Z', type: 'lobbying_meeting', title: 'Meeting with Vale SA representatives', description: 'Confrontational meeting with Vale mining company lobbyists regarding deforestation.', evidenceCount: 3, source: 'lobby_register', entities: ['Vale SA'], sentiment: 'negative' },
  { id: 'ev-092', actorId: 'actor-006', hash: 'v3c4d5', timestamp: '2026-02-01T18:00:00Z', type: 'public_statement', title: 'Accused mining lobby of corruption', description: 'Press conference accusing mining lobby of bribing 12 congressmen. Named specific companies.', evidenceCount: 7, source: 'news', entities: ['Vale SA', 'Anglo American'], sentiment: 'negative' },
  { id: 'ev-6001', actorId: 'actor-006', hash: 'lf01a1', timestamp: '2026-01-20T14:00:00Z', type: 'vote', title: 'Voted YES on Bolsa Família expansion', description: 'Supported expanding social welfare program coverage.', evidenceCount: 5, source: 'parliamentary_record' },
  { id: 'ev-6002', actorId: 'actor-006', hash: 'lf02b2', timestamp: '2025-12-10T20:00:00Z', type: 'social_media', title: 'Tweet: Praised Lula climate pledge', description: '"President @LulaOficial\'s COP pledge: zero deforestation by 2030. Now hold the agribusiness lobby accountable. Actions > words. 🌳 #COP30"', evidenceCount: 1, source: 'twitter', sourceHandle: '@LuisaFerreira', sentiment: 'positive', entities: ['Lula', 'COP30'] },
  { id: 'ev-6003', actorId: 'actor-006', hash: 'lf03c3', timestamp: '2025-11-01T10:00:00Z', type: 'vote', title: 'Voted YES on Indigenous Land Demarcation', description: 'Supported constitutional amendment protecting indigenous territories.', evidenceCount: 8, source: 'parliamentary_record' },
  { id: 'ev-6004', actorId: 'actor-006', hash: 'lf04d4', timestamp: '2025-09-15T14:00:00Z', type: 'lobbying_meeting', title: 'Meeting with JBS SA lobbyists', description: 'Tense meeting with JBS meat processing company on deforestation-linked supply chains.', evidenceCount: 4, source: 'lobby_register', entities: ['JBS SA'], sentiment: 'negative' },
  { id: 'ev-6005', actorId: 'actor-006', hash: 'lf05e5', timestamp: '2025-08-01T09:00:00Z', type: 'travel', title: 'Amazon region field visit', description: 'Week-long visit to Pará and Amazonas states documenting illegal mining.', evidenceCount: 12, source: 'official_record', entities: ['IBAMA'] },
  { id: 'ev-6006', actorId: 'actor-006', hash: 'lf06f6', timestamp: '2025-06-15T10:00:00Z', type: 'vote', title: 'Voted NO on Agribusiness Tax Relief', description: 'Opposed tax breaks for large agricultural exporters.', evidenceCount: 4, source: 'parliamentary_record' },
  { id: 'ev-6007', actorId: 'actor-006', hash: 'lf07g7', timestamp: '2025-04-01T18:00:00Z', type: 'social_media', title: 'Tweet: Teacher salary protest', description: '"100,000 teachers on the streets of São Paulo today. They deserve living wages. Education is not an expense, it\'s an investment. #GreveDosProfessores"', evidenceCount: 1, source: 'twitter', sourceHandle: '@LuisaFerreira', sentiment: 'negative' },
  { id: 'ev-6008', actorId: 'actor-006', hash: 'lf08h8', timestamp: '2025-02-20T12:00:00Z', type: 'financial_disclosure', title: 'Annual asset declaration', description: 'Declared R$450,000 total assets. No corporate board positions.', evidenceCount: 1, source: 'financial_filing' },
  { id: 'ev-6009', actorId: 'actor-006', hash: 'lf09i9', timestamp: '2024-08-01T10:00:00Z', type: 'foreign_meeting', title: 'Met Colombian environmental minister', description: 'Discussed Amazon Cooperation Treaty Organization agenda.', evidenceCount: 3, source: 'official_record', entities: ['Colombia', 'ACTO'] },
  { id: 'ev-6010', actorId: 'actor-006', hash: 'lf10j0', timestamp: '2023-02-01T10:00:00Z', type: 'election', title: 'Sworn in as Federal Deputy', description: 'Took office after 2022 election on PT ticket, São Paulo.', evidenceCount: 6, source: 'official_record' },

  // ===== Takeshi Yamamoto (actor-007) – Japanese LDP =====
  { id: 'ev-100', actorId: 'actor-007', hash: 'u1a2b3', timestamp: '2026-03-20T14:00:00Z', type: 'vote', title: 'Voted YES on Defense Modernization Bill', description: 'Supported increased defense spending amid regional tensions.', evidenceCount: 5, source: 'parliamentary_record' },
  { id: 'ev-101', actorId: 'actor-007', hash: 'u2b3c4', timestamp: '2026-03-15T10:00:00Z', type: 'corporate_event', title: 'Toyota annual reception', description: 'Attended Toyota\'s annual Diet members reception. 45 LDP members present.', evidenceCount: 3, source: 'news', entities: ['Toyota Motor Corp'] },
  { id: 'ev-102', actorId: 'actor-007', hash: 'u3c4d5', timestamp: '2026-03-01T09:00:00Z', type: 'lobbying_meeting', title: 'Keidanren economic policy briefing', description: 'Attended Japan Business Federation policy briefing on digital economy regulation.', evidenceCount: 2, source: 'lobby_register', entities: ['Keidanren'] },
  { id: 'ev-103', actorId: 'actor-007', hash: 'u4d5e6', timestamp: '2026-02-10T14:00:00Z', type: 'social_media', title: 'Tweet: Taiwan Strait concerns', description: '"Japan must strengthen its defense capabilities. The situation in the Taiwan Strait demands our attention. I support PM\'s approach. 日本を守る 🇯🇵"', evidenceCount: 1, source: 'twitter', sourceHandle: '@TYamamotoLDP', sentiment: 'neutral', entities: ['Taiwan', 'Japan Self-Defense Forces'] },
  { id: 'ev-104', actorId: 'actor-007', hash: 'u5e6f7', timestamp: '2026-01-20T09:00:00Z', type: 'financial_disclosure', title: 'Political funds report 2025', description: 'Filed ¥42M in political funds. Major donors: Toyota, Keidanren, construction associations.', evidenceCount: 2, source: 'financial_filing', entities: ['Toyota Motor Corp', 'Keidanren'] },
  { id: 'ev-105', actorId: 'actor-007', hash: 'u6f7g8', timestamp: '2025-12-01T10:00:00Z', type: 'travel', title: 'Official visit to Washington D.C.', description: 'Met with Senate Armed Services Committee members on US-Japan defense cooperation.', evidenceCount: 4, source: 'official_record', entities: ['US Senate', 'Pentagon'] },
  { id: 'ev-7001', actorId: 'actor-007', hash: 'ty01a1', timestamp: '2025-11-01T14:00:00Z', type: 'vote', title: 'Voted YES on Economic Security Act revision', description: 'Supported supply chain security measures for semiconductors.', evidenceCount: 6, source: 'parliamentary_record' },
  { id: 'ev-7002', actorId: 'actor-007', hash: 'ty02b2', timestamp: '2025-10-10T10:00:00Z', type: 'lobbying_meeting', title: 'Meeting with Sony Group', description: 'Discussed semiconductor subsidy allocation and entertainment industry regulations.', evidenceCount: 2, source: 'lobby_register', entities: ['Sony Group'] },
  { id: 'ev-7003', actorId: 'actor-007', hash: 'ty03c3', timestamp: '2025-09-01T09:00:00Z', type: 'scandal', title: 'Political funds scandal investigation', description: 'Named in Diet investigation of LDP faction fund-raising dinner ticket irregularities.', evidenceCount: 15, source: 'news', entities: ['LDP Abe Faction'], sentiment: 'negative' },
  { id: 'ev-7004', actorId: 'actor-007', hash: 'ty04d4', timestamp: '2025-07-15T14:00:00Z', type: 'corporate_event', title: 'TSMC Japan groundbreaking ceremony', description: 'Attended TSMC Kumamoto fab groundbreaking as Diet representative.', evidenceCount: 5, source: 'news', entities: ['TSMC', 'Kumamoto Prefecture'] },
  { id: 'ev-7005', actorId: 'actor-007', hash: 'ty05e5', timestamp: '2025-05-20T10:00:00Z', type: 'vote', title: 'Voted YES on LGBTQ Understanding Act', description: 'Supported watered-down LGBTQ awareness legislation within LDP.', evidenceCount: 4, source: 'parliamentary_record' },
  { id: 'ev-7006', actorId: 'actor-007', hash: 'ty06f6', timestamp: '2025-03-01T09:00:00Z', type: 'donation_received', title: '¥8M from Toyota Motor political fund', description: 'Annual political donation from Toyota group companies.', evidenceCount: 2, source: 'financial_filing', entities: ['Toyota Motor Corp'] },
  { id: 'ev-7007', actorId: 'actor-007', hash: 'ty07g7', timestamp: '2024-10-01T10:00:00Z', type: 'foreign_meeting', title: 'Met South Korean legislators', description: 'Japan-South Korea parliamentary exchange on security cooperation.', evidenceCount: 3, source: 'official_record', entities: ['South Korea National Assembly'] },
  { id: 'ev-7008', actorId: 'actor-007', hash: 'ty08h8', timestamp: '2012-12-16T10:00:00Z', type: 'election', title: 'Elected to House of Representatives', description: 'Won proportional representation seat in 2012 general election.', evidenceCount: 8, source: 'official_record' },

  // ===== Claire Dupont (actor-008) – French Renaissance =====
  { id: 'ev-110', actorId: 'actor-008', hash: 't1a2b3', timestamp: '2026-03-19T14:00:00Z', type: 'vote', title: 'Voted YES on Pension Reform Amendment', description: 'Supported pension reform despite widespread protests.', evidenceCount: 6, source: 'parliamentary_record' },
  { id: 'ev-111', actorId: 'actor-008', hash: 't2b3c4', timestamp: '2026-03-15T20:00:00Z', type: 'social_media', title: 'Tweet: Defending pension reform', description: '"I hear the anger. But we must face demographic reality. Our pension system needs reform NOW or it collapses in 10 years. Hard truths. #ReformeDesRetraites"', evidenceCount: 1, source: 'twitter', sourceHandle: '@CDupontRE', sentiment: 'neutral' },
  { id: 'ev-112', actorId: 'actor-008', hash: 't3c4d5', timestamp: '2026-03-10T14:00:00Z', type: 'vote', title: 'Voted YES on Climate Adaptation Act', description: 'Supported climate adaptation measures for coastal and agricultural regions.', evidenceCount: 4, source: 'parliamentary_record' },
  { id: 'ev-113', actorId: 'actor-008', hash: 't4d5e6', timestamp: '2026-03-01T10:00:00Z', type: 'lobbying_meeting', title: 'Meeting with TotalEnergies lobbyists', description: 'Scheduled meeting with TotalEnergies public affairs director on energy transition timeline.', evidenceCount: 3, source: 'lobby_register', entities: ['TotalEnergies'] },
  { id: 'ev-114', actorId: 'actor-008', hash: 't5e6f7', timestamp: '2026-02-15T14:00:00Z', type: 'corporate_event', title: 'LVMH Diversity Gala', description: 'Attended LVMH-hosted gala dinner in Paris. Event featured luxury industry leaders and politicians.', evidenceCount: 2, source: 'news', entities: ['LVMH', 'Bernard Arnault'] },
  { id: 'ev-115', actorId: 'actor-008', hash: 't6f7g8', timestamp: '2026-01-10T12:00:00Z', type: 'donation_received', title: '€15,000 from LVMH executives', description: 'HATVP filings show donations from LVMH-linked individuals totaling €15,000.', evidenceCount: 2, source: 'financial_filing', entities: ['LVMH'] },
  { id: 'ev-8001', actorId: 'actor-008', hash: 'cd01a1', timestamp: '2025-12-15T14:00:00Z', type: 'vote', title: 'Voted YES on Immigration Reform bill', description: 'Supported Macron\'s immigration law amid RN opposition.', evidenceCount: 7, source: 'parliamentary_record' },
  { id: 'ev-8002', actorId: 'actor-008', hash: 'cd02b2', timestamp: '2025-11-20T10:00:00Z', type: 'lobbying_meeting', title: 'Meeting with Airbus lobbyists', description: 'Discussed European defense procurement and Airbus factory investment in Toulouse.', evidenceCount: 3, source: 'lobby_register', entities: ['Airbus SE'] },
  { id: 'ev-8003', actorId: 'actor-008', hash: 'cd03c3', timestamp: '2025-10-05T20:00:00Z', type: 'social_media', title: 'Tweet: Criticized RN on EU', description: '"Marine Le Pen wants to destroy Europe from within. Sovereignty isn\'t isolation. France is stronger IN the EU. #Renaissance #Europe"', evidenceCount: 1, source: 'twitter', sourceHandle: '@CDupontRE', sentiment: 'negative', entities: ['Marine Le Pen', 'RN'] },
  { id: 'ev-8004', actorId: 'actor-008', hash: 'cd04d4', timestamp: '2025-09-01T14:00:00Z', type: 'vote', title: 'Voted YES on Nuclear Energy Extension', description: 'Supported extending lifespan of existing nuclear plants.', evidenceCount: 5, source: 'parliamentary_record' },
  { id: 'ev-8005', actorId: 'actor-008', hash: 'cd05e5', timestamp: '2025-07-10T10:00:00Z', type: 'corporate_event', title: 'Vivatech Paris panel', description: 'Panelist on "Europe\'s Digital Sovereignty" at Vivatech. Shared stage with startup founders.', evidenceCount: 3, source: 'news', entities: ['Vivatech'] },
  { id: 'ev-8006', actorId: 'actor-008', hash: 'cd06f6', timestamp: '2025-05-15T12:00:00Z', type: 'financial_disclosure', title: 'HATVP annual declaration', description: 'Declared €780,000 net worth. No corporate board seats. Previous career: McKinsey consultant.', evidenceCount: 1, source: 'financial_filing', diff: { removed: 'Net worth: €720,000', added: 'Net worth: €780,000' }, entities: ['McKinsey'] },
  { id: 'ev-8007', actorId: 'actor-008', hash: 'cd07g7', timestamp: '2025-03-20T14:00:00Z', type: 'speech', title: 'Assemblée speech on EU integration', description: 'Major address calling for deeper European fiscal integration.', evidenceCount: 4, source: 'parliamentary_record' },
  { id: 'ev-8008', actorId: 'actor-008', hash: 'cd08h8', timestamp: '2025-01-15T10:00:00Z', type: 'foreign_meeting', title: 'Met German Green MPs', description: 'Franco-German climate policy coordination meeting in Strasbourg.', evidenceCount: 2, source: 'official_record', entities: ['Bündnis 90/Die Grünen'] },
  { id: 'ev-8009', actorId: 'actor-008', hash: 'cd09i9', timestamp: '2024-06-01T10:00:00Z', type: 'media_appearance', title: 'France 2 debate on pensions', description: 'Live televised debate against LFI representative on pension reform.', evidenceCount: 5, source: 'news', entities: ['France 2', 'LFI'] },
  { id: 'ev-8010', actorId: 'actor-008', hash: 'cd10j0', timestamp: '2022-06-19T10:00:00Z', type: 'election', title: 'Elected to Assemblée nationale', description: 'Won Paris constituency seat on Renaissance ticket.', evidenceCount: 8, source: 'official_record' },
];

// ==================== RELATIONSHIPS ====================

export const relationships: Relationship[] = [
  // Cross-party within country
  { id: 'rel-001', sourceId: 'actor-001', sourceType: 'actor', targetId: 'actor-002', targetType: 'actor', type: 'committee_co_member', strength: 0.4, description: 'Both serve in federal parliament, overlapping committee interests.', since: '2019-12-02' },
  // Cross-border ideological alignment
  { id: 'rel-002', sourceId: 'party-sp', sourceType: 'party', targetId: 'party-spd', targetType: 'party', type: 'ideological_alignment', strength: 0.85, description: 'Both social democratic parties, members of Progressive Alliance.' },
  { id: 'rel-003', sourceId: 'party-sp', sourceType: 'party', targetId: 'party-pt', targetType: 'party', type: 'ideological_alignment', strength: 0.7, description: 'Shared democratic socialist roots, both in Progressive Alliance.' },
  { id: 'rel-004', sourceId: 'party-fdp', sourceType: 'party', targetId: 'party-lrem', targetType: 'party', type: 'ideological_alignment', strength: 0.65, description: 'Liberal centrist alignment, both ALDE/Renew affiliates.' },
  { id: 'rel-005', sourceId: 'party-svp', sourceType: 'party', targetId: 'party-gop', targetType: 'party', type: 'ideological_alignment', strength: 0.5, description: 'Conservative-nationalist tendencies, though different political systems.' },
  { id: 'rel-006', sourceId: 'party-cdu', sourceType: 'party', targetId: 'party-ldp', targetType: 'party', type: 'ideological_alignment', strength: 0.55, description: 'Both center-right governing parties with long incumbency traditions.' },
  // Actors across borders
  { id: 'rel-007', sourceId: 'actor-004', sourceType: 'actor', targetId: 'actor-008', targetType: 'actor', type: 'cross_border_alliance', strength: 0.6, description: 'Collaborated on transatlantic AI governance framework at OECD.', since: '2025-11-15' },
  { id: 'rel-008', sourceId: 'actor-001', sourceType: 'actor', targetId: 'actor-006', targetType: 'actor', type: 'ally', strength: 0.5, description: 'Co-signed open letter on global social policy standards at UN.', since: '2025-09-01' },
  // Intra-party rivalry
  { id: 'rel-009', sourceId: 'actor-004', sourceType: 'actor', targetId: 'actor-005', targetType: 'actor', type: 'rival', strength: 0.7, description: 'Frequent opponents in Senate/House debates on defense spending.' },
  // Corporate/lobby relationships
  { id: 'rel-010', sourceId: 'actor-005', sourceType: 'actor', targetId: 'actor-007', targetType: 'actor', type: 'cross_border_alliance', strength: 0.45, description: 'Both hawks on defense spending; met at US-Japan defense summit.', since: '2025-12-01' },
  { id: 'rel-011', sourceId: 'actor-002', sourceType: 'actor', targetId: 'actor-003', targetType: 'actor', type: 'ally', strength: 0.55, description: 'Share pro-business stance; coordinate on EU financial regulation positions.', since: '2024-01-15' },
];

// ==================== PROPOSALS ====================

export const mockProposals: Proposal[] = [
  {
    id: 'prop-001', title: 'Energieversorgungsinitiative', officialTitle: 'Volksinitiative «Für eine sichere Energieversorgung»',
    status: 'consultation', type: 'initiative', jurisdiction: 'federal', countryId: 'ch',
    submittedDate: '2026-04-03', sponsors: ['Energiekomitee Schweiz'],
    affectedLaws: ['EnG (Energiegesetz)', 'StromVG'], evidenceCount: 12, revisionId: 'rev-a1b2c3',
    summary: 'Aims to constitutionally anchor minimum domestic energy production targets.',
  },
  {
    id: 'prop-002', title: 'BVG-Reform', officialTitle: 'Reform der beruflichen Vorsorge (BVG 21)',
    status: 'pending_vote', type: 'bill', jurisdiction: 'federal', countryId: 'ch',
    voteDate: '2026-06-14', submittedDate: '2021-11-17', sponsors: ['Bundesrat'],
    affectedLaws: ['BVG'], evidenceCount: 34, revisionId: 'rev-d4e5f6',
    summary: 'Lowers the conversion rate from 6.8% to 6.0%, introduces lifetime contribution supplements.',
  },
  {
    id: 'prop-003', title: 'AI Governance Framework', officialTitle: 'Artificial Intelligence Governance and Safety Act',
    status: 'parliamentary_deliberation', type: 'bill', jurisdiction: 'federal', countryId: 'us',
    submittedDate: '2025-09-15', sponsors: ['Sen. Sarah Mitchell', 'Sen. R. Kumar'],
    affectedLaws: ['Federal Trade Commission Act', 'National AI Initiative Act'], evidenceCount: 45, revisionId: 'rev-us-ai01',
    summary: 'Establishes federal framework for AI system risk classification and mandatory safety testing.',
  },
  {
    id: 'prop-004', title: 'Energy Transition Act', officialTitle: 'Energiewende-Beschleunigungsgesetz',
    status: 'accepted', type: 'bill', jurisdiction: 'federal', countryId: 'de',
    submittedDate: '2025-06-01', sponsors: ['Bundesregierung'],
    affectedLaws: ['EEG', 'EnWG'], evidenceCount: 28, revisionId: 'rev-de-en01',
    summary: 'Accelerates renewable energy deployment targets to 80% by 2030.',
  },
];

// ==================== CHANGELOG ====================

export const mockChangelog: ChangeLogEntry[] = [
  { id: 'cl-001', timestamp: '2026-04-03T14:22:00Z', type: 'proposal_added', title: 'New initiative registered', subject: 'Energieversorgungsinitiative', subjectType: 'proposal', subjectId: 'prop-001', revisionId: 'rev-a1b2c3', evidenceCount: 12, summary: 'Federal Chancellery published new popular initiative.', countryId: 'ch' },
  { id: 'cl-002', timestamp: '2026-04-03T11:05:00Z', type: 'revision', title: 'Explainer updated', subject: 'BVG-Reform', subjectType: 'proposal', subjectId: 'prop-002', revisionId: 'rev-d4e5f6', evidenceCount: 34, summary: 'Updated impact analysis following new SECO data.', countryId: 'ch' },
  { id: 'cl-003', timestamp: '2026-04-03T09:30:00Z', type: 'ingestion', title: 'AI governance bill advances', subject: 'AI Governance Framework', subjectType: 'proposal', subjectId: 'prop-003', revisionId: 'rev-us-ai01', evidenceCount: 45, summary: 'Senate committee passed AI governance bill with amendments.', countryId: 'us' },
  { id: 'cl-004', timestamp: '2026-04-02T16:40:00Z', type: 'correction', title: 'Actor profile corrected', subject: 'Maria Schneider', subjectType: 'actor', subjectId: 'actor-001', revisionId: 'rev-j0k1l2', evidenceCount: 3, summary: 'GPK membership date corrected.', countryId: 'ch' },
  { id: 'cl-005', timestamp: '2026-04-02T10:15:00Z', type: 'forecast_update', title: 'Cross-border AI policy analysis', subject: 'Mitchell-Dupont AI cooperation', subjectType: 'actor', subjectId: 'actor-004', revisionId: 'rev-xb01', evidenceCount: 8, summary: 'New analysis of transatlantic AI governance alignment.', countryId: 'us' },
];

// ==================== LABELS ====================

export const typeLabels: Record<ChangeLogEntry['type'], string> = {
  proposal_added: 'NEW', revision: 'REV', correction: 'COR', ingestion: 'ING', forecast_update: 'FCT',
};

export const statusLabels: Record<Proposal['status'], string> = {
  consultation: 'CONSULTATION', parliamentary_deliberation: 'DELIBERATION', pending_vote: 'PENDING VOTE', accepted: 'ACCEPTED', rejected: 'REJECTED',
};

export const eventTypeLabels: Record<ActorEvent['type'], string> = {
  vote: 'VOTE', speech: 'SPCH', committee_join: 'JOIN', committee_leave: 'LEFT', election: 'ELCT',
  appointment: 'APPT', resignation: 'RSGN', scandal: 'SCAN', policy_change: 'PLCY',
  party_switch: 'SWCH', legislation_sponsored: 'LGSL', foreign_meeting: 'FRGN',
  lobbying_meeting: 'LOBY', corporate_event: 'CORP', financial_disclosure: 'FINC',
  social_media: 'TWEET', travel: 'TRVL', donation_received: 'DONA',
  public_statement: 'STMT', court_case: 'CORT', media_appearance: 'MDIA',
};

export const eventTypeColors: Record<ActorEvent['type'], string> = {
  vote: 'bg-primary/10', speech: 'bg-accent/20', committee_join: 'bg-green-500/10', committee_leave: 'bg-destructive/10',
  election: 'bg-yellow-500/10', appointment: 'bg-blue-500/10', resignation: 'bg-destructive/10', scandal: 'bg-destructive/20',
  policy_change: 'bg-purple-500/10', party_switch: 'bg-orange-500/10', legislation_sponsored: 'bg-green-500/10', foreign_meeting: 'bg-blue-500/10',
  lobbying_meeting: 'bg-amber-500/10', corporate_event: 'bg-amber-500/10', financial_disclosure: 'bg-emerald-500/10',
  social_media: 'bg-sky-500/10', travel: 'bg-indigo-500/10', donation_received: 'bg-yellow-500/10',
  public_statement: 'bg-violet-500/10', court_case: 'bg-red-500/10', media_appearance: 'bg-pink-500/10',
};

export const sourceLabels: Record<NonNullable<ActorEvent['source']>, string> = {
  twitter: '𝕏 TWITTER', official_record: 'OFFICIAL', news: 'NEWS', financial_filing: 'FILING',
  parliamentary_record: 'PARLIAMENT', court_filing: 'COURT', lobby_register: 'LOBBY REG',
};

export const sourceColors: Record<NonNullable<ActorEvent['source']>, string> = {
  twitter: 'bg-sky-500/20 text-sky-700 dark:text-sky-300',
  official_record: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  news: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
  financial_filing: 'bg-green-500/20 text-green-700 dark:text-green-300',
  parliamentary_record: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
  court_filing: 'bg-red-500/20 text-red-700 dark:text-red-300',
  lobby_register: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
};

// ==================== HELPERS ====================

export const getCountry = (id: string) => countries.find(c => c.id === id);
export const getContinent = (id: string) => continents.find(c => c.id === id);
export const getCity = (id: string) => cities.find(c => c.id === id);
export const getParty = (id: string) => parties.find(p => p.id === id);
export const getActorEvents = (actorId: string) => actorEvents.filter(e => e.actorId === actorId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
export const getActorsByCountry = (countryId: string) => mockActors.filter(a => a.countryId === countryId);
export const getActorsByContinent = (continentId: string) => {
  const countryIds = countries.filter(c => c.continentId === continentId).map(c => c.id);
  return mockActors.filter(a => countryIds.includes(a.countryId));
};
