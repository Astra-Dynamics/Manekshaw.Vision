/**
 * Schema.org Structured Data Generator for Manekshaw.Vision
 * Built by Team Astra Dynamics
 */

import { SITE_CONFIG, getActiveSocialLinks } from './site';

export const FAQ_DATA = [
  {
    question: 'What is Manekshaw.Vision (ManVis)?',
    answer:
      'Manekshaw.Vision is an open-source, sovereign situational awareness and defense intelligence platform designed to aggregate, analyze, and visualize geopolitical events, military postures, active conflict zones, and strategic natural events in real time.'
  },
  {
    question: 'Who created Manekshaw.Vision?',
    answer:
      'Manekshaw.Vision was engineered by Team Astra Dynamics (ADYN), an engineering team competing in WRO Future Engineers 2026. The platform is dedicated to Field Marshal Sam Hormusji Framji Jamshedji Manekshaw, MC (1914–2008).'
  },
  {
    question: 'What live telemetry and intelligence data sources are used?',
    answer:
      'The platform integrates authoritative open-source intelligence (OSINT) telemetry including USGS real-time seismic sensors, NASA EONET hazard tracking, ACLED conflict reporting, FIRMS thermal sensors, military transponder tracking, and verified international news dispatches.'
  },
  {
    question: 'How often is the situational intelligence feed updated?',
    answer:
      'The automated intelligence ingestion pipeline runs continuously every 30 minutes via GitHub Actions, and client streams refresh live seismic, environmental, and news data directly from upstream APIs.'
  },
  {
    question: 'Is Manekshaw.Vision affiliated with any government or defense agency?',
    answer:
      'No. Manekshaw.Vision is an independent, non-commercial open-source research initiative. It is not affiliated with, endorsed by, or operated on behalf of any government, armed forces, or defense agency.'
  }
];

export const getSiteJsonLd = () => {
  const activeSocialUrls = getActiveSocialLinks().map((s) => s.url);
  const teamSameAs = Array.from(new Set(['https://github.com/Astra-Dynamics', ...activeSocialUrls]));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_CONFIG.siteUrl}/#website`,
        'url': SITE_CONFIG.siteUrl,
        'name': SITE_CONFIG.name,
        'alternateName': SITE_CONFIG.shortName,
        'description': SITE_CONFIG.description,
        'inLanguage': 'en-US',
        'publisher': {
          '@id': `${SITE_CONFIG.siteUrl}/#organization`
        }
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_CONFIG.siteUrl}/#organization`,
        'name': SITE_CONFIG.name,
        'url': SITE_CONFIG.siteUrl,
        'logo': `${SITE_CONFIG.siteUrl}/logo.jpg`,
        'description': 'Sovereign defense intelligence and geopolitical monitoring initiative.',
        'creator': {
          '@id': `${SITE_CONFIG.siteUrl}/#team`
        },
        'publisher': {
          '@id': `${SITE_CONFIG.siteUrl}/#team`
        },
        ...(activeSocialUrls.length > 0 ? { 'sameAs': activeSocialUrls } : {})
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_CONFIG.siteUrl}/#team`,
        'name': SITE_CONFIG.team.name,
        'url': `${SITE_CONFIG.siteUrl}/about`,
        'description': SITE_CONFIG.team.description,
        'sameAs': teamSameAs
      },
      {
        '@type': 'WebApplication',
        '@id': `${SITE_CONFIG.siteUrl}/#webapp`,
        'name': `${SITE_CONFIG.name} Dashboard`,
        'url': `${SITE_CONFIG.siteUrl}/dashboard`,
        'applicationCategory': 'SecurityApplication',
        'operatingSystem': 'Web',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'author': {
          '@id': `${SITE_CONFIG.siteUrl}/#team`
        }
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_CONFIG.siteUrl}/#faq`,
        'mainEntity': FAQ_DATA.map((item) => ({
          '@type': 'Question',
          'name': item.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': item.answer
          }
        }))
      }
    ]
  };
};
