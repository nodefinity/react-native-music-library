import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      id: 'home.features.android.title',
      message: 'Android MediaStore',
      description: 'Android feature title on the homepage',
    }),
    icon: '🤖',
    description: (
      <Translate id="home.features.android.description">
        Query local tracks, albums, and artists through Android MediaStore, with
        sorting and directory filtering.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'home.features.ios.title',
      message: 'iOS Music Library',
      description: 'iOS feature title on the homepage',
    }),
    icon: '🍎',
    description: (
      <Translate id="home.features.ios.description">
        Access the user&apos;s Music Library through MediaPlayer and
        MPMediaQuery using the same JavaScript API.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'home.features.metadata.title',
      message: 'Track Metadata',
      description: 'Track metadata feature title on the homepage',
    }),
    icon: '🎵',
    description: (
      <Translate id="home.features.metadata.description">
        Read bitrate, sample rate, channels, format, genre, composer, and other
        library or embedded metadata.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'home.features.artwork.title',
      message: 'Artwork & Lyrics',
      description: 'Artwork and lyrics feature title on the homepage',
    }),
    icon: '🎨',
    description: (
      <Translate id="home.features.artwork.description">
        Display artwork references and retrieve lyrics exposed by the Local
        Music Library or embedded in a track.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'home.features.pagination.title',
      message: 'Cursor Pagination',
      description: 'Pagination feature title on the homepage',
    }),
    icon: '📄',
    description: (
      <Translate id="home.features.pagination.description">
        Load large libraries efficiently with typed cursors, configurable page
        sizes, and flexible sorting.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'home.features.architecture.title',
      message: 'React Native New Architecture',
      description: 'New Architecture feature title on the homepage',
    }),
    icon: '⚛️',
    description: (
      <Translate id="home.features.architecture.description">
        Built with TurboModules and TypeScript for a native, type-safe React
        Native integration.
      </Translate>
    ),
  },
];

function Feature({ title, icon, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.featureColumn)}>
      <article className={styles.featureCard}>
        <span className={styles.featureIcon} aria-hidden="true">
          {icon}
        </span>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </article>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.intro}>
          <Heading as="h2">
            <Translate id="home.features.sectionTitle">
              One API for the local music library on Android and iOS
            </Translate>
          </Heading>
          <p>
            <Translate id="home.features.sectionDescription">
              Build local music browsers and players with direct access to
              tracks, albums, artists, artwork, lyrics, and detailed audio
              metadata.
            </Translate>
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
