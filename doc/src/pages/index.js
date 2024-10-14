import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Intro from '../../docs/Introduction.md';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        
        <Heading as="h1" className="hero__title">
          <div style={{ alignItems: "center" }}>
            <img src={useBaseUrl('/img/logo.png')} alt="Logo" style={{ marginRight: "5px" }} />
            <br/>
            Welcome to {siteConfig.title}!
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
        paddingLeft: "25%",
        paddingRight: "25%",
        paddingTop: "60px",
        paddingBottom: "60px"
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