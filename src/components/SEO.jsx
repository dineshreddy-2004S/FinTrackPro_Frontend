import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'FinTrack Pro | Institutional Wealth Hub',
  description = 'Real-time Indian stock tracking, analytics, and tax estimations.',
  canonicalUrl = 'https://fintrackpro.vercel.app',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;