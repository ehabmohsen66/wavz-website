/**
 * WAVZ i18n translations
 * ----------------------
 * Add new keys here in BOTH `en` and `ar` blocks.
 * Use `useLang()` hook in components to access current language strings.
 *
 * Brand name "WAVZ" is always Latin in both languages (do not transliterate).
 * Arabic uses formal Modern Standard Arabic (فصحى), enterprise-appropriate tone.
 */

export const translations = {
  en: {
    nav: {
      platform: 'Solutions',
      product: 'Industries',
      solutions: 'Partners',
      resources: 'Newsroom',
      pricing: 'About',
      cta: 'Get a Consultation',
    },
    hero: {
      tagline: 'The turn-key platform for enterprise digital transformation.',
      tagline2: 'Supports Multi-Industry, Multi-Service, Multi-Geography Delivery.',
      product1: 'IT Managed Services',
      productAccent: '& Solutions',
      product2: 'Revolutionize your enterprise operations, drive innovation, and achieve unprecedented success with',
      brand: 'WAVZ for Digital Transformation',
      lede1: 'SAP-grade ERP joins Temenos-grade banking, on YOUR infrastructure. ',
      ledeAccent1: 'Multi-Industry',
      lede2: ' delivery that scales every operation. ',
      ledeAccent2: 'Multi-Service',
      lede3: ' orchestration past 99.9% SLA. ',
      ledeAccent3: 'Multi-Geography',
      lede4: ' coverage across MEA, one team, one accountable lead.',
      cta1: 'Get a Consultation',
      cta2: 'Calculate Your Savings',
      diagramSource: 'Client Workloads',
      diagramOrch: 'WAVZ Orchestrator',
      diagramOrchSub: '24/7 SOC + NOC',
      diagramRack1: 'SAP',
      diagramRack2: 'Data and AI',
      diagramRack3: 'Oracle',
      diagramCloud: 'Hybrid Cloud',
    },
    offering: {
      eyebrow: 'OFFERING',
      title: 'What We Deliver',
      lede: 'Strategy feeds architecture. Architecture feeds operations. Operations close the loop. Loop closes daily.',
      learnMore: 'Learn more',
      stats: {
        years: 'Years in MEA',
        clients: 'Enterprise clients',
        industries: 'Industries served',
      },
      pills: ['Roadmap Design', 'Risk Architecture', 'Budget Validation', 'Executive Briefing'],
      cards: [
        {
          name: 'StrategicAdvisory',
          tag: 'CONSULTING',
          tagType: 'green',
          desc: 'Real-world transformation roadmaps from MEA banking, postal, and government engagements. The advisory practice that informs every implementation.',
        },
        {
          name: 'WAVZSimulator',
          tag: 'PROPRIETARY',
          tagType: 'yellow',
          desc: 'Models implementation paths, resource placement, and risk strategies. Predicts programme bottlenecks a quarter ahead. Drives delivery.',
        },
        {
          name: 'MultiOperations',
          tag: 'PROPRIETARY',
          tagType: 'yellow',
          desc: "The runtime that's multi-industry, multi-service, multi-geography. SLA-aware routing, escalation/recovery, capacity-autoscaling, self-healing — one pipeline.",
        },
      ],
    },
    benchmark: {
      pill1: 'LIVE & ENTERPRISE-GRADE',
      pill2: 'BY WAVZ',
      title1: 'Operations',
      title2: 'Center',
      subtitle: 'The 24/7 operations backbone for enterprises under critical workloads.',
      desc1Strong: 'The operating practice:',
      desc1: ' Real recorded delivery patterns — multiple industries, platforms, and SLAs — across hundreds of mission-critical workloads. Automated playbooks against your environment across providers and stack types.',
      desc2Strong: "WAVZ's platform:",
      desc2: ' Enterprise teams already use our SOC/NOC operating model to optimize uptime and incident response for frontier banking. With WAVZ, that same power works across your entire estate — any provider, any platform mix, any demand pattern.',
      tagline: "WAVZ optimizes your operations — whether you're transforming, operating, or both.",
      cta1: 'Explore OperationsCenter',
      cta2: 'See It On Your Workloads',
      command: '$ wavz consult --industry=banking',
      measures: 'WHAT IT MEASURES',
      metrics: [
        { code: 'MTTR', label: 'Mean Time to Restore' },
        { code: 'SLA', label: 'Service Level Achievement' },
        { code: 'FCR', label: 'First-Call Resolution' },
        { code: 'CSAT', label: 'Customer Satisfaction' },
        { code: 'Uptime', label: 'Platform Availability' },
      ],
    },
    platform: {
      eyebrow: 'PLATFORM',
      title1: 'The Discipline',
      titleAccent: 'Behind',
      title2: 'the Difference',
      lede: 'Three axes of complexity, solved together: industries served, services delivered, geographies covered — in one operating model.',
      cards: [
        {
          title: 'WAVZ Simulator',
          accent: 'Simulator',
          desc: 'A consulting exploration loop over the transformation roadmap. The simulator finds implementation paths, resource placement, and sequencing humans never would — and predicts SLA breaches a quarter before they happen. Predictive, not reactive.',
        },
        {
          title: 'Multi-Industry Intelligent Delivery',
          accent: 'Intelligent',
          desc: 'Many sectors, many clients, many SLAs — sharing the same expert pool without trampling each other. KPI-aware, risk-aware, SLA-driven scheduling that tunes every engagement. This alone delivers 60% lower cost per managed service.',
        },
        {
          title: 'Heterogeneous Stack Mastery',
          accent: 'Mastery',
          desc: 'Any platform. Multi-vendor across all of them. SAP, Temenos, Tietoevry, Teradata — any architecture within the same delivery pipeline. 99.9% uptime.',
        },
        {
          title: 'SLA-Driven Autoscaling',
          accent: 'Autoscaling',
          desc: 'Define your targets — uptime, response time or cost. WAVZ enforces them. If MTTR drifts — escalation triggers instantly. If load drops — capacity rebalances within the hour.',
        },
        {
          title: 'Lowest Cost Per Service Hour',
          accent: 'Hour',
          desc: 'Dynamic resource allocation eliminates wasted billable hours. Multi-site delivery cuts mobilization time. Multi-shore arbitrage routes to the most capable available team.',
        },
      ],
      learnMore: 'Learn more',
    },
    architecture: {
      eyebrow: 'ARCHITECTURE',
      title: 'Strategy/Operations Disaggregation — The Enterprise Advantage',
      desc1: 'Enterprise transformation is not one workload. Strategy is consulting-bound — high-context, expert-led, brief-friendly, loves senior judgement. Operations is process-bound — repeatable, SLA-sensitive, loves disciplined execution and good tooling.',
      desc2: 'No single team is optimal for both. WAVZ disaggregates them across function — senior consultants for strategy, operating teams for execution — in the same delivery pipeline, under one SLA, managed by one accountable lead.',
      tagline: 'Heterogeneous expertise, finally working.',
      step1: 'Client Brief',
      step2: 'WAVZ',
      step2sub: 'MultiOperations',
      phase1: 'Strategy Phase',
      phase1Brand: 'SAP+Temenos',
      phase1desc: 'Consulting-bound · Expert-led',
      phase2: 'Operations Phase',
      phase2Brand: 'SOC+NOC+AMS',
      phase2desc: 'SLA-bound · 24/7 execution',
      result: 'Single Outcome, One SLA',
      finalLine: "This combination has delivered results we didn't think were possible.",
      cta: 'See How It Works',
    },
    results: {
      eyebrow: 'RESULTS',
      title: 'What Enterprises Building at Scale Say',
      featured: {
        value: '100',
        suffix: '%',
        title: 'Workforce Growth Gain',
        sub: 'WAVZ — scaled to 1,300 specialists across MEA in 2 years',
      },
      stats: [
        { value: '2', suffix: 'X', label: 'Revenue Growth', sub: 'Doubled in 2023 across MEA expansion' },
        { value: '99.9', suffix: '%', label: 'SLA Achievement', sub: 'Across managed services portfolio' },
        { value: '60', suffix: '%', label: 'Lower TCO', sub: 'vs in-house operations, same scope' },
        { value: '15', suffix: '+', label: 'Enterprise Clients', sub: 'Banks, ministries, postal authorities' },
        { value: '5', suffix: 'X', label: 'ROI', sub: 'On digital transformation programmes' },
      ],
      quotes: [
        {
          text: 'WAVZ has enabled us to better manage our business and focus on our core mission, which is reaching out to more women in Egypt and providing them with early detection and treatment.',
          author: 'Eng. Jilan Felfela',
          role: 'Member of the Board of Trustees, Baheya Foundation',
        },
        {
          text: 'We believe our partnership with WAVZ is a cornerstone towards the provision of advisory and operating services as needed by Port-Said SC-Zone.',
          author: 'Marwan Tag',
          role: 'IT General Manager, SC-Zone',
        },
        {
          text: 'Our partnership with WAVZ brings new opportunities for growth and digital transformation in the region. Exceptional resources, expertise, and well-trained personnel who understand the local culture.',
          author: 'Edgars Bīberis',
          role: 'Regional Director, Tietoevry',
        },
      ],
    },
    ecosystem: {
      eyebrow: 'ECOSYSTEM',
      title: 'Built for the Stack You Already Use',
      lede: 'WAVZ works on any platform, cloud and major framework. Multi-vendor, multi-cloud, multi-geography. No rewrites. No lock-in.',
      featured: 'Featured',
      featuredDesc: 'Heterogeneous SAP + Temenos delivery for banking transformation',
      providers: 'Platform Partners',
      cloud: '15+ Enterprise Clients',
      tools: 'Industry Frameworks',
    },
    comparison: {
      eyebrow: 'COMPARISON',
      title: 'A Category of One',
      subtitle: 'WAVZ vs. the alternatives, including Big-4 consultants. No comparison.',
      headers: ['Capability', 'WAVZ', 'In-House', 'Generic IT', 'Big-4', 'Offshore', 'Niche Vendor'],
      rows: [
        '24/7 Operations Center (CCC + SOC + NOC)',
        'Multi-Industry Delivery',
        'Multi-Platform Mastery (SAP + Temenos + Tietoevry)',
        'Strategic Consulting + Execution',
        'SLA-Based Accountability',
        'Local MEA Cultural Expertise',
        'KPI-Aware + Risk-Aware Delivery',
        'Automatic Workload Profiling',
        'Cost Per Service Hour Optimization',
        'Multi-Cloud + On-Prem Unified',
      ],
      capabilities: [
        [true, false, false, false, false, false],
        [true, false, false, true, false, false],
        [true, false, false, false, false, true],
        [true, false, false, true, false, false],
        [true, false, true, false, true, false],
        [true, true, false, false, false, false],
        [true, false, false, true, false, false],
        [true, false, false, false, false, false],
        [true, false, true, false, true, false],
        [true, false, false, false, false, false],
      ],
    },
    cta: {
      title: 'Ready to transform your enterprise?',
      desc: 'See how WAVZ can cut your operations cost by 60% and eliminate digital transformation complexity.',
      btn1: 'Get a Consultation',
      btn2: 'Calculate Your Savings',
    },
    footer: {
      address: 'Maadi Technology Park, Block MB3, Building B2, Cairo, Egypt',
      phone: '+20 2 2120 1430',
      contact: 'Contact Us',
      cols: [
        { title: 'Solutions', links: ['Managed Services', 'Oracle Technology Solutions', 'SAP Solutions & Services', 'Data & AI Solutions'] },
        { title: 'Industries', links: ['Banking & Finance', 'Postal Authorities', 'Government', 'Enterprise', 'Telecom'] },
        { title: 'Company', links: ['About WAVZ', 'Our Journey', 'Board of Directors', 'Executive Team', 'Our Partners'] },
        { title: 'Resources', links: ['Newsroom', 'Blog', 'Insights', 'Careers', 'Contact'] },
      ],
      copy: '© 2026 WAVZ for Digital Transformation. All rights reserved.',
      privacy: 'Privacy',
      terms: 'Terms',
    },
    about: {
      tagline: 'We are a technology transformation company built to solve the hardest enterprise challenges — across sectors, across borders, across platforms.',
      introLine1: 'WAVZ for Digital Transformation is a leading technology company delivering SAP, fintech, payment platforms, cybersecurity, and managed services across the Middle East and Africa.',
      introLine2: 'Founded with a mission to bridge the gap between world-class technology and regional market expertise, WAVZ has grown to serve governments, banks, and enterprises across the MEA region.',
      visionTitle: 'VISION',
      visionText: 'To become the region’s trusted visionary partner, enabling organizations to grow, innovate, and evolve with confidence.',
      missionTitle: 'MISSION',
      missionText: 'We empower organizations with an innovative portfolio of advisory and operational services, combining delivery excellence and partnerships to ensure resilient and sustainable growth.',
      purposeBadge: 'OUR PURPOSE',
      strategyTitle: 'Our Strategy',
      strategySubtitle: 'Six pillars that define how we think, work, and deliver value for our clients.',
      strategyPillars: [
        { title: 'Technology Leadership', desc: 'Leveraging the most advanced platforms — SAP, Temenos, Tietoevry, Teradata — to deliver real transformation, not just implementation.' },
        { title: 'Cybersecurity First', desc: 'Every solution we deliver is built with security at its core. We partner with world leaders like Nevis to protect our clients\' most critical assets.' },
        { title: 'Regional Expertise', desc: 'Deep understanding of MEA markets, regulations, and cultures allows us to deliver solutions that truly fit local needs.' },
        { title: 'Innovation Culture', desc: 'We invest in R&D, AI integration, and emerging technologies to ensure our clients always stay ahead of the curve.' },
        { title: 'Partnership Model', desc: 'We believe the best outcomes come from true collaboration — with clients, technology partners, and our own talented team.' },
        { title: 'People-First Approach', desc: 'Our most important asset is our 1,300+ experts. We invest deeply in training, development, and a culture of excellence.' },
      ],
      storyTitle: 'Our Story',
      storySubtitle: 'From a bold idea to a regional technology leader — this is the WAVZ journey.',
      storyMilestones: [
        { year: '2008', title: 'Founded', desc: 'Inception and inauguration of WAVZ’s first project (SAP ERP)' },
        { year: '2014', title: 'SAP Implementation EGYPT POST', desc: 'Day-to-Day operation technical support, FI/CO, inventory, purchasing, payroll & personnel' },
        { year: '2016', title: 'Call Center Resource Augmentation', desc: 'Supporting customer services centers with all the required resources augmentation.' },
        { year: '2017', title: 'Egypt Post Digital Transformation', desc: 'E-postal & E-logistics application resource augmentation, SAP marketplace, postal portal' },
        { year: '2018', title: 'Services Expansion', desc: 'Introduced E-payment, E-counter and E-signature solutions' },
        { year: '2020', title: 'Digital Payments Solutions Expansions', desc: 'Inaugurated the issuing Meeza cards & Visa NFC issuing implementations' },
        { year: '2022', title: 'Services Expansion', desc: 'Introduced core financial & integrated transactions solutions' },
        { year: '2023', title: 'Regional Expansion', desc: 'Began expanding in regional African and Middle Eastern markets through innovative SAP and financial solutions' },
      ],
      whyTitle: 'Why We Exist',
      whyText: 'Enterprise transformation in the MEA region has always been harder than it needs to be — fragmented vendors, cultural gaps, and a lack of local expertise. We built WAVZ to change that. To be the one partner that delivers both the strategy and the execution, under one roof, with one accountable team.',
      valuesTitle: 'Our Core Values',
      valuesSubtitle: 'The principles that guide every decision, every project, and every interaction at WAVZ.',
      values: [
        { name: 'Candor', desc: 'We believe in radical honesty — with our clients, our partners, and ourselves. No surprises, no spin.' },
        { name: 'Integrity', desc: 'We do what we say, every time. Our reputation is built on a consistent record of delivery and accountability.' },
        { name: 'Respect', desc: 'Every person — client, partner, or team member — deserves dignity, consideration, and genuine engagement.' },
        { name: 'Customer Focus', desc: 'Our clients\' success is our only measure of success. We obsess over outcomes, not outputs.' },
        { name: 'Sense of Ownership', desc: 'We take personal responsibility for results. Every team member acts like an owner of the outcome.' },
        { name: 'One Team, One Goal', desc: 'Despite our scale, we operate as a single unified team — all pulling in the same direction for the same goal.' },
      ],
    },
    journey: {
      tagline: 'From a bold startup to a regional technology leader — explore the milestones that shaped WAVZ.',
      steps: [
        { year: '2008', title: 'Founded', items: ['Inception and inauguration of WAVZ’s first project (SAP ERP)'] },
        { year: '2014', title: 'SAP Implementation EGYPT POST', items: ['Day-to-Day operation technical support', 'FI/CO, inventory, purchasing, payroll & personnel'] },
        { year: '2016', title: 'Call Center Resource Augmentation', items: ['Supporting customer services centers with all the required resources augmentation.'] },
        { year: '2017', title: 'Egypt Post Digital Transformation', items: ['E-postal & E-logistics application resource augmentation', 'SAP marketplace, postal portal'] },
        { year: '2018', title: 'Services Expansion', items: ['Introduced E-payment', 'E-counter and E-signature solutions'] },
        { year: '2020', title: 'Digital Payments Solutions Expansions', items: ['Inaugurated the issuing Meeza cards & Visa NFC issuing implementations'] },
        { year: '2022', title: 'Services Expansion', items: ['Introduced core financial & integrated transactions solutions'] },
        { year: '2023', title: 'Regional Expansion', items: ['Began expanding in regional African and Middle Eastern markets through innovative SAP and financial solutions'] },
      ],
    },
    news: {

      eyebrow: 'PRESS ROOM',
      title1: 'WAVZ',
      titleAccent: 'News & Updates',
      lede: 'The latest partnerships, milestones, and insights from WAVZ for Digital Transformation.',
      filterAll: 'All',
      filterAnnouncements: 'Partnerships',
      filterInsights: 'Insights',
      filterEvents: 'Events',
      backToNews: 'Back to News',
      readArticle: 'Read Article',
      seeMore: 'View All News',
      categories: {
        announcement: 'Partnership',
        insight: 'Insight',
        event: 'Event',
      },
      items: [
        {
          id: 'mbme-partnership',
          content: `Cairo, January 22, 2025 – WAVZ for Digital Transformation, a leading Egyptian provider of digital solutions and related services across the Middle East and Africa, and MBME Group PJSC, a prominent technology solutions and digital transformation leader, today announced a significant Memorandum of Understanding (MoU). This strategic partnership aims to leverage the combined strengths of both organizations to deliver cutting-edge technological solutions and digital services that accelerate digital transformation across the region.

The MoU signing ceremony took place in Abu Dhabi, attended by Eng. Amr Esmat, Managing Director and CEO of WAVZ, and Mr. Abdel Hadi Mohamed, Managing Director and CEO of MBME Group. This collaboration will focus on delivering significant added value to customers throughout the Middle East and Africa. By leveraging the combined expertise of both companies, this partnership will empower businesses and governments to achieve their strategic objectives through innovative solutions.

“We are thrilled to embark on this strategic partnership with MBME Group, a leader in technology and digital transformation. This collaboration marks a significant milestone in our journey towards a digitally empowered future for the region. Joining our forces and leveraging our collective strengths, we will deliver innovative solutions that create substantial value for businesses, governments, and end-users within the region.” Eng. Amr Esmat, Managing Director and CEO of WAVZ

“We are thrilled to embark on this strategic partnership with MBME Group, a leader in technology and digital transformation. This collaboration marks a significant milestone in our journey towards a digitally empowered future for the region. Joining our forces and leveraging our collective strengths, we will deliver innovative solutions that create substantial value for businesses, governments, and end-users within the region.”

“We signed a Memorandum of Understanding (MoU) with MBME Group PJSC, a prominent technology solutions and digital transformation leader”

“This collaboration marks a significant milestone in our journey towards a digitally empowered future for the region.”

Amr Esmat, CEO and Managing Director of WAVZ

“This partnership reflects our commitment to delivering innovative and transformative solutions to clients within the MEA region. The expertise brought by WAVZ complements MBME’s capabilities, and together we aspire to elevate the standards in secure payments and digital transformation.” Mr. Abdel Hadi Mohamed, Managing Director and CEO of MBME Group

“This partnership reflects our commitment to delivering innovative and transformative solutions to clients within the MEA region. The expertise brought by WAVZ complements MBME’s capabilities, and together we aspire to elevate the standards in secure payments and digital transformation.”

Baheya Foundation is the leading foundation in Egypt specializing in early detection and treatment of breast cancer. The foundation provides its services free of charge to women that are fighting Breast Cancer across Egypt. This partnership comes as part of WAVZ’s Corporate Social Responsibility strategy to support community projects and initiatives, and their commitment to contributing to achieving sustainable development in Egypt.

WAVZ for Digital Transformation is a leading provider of renowned business solutions and digital services, dedicated to delivering transformative and tailored solutions that enhance operational efficiency and elevate customer engagement. By combining innovation with deep industry expertise, WAVZ empowers its clients to focus on their core business goals and aspirations. WAVZ assumes responsibility for fulfilling all technological needs through its comprehensive service portfolio, allowing clients to concentrate on their core business objectives.

MBME Group P.J.S.C. operates as the largest technology service provider in the UAE, facilitating government, semi-government, and private services. The Group specializes in cutting-edge technology, digital services, product management, and strategic technology investments, with an integrated fintech ecosystem that includes MBME Pay, MBME Wow Pay, and MBME Investment. As a UAE company, its local expertise ensures solutions are tailored to regional needs, with more than 770 in-house built APIs and over 4000 smart touchpoints across the UAE, the Group serves over 3.2 million customers, making MBME a reliable partner in the UAE’s fintech innovation and payment services industry.`,
          category: 'announcement',
          date: 'Jan 31, 2025',
          readTime: '4 min read',
          image: '/news/mbme.jpg',
          title: 'WAVZ and MBME Group Forge Strategic Partnership to Drive Digital Transformation',
          excerpt: 'WAVZ for Digital Transformation and MBME Group PJSC announced a strategic partnership to accelerate digital transformation across the Middle East and Africa.',
          url: 'https://wavz.com.eg/news/wavz-and-mbme-group-forge-strategic-partnership-to-drive-digital-transformation-across-the-middle-east-and-africa/',
        },
        {
          id: 'baheya-foundation',
          content: `Cairo, September 23, 2024, WAVZ for Digital Transformation, the leading Egyptian company in providing digital solutions in the Middle East and Africa, a subsidiary of PFI (Post for Investment Company), announced that they have signed a cooperation protocol with Baheya Foundation, the leading charity foundation for early detection and treatment of breast cancer, with the aim of providing comprehensive support and development for SAP ERP solution, which will help Baheya better manage their Finance and administration operations. This cooperation comes within the framework of WAVZ’s commitment to their social responsibility towards the Egyptian society, as it was agreed to provide these services out of WAVZ’s belief in the importance of supporting charitable foundations and hospitals that provide vital services to large segments of the Egyptian society.

“We at WAVZ believe in the importance of providing support to foundations that work to improve the lives of the Egyptian people. Baheya Foundation plays a pivotal role in breast cancer treatment in Egypt. We believe that by providing our SAP support and development services to Baheya, we contribute to improving the efficiency of their operations, which will enable their medical and administration staff to focus on what really matters – providing the best patient care.” Eng. Amr Esmat, Managing Director and CEO of WAVZ

“We at WAVZ believe in the importance of providing support to foundations that work to improve the lives of the Egyptian people. Baheya Foundation plays a pivotal role in breast cancer treatment in Egypt. We believe that by providing our SAP support and development services to Baheya, we contribute to improving the efficiency of their operations, which will enable their medical and administration staff to focus on what really matters – providing the best patient care.”

“We signed a cooperation protocol with Baheya Foundation, the leading charity foundation for early detection and treatment of breast cancer,”

“This cooperation comes within the framework of WAVZ’s commitment to their social responsibility towards the Egyptian society”

Amr Esmat, CEO and Managing Director of WAVZ

“We are pleased to sign this protocol with WAVZ, which reflects their commitment to supporting the community and public health issues. This support will help enable Baheya Foundation to manage our business better and focus on our core mission which is reaching out to more women in Egypt and providing them with early detection and treatment of breast cancer.” Eng. Jilan Felfela, Member of the Board of Trustees of the Baheya Foundation and Head of the Innovation and Technology Committee

“We are pleased to sign this protocol with WAVZ, which reflects their commitment to supporting the community and public health issues. This support will help enable Baheya Foundation to manage our business better and focus on our core mission which is reaching out to more women in Egypt and providing them with early detection and treatment of breast cancer.”

Baheya Foundation is the leading foundation in Egypt specializing in early detection and treatment of breast cancer. The foundation provides its services free of charge to women that are fighting Breast Cancer across Egypt. This partnership comes as part of WAVZ’s Corporate Social Responsibility strategy to support community projects and initiatives, and their commitment to contributing to achieving sustainable development in Egypt.

WAVZ is a leading provider of digital transformation solutions, specializing in assisting organizations across various industries in optimizing their operations, leveraging emerging technologies, and enhancing customer experience. With a track record of successful implementations, We are committed to delivering innovative solutions that drive tangible business outcomes.

Baheya is a leading non-profit foundation that is founded upon two main principles: sustainability and community partnership. Baheya provides innovative awareness programs specialized in the early detection and treatment of breast cancer while using state-of-the-art technology.`,
          category: 'announcement',
          date: 'Sep 23, 2024',
          readTime: '3 min read',
          image: '/news/baheya.jpg',
          title: 'WAVZ Signs Cooperation Protocol with Baheya Foundation for SAP Support',
          excerpt: "WAVZ for Digital Transformation signed a cooperation protocol with Baheya Foundation to provide SAP support and development services, empowering the foundation's mission.",
          url: 'https://wavz.com.eg/news/wavz-for-digital-transformation-signs-a-cooperation-protocol-with-baheya-foundation-to-provide-sap-support-and-development-services/',
        },
        {
          id: 'teradata-agreement',
          content: `[Cairo, Egypt – September 5, 2024] – WAVZ for Digital Transformation LLC, a prominent Egyptian Information Technology solutions provider, and Teradata announced today a strategic agreement to drive digital transformation and data-driven AI innovation for businesses in Egypt.

Teradata will provide its Vantage data and analytics platform to WAVZ, enabling WAVZ to offer its customers a comprehensive suite of advanced data analytics capabilities, including AI/ML. Through this collaboration, Egyptian enterprises across various sectors will gain access to Teradata’s world-class ClearScape Analytics capabilities, empowering them to unlock valuable insights from their data, implement Trusted AI, and make more informed decisions that deliver business value.

The partnership between WAVZ and Teradata aims to drive innovation within the Egyptian business landscape in the following ways:

Providing access to advanced data analytics capabilities: With access to Teradata Vantage, Egyptian enterprises are expected to be able to unlock insights that power better decision making, faster innovation and accelerated value.

Enabling business growth and competitiveness: Integrating Teradata’s advanced analytics capabilities into WAVZ’s service offerings is intended to deliver better answers and faster results, helping Egyptian enterprises identify new opportunities for growth and gain a competitive edge in their respective industries.

Providing comprehensive services: Through their close collaboration, WAVZ and Teradata will work together to support their shared customers in their digital transformation journeys. This will include offering tailored solutions, implementation services, and ongoing technical assistance to ensure the successful adoption and utilization of the data analytics and AI capabilities.

“Our collaboration with Teradata will significantly enhance our ability to provide tailored, trusted data solutions to our customers. By integrating Teradata’s advanced analytics and AI capabilities into our offerings, we can help Egyptian enterprises unlock new opportunities for growth and gain a competitive edge in their respective industries.” Eng. Amr Esmat, Managing Director and CEO of WAVZ

“Our collaboration with Teradata will significantly enhance our ability to provide tailored, trusted data solutions to our customers. By integrating Teradata’s advanced analytics and AI capabilities into our offerings, we can help Egyptian enterprises unlock new opportunities for growth and gain a competitive edge in their respective industries.”

“WAVZ and Terada announced a strategic agreement to drive digital transformation and data-driven AI innovation for businesses in Egypt.

“This partnership aims to drive innovation within the Egyptian business landscape”

Amr Esmat, CEO and Managing Director of WAVZ

The partnership between WAVZ and Teradata is expected to accelerate the adoption of AI technologies and foster innovation within the Egyptian business landscape. Through this strategic alliance, the two companies will work closely to support their shared customers in their digital transformation journeys and harness the power of their data for AI.

By focusing on the financial and government sectors, the collaboration can play a crucial role in driving innovation within some of the most critical industries in the Egyptian economy. The combination of global expertise and local market knowledge can unlock significant value for these sectors and contribute to the overall economic and societal development of the country.

“At Teradata, we know that people thrive when empowered with trusted information. We are excited to begin working with WAVZ and leverage their expertise in the Egyptian market to bring Teradata’s innovative platform and Trusted AI capabilities to local businesses.” Mr. Khaled Hammouda, Teradata Egypt General Manager

“At Teradata, we know that people thrive when empowered with trusted information. We are excited to begin working with WAVZ and leverage their expertise in the Egyptian market to bring Teradata’s innovative platform and Trusted AI capabilities to local businesses.”

WAVZ is a leading Managed Services Provider and a SAP implementation and consulting firm. The company offers a comprehensive suite of SAP services, including implementation, consulting, and managed services. WAVZ has a proven track record of helping clients to successfully implement and manage SAP solutions. The company’s managed services business model provides clients with the flexibility and scalability that they need to grow their business. For more information, visit https://wavz.com.eg`,
          category: 'announcement',
          date: 'Sep 8, 2024',
          readTime: '4 min read',
          image: '/news/teradata.jpg',
          title: 'WAVZ and Teradata Announce Strategic Agreement for Data Analytics and AI',
          excerpt: 'WAVZ and Teradata announced a strategic agreement to drive digital transformation and data-driven AI innovation for businesses in Egypt and the region.',
          url: 'https://wavz.com.eg/news/wavz-and-teradata-announce-strategic-agreement-to-empower-egyptian-enterprises-with-data-analytics-and-ai/',
        },
        {
          id: 'westport-datacenter',
          content: `WAVZ for Digital Transformation, well known for their suite of Managed IT and Digital Transformation Services, are successfully managing the data center of West Port Said Free Zone as part of the FZ Digital Infrastructure Development Project, in addition to providing the technical support needed for the Citizen Card Project in the same governorate.

Discussions underway to raise capital to meet regional expansion

“National Postal Authority”, “Egypt Trust” and “Deutschland Technology” are examples of our long list of prestigious clients

Amr Esmat, Managing Director and CEO of the company said that they are currently implementing several projects in several sectors including Oil & Gas, Transportation, Professional Services, and Education. He explained that WAVZ aims to focus on providing worldclass solutions and services that rely on integrating artificial intelligence systems, data analysis, and systems that support the decision-making process. Decision, and helping clients meet current and future challenges.

It is noteworthy that the citizen card in Port Said is a unified smart card that was developed in cooperation between the Ministry of Communications and the National Postal Authority, and aims to simplify the procedures for citizens to obtain catering services, comprehensive health insurance, and government payments.

“WAVZ client base includes entities from inside and outside Egypt, like “Egypt Trust” for electronic signature services and information security, as well as, “Deutschland Technology”, an Egyptian company specialized in fire-fighting systems and modern technological solutions in the field of electrical, mechanical and sanitary engineering. This is to name a few.” Amr Esmat, CEO and Managing Director of WAVZ in statements to Al Mal

“WAVZ client base includes entities from inside and outside Egypt, like “Egypt Trust” for electronic signature services and information security, as well as, “Deutschland Technology”, an Egyptian company specialized in fire-fighting systems and modern technological solutions in the field of electrical, mechanical and sanitary engineering. This is to name a few.”

Esmat pointed out that WAVZ have succeeded in increasing their revenues by 100% during the past year, to reach 507 million Egyptian pounds compared to 2022, and it also achieved an increase in its profits by 120%, noting that WAVZ was able, within two years, to double their workforce to reach 1,300 employees.

“Our profits increased by 120% and our revenues doubled in 2023.”

“We doubled our job opportunities within two years to reach 1,300 employees.”

Amr Esmat, CEO and Managing Director of WAVZ

He pointed out that WAVZ provides – but is not limited to – information technology infrastructure management solutions, as well as network and contact center management services, in addition to developing the digital infrastructure for institutions, and modern state of the art digital services in accordance with international worldclass standards. He also pointed out that Artificial Intelligence is no longer a luxury as some may believe, but rather an urgent necessity to develop the competitiveness of institutions to maintain pace with global changes.

He added that WAVZ is also providing services for implementing and managing enterprise resource planning packages (ERP), using SAP solutions, in addition to implementing and managing information infrastructure solutions for financial institutions, including, for example, Temenos core banking application and Tietoevry card management and digital payment solutions, as well as services for implementing and managing digital postal systems, including digital transformation services and electronic payments.

Esmat added that WAVZ strategy during the current year is based on enhancing customers’ confidence in being their preferred solution provider during their digital transformation journey by meeting all their technological needs, indicating that WAVZ has a network of global partners with expertise who are able to provide IT solutions that meet the challenging needs of the Egyptian, Arab and African markets and most importantly, are willing to transfer their expertise to WAVZ local experts.

A new partnership with “Nevis” for cyber security systems and “Saudi Azm”

He noted that the company have expanded their network of global partners to include Nevis for cyber security systems, as well as strengthening its partnership with SAP, Temenos, Tietoevry, and Saudi Azm for Communications and Information Technology. Moreover, they are studying many future cooperation opportunities, with the aim of providing a package of innovative and advanced digital solutions to its customers in various fields and industries, such as the open banking system, which caters for faster and safer transactions anywhere in the world.

Esmat revealed that WAVZ – in cooperation with Tietoevery – have recently organized a workshop that included leaders of the Egyptian banking and financial sectors to discuss the “future vision of payment systems in 2030.” During the workshop, the future vision of local and global trends in payments was discussed, the future of acquisitions for e-commerce and digital transactions, and the extent of the impact of the Corona pandemic on the major transformation in payment. Something that has significantly accelerated such digital transformation including, but not limited to – online shopping and e-commerce.

Esmat said that the workshop has also highlighted the latest global trends that shape the banking ecosystem, including real-time payment systems 24 hours a day, 7 days a week, the ongoing cost pressure due to digitization, geopolitical challenges, and the impact of high borrowing interests, inflation, and the cost of capital on financial institutions. As well as the latest trends and directions of global payment systems.

Esmat continued, WAVZ have installed and implemented the Postal Services Systems in the Democratic Republic of Congo, in addition to other projects with strategic partners in the Saudi market, indicating that the company intends to open branches in few Arab countries during the next stage.

He continued: WAVZ also participated in many local and regional conferences and events, such as the “Seamless Forum” in North Africa, the “LEAP Forum” in Saudi Arabia, and the “African Postal Union Forum,” in addition to global forums held by our global partners. WAVZ are continuously seeking to be participate in various regional forums to present our services and communicate with customers and active partners in various markets and fields.

Esmat ruled out the company’s tendency towards bank borrowing to finance their expansion plans, especially since the growth in their profits provides them with sufficient liquidity to manage and grow their business successfully, revealing that they are looking at increase their capital – through the current stakeholders – to support regional expansions and their efforts to grow and expand their customer base. He added that the company does not plan to carry out acquisition deals of other entities in the near future, but if the need arises for growth, we will do so, in line with our strategic directions.

WAVZ for Digital Transformation is a leading Egyptian company in the field of providing digital information technology solutions and services. With a proven track record of successful implementations across different industries, WAVZ for Digital Transformation is committed to providing innovative solutions that increase efficiency, reduce costs, and leverage instantaneous data insights that facilitate a more informed decision-making process. The company’s managed business model provides clients with the flexibility and scalability that they need to grow their business.`,
          category: 'insight',
          date: 'Jul 4, 2024',
          readTime: '3 min read',
          image: '/news/westport.jpg',
          title: 'WAVZ Managing the Data Center of West Port Said Free Zone',
          excerpt: 'WAVZ for Digital Transformation is successfully managing the data center of West Port Said Free Zone as part of the FZ Digital Infrastructure Development Project.',
          url: 'https://wavz.com.eg/news/wavz-is-successfully-managing-the-data-center-of-west-port-said-free-zone-as-part-of-the-fz-digital-infrastructure-development-project/',
        },
        {
          id: 'tietoevry-2030',
          content: `Cairo – June 2024, WAVZ for Digital Transformation, a leading Egyptian provider of digital solutions and related services in the Middle East and Africa, hosted an inspiring workshop titled “Envisioning the Future of Payments” at the prestigious St. Regis Hotel. The event brought together prominent figures from the banking and financial sector, alongside experts from WAVZ and their strategic partner in digital payment systems, Tietoevry.

The workshop delved into the transformative power of digitalization on payments, exploring how local and global trends are shaping the future of e-commerce, real-time transactions, and the overall customer experience. Discussions highlighted the impact of the COVID-19 pandemic in accelerating this shift, with online shopping rates experiencing a significant surge.

Key global trends shaping the future of banking were explored, including the rise of 24/7 real-time payments, ongoing digitization pressures, fragmented digital ecosystems, the growing need for seamless customer experiences, e-commerce and trade digitization, evolving regulations, geopolitical challenges, and the impact of economic factors – like rising interest rates and inflation – on financial institutions.

Adding an exciting dimension to the event, WAVZ announced a pivotal expansion of their partnership with Tietoevry. This collaboration positions WAVZ as the regional support provider for Tietoevry’s innovative payment solutions across the MEA region. WAVZ will leverage its team of highly skilled and certified local professionals to deliver these solutions, ensuring the highest international standards are met.

This strategic alliance highlights WAVZ and Tietoevry’s unwavering commitment to the Egyptian market and the broader MEA region. It signifies a shared vision to drive progress and deliver cutting-edge global payment technologies through a local lens. WAVZ’s expertise in localization and its team of highly trained Egyptian personnel will be instrumental in achieving this vision.

“We are thrilled to collaborate with Tietoevry, a global leader in the payment solutions and services industry. Together, we will offer our clients a comprehensive suite of innovative and advanced digital solutions across various industries. This includes the transformative open banking system, facilitating secure and faster transactions worldwide. This partnership aligns perfectly with our expansion strategy and commitment to delivering services through highly qualified local professionals. The future of payments is brimming with game-changing trends, and we are at the forefront of reshaping this landscape.” Eng. Amr Esmat, Managing Director and CEO of WAVZ

“We are thrilled to collaborate with Tietoevry, a global leader in the payment solutions and services industry. Together, we will offer our clients a comprehensive suite of innovative and advanced digital solutions across various industries. This includes the transformative open banking system, facilitating secure and faster transactions worldwide. This partnership aligns perfectly with our expansion strategy and commitment to delivering services through highly qualified local professionals. The future of payments is brimming with game-changing trends, and we are at the forefront of reshaping this landscape.”

“We announced a pivotal expansion of our partnership with Tietoevry.”

“Future innovative trends will redefine how we deal with different payment systems”

Amr Esmat, CEO and Managing Director of WAVZ

“Our partnership with WAVZ, brings new opportunities for growth and digital transformation in the region. With the global economy witnessing rapid development, it is crucial to have a partner that provides exceptional resources, expertise, and well-trained personnel who understand the local culture. This partnership strengthens our commitment to success and enables us to realize our vision for the region.We also recognize how real-time payments are transforming business operations, by offering faster access to working capital and enhancing cash flow. It is an exciting time for businesses, as this innovation revolutionizes the way they operate and manage finances.” Edgars Bīberis, Regional Director of Business Development at Tietoevry

“Our partnership with WAVZ, brings new opportunities for growth and digital transformation in the region. With the global economy witnessing rapid development, it is crucial to have a partner that provides exceptional resources, expertise, and well-trained personnel who understand the local culture. This partnership strengthens our commitment to success and enables us to realize our vision for the region.We also recognize how real-time payments are transforming business operations, by offering faster access to working capital and enhancing cash flow. It is an exciting time for businesses, as this innovation revolutionizes the way they operate and manage finances.”

WAVZ is a leading Managed Services Provider and a SAP implementation and consulting firm. The company offers a comprehensive suite of SAP services, including implementation, consulting, and managed services. WAVZ has a proven track record of helping clients to successfully implement and manage SAP solutions. The company’s managed services business model provides clients with the flexibility and scalability that they need to grow their business. For more information, visit https://wavz.com.eg

Tietoevry creates purposeful technology that reinvents the world for good. We are a leading technology company with a strong Nordic heritage and global capabilities. Based on our core values of openness, trust and diversity, we work with our customers to develop digital futures where businesses, societies, and humanity thrive.

Our 24,000 experts globally specialize in cloud, data, and software, serving thousands of enterprises and public-sector customers in more than 90 countries. Tietoevry’s annual turnover is approximately EUR 3 billion and the company’s shares are listed on the NASDAQ exchange in Helsinki and Stockholm, as well as on Oslo Børs.`,
          category: 'event',
          date: 'Jun 10, 2024',
          readTime: '3 min read',
          image: '/news/tietoevry.jpg',
          title: 'WAVZ and Tietoevry Share Payment Systems 2030 Vision with Egyptian Banking Leaders',
          excerpt: 'WAVZ hosted an inspiring workshop "Envisioning the Future of Payments" at the prestigious St. Regis Hotel, bringing together Egyptian banking leaders.',
          url: 'https://wavz.com.eg/news/wavz-and-tietoevry-share-their-payment-systems-2030-vision-with-egyptian-banking-leaders/',
        },
        {
          id: 'leap-saudi',
          content: `Riyadh, Saudi Arabia, March 6th, 2024 – WAVZ for Digital Transformation, a leading Egyptian provider of digital solutions and services in the Middle East and Africa is actively participating in the 3rd edition of LEAP, the premier event for tech professionals, held in Riyadh, Saudi Arabia. LEAP is a global tech event that brings together hundreds of thousands of attendees showcasing the latest technology and its implications on the prosperity of humanity and finding innovative solutions to the key challenges it faces.

WAVZ joins a distinguished group of Egyptian companies showcased at the Chamber of Information and Communications Technology Industry (CIT) pavilion. This participation presents a valuable opportunity for WAVZ to engage with key decision-makers in Saudi Arabia, fostering partnerships with government bodies, academic institutions, and commercial entities, and also, to showcase its latest digital solutions and services capabilities, demonstrating the company’s expertise in the rapidly evolving digital landscape.

“We’re thrilled to participate in this prestigious global tech summit. LEAP provides a platform to explore potential collaborations, delve into cutting-edge solutions, and unlock new avenues for expanding access to Egyptian digital solutions and services in international markets, aligning with the Egyptian government’s vision to increase digital service exports. ” Eng. Amr Esmat, Managing Director and CEO of WAVZ

“We’re thrilled to participate in this prestigious global tech summit. LEAP provides a platform to explore potential collaborations, delve into cutting-edge solutions, and unlock new avenues for expanding access to Egyptian digital solutions and services in international markets, aligning with the Egyptian government’s vision to increase digital service exports. ”

Esmat added, “We’re further solidifying our commitment through today’s strategic partnership agreement with Saudi AZM, a leading company in the field of information technology. This collaboration indicates a significant step forward in WAVZ’s expansion across the MEA region.

“We are excited about our partnership with WAVZ, a strategic ally that complements our capabilities and supports the needs of our joint projects. We look forward to a fruitful collaboration and achieving new successes together.” Eng. Ali AlBalla, CEO of Saudi AZM

“We are excited about our partnership with WAVZ, a strategic ally that complements our capabilities and supports the needs of our joint projects. We look forward to a fruitful collaboration and achieving new successes together.”

“We signed a strategic partnership with Saudi AZM.”

“WAVZ demonstrates a commitment to Egypt’s digital services export vision through LEAP participation.”

Amr Esmat, CEO and Managing Director of WAVZ

It is worth mentioning that WAVZ’s mission is to provide powerful, yet cost-effective digital solutions, which empower organizations to achieve their IT and business goals, navigating the ever-evolving technological landscape with agility and confidence. WAVZ mission extends beyond technology. They foster a thriving environment where their talented team can flourish, contributing their expertise to champion their success. WAVZ focuses on building meaningful partnerships that would help them achieve their goal of becoming the trusted advisor and preferred partner that supports organizations in their digital transformation journey. WAVZ offers a comprehensive portfolio of services, managed according to the state of art international standards, ensuring clients can focus on their core business activities while WAVZ seamlessly addresses their technology needs.

LEAP brings together international corporations and experts to exchange ideas and knowledge across various fields, including technology, AI, sustainability, space exploration, and cybersecurity. The event serves as a platform for innovators, investors, and leading businesses, contributing to the region’s growth as a technological hub and offering specialized platforms for investors and emerging companies.

WAVZ is a leading Managed Services Provider and a SAP implementation and consulting firm. The company offers a comprehensive suite of SAP services, including implementation, consulting, and managed services. WAVZ has a proven track record of helping clients to successfully implement and manage SAP solutions. The company’s managed services business model provides clients with the flexibility and scalability that they need to grow their business. For more information, visit https://wavz.com.eg`,
          category: 'event',
          date: 'Mar 6, 2024',
          readTime: '3 min read',
          image: '/news/leap.jpg',
          title: 'WAVZ Showcases Digital Expertise at LEAP in Saudi Arabia',
          excerpt: 'WAVZ actively participated in the 3rd edition of LEAP in Riyadh, the premier tech event, demonstrating its cutting-edge digital transformation capabilities.',
          url: 'https://wavz.com.eg/news/leap-in-saudi-arabia/',
        },
        {
          id: 'revenue-2023',
          content: `Cairo, Egypt, February 12, 2024 – WAVZ for Digital Transformation, a leading Egyptian provider of digital solutions and related services in the Middle East and Africa, announced today a remarkable year of growth in 2023, doubling its revenues year over year, reaching 507 million Egyptian Pounds, while their profits soared by 120%. WAVZ workforce team grew to 1,300 employees, representing a 100% increase in job opportunities within two years.

“We are thrilled with the exceptional results achieved in 2023,” said Eng. Amr Esmat, CEO and Managing Director of WAVZ. “This success is driven by our significant expansion into new areas of digital transformation and managed services, allowing us to capture significant growth opportunities across the Egyptian, Middle Eastern, and African markets. We also established strategic partnerships that enable us to deliver even more innovative and market-relevant solutions to our clients.”

Esmat further explained, “Our strategic growth plan includes exploring new markets, and providing key strategic service to our clients, which have fuelled the hiring spree. At WAVZ, we strive to be the best employer in the market, attracting and nurturing highly skilled local talent. Our teams, who are trained according to the highest international standards, deliver distinguished services, which positions us as a trusted advisor and preferred solution provider for clients undergoing their digital transformation journeys. We help them stay focused on their core business while we take care of their evolving technological needs with our cutting-edge industry-leading solutions and services.”

“At WAVZ, we ignite business success through powerful, yet cost-effective digital solutions. We empower our clients to achieve their IT and business goals, navigating the ever-evolving technological landscape with agility and confidence. Our mission extends beyond technology. We foster a thriving environment where our talented team can flourish, contributing their expertise to champion our clients’ success. Together with our clients, we build meaningful partnerships, becoming their trusted advisor and preferred partner in their digital transformation journey.” Amr Esmat, CEO and Managing Director of WAVZ

“At WAVZ, we ignite business success through powerful, yet cost-effective digital solutions. We empower our clients to achieve their IT and business goals, navigating the ever-evolving technological landscape with agility and confidence. Our mission extends beyond technology. We foster a thriving environment where our talented team can flourish, contributing their expertise to champion our clients’ success. Together with our clients, we build meaningful partnerships, becoming their trusted advisor and preferred partner in their digital transformation journey.”

“Our profits increased by 120% and our revenues doubled in 2023.”

“We doubled our job opportunities within two years to reach 1,300 employees.”

Amr Esmat, CEO and Managing Director of WAVZ

Recognizing the global digital transformation trends, WAVZ has actively expanded its international partner network. Key collaborations include Nevis for cybersecurity systems. At the same time, WAVZ has strengthened and upgraded their existing partnerships with world-class international technology partners like SAP, Temenos, and Tietoevry, which enables WAVZ to offer a comprehensive suite of advanced digital solutions across diverse industries. These include the Open Banking Solutions for secure and swift global transactions, WAVZ unique Managed Services solutions and services, and cutting-edge SAP and Temenos solutions. It’s also worth mentioning that WAVZ delivers its solutions and services through various business models according to the customer needs and requirements, which empowers companies of different sizes to increase efficiency, reduce costs, and leverage instantaneous data insights that facilitate a more informed decision-making process.

WAVZ for Digital Transformation is a leading Egyptian company in the field of providing digital information technology solutions and services. With a proven track record of successful implementations across different industries, WAVZ for Digital Transformation is committed to providing innovative solutions that increase efficiency, reduce costs, and leverage instantaneous data insights that facilitate a more informed decision-making process. The company’s managed business model provides clients with the flexibility and scalability that they need to grow their business. For more information, visit https://wavz.com.eg`,
          category: 'insight',
          date: 'Feb 16, 2024',
          readTime: '5 min read',
          image: '/news/revenue.jpg',
          title: 'WAVZ Doubles Revenue in 2023, Expanding Footprint in Middle East and Africa',
          excerpt: 'WAVZ for Digital Transformation announced remarkable growth in 2023, doubling revenue and expanding its expert workforce across the Middle East and Africa region.',
          url: 'https://wavz.com.eg/news/wavz-for-digital-transformation-doubles-revenue-in-2023-expanding-footprint-in-middle-east-and-africa/',
        },
        {
          id: 'prosecure-sap',
          content: `Prosecure, a leading provider of integrated security solutions, announced today that it has signed with WAVZ for Digital Transformation, a global SAP implementation and consulting firm, to implement cutting-edge SAP ERP Solution in a Managed Services Business Model, which would help Prosecurestreamline its financial, material management and human capital management processes.

“Our Vision is to provide professional security services and to enhance the security and safety of our customers through continuous development and provision of the latest security technological means and methods, taking into account and monitoring quality, and always being prepared to deal with various risks. We are excited to partner with WAVZ to implement SAP ERP Solution.SAP is a world-class ERP system that will help us improve our operational efficiency and effectiveness, and adapt to changes dynamically based on real-time usage and customer experience data​. We chose WAVZ because of their vast experience in this domain that is supported by a successful track record in similar implementations. Especially the Managed Services Business model, which will help us focus on our core business, while WAVZ takes care of our ERP IT infrastructure and the associated processes. We are confident that WAVZ is the right partner that can help us with this important implementation”. Gen. Shahin Bassiouni, CEO of Prosecure.

“Our Vision is to provide professional security services and to enhance the security and safety of our customers through continuous development and provision of the latest security technological means and methods, taking into account and monitoring quality, and always being prepared to deal with various risks. We are excited to partner with WAVZ to implement SAP ERP Solution.SAP is a world-class ERP system that will help us improve our operational efficiency and effectiveness, and adapt to changes dynamically based on real-time usage and customer experience data​. We chose WAVZ because of their vast experience in this domain that is supported by a successful track record in similar implementations. Especially the Managed Services Business model, which will help us focus on our core business, while WAVZ takes care of our ERP IT infrastructure and the associated processes. We are confident that WAVZ is the right partner that can help us with this important implementation”.

SAP ERP Solutions will provide Prosecure with instant and personalized business insights, which will help Prosecure stay on top of compliance and security with global standards built-in and always up to date. It will help them also ​collaborate with their global suppliers and partners across supply chain processes for tasks and activities such as ordering, forecasting, inventory management, supply and demand monitoring, and onboarding. Last but not least, Prosceure will be able to better manage their Human Capital and Enhance organizational agility and employee engagement by creating, managing, and tracking the performance of their dynamic teams outside formal reporting structures.

“We are proud to be selected by Prosecure to implement SAP ERP Solutions. We have a proven track record of successfully implementing SAP solutions in a Managed Services model for companies of all sizes. We are confident that we can help Prosecure achieve its business objectives. SAP ERP solution will enable Prosecure to improve efficiency, reduce costs and make better business decisions.” Amr Esmat, CEO and Managing Director of WAVZ.

“We are proud to be selected by Prosecure to implement SAP ERP Solutions. We have a proven track record of successfully implementing SAP solutions in a Managed Services model for companies of all sizes. We are confident that we can help Prosecure achieve its business objectives. SAP ERP solution will enable Prosecure to improve efficiency, reduce costs and make better business decisions.”

Prosecure is a leading provider of integrated security solutions. The company offers a wide range of products and services, including security systems, access control, video surveillance and fire alarm systems. Prosecure’s customers include businesses, government agencies and educational institutions.

WAVZ is a leading Managed Services Provider and a SAP implementation and consulting firm. The company offers a comprehensive suite of SAP services, including implementation, consulting, and managed services. WAVZ has a proven track record of helping clients to successfully implement and manage SAP solutions. The company’s managed business model provides clients with the flexibility and scalability that they need to grow their business.`,
          category: 'announcement',
          date: 'Nov 5, 2023',
          readTime: '3 min read',
          image: '/news/prosecure.webp',
          title: 'Prosecure Partners with WAVZ to Implement Cutting-Edge SAP ERP Solutions',
          excerpt: 'Prosecure, a leading integrated security solutions provider, signed with WAVZ for Digital Transformation to implement SAP ERP in a Managed Services model.',
          url: 'https://wavz.com.eg/news/prosecure-security-and-guarding-company-partners-with-wavz-to-implement-cutting-edge-sap-erp-solutions/',
        },
        {
          id: 'transecure-sap',
          content: `WAVZ for Digital Transformation, a leading Managed Service and SAP implementation and consulting firm, announced today that it has signed a contract with Trans-secure, a leading provider of secure physical transfer of cash and other valuables, to implement top-notch SAP ERP Solution in a Managed Services Business Model, which would help Trans-secure better manage their business operations and have enhanced visibility and better management of their fleet.

“Our objective is to offer a host of products and services that allow for the secure physical transfer of cash and other valuables. The company’s footprint covers almost all the Egyptian Nation including but not limited to Egyptian Post Organization Offices and branches nationwide. The company has plans to expand its fleet to 260 armoured vehicles by 2024”“We are excited to partner with WAVZ to implement SAP ERP Solution, which will help us improve our operational efficiency and effectiveness, and better manage our fleet of vehicles in a cost-effective manner. We chose WAVZ because of their maturity in offering the required solution that would meet our current and future needs in a Managed Services Model. This will help us focus on our core business, while WAVZ takes care of our ERP IT infrastructure and the associated processes. We are confident that WAVZ is the right partner that can help us with this important implementation”. Mr. Ahmed Fathy El-Sebaay, CEO of Trans-secure.

“Our objective is to offer a host of products and services that allow for the secure physical transfer of cash and other valuables. The company’s footprint covers almost all the Egyptian Nation including but not limited to Egyptian Post Organization Offices and branches nationwide. The company has plans to expand its fleet to 260 armoured vehicles by 2024”“We are excited to partner with WAVZ to implement SAP ERP Solution, which will help us improve our operational efficiency and effectiveness, and better manage our fleet of vehicles in a cost-effective manner. We chose WAVZ because of their maturity in offering the required solution that would meet our current and future needs in a Managed Services Model. This will help us focus on our core business, while WAVZ takes care of our ERP IT infrastructure and the associated processes. We are confident that WAVZ is the right partner that can help us with this important implementation”.

“We are pleased to partner with Trans-secure Money Transfer Company to help them implement and manage their SAP solutions”“Our Managed Services Model will provide Trans-secure with the flexibility and scalability they need to grow their business. We are committed to helping Trans-secure improve efficiency, reduce costs and make better business decisions through the successful implementation of SAP ERP”. Amr Esmat, CEO and Managing Director of WAVZ.

“We are pleased to partner with Trans-secure Money Transfer Company to help them implement and manage their SAP solutions”“Our Managed Services Model will provide Trans-secure with the flexibility and scalability they need to grow their business. We are committed to helping Trans-secure improve efficiency, reduce costs and make better business decisions through the successful implementation of SAP ERP”.

Trans-secure, a leading provider of a host of products and services that allow for the secure physical transfer of cash and other valuables. The company’s footprint covers almost all the Egyptian Nation including but not limited to Egyptian Post Organization Offices and branches nationwide. Trans-secure is committed to providing its customers with a safe, reliable, and affordable way to move their cash.

WAVZ is a leading Managed Services Provider and a SAP implementation and consulting firm. The company offers a comprehensive suite of SAP services, including implementation, consulting, and managed services. WAVZ has a proven track record of helping clients to successfully implement and manage SAP solutions. The company’s managed business model provides clients with the flexibility and scalability that they need to grow their business.`,
          category: 'announcement',
          date: 'Nov 5, 2023',
          readTime: '3 min read',
          image: '/news/transecure.webp',
          title: 'Trans-Secure Partners with WAVZ to Implement SAP ERP in Managed Services Model',
          excerpt: 'Trans-Secure for Money Transfer signed a contract with WAVZ to implement SAP ERP in a Managed Services Business Model, enabling smarter operations.',
          url: 'https://wavz.com.eg/news/trans-secure-for-money-transfer-partners-with-wavz-to-implement-sap-erp-in-a-managed-services-business-model/',
        },
        {
          id: 'nevis-cyber',
          content: `Zurich, Nevis Security AG, a leading specialist in secure login solutions, and WAVZ for Digital Transformation, a leading provider of digital solutions in the ME/A region, today announced their partnership. The goal of this partnership is to combat cyber risks in the banking sector and enable a seamless customer experience. The collaboration combines WAVZ’s expertise in digital transformation with Nevis’ secure login solutions.

As digital transformation in the banking sector advances, consumer expectations are on the rise. For businesses and financial institutions, enhanced customer engagement strategies are crucial to meet these demands. On the other hand, cyber threats in the financial sector are rapidly increasing worldwide. The major risks include fraud, data and identity theft, and money laundering. Additionally, banks are facing stricter regulations and laws such as the Second Payment Services Directive (PSD2), Anti-Money Laundering (AML) regulations, Combating Financing of Terrorism (CFT) regulations, the General Data Protection Regulation (GDPR), and Customer Due Diligence (CDD) process requirements, which include customer identity verification (Know Your Customer, KYC).

Compliance with these various regulations and processes is critical to ensuring data protection, preventing financial crime and terrorism financing, and maintaining customer trust.

With Nevis’ solutions, banks can implement robust authentication, authorization, and automated fraud detection tools to protect sensitive customer data and prevent unauthorized access to accounts. At the same time, these solutions enable a smooth and personalized customer experience through seamless login processes across multiple channels, making it easier for customers to access their accounts or other services. Furthermore, banks can leverage customer data to offer tailored products and services that not only enhance customer loyalty but also maximize business potential, providing a competitive advantage for financial institutions.

Nevis’ solutions feature an open API architecture, allowing for easy plug-and-play implementation. They significantly reduce time-to-market for banks and financial service providers, as they enable quick and easy customization to individual solutions.

“Data security, compliance, and a seamless customer experience are top priorities in the banking sector. Nevis’ solutions meet these requirements through robust security measures, compliance features, and seamless authentication methods. With features like Single Sign-On, Multi-Factor Authentication, consent and preference management, federated identity management, and customer data analysis, not only can the security of a bank account be ensured, but personalized recommendations based on customer preferences can also be provided. This greatly enhances customer satisfaction and loyalty.” Amr Esmat, CEO and Managing Director of WAVZ.

“Data security, compliance, and a seamless customer experience are top priorities in the banking sector. Nevis’ solutions meet these requirements through robust security measures, compliance features, and seamless authentication methods. With features like Single Sign-On, Multi-Factor Authentication, consent and preference management, federated identity management, and customer data analysis, not only can the security of a bank account be ensured, but personalized recommendations based on customer preferences can also be provided. This greatly enhances customer satisfaction and loyalty.”

“We look forward to future collaboration with the experts at WAVZ. We support banks and financial service providers in the ME/A region in implementing a simple and secure solution for authenticating their customers. With our new three-tiered Win-Win-Win strategy, we aim to address the ongoing digitization in the ME/A region and provide secure access controls and identity management. Therefore, we will invest heavily in employees and partners like WAVZ, who bring the necessary expertise to build a global network. With WAVZ, the first step is taken, and we would be delighted to welcome further partners.” Stephan Schweizer, CEO of Nevis Security AG

“We look forward to future collaboration with the experts at WAVZ. We support banks and financial service providers in the ME/A region in implementing a simple and secure solution for authenticating their customers. With our new three-tiered Win-Win-Win strategy, we aim to address the ongoing digitization in the ME/A region and provide secure access controls and identity management. Therefore, we will invest heavily in employees and partners like WAVZ, who bring the necessary expertise to build a global network. With WAVZ, the first step is taken, and we would be delighted to welcome further partners.”

If you wish to become a partner of Nevis Security AG to benefit from an international network of expertise, please feel free to contact us at: partner@nevis.net

Nevis develops security solutions for the digital world of tomorrow: The portfolio includes passwordless logins that are easy to use and optimize user data protection. In Switzerland, Nevis is the market leader for identity and access management and secures over 80 percent of all e-banking transactions. Authorities, as well as leading service and industrial companies worldwide, rely on Nevis solutions. The authentication specialist has locations in Switzerland, Germany, the UK, and Hungary.

WAVZ is a leading provider of digital transformation solutions, specializing in assisting organizations across various industries in optimizing their operations, leveraging emerging technologies, and enhancing customer experience. With a track record of successful implementations, WAVZ is committed to delivering innovative solutions that drive tangible business outcomes.`,
          category: 'announcement',
          date: 'Oct 31, 2023',
          readTime: '4 min read',
          image: '/news/nevis.webp',
          title: 'WAVZ and Nevis Announce Partnership to Combat Cyber Risks in the Banking Sector',
          excerpt: 'Nevis Security AG and WAVZ announced their partnership to combat cyber risks in the banking sector, strengthening digital identity and secure login solutions.',
          url: 'https://wavz.com.eg/news/wavz-and-nevis-announce-partnership-to-combat-cyber-risks-in-the-banking-sector/',
        },
        {
          id: 'tietoevry-openbanking',
          content: `During their participation in “Seamless North Africa 2023” exhibition, WAVZ, a Digital Transformation and Managed Services company, in collaboration with Tietoevry, one of the leaders in Payments Solutions, presented how Open Banking systems and Finance solutions will change business models and how banks’ current business model is being challenged. It is expected that API Banking will change the Banks; business model to enable a wide range of companies and organizations to offer their own financial products and services without having to invest in a full-fledged banking infrastructure. According to Accenture, Banking marketplaces could generate up to \$500 billion in new revenue for banks globally by 2030.

Andres Olofsson, Head of PaaS at Tietoevry Banking, presented many valuable insights highlighting the importance of adopting open banking systems and introducing embedded third-party offerings that would enhance banks’ portfolio of products, saying:

Tietoevry has been supporting banks and financial institutions – through our expertise in the field of digital banking services and the financial ecosystem – for more than 50 years. Our products and services have enabled more than 400 institutions in more than 50 countries around the world. We achieved sales of €500 million in 2021 through the services we provide. Studies indicate that the volume of financial transactions in the United States is expected to reach \$7 trillion by 2026”. According to Allied Market Research, the global Banking-as-a-Service market was valued at \$2.41 billion in 2020 and is expected to reach \$11.34 billion in 2030 at a growth rate of 17.1%. Andres Olofsson, Head of PaaS at Tietoevry Banking

Tietoevry has been supporting banks and financial institutions – through our expertise in the field of digital banking services and the financial ecosystem – for more than 50 years. Our products and services have enabled more than 400 institutions in more than 50 countries around the world. We achieved sales of €500 million in 2021 through the services we provide. Studies indicate that the volume of financial transactions in the United States is expected to reach \$7 trillion by 2026”. According to Allied Market Research, the global Banking-as-a-Service market was valued at \$2.41 billion in 2020 and is expected to reach \$11.34 billion in 2030 at a growth rate of 17.1%.

We are pleased to partner with WAVZ. It’s the kind of partnership that will expand our reach in the Middle East and Africa region through their well-trained Egyptian experts who are capable of providing the latest advanced services according to international standards. We also aim to help banking institutions reach new segments of customers in the Middle East and Africa by providing the latest global applications and services in the field of Open Banking Systems and Digital Payments. Andres Olofsson, Head of PaaS at Tietoevry Banking

We are pleased to partner with WAVZ. It’s the kind of partnership that will expand our reach in the Middle East and Africa region through their well-trained Egyptian experts who are capable of providing the latest advanced services according to international standards. We also aim to help banking institutions reach new segments of customers in the Middle East and Africa by providing the latest global applications and services in the field of Open Banking Systems and Digital Payments.

From his part, Amr Esmat, Managing Director and CEO of WAVZ said:

Through our cooperation with Tietoevry, we aim to enable Financial Institutions to adopt the latest innovative Banking Services, especially Open Banking Systems, Electronic Payments, and Digital Services, which would help them reach new segments of customers while maintaining complete confidentiality of customer data. Amr Esmat, Managing Director and CEO of WAVZ

Through our cooperation with Tietoevry, we aim to enable Financial Institutions to adopt the latest innovative Banking Services, especially Open Banking Systems, Electronic Payments, and Digital Services, which would help them reach new segments of customers while maintaining complete confidentiality of customer data.

It is worth mentioning that WAVZ for Digital Transformation and Managed Services is participating as a gold sponsor in the Seamless North Africa 2023 summit, in partnership with Tietoevry, one of the world’s leading companies in Electronic Payments and Card Management. The summit is held under the title “The Road to Financial Technology in North Africa and the Middle East,” and sponsored by the Central Bank of Egypt in cooperation with the Arab League and the Arab Union for Digital Economy, and with the participation of more than 4,000 people from company heads, institutions, and entrepreneurs in the Middle East and Africa region.

WAVZ is a company based in Egypt for 15 years, and we’re actually very proud today to be in Seamless North Africa presenting solutions that are implemented in other places in the world successfully. Global expertise, global experience, implemented successfully in Egypt and being supported in Egypt by local resource which proves that Egyptians, when trained and developed in a proper manner, they can provide the same quality of service that we’re getting from international expertise. We’re currently expanding in Saudi Arabia, Jordan & Africa through successful projects in these places. Our presence in Seamless with our strategic partner Tietoevry demonstrates the significance of our partnership and how they consider us their arm in the region. Amr Esmat, Managing Director and CEO of WAVZ

WAVZ is a company based in Egypt for 15 years, and we’re actually very proud today to be in Seamless North Africa presenting solutions that are implemented in other places in the world successfully. Global expertise, global experience, implemented successfully in Egypt and being supported in Egypt by local resource which proves that Egyptians, when trained and developed in a proper manner, they can provide the same quality of service that we’re getting from international expertise. We’re currently expanding in Saudi Arabia, Jordan & Africa through successful projects in these places. Our presence in Seamless with our strategic partner Tietoevry demonstrates the significance of our partnership and how they consider us their arm in the region.

Open Banking is a great business model. The introduction of the InstaPay platform in Egypt is considered the first cornerstone that will enable Open Banking systems to work smoothly because, without instant payment, Open Banking systems would be missing a cornerstone. Now, with the – hopefully soon – regulations coming from FRA and the Central Bank of Egypt, this would present an opportunity for FinTech’s services to grow because they are dependent on getting access to customer data and getting access to the payment infrastructure. We are now in a pivoting time where new financial services could be introduced to the Egyptian population, which is a huge mass market and this will also attract regional FinTech Companies to introduce their services in Egypt, whether that would be from North Africa or even Europe coming into this region purely because of the size and the promising potential of the Egyptian Retail Market.

From his part, Andres Olofsson, Head of PaaS at Tietoevry Banking explained that Banks now need Small and Medium Enterprises (SME) to help them expand their services rapidly to new segments by introducing new services that meet these market segments’ needs. Open Banking systems would play the role of the facilitator between Banks and SMEs by providing them access to information that they might need without jeopardizing the security and confidentiality of Customer Information. It helps both Banks and SMEs unleash potential opportunities in the market and serve these segments of the market in a convenient manner.

I believe the Egyptian Financial Market has developed significantly lately. Such development has been supported by highly developed human resources that are highly educated and trained, which has resulted in significant growth of the pool of talents across different disciplines. This is why we chose WAVZ to be our strategic partner in the region. With their skilled resources, they can serve the evolving domestic market, and moreover, with their growing capability, serve the Middle East and Africa region. Especially, with the scarcity of talent across the globe. Andres Olofsson, Head of PaaS at Tietoevry Banking

I believe the Egyptian Financial Market has developed significantly lately. Such development has been supported by highly developed human resources that are highly educated and trained, which has resulted in significant growth of the pool of talents across different disciplines. This is why we chose WAVZ to be our strategic partner in the region. With their skilled resources, they can serve the evolving domestic market, and moreover, with their growing capability, serve the Middle East and Africa region. Especially, with the scarcity of talent across the globe.

Tietoevry is working across the entire Africa, like South Africa and Mauritius for example. We deliver the infrastructure to the Mauritius Central Bank to do instant transfers like Instapay. We’re also working in Nigeria and other regions where there are huge opportunities, but talents may not be as developed as we aspire. So, Egypt is a good springboard for a rapid connection in terms of access to the wider market and the proximity to the rest of Africa. One of our challenges in the region as a European company is that the decision-making process is always different than what we are used to. Hence, the need to be aligned with a local partner who can liaise with decision-makers, and who understands the local procurement process.

After the Middle East, we see Nigeria, and Kenya, as potential markets for expanding in the African market together with South Africa and Egypt. We believe Egypt is probably the most prominent market in North Africa with huge potential. Even with the risk that the Egyptian currency might get further depreciated, which presents a commercial risk, we still believe it’s a promising market. This is also why we need strategic local partners, with a local cost base. It helps hedge a bit of the currency risk.

Regarding our participation on Seamless Egypt, I find it very successful because you got so many young talents doing FinTech coming together. I’ve attended seamless in Riyadh, and in Dubai. And what excites me is the youth and all the ideas they generate. If you go to the FinTech sessions, there’s a lot of brilliant ideas, they come up with good and cool use cases. I think Vibrance is probably a good word to describe that everybody is super curious, super knowledgeable. You get the sense that nothing is impossible. It’s more that those people don’t see the limitations, they see the new bright ideas. It makes me only wish that the banks were as open as the FinTech. Having said that, I think that banks are sometimes sand bagged by regulations, limitations, and security.There was a good session yesterday about how slow the banks are moving, because simply they take care of our money, whereas FinTech Companiescan come up with all crazy ideas, try, make, or break, and then drop it and come up with a new one. Banks don’t have this luxury, and this is why, both business models need each other,and this is where Open Banking systems can facilitate the cooperation model between Banks and FinTech Companies. I think that what excites me the most is exploring what these young talents have in mind, and the brilliant ideas they have, and that is why it’s great to be here. Andres Olofsson, Head of PaaS at Tietoevry Banking

Regarding our participation on Seamless Egypt, I find it very successful because you got so many young talents doing FinTech coming together. I’ve attended seamless in Riyadh, and in Dubai. And what excites me is the youth and all the ideas they generate. If you go to the FinTech sessions, there’s a lot of brilliant ideas, they come up with good and cool use cases. I think Vibrance is probably a good word to describe that everybody is super curious, super knowledgeable. You get the sense that nothing is impossible. It’s more that those people don’t see the limitations, they see the new bright ideas. It makes me only wish that the banks were as open as the FinTech. Having said that, I think that banks are sometimes sand bagged by regulations, limitations, and security.There was a good session yesterday about how slow the banks are moving, because simply they take care of our money, whereas FinTech Companiescan come up with all crazy ideas, try, make, or break, and then drop it and come up with a new one. Banks don’t have this luxury, and this is why, both business models need each other,and this is where Open Banking systems can facilitate the cooperation model between Banks and FinTech Companies. I think that what excites me the most is exploring what these young talents have in mind, and the brilliant ideas they have, and that is why it’s great to be here.

Regarding our partnership with WAVZ, they are a reputable and capable Services Provider, we are merely a software vendor, which makes a perfect match, where we support them with our global experience because that is something that the region is hungry for, we come in also with an international perspective, lessons learned from other markets, while WAVZ comes in with their wealth of local market knowledge and a rich pool of resources. They have around 1000 people on board. Together, we provide leading technology that is proven and successful globally, and in the region, with local expertise and support. It’s a partnership that makes sense and is meaningful and relevant to the Middle East and African markets.`,
          category: 'insight',
          date: 'Oct 29, 2023',
          readTime: '4 min read',
          image: '/news/tietoevry-openbanking.jpg',
          title: 'Tietoevry: Open Banking Systems Set To Disrupt The Banking Sector',
          excerpt: 'During Seamless North Africa 2023, WAVZ and Tietoevry presented their vision on how open banking systems are set to disrupt the banking sector.',
          url: 'https://wavz.com.eg/news/tietoevry-open-banking-systems-set-to-disrupt-the-banking-sector/',
        },
        {
          id: 'sczone-digital',
          content: `Cairo, Egypt. September 20, 2023 – WAVZ and SC-Zone Collaborate on Groundbreaking SC-Zone Digital Transformation Project. WAVZ for Digital Transformation, a leading provider of digital transformation solutions, is proud to announce its partnership with SC-Zone, a prominent organization focused on harnessing the potential of the Suez Canal and its surrounding areas. This collaboration aims to revolutionize the IT infrastructure within SC-Zone and propel the SC-Zone Digital Transformation initiative to new heights.

“The primary objective of SC-Zone is to establish a business environment that is highly efficient, competitive, and environmentally sustainable, while also creating employment opportunities and positioning itself as a global hub for marine transportation and logistics services. To achieve this vision, SC-Zone aims to set new industry standards and become a beacon of responsible maritime practices, aligning with emerging market trends, improving customer services, and attracting new customers by offering cutting-edge solutions. We believe our partnership with WAVZ is a cornerstone towards the provision of advisory and operating services as needed by Port-Said SC-Zone.” Marwan Tag, IT General Manager, SC-Zone

“The primary objective of SC-Zone is to establish a business environment that is highly efficient, competitive, and environmentally sustainable, while also creating employment opportunities and positioning itself as a global hub for marine transportation and logistics services. To achieve this vision, SC-Zone aims to set new industry standards and become a beacon of responsible maritime practices, aligning with emerging market trends, improving customer services, and attracting new customers by offering cutting-edge solutions. We believe our partnership with WAVZ is a cornerstone towards the provision of advisory and operating services as needed by Port-Said SC-Zone.”

The SC-Zone project is divided into two distinct phases, WAVZ will focus in the beginning on offering consultancy services for the evaluation, testing, and acceptance of project completion and deliverables of the vendor. Additionally, it involves ensuring the ongoing maintenance of project documentation, ensuring a seamless implementation process. In phase 2 of the project, WAVZ for digital transformation will take on the responsibility of training the current SC Zone resources and will also manage the operations of the Port-Said SC-Zone Datacenter and its associated IT, network, fiber, and electromechanical infrastructure. Furthermore, WAVZ will identify potential opportunities for improving Datacenter Operations by identifying operational gaps and risks within such a complex environment.

Through this partnership, SC-Zone aims to make use of WAVZ experience across several key areas. The key objective will be to align the overall IT strategic directions with SC-Zone’s long-term vision and business goals. Such alignment should result in the development of an operational roadmap that includes a phased implementation approach and incorporates current and future business requirements.

“We are excited about this partnership with SC-Zone. This collaboration aims to maximize SC-Zone’s Return on Investment by reducing operational expenses and streamlining the management of the Port-Said data center to make it more efficient. WAVZ’s expertise will not only ensure efficient operations, but also adherence to schedules, and staying within budgeted costs, ultimately optimizing resources utilization” Mr. Amr Esmat, CEO and Managing Director of WAVZ

“We are excited about this partnership with SC-Zone. This collaboration aims to maximize SC-Zone’s Return on Investment by reducing operational expenses and streamlining the management of the Port-Said data center to make it more efficient. WAVZ’s expertise will not only ensure efficient operations, but also adherence to schedules, and staying within budgeted costs, ultimately optimizing resources utilization”

Mr. Mohamed El-Husseini, Chief Technical Officer of WAVZ added

“Our objective is to enable SC-Zone to deliver new projects smoothly and enhance the usability of the existing systems and infrastructure. This will empower SC-Zone to adapt to evolving business needs, ensuring flexibility and providing a seamless experience to its customers.” Mr. Mohamed El-Husseini, Chief Technical Officer of WAVZ

“Our objective is to enable SC-Zone to deliver new projects smoothly and enhance the usability of the existing systems and infrastructure. This will empower SC-Zone to adapt to evolving business needs, ensuring flexibility and providing a seamless experience to its customers.”

The collaboration between SC-Zone and WAVZ signifies a commitment to driving innovation, efficiency, and customer satisfaction. By leveraging the expertise and strategic guidance of WAVZ, SC-Zone is well-positioned to achieve its goals and deliver exceptional results for the SC-Zone digital transformation project.

The SC-Zone digital transformation project will maximize productivity and efficiency, streamlining workflows, which will contribute to saving time and energy. With cutting-edge technology at their disposal, SC-Zone staff can expect a seamless and more efficient work process, which would enhance and improve their customer journey.

WAVZ is a leading provider of digital transformation solutions, specializing in assisting organizations across various industries in optimizing their operations, leveraging emerging technologies, and enhancing customer experiences. With a track record of successful implementations, WAVZ is committed to delivering innovative solutions that drive tangible business outcomes.

SC Zone is a leading authority in marine transportation and logistics services, dedicated to driving innovation and sustainable practices in the maritime industry. With a focus on efficiency, competitiveness, and customer satisfaction, SC Zone aims to establish the Suez Canal and its surrounding areas as a global hub for business and technology.

For more information, contact us here`,
          category: 'announcement',
          date: 'Sep 20, 2023',
          readTime: '3 min read',
          image: '/news/sczone.jpg',
          title: 'Embarking On The SC-Zone Digital Transformation Project with WAVZ',
          excerpt: 'WAVZ and SC-Zone announced their groundbreaking collaboration on the SC-Zone Digital Transformation Project, a landmark initiative for the region.',
          url: 'https://wavz.com.eg/news/embarking-on-the-sc-zone-digital-transformation-project-in-collaboration-with-wavz/',
        },
        {
          id: 'openbanking-future',
          content: `Cairo, July 2023– Wavz, a popular electronic transformation and outsourcing services firm, is thrilled to reveal its significant role as a Golden Sponsor at the highly anticipated Seamless North Africa 2023 summit. In cooperation with Tietoevry, an international leader in electronic repayments and card management, Wavz is set to showcase ingenious open banking solutions.

Open Banking Solutions stand for a pivotal shift in the financial services landscape. This practice advertises safe and secure interactions within the financial industry, enabling third-party repayment suppliers and financial solution business to gain access to banking purchases and monetary data. Open banking financial services has actually gotten tremendous popularity as a result of its capacity to help with faster and much more safe and secure financial purchases, going beyond geographical boundaries.

The upcoming summit, slated for July 17-18, will be held at the esteemed Egypt International Exhibit Center in New Cairo, under the notable patronage of the Egyptian Cabinet and the Central Financial Institution of Egypt. The Arab League and the Arab Union for Digital Economic climate have actually additionally expanded their support for the occasion. With the motif “The Road to FinTech between East and Africa,” this year’s summit is particularly relevant to the current rise of technological developments transforming the financial field in these areas.

Open Banking Solutions are greater than simply a fashionable term; they indicate a substantial modification in the financial services industry. This strategy fosters risk-free cooperations within the banking field, enabling third-party repayment companies and economic solution firms to acquire financial deals and economic information. This concept has actually come to be extremely preferred many thanks to the numerous benefits it gives.

It allows quicker and much more protected financial purchases, transcending geographical limits. It empowers consumers by giving them with greater control over their economic data and introducing a series of innovative financial tools and solutions. The chance for third-party applications to seamlessly get in touch with financial systems and gain access to important data is a game-changer. It’s all about streamlining, simplifying, and improving the economic experience for consumers and services alike.

Wavz, a pioneering company in the digital improvement area, has actually been playing an essential function in making Open Banking Solutions accessible and impactful in the Middle East and Africa. With their cutting-edge services and critical collaborations, they have positioned themselves as a significant gamer in the rapidly evolving financial services landscape.

At the Seamless North Africa top, Wavz will certainly go to the center of conversations, with an appealing exhibition cubicle where industry leaders and experts will certainly assemble to check out the opportunities and ramifications of Open Banking Solutions. Panel discussions will certainly delve deep into how Open Banking Solutions are reinventing financial services in the region, with a certain emphasis on Egypt.

Egypt is not simply the historic cradle of world; it’s likewise a significant player in the modern-day financial services sector. The nation’s financial landscape is evolving swiftly, and digital change is a key motorist of this change. Open up Banking is getting traction as it straightens seamlessly with the worldwide trend of digitization. It uses brand-new opportunities for tiny and medium-sized companies, enabling them to contend better with recognized monetary company.

Mr. Amr Essam, CEO of Wavz, emphasized the importance of Open Banking Solutions, specifying, “Open Banking Solutions are no more a deluxe; they’re a necessity in today’s busy international economy. We’re seeing a remarkable shift towards digitalization worldwide, and Open Banking Solutions are at the heart of this transformation. These systems open brand-new opportunities for companies, enabling them to minimize prices, welcome cutting-edge innovation, and give extraordinary consumer service. Every organization, no matter of its market, can leverage Open Banking Solutions to promote more powerful consumer relationships.”

The upcoming Seamless North Africa summit is anticipated to be a significant occasion, bringing together greater than 4,000 guests from around the globe. Among them will be influential people, federal government reps, and specialists in the area, all collaborating to look into different areas of electronic payments, monetary modern technology, advancement, and digital banking.

The conference supplies a platform for networking, knowledge exchange, and collaboration. It’s a melting pot of ideas and services that will assist form the future of the financial services industry in the Middle East and Africa. With Wavz leading the fee in Open Banking Solutions discussions, the summit guarantees to be an occasion that forms the industry’s future.

The partnership between Wavz and Tietoevry and their engagement in Seamless North Africa 2023 is poised to speed up the fostering of Open Banking Solutions in Egypt, the Center East, and Africa. Open Banking Solutions are not just a pattern; they’re an essential change that is improving the method we engage with financial services. The top, with its global assistance and extensive participation, is the excellent system to champion this improvement. As Wavz brings their expertise to the leading edge, the monetary landscape of the area is poised to evolve for the much better. Open Banking Solutions are below to stay, and their future appearances brilliant in the center East and Africa.`,
          category: 'insight',
          date: 'Jul 13, 2023',
          readTime: '4 min read',
          image: '/news/openbanking.jpg',
          title: 'WAVZ Open Banking Solutions: Leading the Financial Future',
          excerpt: 'WAVZ revealed its role as a Golden Sponsor at Seamless North Africa 2023, in cooperation with Tietoevry, showcasing next-generation open banking solutions.',
          url: 'https://wavz.com.eg/news/wavz-open-banking-solutions-leading-the-financial-future/',
        },
        {
          id: 'ahliyya-university',
          content: `In collaboration with Egypt Post and WAVZ, Al-Ahliyya Amman University to launch enrollment services and tuition Payments for Egyptian students through the 4,500 Branches of Egypt Post.

In its efforts to facilitate the enrolment and tuition payment services to Egyptian Students, Al-Ahliyya Amman University will be offering their Enrollment and tuition payments to Egyptian Students through the 4,500 Branches of Egypt Post. This will allow Egyptian Students to complete their enrolment process smoothly and pay for their tuition fees in local currency and according to the transfer rate announced by the Central Bank of Egypt.

The agreement was signed by Pillars Marketing Company, the marketing arm of Al-Ahliyya Amman University, and WAVZ for Digital Transformation, the technology arm of Egypt Poston June 14, 2023.

“This agreement represents a significant milestone for Al-Ahliyya Amman University to facilitate the enrolment and payment services to the Egyptian students. We’re very happy to be able to offer these services to the Egyptian youth through a trusted partner with unprecedented reach like Egypt Post. We’re also confident that WAVZ will be able to provide us with the technology solutions that will make these services smooth and according to the latest standards. We have a firm commitment to provide and expand our educational services to the Egyptian Youth. We believe we found the right partners to help us in our mission” Ammar Al-Jurf, Managing Director of Pillars Marketing

“This agreement represents a significant milestone for Al-Ahliyya Amman University to facilitate the enrolment and payment services to the Egyptian students. We’re very happy to be able to offer these services to the Egyptian youth through a trusted partner with unprecedented reach like Egypt Post. We’re also confident that WAVZ will be able to provide us with the technology solutions that will make these services smooth and according to the latest standards. We have a firm commitment to provide and expand our educational services to the Egyptian Youth. We believe we found the right partners to help us in our mission”

Overall, the partnership between Al-Ahliyya Amman University, Egypt Post, and WAVZ for Digital Transformation aims to make enrolment and tuition payment services more accessible to Egyptian students. The use of local currency and the transfer rate announced by the Central Bank of Egypt, makes the process more convenient for students. Moreover, the use of technology in the enrolment and payment process is expected to improve efficiency and reduce the potential for errors, making the system more reliable and transparent.

This could potentially improve the credibility of the education system and encourage more students to enroll in university. The partnership is also a testament to the importance of public-private partnerships in improving access to education and other essential services. By leveraging the resources and expertise of both the private and public sectors, the partnership can provide a more comprehensive and effective solution that benefits all parties involved.

Egypt Post has expressed their excitement about this partnership.

“This agreement will enable Egyptian Students to enroll smoothly in Al-Ahliyya Amman University and provide the students the ability to pay their tuition fees through our 4,500 branches across the nation and in local currency without the need to go through the trouble of outsourcing foreign currency. It falls in synch with our commitment to provide relevant and meaningful services to the Egyptian Youth” Hatem El-Souly, Head of Quality Control, Egypt Post

“This agreement will enable Egyptian Students to enroll smoothly in Al-Ahliyya Amman University and provide the students the ability to pay their tuition fees through our 4,500 branches across the nation and in local currency without the need to go through the trouble of outsourcing foreign currency. It falls in synch with our commitment to provide relevant and meaningful services to the Egyptian Youth”

WAVZ was also very excited to be part of this agreement.

“We’re so excited to be part of this agreement and to provide the technology needed to make this partnership successful. This falls along our commitment to enable advanced Digital Services to the Egyptian Youth Community through the 4,500 Branches of Egypt Post. Such programs highlight the importance of technology and Digital Services that can positively impact people’s lives” Amr Esmat, CEO and Managing Director of WAVZ.

“We’re so excited to be part of this agreement and to provide the technology needed to make this partnership successful. This falls along our commitment to enable advanced Digital Services to the Egyptian Youth Community through the 4,500 Branches of Egypt Post. Such programs highlight the importance of technology and Digital Services that can positively impact people’s lives”`,
          category: 'announcement',
          date: 'Jun 14, 2023',
          readTime: '3 min read',
          image: '/news/ahliyya.webp',
          title: 'Al-Ahliyya Amman University Partners with Egypt Post and WAVZ for Student Enrollment',
          excerpt: 'Al-Ahliyya Amman University, with Egypt Post and WAVZ, launched enrollment and tuition payment services for Egyptian students through 4,500 post branches.',
          url: 'https://wavz.com.eg/news/al-ahliyya-amman-university-enrollemtn-services-and-tuition-payments/',
        },
        {
          id: 'egypt-trust-callcenter',
          content: `[Cairo, Egypt] – (1st of April) – Egypt Trust announces the launch of their new “Egypt Trust Call Center”, which will be operated by WAVZ for Digital Transformation to serve more customers, more efficiently.

“By Providing Digital Signature Certificates, Egypt Trust is able to support automating government services and making them available electronically to the Egyptian society.One of our key objectives is to be able to serve our customers more efficiently and help them resolve any issues that they might have in the smoothest and most satisfactory manner. Hence, the need to partner with a reliable and efficient service provider like WAVZ” Said Mohamed Kiwan, CEO of Egypt Trust.

“By Providing Digital Signature Certificates, Egypt Trust is able to support automating government services and making them available electronically to the Egyptian society.One of our key objectives is to be able to serve our customers more efficiently and help them resolve any issues that they might have in the smoothest and most satisfactory manner. Hence, the need to partner with a reliable and efficient service provider like WAVZ”

The last few years witnessed an exponential growth in Egypt Trust’s corporate customer base, which led to establishing the Egypt Trust Call Center to be able to respond to customer inquiries and provide reliable information when needed over the clock. After one year of its operation, seeking better and more efficient customer service, Egypt Trust decided to outsource their Call Center operation so that they can focus on their core business.

After careful consideration, Egypt Trust decided to partner with WAVZ for Digital Transformation to provide the Egypt Trust Call Center a complete Outsourced solution including Experienced Resources, Technology, and Operational Processes enhancements for a distinguished customer experience.

During that process, WAVZ along with Egypt Trust have adopted best practice applications to produce a Service Catalog that will not only help overcome the challenges experienced in the current setup, but more importantly to enhance the customer experience and meet the customer’s ever growing expectations. Seeking a smooth transition, WAVZ has worked with Egypt Trust to make sure the project is executed in the shortest time possible without jeopardizing the enhancements needed to improve the internal processes and the customer experience.

The transition was executed in a record time of less than four weeks to make the new Call Center up and running. Making sure that they have the right calibers, providing the needed training, and on-boarding processes has helped Egypt Trust in ramping up the resources needed for the future needs in record times.

The solution has also helped Egypt Trust to adopt the best practices and cost-effective models security protocols and to ensure the Call Center Operational Excellence.

The Call Center will be staffed with highly skilled agents who have been trained to provide outstanding customer service.

“WAVZ for Digital Transformation is confident that this collaboration will lead to growth and success for both companies. We are excited to work together to provide world-class customer service to our clients.” Said Amr Esmat, CEO & Managing Director of WAVZ

“WAVZ for Digital Transformation is confident that this collaboration will lead to growth and success for both companies. We are excited to work together to provide world-class customer service to our clients.”

Egyptian Company for Digital Signature and Information Security – Egypt Trust is an Egyptian company established in 2005 presenting its services to the Egyptian Market according to government plans for digital transformation. Egypt Trust is a Governmental-Certified Digital Certificate Authority that issues digital certificates for both individuals and corporations.

WAVZ is a multi-technology and cross-vendor service provider focused on using highly skilled business and technical expertise to serve the ever-demanding Egyptian and regional public and private sectors. WAVZ offers various IT services across various disciplines. WAVZ services/solutions are mostly custom made to superbly match our client’s business needs on time and budget. WAVZ is a partner to multiple blue chip technology firms including but not limited to SAP, Oracle and Temenos.

For more information about WAVZ for Digital Transformation and our services, contact us here`,
          category: 'announcement',
          date: 'Apr 1, 2023',
          readTime: '3 min read',
          image: '/news/egypttrust.jpg',
          title: 'WAVZ Upgrades Egypt Trust Call Center Operations to Provide World-Class Service',
          excerpt: 'Egypt Trust announced the launch of their new Call Center, operated by WAVZ for Digital Transformation, to serve more customers more efficiently.',
          url: 'https://wavz.com.eg/news/egypt-trust-call-center-operations-upgrades/',
        },
      ],
    },
  },

  ar: {
    nav: {
      platform: 'الحلول',
      product: 'القطاعات',
      solutions: 'الشركاء',
      resources: 'الأخبار',
      pricing: 'عن الشركة',
      cta: 'احجز استشارة',
    },
    hero: {
      tagline: 'المنصة المتكاملة للتحول الرقمي للمؤسسات.',
      tagline2: 'تنفيذ متعدد القطاعات، متعدد الخدمات، عبر مختلف مناطق الشرق الأوسط وأفريقيا.',
      product1: 'خدمات وحلول تكنولوجيا المعلومات',
      productAccent: 'المُدارة بالكامل',
      product2: 'أحدث نقلة نوعية في عملياتك المؤسسية وحقق أعلى مستويات الكفاءة والموثوقية مع',
      brand: 'WAVZ للتحول الرقمي',
      lede1: 'تطبيقات SAP المؤسسية، مقترنة بأحدث الأنظمة البنكية والتقنية، على بنيتك التحتية. ',
      ledeAccent1: 'تنفيذٌ متعدد القطاعات',
      lede2: ' يوسع كل عملية. ',
      ledeAccent2: 'تنسيقٌ متعدد الخدمات',
      lede3: ' بمعدل اتفاقية مستوى خدمة 99.9%. ',
      ledeAccent3: 'تغطيةٌ إقليمية شاملة',
      lede4: ' عبر المنطقة — فريق واحد، وقائد مسؤول واحد.',
      cta1: 'احجز استشارة',
      cta2: 'احسب وفوراتك',
      diagramSource: 'أحمال العملاء',
      diagramOrch: 'مُنسِّق WAVZ',
      diagramOrchSub: 'SOC + NOC على مدار الساعة',
      diagramRack1: 'SAP',
      diagramRack2: 'البيانات والذكاء الاصطناعي',
      diagramRack3: 'Oracle',
      diagramCloud: 'السحابة الهجينة',
    },
    offering: {
      eyebrow: 'ما نقدمه',
      title: 'محفظة حلولنا المتكاملة',
      lede: 'الاستراتيجية تغذي التصميم المعماري. والتصميم المعماري يقود العمليات التشغيلية المنضبطة لضمان استمرارية الأداء يومياً.',
      learnMore: 'تعرف على المزيد',
      stats: {
        years: 'عاماً من الخبرة في المنطقة',
        clients: 'عميلاً مؤسسياً كبيراً',
        industries: 'قطاعات رئيسية نخدمها',
      },
      pills: ['تصميم خارطة الطريق', 'هندسة إدارة المخاطر', 'التحقق من الميزانية', 'الإيجاز التنفيذي'],
      cards: [
        { name: 'الاستشارات الاستراتيجية', tag: 'استشارات', tagType: 'green', desc: 'خرائط طريق حقيقية للتحول مستمدة من خبراتنا العملية مع كبرى البنوك والمؤسسات الحكومية في المنطقة.' },
        { name: 'محاكي WAVZ', tag: 'ابتكار حصري', tagType: 'yellow', desc: 'نمذجة مسارات التنفيذ وتوزيع الموارد واستراتيجيات إدارة المخاطر، مع توقع التحديات قبل حدوثها لتأمين التسليم.' },
        { name: 'العمليات متعددة المحاور', tag: 'تشغيل موحد', tagType: 'yellow', desc: 'نموذج تشغيل متكامل متعدد القطاعات والخدمات والمناطق — توجيه ذكي، تصعيد فوري، وتوسع مرن تحت خط تسليم واحد.' },
      ],
    },
    benchmark: {
      pill1: 'تشغيل مباشر بمستوى المؤسسات',
      pill2: 'من WAVZ',
      title1: 'مركز',
      title2: 'العمليات',
      subtitle: 'العمود الفقري للعمليات على مدار الساعة للمؤسسات ذات الأعباء التشغيلية الحرجة.',
      desc1Strong: 'الممارسة التشغيلية:',
      desc1: ' أنماط تنفيذ موثوقة عبر قطاعات ومنصات متعددة، تدير مئات أعباء العمل الحيوية بأطر تشغيل متوافقة خصيصاً مع بيئة أعمالك.',
      desc2Strong: 'منصة WAVZ:',
      desc2: ' تستفيد المؤسسات من نموذج تشغيل SOC/NOC المتقدم لتحسين وقت التشغيل وسرعة الاستجابة للحوادث عبر منشآتك التقنية بالكامل.',
      tagline: 'WAVZ تُحسِّن عملياتك — سواء كنت في مرحلة التحول الرقمي أو التشغيل المستمر أو كليهما.',
      cta1: 'استكشف مركز العمليات',
      cta2: 'اختبر الحل على بيئتك',
      command: '$ wavz consult --industry=banking',
      measures: 'ما نقيسه',
      metrics: [
        { code: 'MTTR', label: 'متوسط زمن استعادة الخدمة' },
        { code: 'SLA', label: 'الالتزام بمستوى الخدمة' },
        { code: 'FCR', label: 'الحل من أول اتصال' },
        { code: 'CSAT', label: 'مستوى رضا العملاء' },
        { code: 'Uptime', label: 'نسبة جاهزية النظام' },
      ],
    },
    platform: {
      eyebrow: 'المنصة',
      title1: 'الانضباط القيادي',
      titleAccent: 'وراء',
      title2: 'التميز التشغيلي',
      lede: 'ثلاثة محاور معقدة تُدار بتناغم تام: قطاعات نخدمها، خدمات نُقدِّمها، ومناطق جغرافية نُغطِّيها — ضمن نموذج تشغيلي موحد.',
      cards: [
        { title: 'محاكي WAVZ', accent: 'محاكي', desc: 'استكشاف استشاري استباقي لخارطة طريق التحول، يتنبأ باحتياجات الموارد ومسارات الإنجاز بكفاءة استباقية وليست تفاعلية.' },
        { title: 'التسليم الذكي متعدد القطاعات', accent: 'الذكي', desc: 'إدارة متزامنة لعدة قطاعات وعملاء باتفاقيات خدمة متباينة عبر كفاءات مشتركة، مما يقلل تكلفة الخدمة المُدارة بنسبة تصل إلى 60%.' },
        { title: 'إتقان البيئات التقنية المختلطة', accent: 'إتقان', desc: 'دعم متعدد الموردين والأنظمة — من SAP و Oracle إلى الحلول البنكية والسحابية — بجاهزية 99.9%.' },
        { title: 'توسع تلقائي وفق اتفاقيات الخدمة', accent: 'توسع', desc: 'التزام صارم بأهدافك التشغيلية — إذا طرأ أي تباطؤ في الأداء، يبدأ التصعيد فوراً وتُعاد موازنة القدرات الاستيعابية بمرونة.' },
        { title: 'أعلى كفاءة لتكلفة ساعات العمل', accent: 'كفاءة', desc: 'توزيع ديناميكي للموارد يلغي الهدر الزمني، وتسليم إقليمي يوفر سرعة انتشار وتكاليف تشغيلية مثلى.' },
      ],
      learnMore: 'اقرأ المزيد',
    },
    architecture: {
      eyebrow: 'الهندسة المعمارية',
      title: 'فصل الاستراتيجية عن العمليات — الميزة التنافسية الكبرى',
      desc1: 'التحول المؤسسي ليس جهداً أحادي البعد. فالاستراتيجية تتطلب رؤية استشارية رفيعة وخبرة معمقة وتقدير قيادي رشيد، بينما تتطلب العمليات تنفيذاً منضبطاً قابلاً للتكرار والتزاماً صارماً باتفاقيات مستوى الخدمة.',
      desc2: 'لا يمكن لفريق واحد أن يتفوق في كليهما معاً بنفس الكفاءة. لذلك تفصل WAVZ بينهما وظيفياً — مستشارون كبار لتصميم الاستراتيجية، وفرق عمليات متخصصة للتنفيذ والتشغيل — تحت مظلة حوكمة واحدة وشريك واحد مسؤول.',
      tagline: 'خبرات متعددة تعمل بتكامل وانسيابية تامة.',
      step1: 'متطلبات العميل',
      step2: 'WAVZ',
      step2sub: 'منظومة العمليات الموحدة',
      phase1: 'مرحلة الاستراتيجية',
      phase1Brand: 'SAP + Oracle',
      phase1desc: 'تخطيط استشاري معمق',
      phase2: 'مرحلة العمليات',
      phase2Brand: 'SOC + NOC + AMS',
      phase2desc: 'تشغيل على مدار الساعة 24/7',
      result: 'نتيجة موحدة، واتفاقية خدمة مضمونة',
      finalLine: 'هذا التكامل المنضبط يضمن نتائج ملموسة تفوق التوقعات.',
      cta: 'شاهد كيف يعمل هذا النموذج',
    },
    results: {
      eyebrow: 'النتائج',
      title: 'ماذا تقول المؤسسات التي تبني على نطاق واسع',
      featured: { value: '100', suffix: '%', title: 'نمو القوى العاملة', sub: 'WAVZ — توسعت إلى 1,300 متخصص عبر المنطقة في عامين' },
      stats: [
        { value: '2', suffix: 'X', label: 'نمو الإيرادات', sub: 'مضاعفة في 2023' },
        { value: '99.9', suffix: '%', label: 'تحقيق اتفاقية الخدمة', sub: 'عبر محفظة الخدمات المُدارة' },
        { value: '60', suffix: '%', label: 'انخفاض التكلفة', sub: 'مقارنةً بالعمليات الداخلية' },
        { value: '15', suffix: '+', label: 'عميلٌ مؤسسي', sub: 'بنوك، وزارات، هيئات' },
        { value: '5', suffix: 'X', label: 'العائد على الاستثمار', sub: 'في برامج التحول الرقمي' },
      ],
      quotes: [
        { text: 'WAVZ مكَّنتنا من إدارة أعمالنا بشكل أفضل والتركيز على مهمتنا الأساسية، وهي الوصول إلى مزيد من النساء في مصر وتوفير الكشف المبكر والعلاج لهن.', author: 'م. جيلان فلفلة', role: 'عضو مجلس أمناء مؤسسة بهية' },
        { text: 'نعتقد أن شراكتنا مع WAVZ تُمثِّل ركيزةً أساسيةً لتقديم الخدمات الاستشارية والتشغيلية وفقاً لاحتياجات المنطقة الاقتصادية.', author: 'مروان تاج', role: 'المدير العام لتقنية المعلومات، المنطقة الاقتصادية' },
        { text: 'تجلب شراكتنا مع WAVZ فرصاً جديدة للنمو والتحول الرقمي في المنطقة. موارد وخبرات استثنائية وفهماً للثقافة المحلية.', author: 'إدغارز بيبيريس', role: 'المدير الإقليمي، Tietoevry' },
      ],
    },
    ecosystem: {
      eyebrow: 'النظام البيئي',
      title: 'مبنيٌّ على المنصات التي تستخدمها بالفعل',
      lede: 'WAVZ تعمل على أي منصة وسحابة وإطار عمل. متعددة الموردين، متعددة السحابات، متعددة المناطق. بدون إعادة كتابة. بدون قيود.',
      featured: 'مميَّز',
      featuredDesc: 'تنفيذٌ مختلطٌ لـ SAP و Temenos للتحول المصرفي',
      providers: 'شركاء المنصات',
      cloud: '+15 عميلٌ مؤسسي',
      tools: 'أُطُرُ القطاع',
    },
    comparison: {
      eyebrow: 'المقارنة',
      title: 'فئةٌ من نوعٍ واحد',
      subtitle: 'WAVZ مقابل البدائل. لا مقارنة.',
      headers: ['القدرة', 'WAVZ', 'داخلي', 'IT عام', 'Big-4', 'أوفشور', 'متخصص'],
      rows: [
        'مركز عمليات 24/7 (CCC + SOC + NOC)',
        'تنفيذٌ متعدد القطاعات',
        'إتقان منصات متعددة',
        'استشاراتٌ + تنفيذ',
        'مساءلةٌ على أساس الاتفاقية',
        'خبرةٌ ثقافيةٌ محلية',
        'تنفيذٌ واعٍ بالمؤشرات',
        'تحديدٌ تلقائي للأحمال',
        'تحسين تكلفة ساعة الخدمة',
        'متعدد السحابة + موحَّد',
      ],
      capabilities: [
        [true, false, false, false, false, false],
        [true, false, false, true, false, false],
        [true, false, false, false, false, true],
        [true, false, false, true, false, false],
        [true, false, true, false, true, false],
        [true, true, false, false, false, false],
        [true, false, false, true, false, false],
        [true, false, false, false, false, false],
        [true, false, true, false, true, false],
        [true, false, false, false, false, false],
      ],
    },
    news: {
      eyebrow: 'غرفة الأخبار',
      title1: 'WAVZ',
      titleAccent: 'أخبار وتحديثات',
      lede: 'أحدث الشراكات والإنجازات والرؤى من WAVZ للتحول الرقمي.',
      filterAll: 'الكل',
      filterAnnouncements: 'شراكات',
      filterInsights: 'رؤى',
      filterEvents: 'فعاليات',
      backToNews: 'العودة إلى الأخبار',
      readArticle: 'اقرأ المقال',
      seeMore: 'عرض جميع الأخبار',
      categories: {
        announcement: 'شراكة',
        insight: 'رؤية',
        event: 'فعالية',
      },
      items: [
        {
          id: 'mbme-partnership',
          content: `القاهرة، 22 يناير 2025 – أعلنت شركة WAVZ للتحول الرقمي، الشركة المصرية الرائدة في مجال توفير الحلول الرقمية والخدمات ذات الصلة في منطقة الشرق الأوسط وإفريقيا، ومجموعة MBME PJSC، الشركة الرائدة في مجال الحلول التكنولوجية والتحول الرقمي، اليوم عن مذكرة تفاهم مهمة. وتهدف هذه الشراكة الاستراتيجية إلى الاستفادة من نقاط القوة المشتركة لكلا المنظمتين لتقديم حلول تكنولوجية متطورة وخدمات رقمية تعمل على تسريع التحول الرقمي في جميع أنحاء المنطقة.

وجرت مراسم توقيع مذكرة التفاهم في أبوظبي، بحضور م. عمرو عصمت، العضو المنتدب والرئيس التنفيذي لشركة WAVZ، والسيد عبد الهادي محمد، العضو المنتدب والرئيس التنفيذي لمجموعة MBME. وسيركز هذا التعاون على تقديم قيمة مضافة كبيرة للعملاء في جميع أنحاء الشرق الأوسط وأفريقيا. ومن خلال الاستفادة من الخبرات المشتركة لكلا الشركتين، ستعمل هذه الشراكة على تمكين الشركات والحكومات من تحقيق أهدافها الاستراتيجية من خلال حلول مبتكرة.

"يسعدنا الشروع في هذه الشراكة الاستراتيجية مع مجموعة MBME، الشركة الرائدة في مجال التكنولوجيا والتحول الرقمي. يمثل هذا التعاون علامة بارزة في رحلتنا نحو مستقبل مدعوم رقميًا في المنطقة. ومن خلال توحيد قوانا والاستفادة من نقاط قوتنا الجماعية، سنقدم حلولًا مبتكرة تخلق قيمة كبيرة للشركات والحكومات والمستخدمين النهائيين داخل المنطقة." م. عمرو عصمت، العضو المنتدب والرئيس التنفيذي لشركة WAVZ

"يسعدنا الشروع في هذه الشراكة الاستراتيجية مع مجموعة MBME، الشركة الرائدة في مجال التكنولوجيا والتحول الرقمي. يمثل هذا التعاون علامة بارزة في رحلتنا نحو مستقبل مدعوم رقميًا في المنطقة. ومن خلال توحيد قوانا والاستفادة من نقاط قوتنا الجماعية، سنقدم حلولًا مبتكرة تخلق قيمة كبيرة للشركات والحكومات والمستخدمين النهائيين داخل المنطقة."

"وقعنا مذكرة تفاهم مع مجموعة MBME Group PJSC، الشركة الرائدة في مجال الحلول التقنية والتحول الرقمي"

"يمثل هذا التعاون علامة بارزة في رحلتنا نحو مستقبل مدعوم رقميًا في المنطقة."

عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ

"تعكس هذه الشراكة التزامنا بتقديم حلول مبتكرة وتحويلية للعملاء في منطقة الشرق الأوسط وأفريقيا. وتكمل الخبرة التي تقدمها WAVZ قدرات MBME، ونطمح معًا إلى رفع معايير المدفوعات الآمنة والتحول الرقمي." السيد عبد الهادي محمد، العضو المنتدب والرئيس التنفيذي لمجموعة MBME

"تعكس هذه الشراكة التزامنا بتقديم حلول مبتكرة وتحويلية للعملاء في منطقة الشرق الأوسط وأفريقيا. وتكمل الخبرة التي تقدمها WAVZ قدرات MBME، ونطمح معًا إلى رفع معايير المدفوعات الآمنة والتحول الرقمي."

مؤسسة بهية هي المؤسسة الرائدة في مصر المتخصصة في الكشف المبكر وعلاج سرطان الثدي. تقدم المؤسسة خدماتها مجانًا للنساء اللاتي يكافحن سرطان الثدي في جميع أنحاء مصر. وتأتي هذه الشراكة كجزء من استراتيجية المسؤولية الاجتماعية لشركة WAVZ لدعم المشروعات والمبادرات المجتمعية، والتزامها بالمساهمة في تحقيق التنمية المستدامة في مصر.

WAVZ للتحول الرقمي هي شركة رائدة في مجال توفير حلول الأعمال والخدمات الرقمية الشهيرة، وهي مكرسة لتقديم حلول تحويلية ومصممة خصيصًا لتعزيز الكفاءة التشغيلية ورفع مستوى مشاركة العملاء. من خلال الجمع بين الابتكار والخبرة الصناعية العميقة، تعمل WAVZ على تمكين عملائها من التركيز على أهدافهم وتطلعاتهم التجارية الأساسية. تتحمل WAVZ مسؤولية تلبية جميع الاحتياجات التكنولوجية من خلال مجموعة خدماتها الشاملة، مما يسمح للعملاء بالتركيز على أهداف أعمالهم الأساسية.

مجموعة إم بي إم إي ش.م.ع. تعمل كأكبر مزود لخدمات التكنولوجيا في دولة الإمارات العربية المتحدة، وتسهيل الخدمات الحكومية وشبه الحكومية والخاصة. وتتخصص المجموعة في التكنولوجيا المتطورة والخدمات الرقمية وإدارة المنتجات والاستثمارات التقنية الاستراتيجية، مع نظام بيئي متكامل للتكنولوجيا المالية يتضمن MBME Pay وMBME Wow Pay وMBME Investment. وباعتبارها شركة إماراتية، تضمن خبرتها المحلية أن تكون الحلول مصممة خصيصًا لتلبية الاحتياجات الإقليمية، مع أكثر من 770 واجهة برمجة تطبيقات داخلية وأكثر من 4000 نقطة اتصال ذكية في جميع أنحاء دولة الإمارات العربية المتحدة، وتخدم المجموعة أكثر من 3.2 مليون عميل، مما يجعل MBME شريكًا موثوقًا به في صناعة الابتكار في مجال التكنولوجيا المالية وخدمات الدفع في دولة الإمارات العربية المتحدة.`,
          category: 'announcement',
          date: '31 يناير 2025',
          readTime: '4 دقائق قراءة',
          image: '/news/mbme.jpg',
          title: 'WAVZ ومجموعة MBME يُبرمان شراكة استراتيجية لدفع التحول الرقمي',
          excerpt: 'أعلنت WAVZ للتحول الرقمي ومجموعة MBME PJSC عن شراكة استراتيجية لتسريع التحول الرقمي في منطقة الشرق الأوسط وأفريقيا.',
          url: 'https://wavz.com.eg/news/wavz-and-mbme-group-forge-strategic-partnership-to-drive-digital-transformation-across-the-middle-east-and-africa/',
        },
        {
          id: 'baheya-foundation',
          content: `القاهرة، 23 سبتمبر 2024، أعلنت شركة WAVZ للتحول الرقمي، الشركة المصرية الرائدة في تقديم الحلول الرقمية في الشرق الأوسط وأفريقيا، التابعة لشركة PFI (شركة البريد للاستثمار)، عن توقيع بروتوكول تعاون مع مؤسسة بهية، المؤسسة الخيرية الرائدة للكشف المبكر وعلاج سرطان الثدي، بهدف تقديم الدعم الشامل والتطوير لحل SAP ERP، مما سيساعد بهية على إدارة عملياتها المالية والإدارية بشكل أفضل. ويأتي هذا التعاون في إطار التزام WAVZ بمسؤوليتها الاجتماعية تجاه المجتمع المصري، حيث تم الاتفاق على تقديم هذه الخدمات إيمانًا من WAVZ بأهمية دعم المؤسسات الخيرية والمستشفيات التي تقدم خدمات حيوية لشرائح كبيرة من المجتمع المصري.

"نحن في WAVZ نؤمن بأهمية تقديم الدعم للمؤسسات التي تعمل على تحسين حياة الشعب المصري. تلعب مؤسسة بهية دورًا محوريًا في علاج سرطان الثدي في مصر. ونعتقد أنه من خلال تقديم خدمات دعم وتطوير SAP الخاصة بنا إلى بهية، فإننا نساهم في تحسين كفاءة عملياتها، مما سيمكن طاقمها الطبي والإداري من التركيز على ما يهم حقًا - توفير أفضل رعاية للمرضى." م. عمرو عصمت، العضو المنتدب والرئيس التنفيذي لشركة WAVZ

"نحن في WAVZ نؤمن بأهمية تقديم الدعم للمؤسسات التي تعمل على تحسين حياة الشعب المصري. تلعب مؤسسة بهية دورًا محوريًا في علاج سرطان الثدي في مصر. ونعتقد أنه من خلال تقديم خدمات دعم وتطوير SAP الخاصة بنا إلى بهية، فإننا نساهم في تحسين كفاءة عملياتها، مما سيمكن طاقمها الطبي والإداري من التركيز على ما يهم حقًا - توفير أفضل رعاية للمرضى."

"وقعنا بروتوكول تعاون مع مؤسسة بهية المؤسسة الخيرية الرائدة للكشف المبكر وعلاج سرطان الثدي"

"يأتي هذا التعاون في إطار التزام WAVZ بمسؤوليتها الاجتماعية تجاه المجتمع المصري"

عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ

"يسعدنا توقيع هذا البروتوكول مع WAVZ، والذي يعكس التزامهم بدعم قضايا المجتمع والصحة العامة. سيساعد هذا الدعم في تمكين مؤسسة بهية من إدارة أعمالنا بشكل أفضل والتركيز على مهمتنا الأساسية وهي الوصول إلى المزيد من النساء في مصر وتزويدهن بالكشف المبكر عن سرطان الثدي وعلاجه." م. جيلان فلفلة، عضو مجلس أمناء مؤسسة بهية ورئيس لجنة الابتكار والتكنولوجيا

"يسعدنا توقيع هذا البروتوكول مع WAVZ، والذي يعكس التزامهم بدعم قضايا المجتمع والصحة العامة. سيساعد هذا الدعم في تمكين مؤسسة بهية من إدارة أعمالنا بشكل أفضل والتركيز على مهمتنا الأساسية وهي الوصول إلى المزيد من النساء في مصر وتزويدهن بالكشف المبكر عن سرطان الثدي وعلاجه."

مؤسسة بهية هي المؤسسة الرائدة في مصر المتخصصة في الكشف المبكر وعلاج سرطان الثدي. تقدم المؤسسة خدماتها مجانًا للنساء اللاتي يكافحن سرطان الثدي في جميع أنحاء مصر. وتأتي هذه الشراكة كجزء من استراتيجية المسؤولية الاجتماعية لشركة WAVZ لدعم المشروعات والمبادرات المجتمعية، والتزامها بالمساهمة في تحقيق التنمية المستدامة في مصر.

WAVZ هي شركة رائدة في مجال توفير حلول التحول الرقمي، وهي متخصصة في مساعدة المؤسسات في مختلف الصناعات على تحسين عملياتها، والاستفادة من التقنيات الناشئة، وتعزيز تجربة العملاء. ومع سجل حافل من التطبيقات الناجحة، نحن ملتزمون بتقديم حلول مبتكرة تؤدي إلى نتائج أعمال ملموسة.

بهية هي مؤسسة رائدة غير ربحية تقوم على مبدأين رئيسيين: الاستدامة والشراكة المجتمعية. تقدم بهية برامج توعوية مبتكرة متخصصة في الكشف المبكر عن سرطان الثدي وعلاجه باستخدام أحدث التقنيات.`,
          category: 'announcement',
          date: '23 سبتمبر 2024',
          readTime: '3 دقائق قراءة',
          image: '/news/baheya.jpg',
          title: 'WAVZ توقع بروتوكول تعاون مع مؤسسة بهية لدعم SAP',
          excerpt: 'وقّعت WAVZ للتحول الرقمي بروتوكول تعاون مع مؤسسة بهية لتقديم خدمات دعم SAP وتطويرها، تمكيناً لمهمة المؤسسة.',
          url: 'https://wavz.com.eg/news/wavz-for-digital-transformation-signs-a-cooperation-protocol-with-baheya-foundation-to-provide-sap-support-and-development-services/',
        },
        {
          id: 'teradata-agreement',
          content: `[القاهرة، مصر – 5 سبتمبر 2024] – أعلنت شركة WAVZ للتحول الرقمي، وهي شركة مصرية بارزة لحلول تكنولوجيا المعلومات، وشركة Teradata اليوم عن اتفاقية استراتيجية لدفع التحول الرقمي وابتكار الذكاء الاصطناعي القائم على البيانات للشركات في مصر.

ستوفر Teradata منصة Vantage للبيانات والتحليلات الخاصة بها إلى WAVZ، مما يتيح لـ WAVZ أن تقدم لعملائها مجموعة شاملة من قدرات تحليل البيانات المتقدمة، بما في ذلك الذكاء الاصطناعي/التعلم الآلي. ومن خلال هذا التعاون، ستتمكن الشركات المصرية في مختلف القطاعات من الوصول إلى إمكانات ClearScape Analytics ذات المستوى العالمي من Teradata، مما يمكّنها من إطلاق رؤى قيمة من بياناتها، وتنفيذ الذكاء الاصطناعي الموثوق به، واتخاذ قرارات أكثر استنارة توفر قيمة الأعمال.

تهدف الشراكة بين WAVZ وTeradata إلى دفع الابتكار في مشهد الأعمال المصري بالطرق التالية:

توفير الوصول إلى قدرات تحليل البيانات المتقدمة: من خلال الوصول إلى Teradata Vantage، من المتوقع أن تكون الشركات المصرية قادرة على إطلاق العنان للرؤى التي تدعم اتخاذ قرارات أفضل، والابتكار بشكل أسرع، والقيمة المتسارعة.

تمكين نمو الأعمال والقدرة التنافسية: يهدف دمج قدرات التحليلات المتقدمة لشركة Teradata في عروض خدمات WAVZ إلى تقديم إجابات أفضل ونتائج أسرع، مما يساعد الشركات المصرية على تحديد فرص جديدة للنمو واكتساب ميزة تنافسية في الصناعات الخاصة بها.

تقديم خدمات شاملة: من خلال تعاونهما الوثيق، ستعمل WAVZ وTeradata معًا لدعم عملائهما المشتركين في رحلات التحول الرقمي الخاصة بهما. وسيشمل ذلك تقديم حلول مخصصة وخدمات التنفيذ والمساعدة الفنية المستمرة لضمان الاعتماد والاستخدام الناجح لتحليلات البيانات وقدرات الذكاء الاصطناعي.

"إن تعاوننا مع Teradata سيعزز بشكل كبير قدرتنا على توفير حلول بيانات مخصصة وموثوقة لعملائنا. ومن خلال دمج التحليلات المتقدمة وقدرات الذكاء الاصطناعي لشركة Teradata في عروضنا، يمكننا مساعدة الشركات المصرية على فتح فرص جديدة للنمو واكتساب ميزة تنافسية في الصناعات الخاصة بها." م. عمرو عصمت، العضو المنتدب والرئيس التنفيذي لشركة WAVZ

"إن تعاوننا مع Teradata سيعزز بشكل كبير قدرتنا على توفير حلول بيانات مخصصة وموثوقة لعملائنا. ومن خلال دمج التحليلات المتقدمة وقدرات الذكاء الاصطناعي لشركة Teradata في عروضنا، يمكننا مساعدة الشركات المصرية على فتح فرص جديدة للنمو واكتساب ميزة تنافسية في الصناعات الخاصة بها."

"أعلنت WAVZ وTerada عن اتفاقية استراتيجية لدفع التحول الرقمي وابتكار الذكاء الاصطناعي المبني على البيانات للشركات في مصر.

"تهدف هذه الشراكة إلى تحفيز الابتكار في مشهد الأعمال المصري"

عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ

ومن المتوقع أن تؤدي الشراكة بين WAVZ وTeradata إلى تسريع اعتماد تقنيات الذكاء الاصطناعي وتعزيز الابتكار في مشهد الأعمال المصري. ومن خلال هذا التحالف الاستراتيجي، ستعمل الشركتان بشكل وثيق لدعم عملائهما المشتركين في رحلات التحول الرقمي الخاصة بهم وتسخير قوة بياناتهم للذكاء الاصطناعي.

ومن خلال التركيز على القطاعين المالي والحكومي، يمكن للتعاون أن يلعب دورًا حاسمًا في دفع الابتكار في بعض الصناعات الأكثر أهمية في الاقتصاد المصري. إن الجمع بين الخبرة العالمية ومعرفة السوق المحلية يمكن أن يفتح قيمة كبيرة لهذه القطاعات ويساهم في التنمية الاقتصادية والاجتماعية الشاملة للبلاد.

"في Teradata، نعلم أن الأشخاص يزدهرون عندما يتم تمكينهم بمعلومات موثوقة. ونحن متحمسون لبدء العمل مع WAVZ والاستفادة من خبراتهم في السوق المصري لجلب منصة Teradata المبتكرة وقدرات الذكاء الاصطناعي الموثوقة إلى الشركات المحلية." السيد خالد حمودة، مدير عام شركة تيراداتا مصر

"في Teradata، نعلم أن الأشخاص يزدهرون عندما يتم تمكينهم بمعلومات موثوقة. ونحن متحمسون لبدء العمل مع WAVZ والاستفادة من خبراتهم في السوق المصري لجلب منصة Teradata المبتكرة وقدرات الذكاء الاصطناعي الموثوقة إلى الشركات المحلية."

WAVZ هي إحدى الشركات الرائدة في مجال توفير الخدمات المدارة وشركة تنفيذ واستشارات SAP. وتقدم الشركة مجموعة شاملة من خدمات SAP، بما في ذلك التنفيذ والاستشارات والخدمات المدارة. تتمتع WAVZ بسجل حافل في مساعدة العملاء على تنفيذ وإدارة حلول SAP بنجاح. يوفر نموذج أعمال الخدمات المُدارة الخاص بالشركة للعملاء المرونة وقابلية التوسع التي يحتاجون إليها لتنمية أعمالهم. لمزيد من المعلومات زوروا https://wavz.com.eg`,
          category: 'announcement',
          date: '8 سبتمبر 2024',
          readTime: '4 دقائق قراءة',
          image: '/news/teradata.jpg',
          title: 'WAVZ وTeradata يُعلنان اتفاقية استراتيجية لتحليلات البيانات والذكاء الاصطناعي',
          excerpt: 'أعلنت WAVZ وTeradata عن اتفاقية استراتيجية لدفع التحول الرقمي والابتكار المدفوع بالذكاء الاصطناعي للشركات في مصر والمنطقة.',
          url: 'https://wavz.com.eg/news/wavz-and-teradata-announce-strategic-agreement-to-empower-egyptian-enterprises-with-data-analytics-and-ai/',
        },
        {
          id: 'tietoevry-2030',
          content: `القاهرة – يونيو 2024، استضافت شركة WAVZ للتحول الرقمي، الشركة المصرية الرائدة في مجال توفير الحلول الرقمية والخدمات ذات الصلة في الشرق الأوسط وأفريقيا، ورشة عمل ملهمة بعنوان “تصور مستقبل المدفوعات” في فندق سانت ريجيس المرموق. وجمع الحدث شخصيات بارزة من القطاع المصرفي والمالي، إلى جانب خبراء من WAVZ وشريكهم الاستراتيجي في أنظمة الدفع الرقمية، Tietoevry.

وتناولت ورشة العمل القوة التحويلية للتحول الرقمي في مجال المدفوعات، واستكشفت كيف تشكل الاتجاهات المحلية والعالمية مستقبل التجارة الإلكترونية، والمعاملات في الوقت الفعلي، وتجربة العملاء الشاملة. وسلطت المناقشات الضوء على تأثير جائحة كوفيد-19 في تسريع هذا التحول، حيث تشهد معدلات التسوق عبر الإنترنت ارتفاعًا كبيرًا.

وتم استكشاف الاتجاهات العالمية الرئيسية التي تشكل مستقبل الخدمات المصرفية، بما في ذلك ظهور المدفوعات في الوقت الفعلي على مدار الساعة طوال أيام الأسبوع، وضغوط الرقمنة المستمرة، والنظم البيئية الرقمية المجزأة، والحاجة المتزايدة إلى تجارب سلسة للعملاء، والتجارة الإلكترونية ورقمنة التجارة، واللوائح التنظيمية المتطورة، والتحديات الجيوسياسية، وتأثير العوامل الاقتصادية - مثل ارتفاع أسعار الفائدة والتضخم - على المؤسسات المالية.

ولإضافة بُعد مثير للحدث، أعلنت WAVZ عن توسيع محوري لشراكتها مع Tietoevry. يجعل هذا التعاون WAVZ مزود الدعم الإقليمي لحلول الدفع المبتكرة من Tietoevry في جميع أنحاء منطقة الشرق الأوسط وأفريقيا. وستستفيد WAVZ من فريقها من المهنيين المحليين ذوي المهارات العالية والمعتمدين لتقديم هذه الحلول، مما يضمن استيفاء أعلى المعايير الدولية.

يسلط هذا التحالف الاستراتيجي الضوء على التزام WAVZ وTietoevry الثابت تجاه السوق المصرية ومنطقة الشرق الأوسط وأفريقيا الأوسع. إنه يدل على رؤية مشتركة لدفع التقدم وتقديم تقنيات الدفع العالمية المتطورة من خلال عدسة محلية. وستكون خبرة WAVZ في التوطين وفريقها من الموظفين المصريين المدربين تدريبا عاليا دورا أساسيا في تحقيق هذه الرؤية.

"يسعدنا التعاون مع شركة Tietoevry، الشركة الرائدة عالميًا في مجال حلول الدفع وصناعة الخدمات. معًا، سنقدم لعملائنا مجموعة شاملة من الحلول الرقمية المبتكرة والمتقدمة عبر مختلف الصناعات. وهذا يشمل النظام المصرفي المفتوح التحويلي، وتسهيل المعاملات الآمنة والسريعة في جميع أنحاء العالم. وتتوافق هذه الشراكة تمامًا مع استراتيجية التوسع لدينا والتزامنا بتقديم الخدمات من خلال متخصصين محليين مؤهلين تأهيلاً عاليًا. إن مستقبل المدفوعات مليء باتجاهات تغيير قواعد اللعبة، ونحن في طليعة إعادة تشكيل هذا المشهد ". م. عمرو عصمت، العضو المنتدب والرئيس التنفيذي لشركة WAVZ

"يسعدنا التعاون مع شركة Tietoevry، الشركة الرائدة عالميًا في مجال حلول الدفع وصناعة الخدمات. معًا، سنقدم لعملائنا مجموعة شاملة من الحلول الرقمية المبتكرة والمتقدمة عبر مختلف الصناعات. وهذا يشمل النظام المصرفي المفتوح التحويلي، وتسهيل المعاملات الآمنة والسريعة في جميع أنحاء العالم. وتتوافق هذه الشراكة تمامًا مع استراتيجية التوسع لدينا والتزامنا بتقديم الخدمات من خلال متخصصين محليين مؤهلين تأهيلاً عاليًا. إن مستقبل المدفوعات مليء باتجاهات تغيير قواعد اللعبة، ونحن في طليعة إعادة تشكيل هذا المشهد ".

"لقد أعلنا عن توسيع محوري لشراكتنا مع تيتويفري."

"الاتجاهات المبتكرة المستقبلية ستعيد تعريف كيفية تعاملنا مع أنظمة الدفع المختلفة"

عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ

"إن شراكتنا مع WAVZ توفر فرصًا جديدة للنمو والتحول الرقمي في المنطقة. ومع أن الاقتصاد العالمي يشهد تطورًا سريعًا، فمن الضروري أن يكون لدينا شريك يوفر موارد استثنائية وخبرة وموظفين مدربين جيدًا ويفهمون الثقافة المحلية. وتعزز هذه الشراكة التزامنا بالنجاح وتمكننا من تحقيق رؤيتنا للمنطقة. ونحن ندرك أيضًا كيف تعمل المدفوعات في الوقت الفعلي على تحويل العمليات التجارية، من خلال توفير وصول أسرع إلى رأس المال العامل وتعزيز التدفق النقدي. إنه وقت مثير للشركات، حيث يُحدث هذا الابتكار ثورة في الطريقة التي تعمل بها تشغيل وإدارة الشؤون المالية." Edgars Bīberis، المدير الإقليمي لتطوير الأعمال في Tietoevry

"إن شراكتنا مع WAVZ توفر فرصًا جديدة للنمو والتحول الرقمي في المنطقة. ومع أن الاقتصاد العالمي يشهد تطورًا سريعًا، فمن الضروري أن يكون لدينا شريك يوفر موارد استثنائية وخبرة وموظفين مدربين جيدًا ويفهمون الثقافة المحلية. وتعزز هذه الشراكة التزامنا بالنجاح وتمكننا من تحقيق رؤيتنا للمنطقة. ونحن ندرك أيضًا كيف تعمل المدفوعات في الوقت الفعلي على تحويل العمليات التجارية، من خلال توفير وصول أسرع إلى رأس المال العامل وتعزيز التدفق النقدي. إنه وقت مثير للشركات، حيث يُحدث هذا الابتكار ثورة في الطريقة التي تعمل بها تشغيل وإدارة الشؤون المالية."

WAVZ هي إحدى الشركات الرائدة في مجال توفير الخدمات المدارة وشركة تنفيذ واستشارات SAP. وتقدم الشركة مجموعة شاملة من خدمات SAP، بما في ذلك التنفيذ والاستشارات والخدمات المدارة. تتمتع WAVZ بسجل حافل في مساعدة العملاء على تنفيذ وإدارة حلول SAP بنجاح. يوفر نموذج أعمال الخدمات المُدارة الخاص بالشركة للعملاء المرونة وقابلية التوسع التي يحتاجون إليها لتنمية أعمالهم. لمزيد من المعلومات زوروا https://wavz.com.eg

يبتكر Tietoevry تقنية هادفة تعيد اختراع العالم من أجل الخير. نحن شركة تكنولوجية رائدة تتمتع بتراث شمالي قوي وقدرات عالمية. واستنادًا إلى قيمنا الأساسية المتمثلة في الانفتاح والثقة والتنوع، فإننا نعمل مع عملائنا لتطوير المستقبل الرقمي حيث تزدهر الشركات والمجتمعات والإنسانية.

يتخصص خبراؤنا البالغ عددهم 24000 خبيرًا عالميًا في السحابة والبيانات والبرمجيات، ويقدمون خدماتهم لآلاف المؤسسات وعملاء القطاع العام في أكثر من 90 دولة. تبلغ مبيعات شركة Tietoevry السنوية ما يقرب من 3 مليارات يورو، وأسهم الشركة مدرجة في بورصة ناسداك في هلسنكي وستوكهولم، وكذلك في أوسلو بورس.`,
          category: 'event',
          date: '10 يونيو 2024',
          readTime: '3 دقائق قراءة',
          image: '/news/tietoevry.jpg',
          title: 'WAVZ وTietoevry يشاركان رؤية أنظمة الدفع 2030 مع قادة البنوك المصرية',
          excerpt: 'استضافت WAVZ ورشة عمل ملهمة بعنوان "تصوُّر مستقبل المدفوعات" في فندق سانت ريجيس المرموق، بحضور قادة البنوك المصرية.',
          url: 'https://wavz.com.eg/news/wavz-and-tietoevry-share-their-payment-systems-2030-vision-with-egyptian-banking-leaders/',
        },
        {
          id: 'leap-saudi',
          content: `الرياض، المملكة العربية السعودية، 6 مارس 2024 – تشارك شركة WAVZ للتحول الرقمي، الشركة المصرية الرائدة في مجال توفير الحلول والخدمات الرقمية في الشرق الأوسط وإفريقيا، بنشاط في النسخة الثالثة من LEAP، الحدث الأول لمحترفي التكنولوجيا، الذي يعقد في الرياض، المملكة العربية السعودية. LEAP هو حدث تقني عالمي يجمع مئات الآلاف من الحضور لعرض أحدث التقنيات وآثارها على ازدهار البشرية وإيجاد حلول مبتكرة للتحديات الرئيسية التي تواجهها.

تنضم WAVZ إلى مجموعة متميزة من الشركات المصرية المشاركة في جناح غرفة صناعة تكنولوجيا المعلومات والاتصالات (CIT). تمثل هذه المشاركة فرصة قيمة لشركة WAVZ للتواصل مع صناع القرار الرئيسيين في المملكة العربية السعودية، وتعزيز الشراكات مع الهيئات الحكومية والمؤسسات الأكاديمية والكيانات التجارية، وكذلك لعرض أحدث حلولها الرقمية وقدراتها على الخدمات، مما يدل على خبرة الشركة في المشهد الرقمي سريع التطور.

"يسعدنا أن نشارك في هذه القمة التكنولوجية العالمية المرموقة. توفر LEAP منصة لاستكشاف أوجه التعاون المحتملة، والتعمق في الحلول المتطورة، وفتح آفاق جديدة لتوسيع الوصول إلى الحلول والخدمات الرقمية المصرية في الأسواق الدولية، بما يتماشى مع رؤية الحكومة المصرية لزيادة صادرات الخدمات الرقمية ". عمرو عصمت، العضو المنتدب والرئيس التنفيذي لشركة WAVZ

"يسعدنا أن نشارك في هذه القمة التكنولوجية العالمية المرموقة. توفر LEAP منصة لاستكشاف أوجه التعاون المحتملة، والتعمق في الحلول المتطورة، وفتح آفاق جديدة لتوسيع الوصول إلى الحلول والخدمات الرقمية المصرية في الأسواق الدولية، بما يتماشى مع رؤية الحكومة المصرية لزيادة صادرات الخدمات الرقمية. "

وأضاف عصمت: "نحن نعمل على ترسيخ التزامنا بشكل أكبر من خلال اتفاقية الشراكة الاستراتيجية اليوم مع شركة AZM السعودية، وهي شركة رائدة في مجال تكنولوجيا المعلومات. ويشير هذا التعاون إلى خطوة مهمة إلى الأمام في توسع WAVZ عبر منطقة الشرق الأوسط وأفريقيا.

"نحن متحمسون لشراكتنا مع WAVZ، الحليف الاستراتيجي الذي يكمل قدراتنا ويدعم احتياجات مشاريعنا المشتركة. ونتطلع إلى تعاون مثمر وتحقيق نجاحات جديدة معًا." م. علي البلا، الرئيس التنفيذي لشركة AZM السعودية

"نحن متحمسون لشراكتنا مع WAVZ، الحليف الاستراتيجي الذي يكمل قدراتنا ويدعم احتياجات مشاريعنا المشتركة. ونتطلع إلى تعاون مثمر وتحقيق نجاحات جديدة معًا."

"لقد وقعنا شراكة استراتيجية مع شركة AZM السعودية."

"تُظهر WAVZ التزامها برؤية تصدير الخدمات الرقمية في مصر من خلال مشاركة LEAP."

عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ

ومن الجدير بالذكر أن مهمة WAVZ هي توفير حلول رقمية قوية وفعالة من حيث التكلفة، والتي تمكن المؤسسات من تحقيق أهدافها في مجال تكنولوجيا المعلومات والأعمال، والتنقل في المشهد التكنولوجي المتطور باستمرار بخفة وثقة. تمتد مهمة WAVZ إلى ما هو أبعد من التكنولوجيا. إنهم يعززون بيئة مزدهرة حيث يمكن لفريقهم الموهوب أن يزدهر، ويساهمون بخبراتهم لدعم نجاحهم. تركز WAVZ على بناء شراكات هادفة من شأنها أن تساعدهم على تحقيق هدفهم المتمثل في أن يصبحوا المستشار الموثوق والشريك المفضل الذي يدعم المؤسسات في رحلة التحول الرقمي الخاصة بهم. تقدم WAVZ مجموعة شاملة من الخدمات، والتي تتم إدارتها وفقًا لأحدث المعايير الدولية، مما يضمن أن العملاء يمكنهم التركيز على أنشطتهم التجارية الأساسية بينما تلبي WAVZ احتياجاتهم التكنولوجية بسلاسة.

يجمع برنامج LEAP بين الشركات والخبراء الدوليين لتبادل الأفكار والمعرفة عبر مختلف المجالات، بما في ذلك التكنولوجيا والذكاء الاصطناعي والاستدامة واستكشاف الفضاء والأمن السيبراني. ويعد هذا الحدث بمثابة منصة للمبتكرين والمستثمرين والشركات الرائدة، مما يساهم في نمو المنطقة كمركز تكنولوجي ويقدم منصات متخصصة للمستثمرين والشركات الناشئة.

WAVZ هي إحدى الشركات الرائدة في مجال توفير الخدمات المدارة وشركة تنفيذ واستشارات SAP. وتقدم الشركة مجموعة شاملة من خدمات SAP، بما في ذلك التنفيذ والاستشارات والخدمات المدارة. تتمتع WAVZ بسجل حافل في مساعدة العملاء على تنفيذ وإدارة حلول SAP بنجاح. يوفر نموذج أعمال الخدمات المُدارة الخاص بالشركة للعملاء المرونة وقابلية التوسع التي يحتاجون إليها لتنمية أعمالهم. لمزيد من المعلومات زوروا https://wavz.com.eg`,
          category: 'event',
          date: '6 مارس 2024',
          readTime: '3 دقائق قراءة',
          image: '/news/leap.jpg',
          title: 'WAVZ تعرض خبرتها الرقمية في LEAP بالمملكة العربية السعودية',
          excerpt: 'شاركت WAVZ بفاعلية في الطبعة الثالثة من LEAP في الرياض، أبرز حدث تقني، مستعرضةً قدراتها المتطورة في التحول الرقمي.',
          url: 'https://wavz.com.eg/news/leap-in-saudi-arabia/',
        },
        {
          id: 'revenue-2023',
          content: `القاهرة، مصر، 12 فبراير 2024 – أعلنت شركة WAVZ للتحول الرقمي، الشركة المصرية الرائدة في مجال توفير الحلول الرقمية والخدمات ذات الصلة في الشرق الأوسط وأفريقيا، اليوم عن عام ملحوظ من النمو في عام 2023، حيث تضاعفت إيراداتها على أساس سنوي لتصل إلى 507 مليون جنيه مصري، بينما ارتفعت أرباحها بنسبة 120٪. نما فريق القوى العاملة في WAVZ إلى 1300 موظف، وهو ما يمثل زيادة بنسبة 100% في فرص العمل خلال عامين.

وقال المهندس: "نحن سعداء بالنتائج الاستثنائية التي تحققت في عام 2023". عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ. "يرجع هذا النجاح إلى توسعنا الكبير في مجالات جديدة للتحول الرقمي والخدمات المدارة، مما يسمح لنا باغتنام فرص نمو كبيرة عبر الأسواق المصرية والشرق أوسطية والإفريقية. كما أنشأنا شراكات استراتيجية تمكننا من تقديم حلول أكثر ابتكارًا وذات صلة بالسوق لعملائنا."

وأوضح عصمت أيضًا: "تتضمن خطة النمو الاستراتيجي لدينا استكشاف أسواق جديدة، وتقديم خدمات استراتيجية رئيسية لعملائنا، مما أدى إلى زيادة موجة التوظيف. في WAVZ، نسعى جاهدين لنكون أفضل صاحب عمل في السوق، من خلال جذب ورعاية المواهب المحلية ذات المهارات العالية. تقدم فرقنا، التي تم تدريبها وفقًا لأعلى المعايير الدولية، خدمات متميزة، مما يجعلنا مستشارًا موثوقًا ومزود حلول مفضل للعملاء الذين يمرون برحلات التحول الرقمي الخاصة بهم. نحن نساعدهم على الاستمرار في التركيز على أعمالهم الأساسية بينما نعتني بتطوراتهم التكنولوجية. احتياجاتنا من خلال حلولنا وخدماتنا المتطورة الرائدة في الصناعة."

"في WAVZ، نشعل نجاح الأعمال من خلال حلول رقمية قوية وفعالة من حيث التكلفة. نحن نمكّن عملائنا من تحقيق أهدافهم في مجال تكنولوجيا المعلومات والأعمال، والتنقل في المشهد التكنولوجي المتطور باستمرار بخفة وثقة. تمتد مهمتنا إلى ما هو أبعد من التكنولوجيا. نحن نعزز بيئة مزدهرة حيث يمكن لفريقنا الموهوب أن يزدهر، ويساهم بخبرته لدعم نجاح عملائنا. جنبًا إلى جنب مع عملائنا، نبني شراكات هادفة، ونصبح مستشارهم الموثوق به وشريكهم المفضل في رحلة التحول الرقمي الخاصة بهم." عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ

"في WAVZ، نشعل نجاح الأعمال من خلال حلول رقمية قوية وفعالة من حيث التكلفة. نحن نمكّن عملائنا من تحقيق أهدافهم في مجال تكنولوجيا المعلومات والأعمال، والتنقل في المشهد التكنولوجي المتطور باستمرار بخفة وثقة. تمتد مهمتنا إلى ما هو أبعد من التكنولوجيا. نحن نعزز بيئة مزدهرة حيث يمكن لفريقنا الموهوب أن يزدهر، ويساهم بخبرته لدعم نجاح عملائنا. جنبًا إلى جنب مع عملائنا، نبني شراكات هادفة، ونصبح مستشارهم الموثوق به وشريكهم المفضل في رحلة التحول الرقمي الخاصة بهم."

"أرباحنا زادت بنسبة 120% وإيراداتنا تضاعفت في 2023"

"لقد ضاعفنا فرص العمل لدينا خلال عامين للوصول إلى 1300 موظف."

عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ

إدراكًا لاتجاهات التحول الرقمي العالمية، قامت WAVZ بتوسيع شبكة شركائها الدوليين بنشاط. تشمل عمليات التعاون الرئيسية نيفيس لأنظمة الأمن السيبراني. وفي الوقت نفسه، قامت WAVZ بتعزيز وتحديث شراكاتها الحالية مع شركاء التكنولوجيا الدوليين ذوي المستوى العالمي مثل SAP وTemenos وTietoevry، مما يمكّن WAVZ من تقديم مجموعة شاملة من الحلول الرقمية المتقدمة عبر الصناعات المتنوعة. وتشمل هذه الحلول المصرفية المفتوحة للمعاملات العالمية الآمنة والسريعة، وحلول وخدمات الخدمات المدارة الفريدة من نوعها من WAVZ، وحلول SAP وTemenos المتطورة. ومن الجدير بالذكر أيضًا أن WAVZ تقدم حلولها وخدماتها من خلال نماذج أعمال متنوعة وفقًا لاحتياجات العملاء ومتطلباتهم، مما يمكّن الشركات بمختلف أحجامها من زيادة الكفاءة وخفض التكاليف والاستفادة من رؤى البيانات الفورية التي تسهل عملية اتخاذ قرارات أكثر استنارة.

WAVZ للتحول الرقمي هي شركة مصرية رائدة في مجال تقديم حلول وخدمات تكنولوجيا المعلومات الرقمية. بفضل سجل حافل من التطبيقات الناجحة عبر مختلف الصناعات، تلتزم WAVZ للتحول الرقمي بتوفير حلول مبتكرة تزيد من الكفاءة، وتقلل التكاليف، وتستفيد من رؤى البيانات الفورية التي تسهل عملية اتخاذ قرارات أكثر استنارة. يوفر نموذج الأعمال المُدار للشركة للعملاء المرونة وقابلية التوسع التي يحتاجون إليها لتنمية أعمالهم. لمزيد من المعلومات زوروا https://wavz.com.eg`,
          category: 'insight',
          date: '16 فبراير 2024',
          readTime: '5 دقائق قراءة',
          image: '/news/revenue.jpg',
          title: 'WAVZ تضاعف إيراداتها في 2023 وتوسّع انتشارها في الشرق الأوسط وأفريقيا',
          excerpt: 'أعلنت WAVZ للتحول الرقمي عن نمو استثنائي في 2023، بمضاعفة الإيرادات وتوسيع فريق الخبراء عبر منطقة الشرق الأوسط وأفريقيا.',
          url: 'https://wavz.com.eg/news/wavz-for-digital-transformation-doubles-revenue-in-2023-expanding-footprint-in-middle-east-and-africa/',
        },
        {
          id: 'westport-datacenter',
          content: `WAVZ للتحول الرقمي، المعروفة بمجموعتها من خدمات تكنولوجيا المعلومات المُدارة والتحول الرقمي، تدير بنجاح مركز البيانات بالمنطقة الحرة بغرب بورسعيد كجزء من مشروع تطوير البنية التحتية الرقمية للمنطقة الحرة، بالإضافة إلى تقديم الدعم الفني اللازم لمشروع بطاقة المواطن في نفس المحافظة.

وتجري المناقشات الآن لزيادة رأس المال لتلبية التوسع الإقليمي

"الهيئة القومية للبريد" و"إيجيبت تراست" و"دويتشلاند تكنولوجى" أمثلة على قائمتنا الطويلة من العملاء المرموقين

وقال عمرو عصمت، العضو المنتدب والرئيس التنفيذي للشركة، إنهم يقومون حاليًا بتنفيذ العديد من المشاريع في عدة قطاعات بما في ذلك النفط والغاز والنقل والخدمات المهنية والتعليم. وأوضح أن WAVZ تهدف إلى التركيز على تقديم حلول وخدمات عالمية تعتمد على تكامل أنظمة الذكاء الاصطناعي وتحليل البيانات والأنظمة التي تدعم عملية اتخاذ القرار. اتخاذ القرار ومساعدة العملاء على مواجهة التحديات الحالية والمستقبلية.

يشار إلى أن بطاقة المواطن في بورسعيد هي بطاقة ذكية موحدة تم تطويرها بالتعاون بين وزارة الاتصالات والهيئة القومية للبريد، وتهدف إلى تبسيط إجراءات حصول المواطنين على خدمات التموين والتأمين الصحي الشامل والمدفوعات الحكومية.

"تضم قاعدة عملاء WAVZ كيانات من داخل مصر وخارجها، مثل شركة "Egypt Trust" لخدمات التوقيع الإلكتروني وأمن المعلومات، بالإضافة إلى شركة "Deutschland Technology" وهي شركة مصرية متخصصة في أنظمة مكافحة الحرائق والحلول التكنولوجية الحديثة في مجال الهندسة الكهربائية والميكانيكية والصحية، وذلك على سبيل المثال لا الحصر". عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ في تصريحات لجريدة المال

"تضم قاعدة عملاء WAVZ كيانات من داخل مصر وخارجها، مثل شركة "Egypt Trust" لخدمات التوقيع الإلكتروني وأمن المعلومات، بالإضافة إلى شركة "Deutschland Technology" وهي شركة مصرية متخصصة في أنظمة مكافحة الحرائق والحلول التكنولوجية الحديثة في مجال الهندسة الكهربائية والميكانيكية والصحية، وذلك على سبيل المثال لا الحصر".

وأشار عصمت إلى أن WAVZ نجحت في زيادة إيراداتها بنسبة 100% خلال العام الماضي لتصل إلى 507 ملايين جنيه مصري مقارنة بعام 2022، كما حققت زيادة في أرباحها بنسبة 120%، مشيرا إلى أن WAVZ تمكنت خلال عامين من مضاعفة قوتها العاملة لتصل إلى 1300 موظف.

"أرباحنا زادت بنسبة 120% وإيراداتنا تضاعفت في 2023"

"لقد ضاعفنا فرص العمل لدينا خلال عامين للوصول إلى 1300 موظف."

عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ

وأشار إلى أن WAVZ تقدم – على سبيل المثال لا الحصر – حلول إدارة البنية التحتية لتكنولوجيا المعلومات، بالإضافة إلى خدمات إدارة الشبكات ومراكز الاتصال، بالإضافة إلى تطوير البنية التحتية الرقمية للمؤسسات، وأحدث الخدمات الرقمية الحديثة وفق المعايير العالمية. وأشار إلى أن الذكاء الاصطناعي لم يعد رفاهية كما يعتقد البعض، بل أصبح ضرورة ملحة لتطوير القدرة التنافسية للمؤسسات لمواكبة المتغيرات العالمية.

وأضاف أن WAVZ تقدم أيضًا خدمات تنفيذ وإدارة حزم تخطيط موارد المؤسسات (ERP)، باستخدام حلول SAP، بالإضافة إلى تنفيذ وإدارة حلول البنية التحتية للمعلومات للمؤسسات المالية، بما في ذلك، على سبيل المثال، تطبيق Temenos المصرفي الأساسي وحلول إدارة بطاقة Tietoevry والدفع الرقمي، بالإضافة إلى خدمات تنفيذ وإدارة أنظمة البريد الرقمية، بما في ذلك خدمات التحول الرقمي والمدفوعات الإلكترونية.

وأضاف عصمت أن استراتيجية WAVZ خلال العام الحالي ترتكز على تعزيز ثقة العملاء في أن تكون مزود الحلول المفضل لهم خلال رحلة التحول الرقمي من خلال تلبية جميع احتياجاتهم التكنولوجية، مشيراً إلى أن WAVZ لديها شبكة من الشركاء العالميين ذوي الخبرة القادرين على تقديم حلول تكنولوجيا المعلومات التي تلبي الاحتياجات الصعبة للأسواق المصرية والعربية والأفريقية، والأهم من ذلك، على استعداد لنقل خبراتهم إلى خبراء WAVZ المحليين.

شراكة جديدة مع “نيفيس” لأنظمة الأمن السيبراني و”عزم السعودية”

وأشار إلى أن الشركة قامت بتوسيع شبكة شركائها العالميين لتشمل نيفيس لأنظمة الأمن السيبراني، فضلا عن تعزيز شراكتها مع شركات SAP، وTemenos، وTietoevry، وSaudi Azm للاتصالات وتقنية المعلومات. علاوة على ذلك، فإنهم يدرسون العديد من فرص التعاون المستقبلية، بهدف تقديم حزمة من الحلول الرقمية المبتكرة والمتقدمة لعملائها في مختلف المجالات والصناعات، مثل النظام المصرفي المفتوح الذي يوفر معاملات أسرع وأكثر أمانًا في أي مكان في العالم.

وكشف عصمت أن WAVZ - بالتعاون مع Tietoevery - نظمت مؤخرًا ورشة عمل ضمت قادة القطاعين المصرفي والمالي المصري لمناقشة "الرؤية المستقبلية لأنظمة الدفع في عام 2030". وتم خلال الورشة مناقشة الرؤية المستقبلية للاتجاهات المحلية والعالمية في مجال المدفوعات، ومستقبل عمليات الاستحواذ للتجارة الإلكترونية والمعاملات الرقمية، ومدى تأثير جائحة كورونا على التحول الكبير في مجال الدفع. وهو الأمر الذي أدى إلى تسريع هذا التحول الرقمي بشكل كبير بما في ذلك، على سبيل المثال لا الحصر، التسوق عبر الإنترنت والتجارة الإلكترونية.

وقال عصمت إن ورشة العمل سلطت الضوء أيضًا على أحدث الاتجاهات العالمية التي تشكل النظام البيئي المصرفي، بما في ذلك أنظمة الدفع في الوقت الفعلي على مدار 24 ساعة يوميًا و7 أيام في الأسبوع، وضغوط التكلفة المستمرة بسبب الرقمنة، والتحديات الجيوسياسية، وتأثير فوائد الاقتراض المرتفعة، والتضخم، وتكلفة رأس المال على المؤسسات المالية. وكذلك أحدث اتجاهات وتوجهات أنظمة الدفع العالمية.

وتابع عصمت، أن شركة WAVZ قامت بتركيب وتنفيذ أنظمة الخدمات البريدية في جمهورية الكونغو الديمقراطية، بالإضافة إلى مشاريع أخرى مع شركاء استراتيجيين في السوق السعودي، مشيراً إلى أن الشركة تعتزم فتح فروع في عدد قليل من الدول العربية خلال المرحلة المقبلة.

وتابع: كما شاركت WAVZ في العديد من المؤتمرات والفعاليات المحلية والإقليمية، مثل “منتدى Seamless” في شمال أفريقيا، و”منتدى LEAP” في المملكة العربية السعودية، و”منتدى اتحاد البريد الأفريقي”، بالإضافة إلى المنتديات العالمية التي عقدها شركاؤنا العالميون. تسعى WAVZ بشكل مستمر للمشاركة في مختلف المنتديات الإقليمية لعرض خدماتنا والتواصل مع العملاء والشركاء النشطين في مختلف الأسواق والمجالات.

واستبعد عصمت اتجاه الشركة نحو الاقتراض البنكي لتمويل خططها التوسعية، خاصة أن نمو أرباحها يوفر لها السيولة الكافية لإدارة وتنمية أعمالها بنجاح، كاشفاً عن أنها تتطلع إلى زيادة رؤوس أموالها – من خلال المساهمين الحاليين – لدعم التوسعات الإقليمية وجهودها لتنمية وتوسيع قاعدة عملائها. وأضاف أن الشركة لا تخطط لتنفيذ صفقات استحواذ على كيانات أخرى في المستقبل القريب، ولكن إذا دعت الحاجة للنمو، فسنفعل ذلك، بما يتماشى مع توجهاتنا الاستراتيجية.

WAVZ للتحول الرقمي هي شركة مصرية رائدة في مجال تقديم حلول وخدمات تكنولوجيا المعلومات الرقمية. بفضل سجل حافل من التطبيقات الناجحة عبر مختلف الصناعات، تلتزم WAVZ للتحول الرقمي بتوفير حلول مبتكرة تزيد من الكفاءة، وتقلل التكاليف، وتستفيد من رؤى البيانات الفورية التي تسهل عملية اتخاذ قرارات أكثر استنارة. يوفر نموذج الأعمال المُدار للشركة للعملاء المرونة وقابلية التوسع التي يحتاجون إليها لتنمية أعمالهم.`,
          category: 'insight',
          date: '4 يوليو 2024',
          readTime: '3 دقائق قراءة',
          image: '/news/westport.jpg',
          title: 'WAVZ تُدير مركز بيانات المنطقة الحرة لغرب بورسعيد',
          excerpt: 'تُدير WAVZ للتحول الرقمي مركز بيانات المنطقة الحرة لغرب بورسعيد بنجاح، ضمن مشروع تطوير البنية التحتية الرقمية للمنطقة.',
          url: 'https://wavz.com.eg/news/wavz-is-successfully-managing-the-data-center-of-west-port-said-free-zone-as-part-of-the-fz-digital-infrastructure-development-project/',
        },
        {
          id: 'prosecure-sap',
          content: `أعلنت شركة Prosecure، الشركة الرائدة في مجال توفير الحلول الأمنية المتكاملة، اليوم أنها وقعت مع WAVZ للتحول الرقمي، وهي شركة عالمية متخصصة في تنفيذ واستشارات SAP، لتنفيذ حلول SAP ERP المتطورة في نموذج أعمال الخدمات المُدارة، مما سيساعد Prosecure على تبسيط عملياتها المالية وإدارة المواد وإدارة رأس المال البشري.

"تتمثل رؤيتنا في تقديم خدمات أمنية احترافية وتعزيز أمن وسلامة عملائنا من خلال التطوير المستمر وتوفير أحدث الوسائل والأساليب التكنولوجية الأمنية، مع مراعاة الجودة ومراقبتها، والاستعداد دائمًا للتعامل مع مختلف المخاطر. نحن متحمسون للشراكة مع WAVZ لتنفيذ SAP ERP Solution. SAP هو نظام تخطيط موارد المؤسسات (ERP) عالمي المستوى الذي سيساعدنا على تحسين كفاءتنا وفعاليتنا التشغيلية، والتكيف مع التغييرات ديناميكيًا بناءً على الاستخدام في الوقت الفعلي وبيانات تجربة العملاء. لقد اخترنا WAVZ بسبب خبرتها الواسعة في مجال هذا المجال مدعوم بسجل حافل من النجاح في تطبيقات مماثلة، وخاصة نموذج أعمال الخدمات المدارة، والذي سيساعدنا على التركيز على أعمالنا الأساسية، في حين تهتم WAVZ بالبنية التحتية لتكنولوجيا تخطيط موارد المؤسسات لدينا والعمليات المرتبطة بها. العميد شاهين بسيوني الرئيس التنفيذي لشركة النيابة العامة.

"تتمثل رؤيتنا في تقديم خدمات أمنية احترافية وتعزيز أمن وسلامة عملائنا من خلال التطوير المستمر وتوفير أحدث الوسائل والأساليب التكنولوجية الأمنية، مع مراعاة الجودة ومراقبتها، والاستعداد دائمًا للتعامل مع مختلف المخاطر. نحن متحمسون للشراكة مع WAVZ لتنفيذ SAP ERP Solution. SAP هو نظام تخطيط موارد المؤسسات (ERP) عالمي المستوى الذي سيساعدنا على تحسين كفاءتنا وفعاليتنا التشغيلية، والتكيف مع التغييرات ديناميكيًا بناءً على الاستخدام في الوقت الفعلي وبيانات تجربة العملاء. لقد اخترنا WAVZ بسبب خبرتها الواسعة في مجال هذا المجال مدعوم بسجل حافل من النجاح في تطبيقات مماثلة، وخاصة نموذج أعمال الخدمات المدارة، والذي سيساعدنا على التركيز على أعمالنا الأساسية، في حين تهتم WAVZ بالبنية التحتية لتكنولوجيا تخطيط موارد المؤسسات لدينا والعمليات المرتبطة بها.

ستوفر حلول SAP ERP لـ Prosecure رؤى فورية وشخصية للأعمال، مما سيساعد Prosecure على البقاء على قمة الامتثال والأمان مع المعايير العالمية المضمنة والمحدثة دائمًا. وسيساعدهم ذلك أيضًا على التعاون مع مورديهم وشركائهم العالميين عبر عمليات سلسلة التوريد للمهام والأنشطة مثل الطلب والتنبؤ وإدارة المخزون ومراقبة العرض والطلب والتأهيل. وأخيرًا وليس آخرًا، ستتمكن شركة Prosceure من إدارة رأس مالها البشري بشكل أفضل وتعزيز المرونة التنظيمية ومشاركة الموظفين من خلال إنشاء وإدارة وتتبع أداء فرقهم الديناميكية خارج هياكل إعداد التقارير الرسمية.

"نحن فخورون باختيارنا من قبل Prosecure لتنفيذ حلول SAP ERP. لدينا سجل حافل من التنفيذ الناجح لحلول SAP في نموذج الخدمات المدارة للشركات من جميع الأحجام. نحن واثقون من أننا نستطيع مساعدة Prosecure على تحقيق أهدافها التجارية. سيمكن حل SAP ERP Prosecure من تحسين الكفاءة وتقليل التكاليف واتخاذ قرارات عمل أفضل." عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ.

"نحن فخورون باختيارنا من قبل Prosecure لتنفيذ حلول SAP ERP. لدينا سجل حافل من التنفيذ الناجح لحلول SAP في نموذج الخدمات المدارة للشركات من جميع الأحجام. نحن واثقون من أننا نستطيع مساعدة Prosecure على تحقيق أهدافها التجارية. سيمكن حل SAP ERP Prosecure من تحسين الكفاءة وتقليل التكاليف واتخاذ قرارات عمل أفضل."

Prosecure هي شركة رائدة في مجال توفير الحلول الأمنية المتكاملة. وتقدم الشركة مجموعة واسعة من المنتجات والخدمات، بما في ذلك أنظمة الأمن والتحكم في الوصول والمراقبة بالفيديو وأنظمة إنذار الحريق. يشمل عملاء Prosecure الشركات والوكالات الحكومية والمؤسسات التعليمية.

WAVZ هي إحدى الشركات الرائدة في مجال توفير الخدمات المدارة وشركة تنفيذ واستشارات SAP. وتقدم الشركة مجموعة شاملة من خدمات SAP، بما في ذلك التنفيذ والاستشارات والخدمات المدارة. تتمتع WAVZ بسجل حافل في مساعدة العملاء على تنفيذ وإدارة حلول SAP بنجاح. يوفر نموذج الأعمال المُدار للشركة للعملاء المرونة وقابلية التوسع التي يحتاجون إليها لتنمية أعمالهم.`,
          category: 'announcement',
          date: '5 نوفمبر 2023',
          readTime: '3 دقائق قراءة',
          image: '/news/prosecure.webp',
          title: 'Prosecure تتشارك مع WAVZ لتطبيق حلول SAP ERP المتطورة',
          excerpt: 'أعلنت Prosecure، الرائدة في حلول الأمن المتكاملة، عن توقيع عقد مع WAVZ لتطبيق نظام SAP ERP في نموذج الخدمات المُدارة.',
          url: 'https://wavz.com.eg/news/prosecure-security-and-guarding-company-partners-with-wavz-to-implement-cutting-edge-sap-erp-solutions/',
        },
        {
          id: 'transecure-sap',
          content: `أعلنت WAVZ للتحول الرقمي، الشركة الرائدة في مجال الخدمات المدارة وتنفيذ SAP والاستشارات، اليوم أنها وقعت عقدًا مع Transsecure، المزود الرائد للتحويل المادي الآمن للنقد والأشياء الثمينة الأخرى، لتنفيذ حل SAP ERP من الدرجة الأولى في نموذج أعمال الخدمات المدارة، والذي من شأنه أن يساعد Transsecure على إدارة عملياتها التجارية بشكل أفضل وتعزيز الرؤية وإدارة أسطولها بشكل أفضل.

"هدفنا هو تقديم مجموعة من المنتجات والخدمات التي تسمح بالتحويل المادي الآمن للنقد والأشياء الثمينة الأخرى. تغطي بصمة الشركة جميع أنحاء الدولة المصرية تقريبًا بما في ذلك على سبيل المثال لا الحصر مكاتب هيئة البريد المصرية وفروعها في جميع أنحاء البلاد. وتخطط الشركة لتوسيع أسطولها إلى 260 مركبة مدرعة بحلول عام 2024"" "نحن متحمسون للدخول في شراكة مع WAVZ لتنفيذ حل SAP ERP، والذي سيساعدنا على تحسين كفاءتنا وفعاليتنا التشغيلية، وإدارة أسطولنا من المركبات بشكل أفضل بطريقة فعالة من حيث التكلفة "لقد اخترنا WAVZ نظرًا لنضجها في تقديم الحل المطلوب الذي يلبي احتياجاتنا الحالية والمستقبلية في نموذج الخدمات المُدارة. وهذا سيساعدنا على التركيز على أعمالنا الأساسية، بينما تعتني WAVZ بالبنية التحتية لتكنولوجيا المعلومات لتخطيط موارد المؤسسات (ERP) والعمليات المرتبطة بها". السيد/ أحمد فتحي السباعي، الرئيس التنفيذي لشركة ترانس سيكيور.

"هدفنا هو تقديم مجموعة من المنتجات والخدمات التي تسمح بالتحويل المادي الآمن للنقد والأشياء الثمينة الأخرى. تغطي بصمة الشركة جميع أنحاء الدولة المصرية تقريبًا بما في ذلك على سبيل المثال لا الحصر مكاتب هيئة البريد المصرية وفروعها في جميع أنحاء البلاد. وتخطط الشركة لتوسيع أسطولها إلى 260 مركبة مدرعة بحلول عام 2024"" "نحن متحمسون للدخول في شراكة مع WAVZ لتنفيذ حل SAP ERP، والذي سيساعدنا على تحسين كفاءتنا وفعاليتنا التشغيلية، وإدارة أسطولنا من المركبات بشكل أفضل بطريقة فعالة من حيث التكلفة "لقد اخترنا WAVZ نظرًا لنضجها في تقديم الحل المطلوب الذي يلبي احتياجاتنا الحالية والمستقبلية في نموذج الخدمات المُدارة. وهذا سيساعدنا على التركيز على أعمالنا الأساسية، بينما تعتني WAVZ بالبنية التحتية لتكنولوجيا المعلومات لتخطيط موارد المؤسسات (ERP) والعمليات المرتبطة بها".

"يسعدنا أن نتشارك مع Trans-secure Money Transfer Company لمساعدتهم على تنفيذ وإدارة حلول SAP الخاصة بهم""سيوفر نموذج الخدمات المدارة الخاص بنا لشركة Transsecure المرونة وقابلية التوسع التي تحتاجها لتنمية أعمالها. نحن ملتزمون بمساعدة Trans-secure على تحسين الكفاءة وتقليل التكاليف واتخاذ قرارات عمل أفضل من خلال التنفيذ الناجح لـ SAP ERP." عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ.

"يسعدنا أن نتشارك مع Trans-secure Money Transfer Company لمساعدتهم على تنفيذ وإدارة حلول SAP الخاصة بهم""سيوفر نموذج الخدمات المدارة الخاص بنا لشركة Transsecure المرونة وقابلية التوسع التي تحتاجها لتنمية أعمالها. نحن ملتزمون بمساعدة Trans-secure على تحسين الكفاءة وتقليل التكاليف واتخاذ قرارات عمل أفضل من خلال التنفيذ الناجح لـ SAP ERP."

Transsecure، شركة رائدة في مجال توفير مجموعة من المنتجات والخدمات التي تسمح بالتحويل المادي الآمن للنقود والأشياء الثمينة الأخرى. تغطي بصمة الشركة جميع أنحاء الجمهورية المصرية تقريبًا بما في ذلك على سبيل المثال لا الحصر مكاتب البريد المصري وفروعه على مستوى البلاد. تلتزم Trans-secure بتزويد عملائها بطريقة آمنة وموثوقة وبأسعار معقولة لنقل أموالهم.

WAVZ هي إحدى الشركات الرائدة في مجال توفير الخدمات المدارة وشركة تنفيذ واستشارات SAP. وتقدم الشركة مجموعة شاملة من خدمات SAP، بما في ذلك التنفيذ والاستشارات والخدمات المدارة. تتمتع WAVZ بسجل حافل في مساعدة العملاء على تنفيذ وإدارة حلول SAP بنجاح. يوفر نموذج الأعمال المُدار للشركة للعملاء المرونة وقابلية التوسع التي يحتاجون إليها لتنمية أعمالهم.`,
          category: 'announcement',
          date: '5 نوفمبر 2023',
          readTime: '3 دقائق قراءة',
          image: '/news/transecure.webp',
          title: 'Trans-Secure تتشارك مع WAVZ لتطبيق SAP ERP في نموذج الخدمات المُدارة',
          excerpt: 'وقّعت Trans-Secure لتحويل الأموال عقداً مع WAVZ لتطبيق نظام SAP ERP في نموذج الخدمات المُدارة لتمكين عملياتها.',
          url: 'https://wavz.com.eg/news/trans-secure-for-money-transfer-partners-with-wavz-to-implement-sap-erp-in-a-managed-services-business-model/',
        },
        {
          id: 'nevis-cyber',
          content: `أعلنت اليوم كل من شركة زيورخ وشركة Nevis Security AG، الشركة الرائدة المتخصصة في حلول تسجيل الدخول الآمن، وشركة WAVZ للتحول الرقمي، الشركة الرائدة في مجال توفير الحلول الرقمية في منطقة الشرق الأوسط وأفريقيا، عن شراكتهما. الهدف من هذه الشراكة هو مكافحة المخاطر السيبرانية في القطاع المصرفي وتمكين تجربة سلسة للعملاء. يجمع هذا التعاون بين خبرة WAVZ في التحول الرقمي وحلول تسجيل الدخول الآمنة من Nevis.

ومع تقدم التحول الرقمي في القطاع المصرفي، فإن توقعات المستهلكين آخذة في الارتفاع. بالنسبة للشركات والمؤسسات المالية، تعد استراتيجيات مشاركة العملاء المعززة أمرًا بالغ الأهمية لتلبية هذه المطالب. ومن ناحية أخرى، تتزايد التهديدات السيبرانية في القطاع المالي بسرعة في جميع أنحاء العالم. وتشمل المخاطر الرئيسية الاحتيال وسرقة البيانات والهوية وغسل الأموال. بالإضافة إلى ذلك، تواجه البنوك لوائح وقوانين أكثر صرامة مثل توجيه خدمات الدفع الثانية (PSD2)، ولوائح مكافحة غسيل الأموال (AML)، ولوائح مكافحة تمويل الإرهاب (CFT)، واللائحة العامة لحماية البيانات (GDPR)، ومتطلبات عملية العناية الواجبة تجاه العملاء (CDD)، والتي تتضمن التحقق من هوية العميل (اعرف عميلك، KYC).

يعد الامتثال لهذه اللوائح والعمليات المختلفة أمرًا بالغ الأهمية لضمان حماية البيانات، ومنع الجرائم المالية وتمويل الإرهاب، والحفاظ على ثقة العملاء.

ومن خلال حلول نيفيس، يمكن للبنوك تنفيذ أدوات قوية للمصادقة والترخيص والكشف الآلي عن الاحتيال لحماية بيانات العملاء الحساسة ومنع الوصول غير المصرح به إلى الحسابات. وفي الوقت نفسه، تتيح هذه الحلول تجربة سلسة وشخصية للعملاء من خلال عمليات تسجيل دخول سلسة عبر قنوات متعددة، مما يسهل على العملاء الوصول إلى حساباتهم أو الخدمات الأخرى. علاوة على ذلك، يمكن للبنوك الاستفادة من بيانات العملاء لتقديم منتجات وخدمات مخصصة لا تعزز ولاء العملاء فحسب، بل تزيد أيضًا من إمكانات الأعمال، مما يوفر ميزة تنافسية للمؤسسات المالية.

تتميز حلول نيفيس ببنية واجهة برمجة التطبيقات (API) المفتوحة، مما يسمح بتنفيذ التوصيل والتشغيل بسهولة. إنها تقلل إلى حد كبير الوقت اللازم للوصول إلى السوق بالنسبة للبنوك ومقدمي الخدمات المالية، لأنها تتيح التخصيص السريع والسهل للحلول الفردية.

"يعتبر أمن البيانات والامتثال وتجربة العملاء السلسة من الأولويات القصوى في القطاع المصرفي. وتلبي حلول نيفيس هذه المتطلبات من خلال تدابير أمنية قوية وميزات امتثال وطرق مصادقة سلسة. ومع ميزات مثل تسجيل الدخول الموحد والمصادقة متعددة العوامل وإدارة الموافقة والتفضيلات وإدارة الهوية الموحدة وتحليل بيانات العميل، لا يمكن ضمان أمان الحساب المصرفي فحسب، بل يمكن أيضًا تقديم توصيات شخصية بناءً على تفضيلات العميل. وهذا يعزز رضا العملاء وولائهم بشكل كبير." عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ.

"يعتبر أمن البيانات والامتثال وتجربة العملاء السلسة من الأولويات القصوى في القطاع المصرفي. وتلبي حلول نيفيس هذه المتطلبات من خلال تدابير أمنية قوية وميزات امتثال وطرق مصادقة سلسة. ومع ميزات مثل تسجيل الدخول الموحد والمصادقة متعددة العوامل وإدارة الموافقة والتفضيلات وإدارة الهوية الموحدة وتحليل بيانات العميل، لا يمكن ضمان أمان الحساب المصرفي فحسب، بل يمكن أيضًا تقديم توصيات شخصية بناءً على تفضيلات العميل. وهذا يعزز رضا العملاء وولائهم بشكل كبير."

"نحن نتطلع إلى التعاون المستقبلي مع الخبراء في WAVZ. نحن ندعم البنوك ومقدمي الخدمات المالية في منطقة الشرق الأوسط وأفريقيا في تنفيذ حل بسيط وآمن لمصادقة عملائهم. ومن خلال استراتيجيتنا الجديدة ثلاثية المستويات المربح للجانبين، نهدف إلى معالجة الرقمنة المستمرة في منطقة الشرق الأوسط وأفريقيا وتوفير ضوابط وصول آمنة وإدارة الهوية. لذلك، سنستثمر بكثافة في الموظفين والشركاء مثل WAVZ، الذين يجلبون الخبرة اللازمة لبناء شبكة عالمية. مع WAVZ، الخطوة الأولى تم اتخاذه، وسنكون سعداء بالترحيب بالمزيد من الشركاء. ستيفان شفايتزر، الرئيس التنفيذي لشركة Nevis Security AG

"نحن نتطلع إلى التعاون المستقبلي مع الخبراء في WAVZ. نحن ندعم البنوك ومقدمي الخدمات المالية في منطقة الشرق الأوسط وأفريقيا في تنفيذ حل بسيط وآمن لمصادقة عملائهم. ومن خلال استراتيجيتنا الجديدة ثلاثية المستويات المربح للجانبين، نهدف إلى معالجة الرقمنة المستمرة في منطقة الشرق الأوسط وأفريقيا وتوفير ضوابط وصول آمنة وإدارة الهوية. لذلك، سنستثمر بكثافة في الموظفين والشركاء مثل WAVZ، الذين يجلبون الخبرة اللازمة لبناء شبكة عالمية. مع WAVZ، الخطوة الأولى تم اتخاذه، وسنكون سعداء بالترحيب بالمزيد من الشركاء.

إذا كنت ترغب في أن تصبح شريكًا لشركة Nevis Security AG للاستفادة من شبكة دولية من الخبرات، فلا تتردد في الاتصال بنا على: Partner@nevis.net

تقوم نيفيس بتطوير حلول أمنية لعالم الغد الرقمي: تتضمن المحفظة عمليات تسجيل دخول بدون كلمة مرور سهلة الاستخدام وتعمل على تحسين حماية بيانات المستخدم. وفي سويسرا، تعد نيفيس الشركة الرائدة في السوق في مجال إدارة الهوية والوصول، وتؤمن أكثر من 80 بالمائة من جميع المعاملات المصرفية الإلكترونية. تعتمد السلطات، وكذلك الشركات الخدمية والصناعية الرائدة في جميع أنحاء العالم، على حلول نيفيس. يمتلك متخصص المصادقة مواقع في سويسرا وألمانيا والمملكة المتحدة والمجر.

WAVZ هي شركة رائدة في مجال توفير حلول التحول الرقمي، وهي متخصصة في مساعدة المؤسسات في مختلف الصناعات على تحسين عملياتها، والاستفادة من التقنيات الناشئة، وتعزيز تجربة العملاء. ومع سجل حافل من التطبيقات الناجحة، تلتزم WAVZ بتقديم حلول مبتكرة تؤدي إلى نتائج أعمال ملموسة.`,
          category: 'announcement',
          date: '31 أكتوبر 2023',
          readTime: '4 دقائق قراءة',
          image: '/news/nevis.webp',
          title: 'WAVZ وNevis يُعلنان شراكة لمكافحة مخاطر الأمن السيبراني في القطاع المصرفي',
          excerpt: 'أعلنت Nevis Security AG وWAVZ عن شراكتهما لمكافحة مخاطر الأمن السيبراني في القطاع المصرفي وتعزيز حلول تسجيل الدخول الآمن.',
          url: 'https://wavz.com.eg/news/wavz-and-nevis-announce-partnership-to-combat-cyber-risks-in-the-banking-sector/',
        },
        {
          id: 'tietoevry-openbanking',
          content: `خلال مشاركتها في معرض “Seamless North Africa 2023”، عرضت WAVZ، شركة التحول الرقمي والخدمات المدارة، بالتعاون مع Tietoevry، إحدى الشركات الرائدة في حلول المدفوعات، كيف ستغير الأنظمة المصرفية المفتوحة والحلول المالية نماذج الأعمال وكيف يتم تحدي نموذج الأعمال الحالي للبنوك. من المتوقع أن تقوم API Banking بتغيير البنوك؛ نموذج أعمال لتمكين مجموعة واسعة من الشركات والمؤسسات من تقديم منتجاتها وخدماتها المالية الخاصة دون الحاجة إلى الاستثمار في بنية تحتية مصرفية كاملة. وفقًا لشركة Accenture، يمكن للأسواق المصرفية أن تولد ما يصل إلى 500 مليار دولار من الإيرادات الجديدة للبنوك على مستوى العالم بحلول عام 2030.

قدم أندريس أولوفسون، رئيس PaaS في شركة Tietoevry Banking، العديد من الأفكار القيمة التي تسلط الضوء على أهمية اعتماد الأنظمة المصرفية المفتوحة وتقديم عروض الطرف الثالث المدمجة التي من شأنها تعزيز محفظة منتجات البنوك، قائلاً:

تدعم شركة Tietoevry البنوك والمؤسسات المالية – من خلال خبرتنا في مجال الخدمات المصرفية الرقمية والنظام البيئي المالي – لأكثر من 50 عامًا. لقد مكنت منتجاتنا وخدماتنا أكثر من 400 مؤسسة في أكثر من 50 دولة حول العالم. حققنا مبيعات بقيمة 500 مليون يورو في عام 2021 من خلال الخدمات التي نقدمها. وتشير الدراسات إلى أنه من المتوقع أن يصل حجم المعاملات المالية في الولايات المتحدة إلى 7 تريليونات دولار بحلول عام 2026”. ووفقاً لشركة Allied Market Research، فقد بلغت قيمة سوق الخدمات المصرفية العالمية كخدمة 2.41 مليار دولار في عام 2020، ومن المتوقع أن تصل إلى 11.34 مليار دولار في عام 2030 بمعدل نمو 17.1%. أندريس أولوفسون، رئيس قسم PaaS في Tietoevry Banking

تدعم شركة Tietoevry البنوك والمؤسسات المالية – من خلال خبرتنا في مجال الخدمات المصرفية الرقمية والنظام البيئي المالي – لأكثر من 50 عامًا. لقد مكنت منتجاتنا وخدماتنا أكثر من 400 مؤسسة في أكثر من 50 دولة حول العالم. حققنا مبيعات بقيمة 500 مليون يورو في عام 2021 من خلال الخدمات التي نقدمها. وتشير الدراسات إلى أنه من المتوقع أن يصل حجم المعاملات المالية في الولايات المتحدة إلى 7 تريليونات دولار بحلول عام 2026”. ووفقاً لشركة Allied Market Research، فقد بلغت قيمة سوق الخدمات المصرفية العالمية كخدمة 2.41 مليار دولار في عام 2020، ومن المتوقع أن تصل إلى 11.34 مليار دولار في عام 2030 بمعدل نمو قدره 17.1%.

نحن سعداء بالشراكة مع WAVZ. إنها الشراكة التي ستوسع نطاق وصولنا في منطقة الشرق الأوسط وأفريقيا من خلال خبرائهم المصريين المدربين جيدًا والقادرين على تقديم أحدث الخدمات المتقدمة وفقًا للمعايير الدولية. كما نهدف إلى مساعدة المؤسسات المصرفية على الوصول إلى شرائح جديدة من العملاء في منطقة الشرق الأوسط وأفريقيا من خلال توفير أحدث التطبيقات والخدمات العالمية في مجال الأنظمة المصرفية المفتوحة والمدفوعات الرقمية. أندريس أولوفسون، رئيس PaaS في Tietoevry Banking

نحن سعداء بالشراكة مع WAVZ. إنها الشراكة التي ستوسع نطاق وصولنا في منطقة الشرق الأوسط وأفريقيا من خلال خبرائهم المصريين المدربين جيدًا والقادرين على تقديم أحدث الخدمات المتقدمة وفقًا للمعايير الدولية. كما نهدف إلى مساعدة المؤسسات المصرفية على الوصول إلى شرائح جديدة من العملاء في منطقة الشرق الأوسط وأفريقيا من خلال توفير أحدث التطبيقات والخدمات العالمية في مجال الأنظمة المصرفية المفتوحة والمدفوعات الرقمية.

ومن جانبه قال عمرو عصمت العضو المنتدب والرئيس التنفيذي لشركة WAVZ:

ونهدف من خلال تعاوننا مع تيتوفري إلى تمكين المؤسسات المالية من تبني أحدث الخدمات المصرفية المبتكرة، وخاصة الأنظمة المصرفية المفتوحة والمدفوعات الإلكترونية والخدمات الرقمية، مما يساعدها على الوصول إلى شرائح جديدة من العملاء مع الحفاظ على السرية التامة لبيانات العملاء. عمرو عصمت، العضو المنتدب والرئيس التنفيذي لشركة WAVZ

ونهدف من خلال تعاوننا مع تيتوفري إلى تمكين المؤسسات المالية من تبني أحدث الخدمات المصرفية المبتكرة، وخاصة الأنظمة المصرفية المفتوحة والمدفوعات الإلكترونية والخدمات الرقمية، مما يساعدها على الوصول إلى شرائح جديدة من العملاء مع الحفاظ على السرية التامة لبيانات العملاء.

جدير بالذكر أن شركة WAVZ للتحول الرقمي والخدمات المدارة تشارك كراعٍ ذهبي في قمة Seamless North Africa 2023، بالشراكة مع شركة Tietoevry، إحدى الشركات العالمية الرائدة في مجال المدفوعات الإلكترونية وإدارة البطاقات. وتنعقد القمة تحت عنوان “الطريق إلى التكنولوجيا المالية في شمال أفريقيا والشرق الأوسط”، ويرعاها البنك المركزي المصري بالتعاون مع الجامعة العربية والاتحاد العربي للاقتصاد الرقمي، وبمشاركة أكثر من 4000 شخص من رؤساء الشركات والمؤسسات ورواد الأعمال في منطقة الشرق الأوسط وأفريقيا.

WAVZ هي شركة مقرها في مصر منذ 15 عامًا، ونحن في الواقع فخورون جدًا اليوم بوجودنا في Seamless شمال إفريقيا لتقديم الحلول التي يتم تنفيذها في أماكن أخرى في العالم بنجاح. خبرة عالمية، تجربة عالمية، تم تنفيذها بنجاح في مصر ودعمها في مصر بموارد محلية مما يثبت أن المصريين، عندما يتم تدريبهم وتطويرهم بطريقة مناسبة، يمكنهم تقديم نفس جودة الخدمة التي نحصل عليها من الخبرات الدولية. نحن نتوسع حاليًا في المملكة العربية السعودية والأردن وأفريقيا من خلال مشاريع ناجحة في هذه الأماكن. إن وجودنا في Seamless مع شريكنا الاستراتيجي Tietoevry يوضح أهمية شراكتنا وكيف يعتبروننا ذراعهم في المنطقة. عمرو عصمت، العضو المنتدب والرئيس التنفيذي لشركة WAVZ

WAVZ هي شركة مقرها في مصر منذ 15 عامًا، ونحن في الواقع فخورون جدًا اليوم بوجودنا في Seamless شمال إفريقيا لتقديم الحلول التي يتم تنفيذها في أماكن أخرى في العالم بنجاح. خبرة عالمية، تجربة عالمية، تم تنفيذها بنجاح في مصر ودعمها في مصر بموارد محلية مما يثبت أن المصريين، عندما يتم تدريبهم وتطويرهم بطريقة مناسبة، يمكنهم تقديم نفس جودة الخدمة التي نحصل عليها من الخبرات الدولية. نحن نتوسع حاليًا في المملكة العربية السعودية والأردن وأفريقيا من خلال مشاريع ناجحة في هذه الأماكن. إن وجودنا في Seamless مع شريكنا الاستراتيجي Tietoevry يوضح أهمية شراكتنا وكيف يعتبروننا ذراعهم في المنطقة.

تعتبر الخدمات المصرفية المفتوحة نموذجًا تجاريًا رائعًا. يعتبر طرح منصة InstaPay في مصر حجر الأساس الأول الذي سيمكن الأنظمة المصرفية المفتوحة من العمل بسلاسة لأنه بدون الدفع الفوري، ستفتقد الأنظمة المصرفية المفتوحة حجر الأساس. والآن، مع اللوائح الصادرة عن الهيئة العامة للرقابة المالية والبنك المركزي المصري، والتي نأمل أن تكون قريبًا، فإن هذا من شأنه أن يوفر فرصة لخدمات التكنولوجيا المالية للنمو لأنها تعتمد على الوصول إلى بيانات العملاء والوصول إلى البنية التحتية للمدفوعات. نحن الآن في وقت محوري حيث يمكن تقديم خدمات مالية جديدة للشعب المصري، وهو سوق ضخم وسيجذب هذا أيضًا شركات التكنولوجيا المالية الإقليمية لتقديم خدماتها في مصر، سواء كان ذلك من شمال إفريقيا أو حتى أوروبا القادمة إلى هذه المنطقة فقط بسبب الحجم والإمكانات الواعدة لسوق التجزئة المصري.

من جانبه، أوضح أندريس أولوفسون، رئيس PaaS في شركة Tietoevry Banking، أن البنوك تحتاج الآن إلى الشركات الصغيرة والمتوسطة (SME) لمساعدتها على توسيع خدماتها بسرعة إلى شرائح جديدة من خلال تقديم خدمات جديدة تلبي احتياجات هذه القطاعات في السوق. ستلعب الأنظمة المصرفية المفتوحة دور الميسر بين البنوك والشركات الصغيرة والمتوسطة من خلال تزويدها بإمكانية الوصول إلى المعلومات التي قد تحتاجها دون تعريض أمن وسرية معلومات العملاء للخطر. فهو يساعد كلاً من البنوك والشركات الصغيرة والمتوسطة على إطلاق العنان للفرص المحتملة في السوق وخدمة هذه القطاعات من السوق بطريقة مريحة.

أعتقد أن السوق المالية المصرية تطورت بشكل ملحوظ في الآونة الأخيرة. وقد تم دعم هذا التطوير من خلال موارد بشرية متطورة للغاية وحاصلة على تعليم وتدريب عاليين، مما أدى إلى نمو كبير في مجموعة المواهب في مختلف التخصصات. ولهذا السبب اخترنا WAVZ لتكون شريكنا الاستراتيجي في المنطقة. وبفضل مواردهم الماهرة، يمكنهم خدمة السوق المحلية المتطورة، علاوة على ذلك، بفضل قدراتهم المتنامية، يمكنهم خدمة منطقة الشرق الأوسط وأفريقيا. خاصة مع ندرة المواهب في جميع أنحاء العالم. أندريس أولوفسون، رئيس PaaS في Tietoevry Banking

أعتقد أن السوق المالية المصرية تطورت بشكل ملحوظ في الآونة الأخيرة. وقد تم دعم هذا التطوير من خلال موارد بشرية متطورة للغاية وحاصلة على تعليم وتدريب عاليين، مما أدى إلى نمو كبير في مجموعة المواهب في مختلف التخصصات. ولهذا السبب اخترنا WAVZ لتكون شريكنا الاستراتيجي في المنطقة. وبفضل مواردهم الماهرة، يمكنهم خدمة السوق المحلية المتطورة، علاوة على ذلك، بفضل قدراتهم المتنامية، يمكنهم خدمة منطقة الشرق الأوسط وأفريقيا. خاصة مع ندرة المواهب في جميع أنحاء العالم.

يعمل تيتوفري في جميع أنحاء أفريقيا، مثل جنوب أفريقيا وموريشيوس على سبيل المثال. نقوم بتسليم البنية التحتية إلى البنك المركزي في موريشيوس لإجراء التحويلات الفورية مثل Instapay. نحن نعمل أيضًا في نيجيريا ومناطق أخرى حيث توجد فرص هائلة، لكن المواهب قد لا تكون متطورة بالقدر الذي نطمح إليه. لذا، تعد مصر نقطة انطلاق جيدة للاتصال السريع من حيث الوصول إلى السوق الأوسع والقرب من بقية أفريقيا. أحد التحديات التي نواجهها في المنطقة كشركة أوروبية هو أن عملية اتخاذ القرار تختلف دائمًا عما اعتدنا عليه. ومن ثم، هناك حاجة إلى التوافق مع شريك محلي يمكنه التواصل مع صناع القرار، ويفهم عملية الشراء المحلية.

وبعد الشرق الأوسط، نرى نيجيريا وكينيا كأسواق محتملة للتوسع في السوق الأفريقية إلى جانب جنوب أفريقيا ومصر. نعتقد أن مصر هي على الأرجح السوق الأبرز في شمال أفريقيا الذي يتمتع بإمكانات هائلة. وحتى مع وجود خطر احتمال انخفاض قيمة العملة المصرية بشكل أكبر، وهو ما يمثل مخاطرة تجارية، فإننا لا نزال نعتقد أنها سوق واعدة. ولهذا السبب أيضًا نحتاج إلى شركاء محليين استراتيجيين، بقاعدة تكلفة محلية. فهو يساعد على التحوط قليلا من مخاطر العملة.

فيما يتعلق بمشاركتنا في Seamless Egypt، أجدها ناجحة جدًا نظرًا لوجود العديد من المواهب الشابة التي تعمل في مجال التكنولوجيا المالية معًا. لقد حضرت سلسًا في الرياض وفي دبي. وما يثيرني هو الشباب وكل الأفكار التي يولدونها. إذا ذهبت إلى جلسات FinTech، فستجد الكثير من الأفكار الرائعة، التي توصلت إلى حالات استخدام جيدة ورائعة. أعتقد أن Vibrance ربما تكون كلمة جيدة لوصف أن الجميع فضوليون للغاية وواسعو المعرفة. لديك شعور بأن لا شيء مستحيل. والأكثر من ذلك هو أن هؤلاء الأشخاص لا يرون القيود، بل يرون الأفكار المشرقة الجديدة. يجعلني أتمنى فقط أن تكون البنوك مفتوحة مثل FinTech. بعد قولي هذا، أعتقد أن البنوك في بعض الأحيان تكون مثقلة بالقواعد التنظيمية والقيود والأمن. كانت هناك جلسة جيدة بالأمس حول مدى بطء تحرك البنوك، لأنها ببساطة تعتني بأموالنا، في حين يمكن لشركات التكنولوجيا المالية أن تأتي بكل الأفكار المجنونة، أو تحاول، أو تصنع، أو تفشل، ثم تتركها وتخرج بأفكار جديدة. لا تتمتع البنوك بهذا الرفاهية، ولهذا السبب يحتاج كلا نموذجي الأعمال إلى بعضهما البعض، وهنا يمكن للأنظمة المصرفية المفتوحة أن تسهل نموذج التعاون بين البنوك وشركات التكنولوجيا المالية. أعتقد أن أكثر ما يثير اهتمامي هو استكشاف ما تفكر فيه هذه المواهب الشابة، والأفكار الرائعة التي لديهم، ولهذا السبب من الرائع أن أكون هنا. أندريس أولوفسون، رئيس PaaS في Tietoevry Banking

فيما يتعلق بمشاركتنا في Seamless Egypt، أجدها ناجحة جدًا نظرًا لوجود العديد من المواهب الشابة التي تعمل في مجال التكنولوجيا المالية معًا. لقد حضرت سلسًا في الرياض وفي دبي. وما يثيرني هو الشباب وكل الأفكار التي يولدونها. إذا ذهبت إلى جلسات FinTech، فستجد الكثير من الأفكار الرائعة، التي توصلت إلى حالات استخدام جيدة ورائعة. أعتقد أن Vibrance ربما تكون كلمة جيدة لوصف أن الجميع فضوليون للغاية وواسعو المعرفة. لديك شعور بأن لا شيء مستحيل. والأكثر من ذلك هو أن هؤلاء الأشخاص لا يرون القيود، بل يرون الأفكار المشرقة الجديدة. يجعلني أتمنى فقط أن تكون البنوك مفتوحة مثل FinTech. بعد قولي هذا، أعتقد أن البنوك في بعض الأحيان تكون مثقلة بالقواعد التنظيمية والقيود والأمن. كانت هناك جلسة جيدة بالأمس حول مدى بطء تحرك البنوك، لأنها ببساطة تعتني بأموالنا، في حين يمكن لشركات التكنولوجيا المالية أن تأتي بكل الأفكار المجنونة، أو تحاول، أو تصنع، أو تفشل، ثم تتركها وتخرج بأفكار جديدة. لا تتمتع البنوك بهذا الرفاهية، ولهذا السبب يحتاج كلا نموذجي الأعمال إلى بعضهما البعض، وهنا يمكن للأنظمة المصرفية المفتوحة أن تسهل نموذج التعاون بين البنوك وشركات التكنولوجيا المالية. أعتقد أن أكثر ما يثير اهتمامي هو استكشاف ما تفكر فيه هذه المواهب الشابة، والأفكار الرائعة التي لديهم، ولهذا السبب من الرائع أن أكون هنا.

فيما يتعلق بشراكتنا مع WAVZ، فهي مزود خدمات يتمتع بالسمعة الطيبة والقدرة، ونحن مجرد بائع برمجيات، وهو ما يمثل تطابقًا مثاليًا، حيث ندعمهم بخبرتنا العالمية لأن هذا شيء تتعطش إليه المنطقة، ونأتي أيضًا بمنظور دولي، والدروس المستفادة من الأسواق الأخرى، في حين تأتي WAVZ بثروتها من المعرفة بالسوق المحلية ومجموعة غنية من الموارد. لديهم حوالي 1000 شخص على متن الطائرة. معًا، نقدم تكنولوجيا رائدة أثبتت نجاحها عالميًا وفي المنطقة، بخبرة ودعم محليين. إنها شراكة منطقية وذات مغزى وذات صلة بأسواق الشرق الأوسط وأفريقيا.`,
          category: 'insight',
          date: '29 أكتوبر 2023',
          readTime: '4 دقائق قراءة',
          image: '/news/tietoevry-openbanking.jpg',
          title: 'Tietoevry: أنظمة البنوك المفتوحة على وشك تحويل القطاع المصرفي',
          excerpt: 'في Seamless North Africa 2023، قدّمت WAVZ وTietoevry رؤيتهما حول كيفية تحويل أنظمة البنوك المفتوحة للقطاع المصرفي.',
          url: 'https://wavz.com.eg/news/tietoevry-open-banking-systems-set-to-disrupt-the-banking-sector/',
        },
        {
          id: 'sczone-digital',
          content: `القاهرة، مصر. 20 سبتمبر 2023 - تتعاون WAVZ وSC-Zone في مشروع التحول الرقمي الرائد في منطقة SC. تفخر شركة WAVZ للتحول الرقمي، الشركة الرائدة في مجال توفير حلول التحول الرقمي، بالإعلان عن شراكتها مع SC-Zone، وهي منظمة بارزة تركز على تسخير إمكانات قناة السويس والمناطق المحيطة بها. ويهدف هذا التعاون إلى إحداث ثورة في البنية التحتية لتكنولوجيا المعلومات داخل منطقة SC ودفع مبادرة التحول الرقمي في منطقة SC إلى آفاق جديدة.

"الهدف الأساسي لمنطقة SC-Zone هو إنشاء بيئة أعمال تتسم بالكفاءة والتنافسية والاستدامة البيئية، مع خلق فرص عمل ووضع نفسها كمركز عالمي للنقل البحري والخدمات اللوجستية. ولتحقيق هذه الرؤية، تهدف SC-Zone إلى وضع معايير صناعية جديدة وتصبح منارة للممارسات البحرية المسؤولة، بما يتماشى مع اتجاهات السوق الناشئة، وتحسين خدمات العملاء، وجذب عملاء جدد من خلال تقديم حلول متطورة. نعتقد أن شراكتنا مع WAVZ هي حجر الزاوية نحو تقديم الاستشارات و خدمات التشغيل حسب حاجة منطقة بورسعيد. مروان تاج، مدير عام تكنولوجيا المعلومات، منطقة SC

"الهدف الأساسي لمنطقة SC-Zone هو إنشاء بيئة أعمال تتسم بالكفاءة والتنافسية والاستدامة البيئية، مع خلق فرص عمل ووضع نفسها كمركز عالمي للنقل البحري والخدمات اللوجستية. ولتحقيق هذه الرؤية، تهدف SC-Zone إلى وضع معايير صناعية جديدة وتصبح منارة للممارسات البحرية المسؤولة، بما يتماشى مع اتجاهات السوق الناشئة، وتحسين خدمات العملاء، وجذب عملاء جدد من خلال تقديم حلول متطورة. نعتقد أن شراكتنا مع WAVZ هي حجر الزاوية نحو تقديم الاستشارات و خدمات التشغيل حسب حاجة منطقة بورسعيد.

ينقسم مشروع SC-Zone إلى مرحلتين متميزتين، وستركز WAVZ في البداية على تقديم الخدمات الاستشارية للتقييم والاختبار وقبول إكمال المشروع وتسليمه للبائع. بالإضافة إلى ذلك، فإنه ينطوي على ضمان الصيانة المستمرة لوثائق المشروع، وضمان عملية تنفيذ سلسة. في المرحلة الثانية من المشروع، ستتولى شركة WAVZ للتحول الرقمي مسؤولية تدريب موارد منطقة اللجنة العليا الحالية وستدير أيضًا عمليات مركز بيانات منطقة اللجنة العليا ببورسعيد وما يرتبط به من تكنولوجيا المعلومات والشبكة والألياف والبنية التحتية الكهروميكانيكية. علاوة على ذلك، ستحدد WAVZ الفرص المحتملة لتحسين عمليات مراكز البيانات من خلال تحديد الثغرات والمخاطر التشغيلية في مثل هذه البيئة المعقدة.

ومن خلال هذه الشراكة، تهدف SC-Zone إلى الاستفادة من خبرة WAVZ في العديد من المجالات الرئيسية. سيكون الهدف الرئيسي هو مواءمة التوجهات الإستراتيجية الشاملة لتكنولوجيا المعلومات مع رؤية المنطقة SC وأهدافها التجارية طويلة المدى. وينبغي أن تؤدي هذه المواءمة إلى تطوير خارطة طريق تشغيلية تتضمن نهج التنفيذ المرحلي وتتضمن متطلبات العمل الحالية والمستقبلية.

"نحن متحمسون لهذه الشراكة مع SC-Zone. يهدف هذا التعاون إلى تعظيم عائد الاستثمار في SC-Zone من خلال تقليل النفقات التشغيلية وتبسيط إدارة مركز بيانات بورسعيد لجعله أكثر كفاءة. لن تضمن خبرة WAVZ كفاءة العمليات فحسب، بل ستضمن أيضًا الالتزام بالجداول الزمنية، والبقاء في حدود التكاليف المدرجة في الميزانية، مما يؤدي في النهاية إلى تحسين استخدام الموارد" السيد عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ

"نحن متحمسون لهذه الشراكة مع SC-Zone. يهدف هذا التعاون إلى تعظيم عائد الاستثمار في SC-Zone من خلال تقليل النفقات التشغيلية وتبسيط إدارة مركز بيانات بورسعيد لجعله أكثر كفاءة. لن تضمن خبرة WAVZ كفاءة العمليات فحسب، بل ستضمن أيضًا الالتزام بالجداول الزمنية، والبقاء في حدود التكاليف المدرجة في الميزانية، مما يؤدي في النهاية إلى تحسين استخدام الموارد "

وأضاف السيد محمد الحسيني، المدير الفني لشركة WAVZ

"هدفنا هو تمكين SC-Zone من تقديم مشاريع جديدة بسلاسة وتعزيز سهولة استخدام الأنظمة والبنية التحتية الحالية. وهذا سيمكن SC-Zone من التكيف مع احتياجات العمل المتطورة، مما يضمن المرونة وتوفير تجربة سلسة لعملائها." السيد محمد الحسيني، المدير الفني لشركة WAVZ

"هدفنا هو تمكين SC-Zone من تقديم مشاريع جديدة بسلاسة وتعزيز سهولة استخدام الأنظمة والبنية التحتية الحالية. وهذا سيمكن SC-Zone من التكيف مع احتياجات العمل المتطورة، مما يضمن المرونة وتوفير تجربة سلسة لعملائها."

يدل التعاون بين SC-Zone وWAVZ على الالتزام بقيادة الابتكار والكفاءة ورضا العملاء. ومن خلال الاستفادة من الخبرة والتوجيه الاستراتيجي لشركة WAVZ، تتمتع SC-Zone بموقع جيد لتحقيق أهدافها وتحقيق نتائج استثنائية لمشروع التحول الرقمي لمنطقة SC-Zone.

سيعمل مشروع التحول الرقمي في المنطقة العليا للمشاريع والإرث على زيادة الإنتاجية والكفاءة إلى أقصى حد، وتبسيط سير العمل، مما سيساهم في توفير الوقت والطاقة. ومع توفر التكنولوجيا المتطورة تحت تصرفهم، يمكن لموظفي SC-Zone أن يتوقعوا عملية عمل سلسة وأكثر كفاءة، الأمر الذي من شأنه أن يعزز ويحسن رحلة العملاء الخاصة بهم.

WAVZ هي شركة رائدة في مجال توفير حلول التحول الرقمي، وهي متخصصة في مساعدة المؤسسات في مختلف الصناعات على تحسين عملياتها، والاستفادة من التقنيات الناشئة، وتعزيز تجارب العملاء. ومع سجل حافل من التطبيقات الناجحة، تلتزم WAVZ بتقديم حلول مبتكرة تؤدي إلى نتائج أعمال ملموسة.

SC Zone هي هيئة رائدة في مجال النقل البحري والخدمات اللوجستية، وهي مكرسة لدفع الابتكار والممارسات المستدامة في الصناعة البحرية. ومن خلال التركيز على الكفاءة والقدرة التنافسية ورضا العملاء، تهدف SC Zone إلى إنشاء قناة السويس والمناطق المحيطة بها كمركز عالمي للأعمال والتكنولوجيا.

لمزيد من المعلومات، اتصل بنا هنا`,
          category: 'announcement',
          date: '20 سبتمبر 2023',
          readTime: '3 دقائق قراءة',
          image: '/news/sczone.jpg',
          title: 'الانطلاق في مشروع التحول الرقمي لـ SC-Zone بالتعاون مع WAVZ',
          excerpt: 'أعلنت WAVZ وSC-Zone عن تعاونهما المحوري في مشروع التحول الرقمي لـ SC-Zone، مبادرة بارزة على مستوى المنطقة.',
          url: 'https://wavz.com.eg/news/embarking-on-the-sc-zone-digital-transformation-project-in-collaboration-with-wavz/',
        },
        {
          id: 'openbanking-future',
          content: `القاهرة، يوليو 2023 – يسر شركة Wavz، وهي شركة مشهورة في مجال التحول الإلكتروني وخدمات الاستعانة بمصادر خارجية، أن تكشف عن دورها الهام كراعي ذهبي في قمة Seamless North Africa 2023 المرتقبة. بالتعاون مع Tietoevry، الشركة الرائدة عالميًا في مجال السداد الإلكتروني وإدارة البطاقات، من المقرر أن تعرض Wavz حلولاً مصرفية مفتوحة بارعة.

تمثل الحلول المصرفية المفتوحة تحولًا محوريًا في مشهد الخدمات المالية. تعلن هذه الممارسة عن تفاعلات آمنة ومأمونة داخل الصناعة المالية، مما يمكّن موردي السداد الخارجيين وأعمال الحلول المالية من الوصول إلى المشتريات المصرفية والبيانات النقدية. لقد اكتسبت الخدمات المالية المصرفية المفتوحة شعبية هائلة نتيجة لقدرتها على المساعدة في عمليات الشراء المالية الأسرع والأكثر أمانًا، والتي تتجاوز الحدود الجغرافية.

ومن المقرر عقد القمة المقبلة في الفترة من 17 إلى 18 يوليو في مركز مصر للمعارض الدولية بالقاهرة الجديدة، تحت رعاية بارزة من مجلس الوزراء المصري والمؤسسة المالية المركزية في مصر. كما قامت جامعة الدول العربية والاتحاد العربي للمناخ الاقتصادي الرقمي بتوسيع دعمهما لهذه المناسبة. وتحت عنوان "الطريق إلى التكنولوجيا المالية بين الشرق وأفريقيا"، فإن قمة هذا العام لها أهمية خاصة بالنسبة للارتفاع الحالي في التطورات التكنولوجية التي تعمل على تحويل المجال المالي في هذه المجالات.

إن الحلول المصرفية المفتوحة أكبر من مجرد مصطلح عصري؛ أنها تشير إلى تعديل كبير في صناعة الخدمات المالية. تعزز هذه الإستراتيجية التعاون الخالي من المخاطر في المجال المصرفي، مما يمكّن شركات السداد الخارجية وشركات الحلول الاقتصادية من الحصول على الصفقات المالية والمعلومات الاقتصادية. لقد أصبح هذا المفهوم مفضلاً للغاية بفضل الفوائد العديدة التي يقدمها.

فهو يتيح عمليات شراء مالية أسرع وأكثر حماية، ويتجاوز الحدود الجغرافية. فهو يعمل على تمكين المستهلكين من خلال منحهم سيطرة أكبر على بياناتهم الاقتصادية وتقديم سلسلة من الأدوات والحلول المالية المبتكرة. إن فرصة تطبيقات الطرف الثالث للتواصل بسلاسة مع الأنظمة المالية والوصول إلى البيانات المهمة ستغير قواعد اللعبة. الأمر كله يتعلق بتبسيط وتبسيط وتحسين التجربة الاقتصادية للمستهلكين والخدمات على حد سواء.

لقد لعبت Wavz، وهي شركة رائدة في مجال التحسين الرقمي، دورًا أساسيًا في جعل الحلول المصرفية المفتوحة متاحة ومؤثرة في منطقة الشرق الأوسط وإفريقيا. ومن خلال خدماتهم المتطورة وتعاوناتهم الهامة، فقد وضعوا أنفسهم كلاعب مهم في مشهد الخدمات المالية سريع التطور.

في قمة Seamless North Africa، سينتقل Wavz بالتأكيد إلى مركز المحادثات، مع مقصورة عرض جذابة حيث سيجتمع بالتأكيد قادة الصناعة والخبراء للتحقق من الفرص وتداعيات الحلول المصرفية المفتوحة. ومن المؤكد أن المناقشات ستتعمق في كيفية قيام شركة Open Banking Solutions بإعادة اختراع الخدمات المالية في المنطقة، مع التركيز بشكل خاص على مصر.

مصر ليست مجرد المهد التاريخي للعالم؛ كما أنها لاعب مهم في قطاع الخدمات المالية في العصر الحديث. يتطور المشهد المالي في البلاد بسرعة، ويعد التغيير الرقمي هو المحرك الرئيسي لهذا التغيير. تحظى الخدمات المصرفية المفتوحة بالاهتمام لأنها تتوافق بسلاسة مع الاتجاه العالمي للرقمنة. ويستخدم فرصًا جديدة تمامًا للشركات الصغيرة والمتوسطة الحجم، مما يمكّنها من التنافس بشكل أفضل مع الشركات المالية المعترف بها.

أكد السيد عمرو عصام، الرئيس التنفيذي لشركة Wavz، على أهمية الحلول المصرفية المفتوحة، موضحًا: "لم تعد الحلول المصرفية المفتوحة فاخرة؛ إنها ضرورة في الاقتصاد الدولي المزدحم اليوم. نحن نشهد تحولًا ملحوظًا نحو الرقمنة في جميع أنحاء العالم، والحلول المصرفية المفتوحة هي في قلب هذا التحول. تفتح هذه الأنظمة فرصًا جديدة تمامًا للشركات، مما يمكنها من تقليل الأسعار والترحيب بالابتكارات المتطورة وتقديم خدمة عملاء استثنائية. كل مؤسسة، بغض النظر عن عملها السوق، يمكنه الاستفادة من الحلول المصرفية المفتوحة لتعزيز علاقات المستهلكين الأكثر قوة.

من المتوقع أن تكون قمة Seamless North Africa القادمة حدثًا مهمًا، حيث تجمع أكثر من 4000 ضيف من جميع أنحاء العالم. وسيكون من بينهم أشخاص مؤثرون، وممثلون عن الحكومة الفيدرالية، ومتخصصون في هذا المجال، يتعاونون جميعًا للنظر في مجالات مختلفة من المدفوعات الإلكترونية، والتكنولوجيا المالية الحديثة، والتقدم، والخدمات المصرفية الرقمية.

يوفر المؤتمر منصة للتواصل وتبادل المعرفة والتعاون. إنها بوتقة تنصهر فيها الأفكار والخدمات التي ستساعد في تشكيل مستقبل صناعة الخدمات المالية في الشرق الأوسط وأفريقيا. ومع قيام Wavz بقيادة الرسوم في مناقشات الحلول المصرفية المفتوحة، تضمن القمة أن تكون مناسبة تشكل مستقبل الصناعة.

تهدف الشراكة بين Wavz وTietoevry ومشاركتهما في Seamless North Africa 2023 إلى تسريع تعزيز الحلول المصرفية المفتوحة في مصر والشرق الأوسط وأفريقيا. الحلول المصرفية المفتوحة ليست مجرد نمط؛ إنها تغيير أساسي يعمل على تحسين الطريقة التي نتعامل بها مع الخدمات المالية. إن القمة، بمساعدتها العالمية ومشاركتها الواسعة، هي النظام الممتاز لدعم هذا التحسن. بينما تعمل Wavz على جلب خبرتها إلى الطليعة، فإن المشهد المالي في المنطقة مهيأ للتطور نحو الأفضل. إن الحلول المصرفية المفتوحة في انتظار البقاء، وظهورها المستقبلي رائع في الشرق الأوسط وأفريقيا.`,
          category: 'insight',
          date: '13 يوليو 2023',
          readTime: '4 دقائق قراءة',
          image: '/news/openbanking.jpg',
          title: 'WAVZ لحلول البنوك المفتوحة: قيادة المستقبل المالي',
          excerpt: 'كشفت WAVZ عن دورها الذهبي في Seamless North Africa 2023، بالتعاون مع Tietoevry، لعرض حلول البنوك المفتوحة من الجيل التالي.',
          url: 'https://wavz.com.eg/news/wavz-open-banking-solutions-leading-the-financial-future/',
        },
        {
          id: 'ahliyya-university',
          content: `بالتعاون مع البريد المصري وWAVZ، جامعة عمان الأهلية تطلق خدمات التسجيل ودفع الرسوم الدراسية للطلاب المصريين من خلال 4500 فرع للبريد المصري.

في إطار جهودها لتسهيل خدمات التسجيل ودفع الرسوم الدراسية للطلاب المصريين، ستقدم جامعة عمان الأهلية دفع رسوم التسجيل والرسوم الدراسية للطلاب المصريين من خلال فروع البريد المصري البالغ عددها 4500 فرع. سيسمح ذلك للطلاب المصريين بإكمال عملية التسجيل بسلاسة ودفع الرسوم الدراسية بالعملة المحلية ووفقًا لسعر التحويل المعلن من قبل البنك المركزي المصري.

ووقع الاتفاقية شركة بيلارز للتسويق الذراع التسويقي لجامعة عمان الأهلية وشركة WAVZ للتحول الرقمي الذراع التكنولوجي للبريد المصري في 14 يونيو 2023.

"تمثل هذه الاتفاقية علامة فارقة لجامعة عمان الأهلية لتسهيل خدمات التسجيل والدفع للطلاب المصريين. ويسعدنا جدًا أن نكون قادرين على تقديم هذه الخدمات للشباب المصري من خلال شريك موثوق به ذو وصول غير مسبوق مثل البريد المصري. ونحن على ثقة أيضًا من أن WAVZ ستكون قادرة على تزويدنا بالحلول التكنولوجية التي ستجعل هذه الخدمات سلسة ووفقًا لأحدث المعايير. لدينا التزام راسخ بتوفير وتوسيع خدماتنا التعليمية للشباب المصري. ونعتقد أننا وجدنا الشركاء المناسبين لمساعدتنا في ذلك. مهمتنا” عمار الجرف، المدير التنفيذي لشركة بيلارز للتسويق

"تمثل هذه الاتفاقية علامة فارقة لجامعة عمان الأهلية لتسهيل خدمات التسجيل والدفع للطلاب المصريين. ويسعدنا جدًا أن نكون قادرين على تقديم هذه الخدمات للشباب المصري من خلال شريك موثوق به ذو وصول غير مسبوق مثل البريد المصري. ونحن على ثقة أيضًا من أن WAVZ ستكون قادرة على تزويدنا بالحلول التكنولوجية التي ستجعل هذه الخدمات سلسة ووفقًا لأحدث المعايير. لدينا التزام راسخ بتوفير وتوسيع خدماتنا التعليمية للشباب المصري. ونعتقد أننا وجدنا الشركاء المناسبين لمساعدتنا في ذلك. مهمتنا"

بشكل عام، تهدف الشراكة بين جامعة عمان الأهلية والبريد المصري وWAVZ للتحول الرقمي إلى جعل خدمات التسجيل ودفع الرسوم الدراسية أكثر سهولة للطلاب المصريين. إن استخدام العملة المحلية وسعر التحويل المعلن من قبل البنك المركزي المصري، يجعل العملية أكثر ملاءمة للطلاب. علاوة على ذلك، من المتوقع أن يؤدي استخدام التكنولوجيا في عملية التسجيل والدفع إلى تحسين الكفاءة وتقليل احتمالية الأخطاء، مما يجعل النظام أكثر موثوقية وشفافية.

ومن الممكن أن يؤدي ذلك إلى تحسين مصداقية نظام التعليم وتشجيع المزيد من الطلاب على الالتحاق بالجامعة. وتعد الشراكة أيضًا شهادة على أهمية الشراكات بين القطاعين العام والخاص في تحسين الوصول إلى التعليم والخدمات الأساسية الأخرى. ومن خلال الاستفادة من الموارد والخبرات لدى كل من القطاعين العام والخاص، يمكن للشراكة أن توفر حلاً أكثر شمولاً وفعالية يفيد جميع الأطراف المعنية.

وقد أعرب البريد المصري عن سعادته بهذه الشراكة.

"ستمكن هذه الاتفاقية الطلاب المصريين من التسجيل بسلاسة في جامعة عمان الأهلية وتزود الطلاب بالقدرة على دفع الرسوم الدراسية من خلال فروعنا البالغ عددها 4500 فرعًا في جميع أنحاء البلاد وبالعملة المحلية دون الحاجة إلى المرور بمشاكل الاستعانة بمصادر خارجية للعملة الأجنبية. وهذا يتماشى مع التزامنا بتقديم خدمات ذات صلة وذات مغزى للشباب المصري" حاتم الصولي، رئيس قسم مراقبة الجودة، البريد المصري

"ستمكن هذه الاتفاقية الطلاب المصريين من التسجيل بسلاسة في جامعة عمان الأهلية وتزود الطلاب بالقدرة على دفع الرسوم الدراسية من خلال فروعنا البالغ عددها 4500 فرعًا في جميع أنحاء البلاد وبالعملة المحلية دون الحاجة إلى المرور بمشاكل الاستعانة بمصادر خارجية للعملة الأجنبية. وهي تتماشى مع التزامنا بتقديم خدمات ذات صلة وذات مغزى للشباب المصري "

كانت WAVZ أيضًا متحمسة جدًا لتكون جزءًا من هذه الاتفاقية.

"نحن متحمسون للغاية لكوننا جزءًا من هذه الاتفاقية ولتوفير التكنولوجيا اللازمة لإنجاح هذه الشراكة. وهذا يندرج في إطار التزامنا بتمكين الخدمات الرقمية المتقدمة لمجتمع الشباب المصري من خلال 4500 فرع للبريد المصري. وتسلط مثل هذه البرامج الضوء على أهمية التكنولوجيا والخدمات الرقمية التي يمكن أن تؤثر بشكل إيجابي على حياة الناس" عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ.

"نحن متحمسون للغاية لكوننا جزءًا من هذه الاتفاقية ولتوفير التكنولوجيا اللازمة لإنجاح هذه الشراكة. ويندرج هذا ضمن التزامنا بتمكين الخدمات الرقمية المتقدمة لمجتمع الشباب المصري من خلال فروع البريد المصري البالغ عددها 4500 فرع. وتسلط مثل هذه البرامج الضوء على أهمية التكنولوجيا والخدمات الرقمية التي يمكن أن تؤثر بشكل إيجابي على حياة الناس "`,
          category: 'announcement',
          date: '14 يونيو 2023',
          readTime: '3 دقائق قراءة',
          image: '/news/ahliyya.webp',
          title: 'جامعة الأهلية الأردنية تتشارك مع البريد المصري وWAVZ لخدمات القبول',
          excerpt: 'أطلقت جامعة الأهلية الأردنية مع البريد المصري وWAVZ خدمات التسجيل وسداد الرسوم للطلاب المصريين عبر 4500 فرع بريد.',
          url: 'https://wavz.com.eg/news/al-ahliyya-amman-university-enrollemtn-services-and-tuition-payments/',
        },
        {
          id: 'egypt-trust-callcenter',
          content: `[القاهرة، مصر] – (1 أبريل) – تعلن شركة إيجيبت ترست عن إطلاق “مركز اتصال إيجيبت ترست” الجديد، والذي سيتم تشغيله بواسطة WAVZ للتحول الرقمي لخدمة المزيد من العملاء بكفاءة أكبر.

قال محمد كيوان، الرئيس التنفيذي لشركة إيجيبت تراست: "من خلال توفير شهادات التوقيع الرقمي، تستطيع إيجيبت تراست دعم أتمتة الخدمات الحكومية وإتاحتها إلكترونيًا للمجتمع المصري. أحد أهدافنا الرئيسية هو أن نكون قادرين على خدمة عملائنا بشكل أكثر كفاءة ومساعدتهم على حل أي مشكلات قد تكون لديهم بطريقة أكثر سلاسة وإرضاءً. ومن هنا جاءت الحاجة إلى الشراكة مع مزود خدمة موثوق به وفعال مثل WAVZ".

"من خلال توفير شهادات التوقيع الرقمي، تستطيع شركة إيجيبت ترست دعم أتمتة الخدمات الحكومية وإتاحتها إلكترونيًا للمجتمع المصري. أحد أهدافنا الرئيسية هو أن نكون قادرين على خدمة عملائنا بشكل أكثر كفاءة ومساعدتهم على حل أي مشكلات قد تكون لديهم بطريقة أكثر سلاسة وإرضاءً. ومن ثم، هناك حاجة إلى الشراكة مع مزود خدمة موثوق به وفعال مثل WAVZ "

شهدت السنوات القليلة الماضية نموًا هائلاً في قاعدة عملاء إيجيبت ترست من الشركات، مما أدى إلى إنشاء مركز اتصال إيجيبت ترست ليكون قادرًا على الرد على استفسارات العملاء وتقديم معلومات موثوقة عند الحاجة إليها على مدار الساعة. بعد عام واحد من تشغيلها، وسعيًا للحصول على خدمة عملاء أفضل وأكثر كفاءة، قررت شركة إيجيبت ترست الاستعانة بمصادر خارجية لتشغيل مركز الاتصال الخاص بها حتى يتمكنوا من التركيز على أعمالهم الأساسية.

بعد دراسة متأنية، قررت شركة Egypt Trust الدخول في شراكة مع WAVZ للتحول الرقمي لتزويد مركز اتصال Egypt Trust بحل كامل من مصادر خارجية بما في ذلك الموارد ذات الخبرة والتكنولوجيا وتحسينات العمليات التشغيلية لتجربة عملاء متميزة.

خلال هذه العملية، اعتمدت WAVZ بالتعاون مع Egypt Trust تطبيقات أفضل الممارسات لإنتاج كتالوج الخدمة الذي لن يساعد فقط في التغلب على التحديات التي يواجهها الإعداد الحالي، ولكن الأهم من ذلك هو تعزيز تجربة العملاء وتلبية توقعات العملاء المتزايدة باستمرار. سعيًا لتحقيق انتقال سلس، عملت WAVZ مع Egypt Trust للتأكد من تنفيذ المشروع في أقصر وقت ممكن دون المساس بالتحسينات اللازمة لتحسين العمليات الداخلية وتجربة العملاء.

تم تنفيذ عملية النقل في وقت قياسي أقل من أربعة أسابيع لتشغيل مركز الاتصال الجديد. إن التأكد من أن لديهم الكفاءات المناسبة، وتوفير التدريب اللازم، وعمليات الإعداد، قد ساعد شركة إيجيبت ترست على زيادة الموارد اللازمة لتلبية الاحتياجات المستقبلية في أوقات قياسية.

وقد ساعد هذا الحل أيضًا شركة إيجيبت ترست على اعتماد أفضل الممارسات ونماذج بروتوكولات الأمان الفعالة من حيث التكلفة وضمان التميز التشغيلي لمركز الاتصال.

سيتم تزويد مركز الاتصال بوكلاء ذوي مهارات عالية تم تدريبهم لتقديم خدمة عملاء متميزة.

"إن شركة WAVZ للتحول الرقمي واثقة من أن هذا التعاون سيؤدي إلى النمو والنجاح لكلا الشركتين. ونحن متحمسون للعمل معًا لتقديم خدمة عملاء ذات مستوى عالمي لعملائنا." سعيد عمرو عصمت، الرئيس التنفيذي والعضو المنتدب لشركة WAVZ

"إن شركة WAVZ للتحول الرقمي واثقة من أن هذا التعاون سيؤدي إلى النمو والنجاح لكلا الشركتين. ونحن متحمسون للعمل معًا لتقديم خدمة عملاء ذات مستوى عالمي لعملائنا."

الشركة المصرية للتوقيع الرقمي وأمن المعلومات – إيجيبت تراست هي شركة مصرية تأسست عام 2005 وتقدم خدماتها للسوق المصري وفقًا للخطط الحكومية للتحول الرقمي. Egypt Trust هي هيئة شهادات رقمية معتمدة من الحكومة تقوم بإصدار الشهادات الرقمية لكل من الأفراد والشركات.

WAVZ هي شركة تقدم خدمات متعددة التقنيات ومتعددة البائعين تركز على استخدام الخبرة التجارية والفنية ذات المهارات العالية لخدمة القطاعين العام والخاص المصري والإقليمي المتطلب باستمرار. تقدم WAVZ خدمات تكنولوجيا المعلومات المتنوعة في مختلف التخصصات. يتم تصميم خدمات/حلول WAVZ في الغالب خصيصًا لتتناسب بشكل رائع مع احتياجات أعمال عملائنا في الوقت المحدد والميزانية. WAVZ هي شريكة للعديد من شركات التكنولوجيا الكبرى بما في ذلك على سبيل المثال لا الحصر SAP وOracle وTemenos.

لمزيد من المعلومات حول WAVZ للتحول الرقمي وخدماتنا، اتصل بنا هنا`,
          category: 'announcement',
          date: '1 أبريل 2023',
          readTime: '3 دقائق قراءة',
          image: '/news/egypttrust.jpg',
          title: 'WAVZ ترفع مستوى عمليات مركز اتصالات Egypt Trust',
          excerpt: 'أعلنت Egypt Trust عن إطلاق مركز الاتصالات الجديد، الذي تُشغّله WAVZ للتحول الرقمي، لخدمة العملاء بكفاءة أعلى.',
          url: 'https://wavz.com.eg/news/egypt-trust-call-center-operations-upgrades/',
        },
      ],
    },
    cta: {
      title: 'جاهزٌ لتحويل مؤسستك؟',
      desc: 'شاهد كيف يمكن لـ WAVZ خفض تكلفة عملياتك بنسبة 60% والقضاء على تعقيد التحول الرقمي.',
      btn1: 'احجز استشارة',
      btn2: 'احسب وفوراتك',
    },
    footer: {
      address: 'حديقة المعادي التكنولوجية، مبنى B2، بلوك MB3، القاهرة، مصر',
      phone: '+20 2 2120 1430',
      contact: 'تواصل معنا',
      cols: [
        { title: 'الحلول', links: ['الخدمات المُدارة', 'حلول تقنيات Oracle', 'حلول وخدمات SAP', 'حلول البيانات والذكاء الاصطناعي'] },
        { title: 'القطاعات', links: ['البنوك والمالية', 'هيئات البريد', 'الحكومة', 'المؤسسات', 'الاتصالات'] },
        { title: 'الشركة', links: ['عن WAVZ', 'مسيرتنا', 'مجلس الإدارة', 'الفريق التنفيذي', 'شركاؤنا'] },
        { title: 'المصادر', links: ['الأخبار', 'المدونة', 'رؤى وأفكار', 'الوظائف', 'تواصل'] },
      ],
      copy: '© 2026 WAVZ للتحول الرقمي. جميع الحقوق محفوظة.',
      privacy: 'الخصوصية',
      terms: 'الشروط',
    },
    about: {
      tagline: 'شركة تحول تكنولوجي بُنيت لحل أصعب تحديات المؤسسات — عبر القطاعات والحدود والمنصات.',
      introLine1: 'WAVZ للتحول الرقمي شركة تكنولوجيا رائدة تقدم حلول SAP وتكنولوجيا مالية ومنصات دفع وأمن سيبراني وخدمات مُدارة عبر الشرق الأوسط وأفريقيا.',
      introLine2: 'تأسست WAVZ بمهمة سد الفجوة بين التكنولوجيا العالمية المتقدمة وخبرة الأسواق الإقليمية، لتخدم الحكومات والبنوك والمؤسسات في منطقة الشرق الأوسط وأفريقيا.',
      visionTitle: 'الرؤية',
      visionText: 'أن نكون الشريك الريادي الموثوق في المنطقة، لتمكين المؤسسات من النمو والابتكار والتطور بثقة.',
      missionTitle: 'الرسالة',
      missionText: 'نُمكّن المؤسسات عبر محفظة مبتكرة من الخدمات الاستشارية والتشغيلية، تجمع بين التميز في التنفيذ والشراكات لضمان نمو مرن ومستدام.',
      purposeBadge: 'هدفنا',
      strategyTitle: 'استراتيجيتنا',
      strategySubtitle: 'ستة ركائز تُحدد كيف نفكر ونعمل ونُقدِّم القيمة لعملائنا.',
      strategyPillars: [
        { title: 'ريادة التكنولوجيا', desc: 'نستثمر أكثر المنصات تطوراً — SAP وTemenos وTietoevry وTeradata — لتحقيق تحول حقيقي، لا مجرد تطبيق.' },
        { title: 'الأمن السيبراني أولاً', desc: 'كل حل نقدمه مبني على أساس من الأمان. نتعاون مع رواد عالميين كـ Nevis لحماية أصول عملائنا الأكثر أهمية.' },
        { title: 'الخبرة الإقليمية', desc: 'الفهم العميق لأسواق الشرق الأوسط وأفريقيا وأنظمتها وثقافاتها يُمكِّننا من تقديم حلول تناسب الاحتياجات المحلية فعلاً.' },
        { title: 'ثقافة الابتكار', desc: 'نستثمر في البحث والتطوير وتكامل الذكاء الاصطناعي والتقنيات الناشئة لضمان تميُّز عملائنا دائماً.' },
        { title: 'نموذج الشراكة', desc: 'نؤمن بأن أفضل النتائج تأتي من التعاون الحقيقي — مع العملاء وشركاء التكنولوجيا وفريقنا الموهوب.' },
        { title: 'الإنسان أولاً', desc: 'أثمن ما نمتلك هو أكثر من 1300 خبير. نستثمر بعمق في التدريب والتطوير وثقافة التميز.' },
      ],
      storyTitle: 'قصتنا',
      storySubtitle: 'من فكرة جريئة إلى رائد تكنولوجي إقليمي — هذه رحلة WAVZ.',
      storyMilestones: [
        { year: '2008', title: 'التأسيس', desc: 'بداية وانطلاق أول مشروع لـ WAVZ (نظام SAP ERP)' },
        { year: '2014', title: 'تطبيق SAP للبريد المصري', desc: 'الدعم الفني للعمليات اليومية، المالية والمراقبة (FI/CO)، المخازن، المشتريات، الرواتب وشؤون الموظفين' },
        { year: '2016', title: 'دعم موارد مراكز الاتصال', desc: 'دعم مراكز خدمة العملاء بجميع الموارد المطلوبة.' },
        { year: '2017', title: 'التحول الرقمي للبريد المصري', desc: 'دعم موارد تطبيقات البريد الإلكتروني واللوجستيات الإلكترونية، سوق SAP، البوابة البريدية' },
        { year: '2018', title: 'توسيع الخدمات', desc: 'إدخال حلول الدفع الإلكتروني، الشباك الإلكتروني، والتوقيع الإلكتروني' },
        { year: '2020', title: 'توسعات حلول المدفوعات الرقمية', desc: 'إطلاق إصدار بطاقات ميزة وتنفيذ إصدار بطاقات Visa NFC' },
        { year: '2022', title: 'توسيع الخدمات', desc: 'إدخال الحلول المالية الأساسية والمعاملات المتكاملة' },
        { year: '2023', title: 'التوسع الإقليمي', desc: 'بدء التوسع في الأسواق الإقليمية الأفريقية والشرق أوسطية من خلال حلول SAP والحلول المالية المبتكرة' },
      ],
      whyTitle: 'لماذا نوجد',
      whyText: 'التحول المؤسسي في منطقة الشرق الأوسط وأفريقيا كان دائماً أصعب مما ينبغي — موردون متفرقون، فجوات ثقافية، وغياب الخبرة المحلية. بنينا WAVZ لتغيير ذلك. لنكون الشريك الوحيد الذي يُقدِّم الاستراتيجية والتنفيذ معاً، تحت سقف واحد، بفريق واحد مسؤول.',
      valuesTitle: 'قيمنا الجوهرية',
      valuesSubtitle: 'المبادئ التي تُوجِّه كل قرار وكل مشروع وكل تفاعل في WAVZ.',
      values: [
        { name: 'الصراحة والشفافية', desc: 'نؤمن بالصدق الجذري — مع عملائنا وشركائنا وأنفسنا. لا مفاجآت ولا مراوغة.' },
        { name: 'النزاهة والأمانة', desc: 'نفعل ما نقوله في كل مرة. سمعتنا مبنية على سجل ثابت من التسليم والمساءلة.' },
        { name: 'الاحترام المتبادل', desc: 'كل شخص — عميل أو شريك أو عضو في الفريق — يستحق الكرامة والتقدير والتفاعل الحقيقي.' },
        { name: 'التركيز على العميل', desc: 'نجاح عملائنا هو المقياس الوحيد لنجاحنا. نهوس بالنتائج لا بالمخرجات.' },
        { name: 'روح المسؤولية والملكية', desc: 'نتحمل المسؤولية الشخصية عن النتائج. كل عضو في الفريق يتصرف كصاحب المشروع.' },
        { name: 'فريق واحد، هدف واحد', desc: 'رغم حجمنا، نعمل كفريق واحد موحد — نسير جميعاً نحو نفس الهدف.' },
      ],
    },
    journey: {
      tagline: 'من شركة ناشئة جريئة إلى رائد تكنولوجي إقليمي — استكشف المحطات التي شكّلت WAVZ.',
      steps: [
        { year: '2008', title: 'التأسيس', items: ['بداية وانطلاق أول مشروع لـ WAVZ (نظام SAP ERP)'] },
        { year: '2014', title: 'تطبيق SAP للبريد المصري', items: ['الدعم الفني للعمليات اليومية', 'المالية والمراقبة، المخازن، المشتريات، الرواتب وشؤون الموظفين'] },
        { year: '2016', title: 'دعم موارد مراكز الاتصال', items: ['دعم مراكز خدمة العملاء بجميع الموارد المطلوبة.'] },
        { year: '2017', title: 'التحول الرقمي للبريد المصري', items: ['دعم موارد تطبيقات البريد الإلكتروني واللوجستيات الإلكترونية', 'سوق SAP، البوابة البريدية'] },
        { year: '2018', title: 'توسيع الخدمات', items: ['إدخال حلول الدفع الإلكتروني', 'الشباك الإلكتروني والتوقيع الإلكتروني'] },
        { year: '2020', title: 'توسعات حلول المدفوعات الرقمية', items: ['إطلاق إصدار بطاقات ميزة وتنفيذ إصدار بطاقات Visa NFC'] },
        { year: '2022', title: 'توسيع الخدمات', items: ['إدخال الحلول المالية الأساسية والمعاملات المتكاملة'] },
        { year: '2023', title: 'التوسع الإقليمي', items: ['بدء التوسع في الأسواق الإقليمية الأفريقية والشرق أوسطية من خلال حلول SAP والحلول المالية المبتكرة'] },
      ],
    },
  },
};
