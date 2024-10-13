import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Intro from '../../docs/Introduction.md';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        
        <Heading as="h1" className="hero__title">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="../../static/img/logo.png" alt="Logo" style={{ marginRight: "5px" }} />
            <span>Welcome to {siteConfig.title}!</span>
          </div>
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello to PapyriAR`}>
      <HomepageHeader />
      <main style={{
        paddingLeft: "20%",
        paddingRight: "20%",
        paddingTop: "50px"
      }}>
       <Intro />
      </main>
    </Layout>
  );
}
/* <h2>What is PapyriAR?</h2>
gsdgsgdsggasdgdggasdgsdgadfgasdfassgadgadgadfgasgageetdfasdgfagadgfadggagfasf

<h2>Why is PapyriAR?</h2>


<h2>What is PapyriAR?</h2> */