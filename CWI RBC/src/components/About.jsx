import Hero from './Hero.jsx';
// Styles object containing all component-specific styles
const styles = {
  section: {
    // Add any section-specific styles here if needed
  },
  
  header: {
    backgroundColor: '#193565',
    padding: '3rem',
    fontFamily: 'inherit',
    color: '#fff',
    textAlign: 'center',
    boxShadow: 'black 0px 0px 10px -1px',
    margin: 0
  },
  
  headerTitle: {
    fontFamily: 'inherit',
    fontWeight: 500,
    fontSize: '2.5rem',
    margin: 0
  },
  
  headerParagraph: {
    fontFamily: 'inherit',
    fontSize: '1.25rem',
    lineHeight: 1.6,
    maxWidth: '800px',
    margin: '2rem auto 0 auto',
    padding: '0 1rem'
  },
  
  textContainer: {
    fontFamily: 'inherit',
    backgroundColor: '#fff',
    color: '#000',
    padding: '3rem',
    boxShadow: 'black 0px 0px 10px -1px',
    margin: 0
  },
  
  textParagraph: {
    fontFamily: 'inherit',
    fontSize: '1.25rem',
    lineHeight: 1.6,
    maxWidth: '800px',
    margin: '2rem auto 0 auto',
    padding: '0 1rem'
  }
};

export default function AboutSection() {
  return (
    <section style={styles.section}>
      <Hero />
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>About CWI</h2>
        <p style={styles.headerParagraph}>The California Water Institute is separated into three divisions: The Center for Irrigation Technology (CIT), The Water, Energy and Technology Center (WET), and the Division of Research & Education.</p>
      </div>
      <div style={styles.textContainer}>
        <p style={styles.textParagraph}>Water is the basis of life and human society. It flows across countless industries and impacts every household. In California, particularly in the San Joaquin Valley, water management remains a significant challenge as the region must overcome challenges related to climate change, population growth and the increased demand on finite water resources. The California Water Institute focuses on all aspects of sustainable water resource management solutions through outreach, entrepreneurship, education, testing, and interdisciplinary research.</p>
        <p style={styles.textParagraph}>Through hands-on learning and research opportunities fostered by the Institute, students are prepared to enter the workforce as well-trained graduates. At the same time, water stakeholders are an important resource to help CWI and Fresno State develop the next generation of professionals through our partnerships. CWI’s collaborative and comprehensive approach to water management solutions is a prime example of what we can accomplish when the University and the community work together to address and solve current and future water issues. Together, we can shape the future of sustainable water resource management and successfully overcome the challenges that lie ahead.</p>
        <p style={styles.textParagraph}>CWI provides all stakeholders with convenient access to Fresno State’s extensive water research and development programs and services. The institute positions Fresno State as a leader in water research and sustainability by engaging the campus community and academic experts from all disciplines to address the most challenging water issues of our time.</p>
      </div>
    </section>
  )
}