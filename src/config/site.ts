/**
 * Manekshaw.Vision - Site Configuration & Metadata Registry
 * Built by Team Astra Dynamics
 */

export interface SiteSocialLinks {
  facebook: string;
  x: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  github: string;
}

export interface SiteConfig {
  siteUrl: string;
  name: string;
  shortName: string;
  title: string;
  description: string;
  team: {
    name: string;
    code: string;
    competition: string;
    description: string;
  };
  social: SiteSocialLinks;
  disclaimer: string;
}

export const SITE_CONFIG: SiteConfig = {
  siteUrl: 'https://www.manvis.tech',
  name: 'Manekshaw.Vision',
  shortName: 'ManVis',
  title: 'Manekshaw.Vision | Sovereign Defense Intelligence Dashboard',
  description:
    'Sovereign defense intelligence & real-time situational awareness by Team Astra Dynamics. Honoring Field Marshal Sam Manekshaw with live OSINT telemetry.',
  team: {
    name: 'Team Astra Dynamics',
    code: 'ADYN',
    competition: 'WRO Future Engineers 2026',
    description:
      'High school engineering team specializing in autonomous robotics, software architecture, and sovereign open-source situational awareness tools.'
  },
  social: {
    facebook: '',
    x: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    github: 'https://github.com/Astra-Dynamics/Manekshaw.Vision'
  },
  disclaimer:
    'Independent, open-source OSINT research project built for educational situational awareness. Not affiliated with any government, armed forces, or defense agency. Not for operational or tactical decision-making.'
};

/**
 * Filter social links to return only configured, non-empty profile URLs
 */
export const getActiveSocialLinks = (social: SiteSocialLinks = SITE_CONFIG.social): Array<{ platform: keyof SiteSocialLinks; url: string }> => {
  return (Object.entries(social) as [keyof SiteSocialLinks, string][])
    .filter(([_, url]) => Boolean(url && url.trim().length > 0))
    .map(([platform, url]) => ({ platform, url }));
};
