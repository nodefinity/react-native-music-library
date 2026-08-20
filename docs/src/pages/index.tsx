import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Translate, { translate } from '@docusaurus/Translate';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          <Translate id="home.hero.title">
            React Native Local Music Library for Android &amp; iOS
          </Translate>
        </Heading>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
          <Translate id="home.hero.subtitle">
            Access on-device tracks, albums, artists, artwork, lyrics, and audio
            metadata through one typed API.
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started"
          >
            <Translate id="home.hero.mainButton">Getting Started</Translate>
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/api"
          >
            <Translate id="home.hero.apiButton">API Reference</Translate>
          </Link>
        </div>
        <div className={styles.installCommand}>
          <span className={styles.installLabel}>
            <Translate id="home.hero.installLabel">Install</Translate>
          </span>
          <code>npm install @nodefinity/react-native-music-library</code>
        </div>
      </div>
    </header>
  );
}

function QuickStart() {
  return (
    <section className={styles.quickStart}>
      <div className={clsx('container', styles.quickStartContainer)}>
        <Heading as="h2">
          <Translate id="home.quickStart.title">
            Query the local music library in minutes
          </Translate>
        </Heading>
        <p>
          <Translate id="home.quickStart.description">
            Retrieve tracks with cursor pagination, then load detailed metadata
            only when you need it.
          </Translate>
        </p>
        <pre className={styles.codeBlock}>
          <code>{`import {
  getTracksAsync,
  getTrackMetadataAsync,
} from '@nodefinity/react-native-music-library';

const page = await getTracksAsync({ first: 20 });
const metadata = await getTrackMetadataAsync(page.items[0].id);`}</code>
        </pre>
        <Link className="button button--primary" to="/docs/getting-started">
          <Translate id="home.quickStart.link">Read the setup guide</Translate>
        </Link>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title={translate({
        id: 'home.meta.title',
        message: 'Local Music Library for Android & iOS',
        description: 'SEO title for the homepage',
      })}
      description={translate({
        id: 'home.meta.description',
        message:
          'Access on-device tracks, albums, artists, artwork, lyrics, and audio metadata in React Native via Android MediaStore and iOS MediaPlayer.',
        description: 'SEO description for the homepage',
      })}
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <QuickStart />
      </main>
    </Layout>
  );
}
