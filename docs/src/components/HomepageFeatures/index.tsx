import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      id: 'home.features.easyToUse.title',
      message: 'Easy to use',
      description: 'The title of the first feature on the homepage',
    }),
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <Translate id="home.features.easyToUse.description">
        Designed for simplicity and ease of use, allowing you to quickly
        integrate into your project and start accessing local music files.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'home.features.powerful.title',
      message: 'Powerful',
      description: 'The title of the second feature on the homepage',
    }),
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <Translate id="home.features.powerful.description">
        Provide a complete media library and music metadata access function,
        allowing you to focus on building excellent music application
        experiences.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'home.features.reactNative.title',
      message: 'Based on React Native',
      description: 'The title of the third feature on the homepage',
    }),
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <Translate id="home.features.reactNative.description">
        Providing native performance and seamless integration experience while
        maintaining cross platform compatibility.
      </Translate>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
