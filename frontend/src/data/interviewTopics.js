// Curated Real-World Interview Question Bank
export const INTERVIEW_TOPICS = {
  system_design: {
    id: "system_design",
    name: "System Design & Distributed Architecture",
    badge: "Distributed Systems",
    color: "cyan",
    questions: [
      {
        id: "sys-1",
        title: "Idempotent Payment Processing",
        company: "Stripe • Amazon • Uber",
        difficulty: "Staff Engineer / L6",
        question:
          "How would you design a fault-tolerant payment processing system to guarantee zero duplicate charges when client network timeouts occur?",
        signals:
          "Idempotency keys (UUIDv4), atomic Redis leases (SETNX), 409 status handling, DB unique constraints, TTL caches.",
        expectedKeywords: [
          "idempotency",
          "redis",
          "uuid",
          "atomic",
          "timeout",
          "lease",
          "retry",
          "database",
          "lock",
          "unique",
          "transaction",
        ],
        modelAnswer:
          "I implement an idempotency layer using a UUIDv4 key in the request header. When a request hits the API gateway, we acquire an atomic lease in Redis using SETNX. If a duplicate arrives while processing, the client receives a 409 conflict or polls the existing transaction status. Once completed, the final response is cached with a 24-hour TTL, backed by database unique constraints to guarantee zero duplicate charges.",
        sampleTranscript:
          "To prevent duplicate payments, I implement an idempotency key using UUIDv4 in the request header. When a request arrives, we store this key in Redis with an atomic lease. If a client retries due to a timeout, we check the cache and return the existing response instead of processing the charge again.",
      },
      {
        id: "sys-2",
        title: "Multi-Region Distributed Rate Limiting",
        company: "Cloudflare • Netflix • Google",
        difficulty: "Principal / Senior SDE",
        question:
          "How would you design a distributed rate limiter that scales across multiple global regions handling over 500,000 requests per second with sub-millisecond latency?",
        signals:
          "Sliding window log vs token bucket, local edge in-memory counters, asynchronous Kafka cross-region reconciliation, partition tolerance.",
        expectedKeywords: [
          "rate limiter",
          "sliding window",
          "redis",
          "token bucket",
          "latency",
          "multi-region",
          "replication",
          "kafka",
          "edge",
        ],
        modelAnswer:
          "I deploy edge rate-limiting proxies in each region utilizing a sliding window counter stored in local Redis memory to eliminate cross-region roundtrip latencies. Local counts are asynchronously batched and reconciled via Kafka into a centralized synchronization tier, allowing dynamic quota adjustments while keeping local latency under 1 millisecond.",
        sampleTranscript:
          "I would utilize a sliding window log or token bucket algorithm backed by local Redis clusters at the edge. To manage latency across multi-region deployments, each region maintains local in-memory counters with asynchronous aggregation via Kafka.",
      },
      {
        id: "sys-3",
        title: "High-Throughput Notification Engine",
        company: "Meta • Uber • DoorDash",
        difficulty: "Senior Backend Engineer",
        question:
          "Design a real-time notification service delivering 100,000 pushes and SMS per second with deduplication, priority queues, and provider failover.",
        signals:
          "Partitioned Kafka queues, worker pools, Redis bloom/sliding filters, circuit breakers with exponential backoff, dead letter queues.",
        expectedKeywords: [
          "kafka",
          "queue",
          "priority",
          "deduplication",
          "circuit breaker",
          "dead letter",
          "batching",
          "worker",
          "fcm",
          "failover",
        ],
        modelAnswer:
          "I architect the pipeline using partitioned Kafka topics grouped by notification priority (Transactional, Urgent, Promotional). Distributed worker pools consume events, deduplicate using Redis sliding filters, and dispatch to third-party providers wrapped with circuit breakers and dead-letter queues to handle upstream provider downtime.",
        sampleTranscript:
          "I architect the pipeline using Kafka partitioned by user ID to guarantee ordering. Worker pools consume notifications, deduplicate via a Redis sliding filter, and forward to providers through circuit breakers with dead-letter queues for undelivered events.",
      },
      {
        id: "sys-4",
        title: "Distributed Unique ID Generator",
        company: "Twitter • Instagram • Discord",
        difficulty: "Senior Distributed Systems SDE",
        question:
          "Design a distributed unique ID generator that generates 64-bit strictly time-sortable IDs at 1,000,000 IDs/second with zero cross-node coordination.",
        signals:
          "Twitter Snowflake architecture, 41-bit millisecond epoch, 10-bit worker/datacenter ID, 12-bit sequence counter, NTP backwards clock skew handling.",
        expectedKeywords: [
          "snowflake",
          "timestamp",
          "sequence",
          "worker id",
          "ntp",
          "clock drift",
          "sortable",
          "64-bit",
          "coordination",
        ],
        modelAnswer:
          "I implement a Twitter Snowflake-based algorithm generating 64-bit integers composed of 1 sign bit, 41 bits for epoch timestamp (giving 69 years of runway), 10 bits for worker/datacenter ID, and 12 bits for a local sequence counter capable of 4,096 IDs per millisecond per node. If the local sequence exhausts within a millisecond, the worker spins until the next millisecond. To guard against NTP clock drift, the service rejects generation or pauses if system clock moves backwards.",
        sampleTranscript:
          "I use a Snowflake algorithm with 41 bits of timestamp, 10 bits of worker ID, and 12 bits of local sequence counter. Each worker generates IDs locally without distributed locks. If the system clock steps backwards due to NTP sync, the service holds generation until the clock catches up.",
      },
      {
        id: "sys-5",
        title: "Global CDN & Instant Dynamic Invalidation",
        company: "Akamai • Cloudflare • Fastly",
        difficulty: "Staff Edge Architect",
        question:
          "How would you architect a global edge CDN capable of serving 5 million requests per second with sub-50ms cache hits, while supporting instantaneous (sub-second) cache purges worldwide?",
        signals:
          "Anycast BGP routing, tiered edge shielding, surrogate keys / cache tags, distributed pub/sub purge mesh, stale-while-revalidate headers.",
        expectedKeywords: [
          "anycast",
          "edge",
          "surrogate key",
          "purge",
          "stale-while-revalidate",
          "origin shield",
          "cache-control",
          "invalidation",
        ],
        modelAnswer:
          "I leverage Anycast BGP routing to direct client traffic to the topologically closest edge Point of Presence (PoP), fronting origin shielding tiers to minimize origin load. Dynamic content is tagged using surrogate keys (cache tags) in HTTP response headers. For sub-second global invalidations, purge requests publish surrogate keys to a distributed in-memory pub/sub mesh running on edge nodes, instantly invalidating related asset keys while serving background revalidations via stale-while-revalidate.",
        sampleTranscript:
          "I use Anycast BGP routing to terminate requests at nearest edge nodes. Dynamic pages include surrogate key headers so related pages share tags. When content updates, a purge message broadcasts over our edge pub/sub mesh to invalidate matching tags in under 200 milliseconds.",
      },
      {
        id: "sys-6",
        title: "Distributed Web Crawler & URL Deduplication",
        company: "Google • Perplexity • Microsoft Bing",
        difficulty: "Staff Systems Engineer",
        question:
          "How do you design a distributed web crawler that indexes 10 billion web pages per month with politeness policies, duplicate content detection, and DNS caching?",
        signals:
          "Mercator frontier queues (domain politeness with priority), Bloom filters and SimHash/MinHash for near-duplicate detection, async DNS worker pools.",
        expectedKeywords: [
          "crawler",
          "frontier",
          "bloom filter",
          "politeness",
          "dns",
          "deduplication",
          "minhash",
          "pagerank",
          "domain",
        ],
        modelAnswer:
          "I design the crawling architecture around a two-tier frontier queue: prioritization queues that score URLs by PageRank and historical freshness, and domain politeness queues backed by Redis with per-host delay timers (e.g. 1 request/second per host). To deduplicate URLs and near-duplicate HTML content at 10-billion scale, I use distributed Scalable Bloom Filters and 64-bit SimHash/MinHash fingerprints, supported by dedicated asynchronous local DNS resolver pools.",
        sampleTranscript:
          "The crawler architecture uses a prioritized URL frontier with domain-specific queues to enforce robots.txt and politeness delays. To prevent re-crawling identical pages, we pass fetched HTML through SimHash fingerprinting and check URLs against distributed Bloom filters.",
      },
    ],
  },
  databases: {
    id: "databases",
    name: "Databases, Caching & Concurrency",
    badge: "Data & Storage",
    color: "emerald",
    questions: [
      {
        id: "db-1",
        title: "Thundering Herd / Cache Stampede",
        company: "Meta • Amazon • LinkedIn",
        difficulty: "Senior Engineer",
        question:
          "What is the cache stampede (thundering herd) problem, and how do you protect high-traffic databases when critical cache keys expire?",
        signals:
          "Distributed mutex locks, probabilistic early expiration (XFetch algorithm), background warming crons, stale-while-revalidate.",
        expectedKeywords: [
          "thundering herd",
          "cache stampede",
          "mutex",
          "lock",
          "probabilistic",
          "ttl",
          "warm",
          "stale",
          "background",
          "expire",
        ],
        modelAnswer:
          "A cache stampede occurs when a high-traffic key expires, triggering simultaneous concurrent queries that overwhelm the database. I prevent this by implementing distributed mutex locks so only the first request queries the primary DB while others wait, combined with probabilistic early expiration (XFetch) and background asynchronous pre-warming.",
        sampleTranscript:
          "A cache stampede happens when a hot cache key expires and thousands of requests hit the database simultaneously. To solve this, I implement distributed mutex locks in Redis so only one worker queries the database, while using background pre-warming.",
      },
      {
        id: "db-2",
        title: "B-Trees vs LSM-Trees Storage Engines",
        company: "Databricks • Apple • Microsoft",
        difficulty: "Staff Systems Engineer",
        question:
          "Explain the architectural trade-offs between B-Tree and LSM-Tree storage engines. Under what workload conditions would you choose Cassandra over PostgreSQL?",
        signals:
          "In-place updates vs append-only SSTables, write amplification, random reads vs sequential writes, compaction overhead.",
        expectedKeywords: [
          "b-tree",
          "lsm-tree",
          "cassandra",
          "postgresql",
          "write amplification",
          "sstable",
          "sequential",
          "throughput",
          "random",
        ],
        modelAnswer:
          "B-Trees maintain balanced pages with in-place updates, making PostgreSQL ideal for read-heavy, low-latency random queries with strict ACID transactions. LSM-Trees append writes sequentially to memory and flush to SSTables on disk, drastically reducing write amplification and making Cassandra superior for write-heavy telemetry or high-throughput logging.",
        sampleTranscript:
          "B-Trees excel at random reads with in-place updates, making PostgreSQL great for relational ACID queries. LSM-Trees append writes sequentially and flush to SSTables, giving Cassandra superior write throughput for streaming and time-series data.",
      },
      {
        id: "db-3",
        title: "Distributed Microservice Transactions",
        company: "Stripe • Airbnb • Uber",
        difficulty: "Staff Architect",
        question:
          "How do you ensure data consistency across multiple independent microservices without locking resources using two-phase commit (2PC)?",
        signals:
          "Saga pattern (choreography vs orchestration), compensating transactions, Transactional Outbox pattern, CDC with Debezium.",
        expectedKeywords: [
          "saga",
          "orchestration",
          "choreography",
          "outbox",
          "compensating",
          "eventual consistency",
          "kafka",
          "cdc",
          "debezium",
        ],
        modelAnswer:
          "I implement the Saga pattern with compensating transactions. Using the Transactional Outbox pattern paired with Debezium CDC, each microservice commits local database state and publishes domain events to Kafka. If an order or payment step fails, an orchestrator publishes compensating events to rollback earlier states gracefully.",
        sampleTranscript:
          "I apply the Saga pattern with compensating transactions instead of 2PC locks. By using the Transactional Outbox pattern, microservices emit events to Kafka, triggering compensating transactions if any downstream step fails.",
      },
      {
        id: "db-4",
        title: "Relational Sharding & Consistent Hashing",
        company: "Pinterest • Discord • Uber",
        difficulty: "Senior Backend / Data Engineer",
        question:
          "Your PostgreSQL relational cluster is reaching vertical storage limits at 50TB. How do you design an application-level sharding strategy using consistent hashing without query hotspots?",
        signals:
          "Virtual nodes on a hash ring, shard key selection (user_id vs tenant_id), scatter-gather cross-shard queries, dual-write resharding migration.",
        expectedKeywords: [
          "sharding",
          "consistent hashing",
          "virtual nodes",
          "shard key",
          "scatter-gather",
          "hotspot",
          "rebalance",
          "partition",
        ],
        modelAnswer:
          "I select a high-cardinality shard key such as tenant_id or user_id and map shards to a consistent hash ring with virtual nodes (e.g. 256 virtual nodes per physical host) to guarantee uniform data distribution. A routing middleware resolves queries to specific shard pools directly. For cross-shard analytics, we fan out scatter-gather queries asynchronously or replicate data via CDC to an analytical warehouse like ClickHouse.",
        sampleTranscript:
          "We shard horizontally using consistent hashing with virtual nodes to distribute keys evenly across database instances. Queries containing the user ID route directly to their specific shard. For cross-shard operations, we use background CDC replication into Snowflake.",
      },
      {
        id: "db-5",
        title: "Write-Ahead Logging (WAL) & Crash Recovery",
        company: "MongoDB • CockroachDB • Snowflake",
        difficulty: "Staff Database Core Engineer",
        question:
          "Explain how Write-Ahead Logging (WAL) and the ARIES recovery algorithm guarantee ACID atomicity and durability during sudden operating system crashes.",
        signals:
          "Append-only disk fsync, Log Sequence Numbers (LSN), check-pointing, Analysis-Redo-Undo phases, dirty page table.",
        expectedKeywords: [
          "wal",
          "write-ahead log",
          "aries",
          "fsync",
          "atomicity",
          "durability",
          "checkpoint",
          "lsn",
          "redo",
          "undo",
        ],
        modelAnswer:
          "Write-Ahead Logging dictates that before any in-memory dirty buffer page is flushed to disk, the corresponding log record must be fsynced sequentially to the WAL with an incremented Log Sequence Number (LSN). During crash recovery, the ARIES protocol executes three phases: Analysis reconstructs active transactions and dirty pages from the last checkpoint; Redo reapplies all logged state changes; Undo rolls back uncommitted transactions in reverse order to preserve atomicity.",
        sampleTranscript:
          "WAL ensures changes are written sequentially to disk logs before modifying database pages. Upon recovery, the engine reads the last checkpoint, executes the redo phase to restore committed transactions, and runs the undo phase to rollback uncommitted mutations.",
      },
      {
        id: "db-6",
        title: "Replication Lag & Read-Your-Own-Writes",
        company: "Shopify • Twitter • Amazon",
        difficulty: "Senior Systems Architect",
        question:
          "How do you guarantee 'read-your-own-writes' consistency in a primary-replica database architecture experiencing asynchronous replication lag of 2 to 5 seconds?",
        signals:
          "Session-level sticky primary routing, tracking transaction commit timestamp / GTID, client monotonic read consistency, Redis write timestamps.",
        expectedKeywords: [
          "replication lag",
          "read-your-own-writes",
          "gtid",
          "primary",
          "replica",
          "sticky session",
          "consistency",
          "timestamp",
        ],
        modelAnswer:
          "I guarantee read-your-own-writes by tracking the last mutation timestamp or Global Transaction ID (GTID) in the user's session cookie or JWT. When the client makes a read request, the database router checks if the replica's replication lag has caught up to the user's GTID. If the replica lags behind, read traffic for that specific user is conditionally routed directly to the primary node for a 10-second safety window.",
        sampleTranscript:
          "When a user performs a write, we store their commit timestamp in their session. For subsequent reads, our database gateway checks replica lag; if the replica has not caught up to that timestamp, we route that user's read to the primary DB.",
      },
    ],
  },
  behavioral: {
    id: "behavioral",
    name: "Behavioral & Leadership (STAR)",
    badge: "Leadership & Culture",
    color: "amber",
    questions: [
      {
        id: "beh-1",
        title: "Technical Disagreement with Leadership",
        company: "Google • Amazon • Microsoft",
        difficulty: "All Engineering Levels",
        question:
          "Tell me about a time you had a fundamental technical disagreement with a team lead or product manager. How did you handle the situation and resolve it?",
        signals:
          "STAR methodology, objective benchmarking, data over opinions, active stakeholder alignment, measurable outcome.",
        expectedKeywords: [
          "disagreement",
          "situation",
          "action",
          "result",
          "data",
          "benchmark",
          "compromise",
          "stakeholder",
          "consensus",
          "sla",
        ],
        modelAnswer:
          "During an infrastructure migration, our tech lead favored building an in-house cache while I advocated for managed Redis. Rather than debating opinions, I built a benchmark harness comparing failover latency and maintenance overhead. The data proved Redis reduced operational overhead by 40 hours monthly, leading our team to align on the managed solution.",
        sampleTranscript:
          "During a major cloud migration, our tech lead wanted an in-house caching solution while I advocated for Redis. I set up a benchmark harness measuring latency and maintenance overhead. The data showed Redis prevented 40 hours of monthly maintenance, convincing the team to align.",
      },
      {
        id: "beh-2",
        title: "Critical Production Outage Triage",
        company: "Meta • Netflix • AWS",
        difficulty: "Senior / Staff Engineer",
        question:
          "Describe a major production outage or incident caused by your code or team. Walk me through your triage, mitigation, and post-mortem prevention.",
        signals:
          "Fast rollback/circuit-break (<5 min), blameless post-mortem, root cause analysis, automated prevention checks.",
        expectedKeywords: [
          "outage",
          "incident",
          "rollback",
          "circuit breaker",
          "post-mortem",
          "sla",
          "root cause",
          "monitoring",
          "prevention",
        ],
        modelAnswer:
          "Following a release, an unindexed database query spiked CPU to 100%, generating 504 errors for 4% of traffic. I immediately executed a blue-green rollback within 3 minutes to restore traffic, followed by hotfixing the index. During our blameless post-mortem, we instituted automated query analysis in CI/CD to prevent unindexed queries from reaching staging.",
        sampleTranscript:
          "After a release, an unindexed query spiked database CPU to 100%. I immediately executed a blue-green rollback within 3 minutes to restore traffic. In the blameless post-mortem, we added automated query analysis to our CI/CD pipeline.",
      },
      {
        id: "beh-3",
        title: "Delivering Under Ambiguity",
        company: "Apple • Stripe • Palantir",
        difficulty: "Lead Engineer / Tech Lead",
        question:
          "Tell me about a project where requirements were ambiguous and constantly shifting. How did you maintain velocity and deliver successfully?",
        signals:
          "Iterative milestones, continuous stakeholder reviews, risk de-scoping, progressive delivery.",
        expectedKeywords: [
          "ambiguity",
          "milestones",
          "iterative",
          "stakeholder",
          "mvp",
          "alignment",
          "scope",
          "feedback",
          "delivered",
        ],
        modelAnswer:
          "When tasked with building an internal ML analytics portal without finalized specs, I scheduled weekly 30-minute prototype demonstrations with cross-functional stakeholders. By shipping functional thin-slice MVPs every sprint, we validated assumptions early, reduced scope creep by 35%, and launched on schedule.",
        sampleTranscript:
          "When tasked with building an internal ML analytics portal with shifting specs, I scheduled weekly prototype reviews with stakeholders. Shipping thin-slice MVPs every sprint allowed us to validate assumptions early and deliver on schedule.",
      },
      {
        id: "beh-4",
        title: "Managing Low Performance & Difficult Teammates",
        company: "Meta • Amazon • Salesforce",
        difficulty: "Engineering Manager / Tech Lead",
        question:
          "Tell me about a time you worked with a disengaged, underperforming, or combative engineer on a critical project. How did you handle the situation and achieve the deliverable?",
        signals:
          "Empathetic discovery 1:1, clarifying objective metrics and ownership, setting milestone check-ins, balancing compassion with team accountability.",
        expectedKeywords: [
          "performance",
          "feedback",
          "1:1",
          "expectations",
          "milestone",
          "coaching",
          "accountability",
          "empathy",
          "outcome",
        ],
        modelAnswer:
          "On a payments migration project, a senior engineer began missing PR deadlines and pushing back aggressively during sprint planning. In our private 1:1, I listened first and learned they felt overwhelmed by undefined architectural constraints. I paired with them to break their epics into structured 2-day deliverables and provided dedicated pairing sessions. Within three weeks, their commit frequency stabilized and our team hit our release target without slipping.",
        sampleTranscript:
          "When an engineer fell behind on critical API deliverables, I scheduled a private 1:1 to understand root blockers. We discovered ambiguous requirements were causing friction. I broke the work into smaller milestone tasks and paired with them daily, restoring sprint velocity.",
      },
      {
        id: "beh-5",
        title: "Influencing Without Authority Across Teams",
        company: "Google • Airbnb • Stripe",
        difficulty: "Senior / Staff Engineer",
        question:
          "Describe a situation where you had to convince partner engineering teams to adopt a breaking architectural standard or migration when you had no direct managerial authority over them.",
        signals:
          "Empathy for partner friction, lightweight POCs, automated migration tooling (codemods), RFC consensus, executive stakeholder alignment.",
        expectedKeywords: [
          "influence",
          "cross-functional",
          "rfc",
          "poc",
          "consensus",
          "migration",
          "friction",
          "stakeholder",
          "adoption",
        ],
        modelAnswer:
          "I spearheaded deprecating legacy REST auth endpoints in favor of strict OAuth2 tokens across four product teams. Initially, teams resisted because of tight roadmaps. Rather than mandate compliance, I authored an RFC detailing security audit findings, published automated codemods that updated 80% of their client calls automatically, and hosted hands-on migration office hours. All four squads completed the migration within our target quarter.",
        sampleTranscript:
          "To migrate multiple squads to a new auth protocol without authority, I wrote an RFC and built automated codemod scripts to reduce their engineering effort. By removing migration toil and holding office hours, all teams adopted the new standard voluntarily.",
      },
      {
        id: "beh-6",
        title: "Hard Trade-offs Under Immovable Deadlines",
        company: "Netflix • Uber • ByteDance",
        difficulty: "All Engineering Levels",
        question:
          "Tell me about a time you had to cut critical scope or accept technical debt to meet an immovable product release deadline. How did you balance risk?",
        signals:
          "Data-driven risk assessment, explicit stakeholder buy-in, tracked tech debt backlog with scheduled remediation sprints, feature flags for rollouts.",
        expectedKeywords: [
          "deadline",
          "trade-off",
          "scope",
          "technical debt",
          "risk",
          "feature flag",
          "mvp",
          "post-launch",
          "stakeholder",
        ],
        modelAnswer:
          "Two weeks before our Black Friday release, load tests revealed our real-time inventory aggregation service couldn't sustain 4x peak traffic. Rebuilding the database pipeline would take four weeks. I proposed a pragmatic trade-off: replace synchronous cross-service queries with a Redis cached snapshot with a 30-second TTL, cutting server load by 80%. We secured executive alignment, launched successfully without downtime, and scheduled the permanent pipeline rebuild during the following sprint.",
        sampleTranscript:
          "Ahead of a major launch, performance testing indicated our real-time database queries would bottleneck. I proposed using a 30-second Redis cache trade-off to meet the deadline. We informed stakeholders of the consistency compromise, survived peak traffic, and refactored properly post-launch.",
      },
    ],
  },
  product: {
    id: "product",
    name: "Product Strategy & Funnel Triage",
    badge: "Product & Growth",
    color: "indigo",
    questions: [
      {
        id: "prod-1",
        title: "Onboarding Drop-off Investigation",
        company: "Uber • Meta • Spotify",
        difficulty: "Product Manager / Lead",
        question:
          "Our mobile app onboarding completion dropped by 18% over the past 7 days. Walk me through your diagnostic triage framework to identify the root cause.",
        signals:
          "Cohort segmentation (OS/build/geo), funnel step isolation, logging telemetry, A/B rollback triggers, 48-hr recovery SLA.",
        expectedKeywords: [
          "drop-off",
          "funnel",
          "segmentation",
          "cohort",
          "telemetry",
          "otp",
          "triage",
          "hypothesis",
          "rollback",
          "metric",
        ],
        modelAnswer:
          "First, I segment the funnel data by device model, app build, network carrier, and geography to isolate the blast radius. If telemetry reveals the drop is concentrated on SMS OTP delivery on Android builds, I work with engineering to verify gateway latencies. If a newly released build is responsible, I trigger a feature flag rollback under our 48-hour recovery SLA.",
        sampleTranscript:
          "First, I segment the drop-off by app version, operating system, and geographical region. Then I inspect the onboarding funnel step-by-step to see if the drop is concentrated on SMS OTP verification or permissions. Once identified, I coordinate with QA to test device compatibility.",
      },
      {
        id: "prod-2",
        title: "Prioritizing Tech Debt vs Features",
        company: "Google • Atlassian • Stripe",
        difficulty: "Group Product Manager",
        question:
          "How do you evaluate and prioritize between paying down critical technical debt versus shipping customer-facing features when bandwidth is constrained?",
        signals:
          "RICE framework, developer velocity vs revenue impact, SLO breach risks, dedicated capacity allocation (e.g. 20-25%).",
        expectedKeywords: [
          "technical debt",
          "rice",
          "velocity",
          "sla",
          "prioritization",
          "customer impact",
          "slo",
          "risk",
          "bandwidth",
        ],
        modelAnswer:
          "I quantify technical debt in terms of system reliability risk and developer velocity drag, evaluating it against customer feature revenue using the RICE framework. If technical debt risks breaching customer SLOs or slows sprint cycle time by over 20%, I reserve 25% of engineering capacity to refactor core infrastructure before taking on net-new features.",
        sampleTranscript:
          "I evaluate technical debt using risk and developer velocity metrics against customer feature ROI using the RICE framework. If technical debt causes SLO violations, I reserve 25% of sprint capacity to refactor before committing to new feature development.",
      },
      {
        id: "prod-3",
        title: "B2B SaaS Pricing Tier Migration",
        company: "Salesforce • Snowflake • Datadog",
        difficulty: "Senior / Principal PM",
        question:
          "We are migrating our developer platform from flat monthly subscription to usage-based consumption pricing. How do you design the transition to avoid churn and minimize billing anxiety?",
        signals:
          "Grandfathering periods, tier calculators, usage spend alerts with soft caps, pilot cohorts, customer advisory board.",
        expectedKeywords: [
          "usage-based",
          "pricing",
          "churn",
          "grandfather",
          "pilot",
          "tier",
          "billing",
          "threshold",
          "consumption",
        ],
        modelAnswer:
          "I mitigate churn by introducing a 90-day grandfathering buffer with dual-run invoices comparing both pricing models. We offer interactive consumption simulators in the dashboard, automated budget alerts at 80% thresholds with soft caps, and rollout first with a controlled pilot cohort of 20 high-usage customers to calibrate before broad release.",
        sampleTranscript:
          "To prevent churn when shifting to usage-based pricing, I provide a 90-day transition period with dual billing statements. We build budget alert thresholds with soft limits so customers never experience bill shock, and test with a pilot cohort first.",
      },
      {
        id: "prod-4",
        title: "Defining Marketplace North Star Metric",
        company: "Spotify • Airbnb • LinkedIn",
        difficulty: "Senior / Principal PM",
        question:
          "If you were Lead PM for a two-sided creator economy marketplace, how would you define the North Star Metric, and what counter-metrics would you monitor to prevent gaming?",
        signals:
          "Value-exchange metric (e.g. Weekly Active Earning Creators), counter-metrics (buyer churn, return rate, take-rate health), leading vs lagging indicators.",
        expectedKeywords: [
          "north star",
          "metric",
          "marketplace",
          "creator",
          "retention",
          "counter-metric",
          "gaming",
          "take-rate",
          "cohort",
        ],
        modelAnswer:
          "I define the North Star Metric as 'Weekly Active Earning Creators'—measuring creator accounts receiving at least \$50 in fan transactions weekly. This directly captures healthy value exchange on both sides of the marketplace. Crucially, I establish counter-metrics: Buyer Refund Rate, Dispute Velocity, and Platform Take-Rate to guarantee sellers don't artificially game volume through low-quality or fraudulent content.",
        sampleTranscript:
          "My North Star Metric is Weekly Active Earning Creators, as it reflects genuine value delivered to both creators and consumers. To prevent gaming, I monitor counter-metrics like chargeback rate, customer churn, and average review scores.",
      },
      {
        id: "prod-5",
        title: "Integrating AI Copilots into Legacy Tools",
        company: "Microsoft • Adobe • Notion",
        difficulty: "AI Product Manager",
        question:
          "How would you design and launch an AI assistive copilot within a 10-year-old enterprise productivity suite without alienating power users who rely on keyboard muscle memory?",
        signals:
          "Non-intrusive progressive disclosure, opt-in controls, low-latency streaming responses, latency SLA fallback, measuring prompt acceptance rate.",
        expectedKeywords: [
          "ai",
          "copilot",
          "power user",
          "progressive disclosure",
          "adoption",
          "opt-in",
          "latency",
          "acceptance rate",
          "workflow",
        ],
        modelAnswer:
          "I implement progressive disclosure: the AI copilot stays invisible until summoned via a distinct shortcut (e.g., Cmd+K or spacebar prompt) to preserve standard keyboard workflows. Responses stream tokens immediately with sub-800ms TTFT. Power users have granular settings to adjust autonomy or disable suggestions entirely. Success is measured by Suggestion Acceptance Rate and task completion speed rather than raw tool invocation count.",
        sampleTranscript:
          "I use progressive disclosure so the AI assistant never interrupts existing workflows. Power users summon it using dedicated hotkeys, suggestions stream with low latency, and users can toggle auto-complete off in settings.",
      },
      {
        id: "prod-6",
        title: "Responding to Low-Cost Cloned Competitors",
        company: "Slack • Zoom • Figma",
        difficulty: "Director / Group PM",
        question:
          "A major competitor just launched a cloned version of your flagship product for 80% cheaper. Walk me through your strategic assessment and 30-day response plan.",
        signals:
          "Moat analysis (switching costs, enterprise security, API integrations), resisting knee-jerk price slashes, customer retention outreach, doubledown on core IP.",
        expectedKeywords: [
          "competitor",
          "moat",
          "switching costs",
          "ecosystem",
          "pricing",
          "retention",
          "differentiation",
          "value proposition",
        ],
        modelAnswer:
          "In the first 30 days, I avoid reactionary price wars that erode brand equity. I audit our structural enterprise moats: proprietary data integrations, security certifications (SOC2/FedRAMP), and enterprise SLAs that low-cost clones cannot easily replicate. I arm our enterprise sales and CS teams with battle cards highlighting total cost of ownership and reliability metrics, while identifying any feature gaps to prioritize on our roadmap.",
        sampleTranscript:
          "Rather than immediately discounting prices, I audit our competitive moats like enterprise compliance, ecosystem integrations, and SLA guarantees. We equip account managers with battle cards emphasizing reliability and total cost of ownership.",
      },
    ],
  },
  frontend: {
    id: "frontend",
    name: "Frontend Architecture & Web Vitals",
    badge: "Web Performance",
    color: "cyan",
    questions: [
      {
        id: "fe-1",
        title: "Optimizing Core Web Vitals (LCP & CLS)",
        company: "Airbnb • Meta • Vercel",
        difficulty: "Staff Frontend Engineer",
        question:
          "How would you optimize a large web application experiencing poor Largest Contentful Paint (LCP) and high Total Blocking Time (TBT)?",
        signals:
          "Asset preloading via CDN, route/component code splitting, offloading work to Web Workers, breaking up long tasks, hydration strategies.",
        expectedKeywords: [
          "lcp",
          "tbt",
          "core web vitals",
          "code splitting",
          "lazy",
          "ssr",
          "bundle",
          "cdn",
          "memo",
          "hydration",
          "worker",
        ],
        modelAnswer:
          "I prioritize preloading critical hero media via CDN with fetchpriority='high', and implement route and component-level code splitting using dynamic imports. To resolve Total Blocking Time, I offload intensive data transformations to Web Workers and break up long tasks, driving LCP under 1.8 seconds and achieving green Core Web Vitals.",
        sampleTranscript:
          "I prioritize preloading critical hero assets via CDN, implementing route-based code splitting using dynamic imports. To minimize Total Blocking Time, I offload heavy data parsing to Web Workers, improving LCP under 1.8 seconds.",
      },
      {
        id: "fe-2",
        title: "Micro-Frontends vs Unified SPA",
        company: "Amazon • Spotify • Shopify",
        difficulty: "Principal UI Architect",
        question:
          "Under what organizational and technical conditions would you advocate for Micro-Frontends over a unified single-page application? What are the key trade-offs?",
        signals:
          "Independent deployment, team autonomy, Module Federation, bundle overhead, CSS isolation, shared state synchronization.",
        expectedKeywords: [
          "micro-frontend",
          "module federation",
          "independent deployment",
          "bundle size",
          "isolated",
          "trade-offs",
          "spa",
          "autonomy",
        ],
        modelAnswer:
          "Micro-frontends are justified when multiple autonomous product squads need independent release cycles without monolithic deployment bottlenecks. However, the architectural trade-offs include duplicated bundle dependencies, CSS encapsulation complexity, and shared cross-boundary state management via custom browser events or Webpack Module Federation.",
        sampleTranscript:
          "Micro-frontends become justifiable when distinct autonomous engineering teams need independent release cadences without blocking monolithic deployments. Trade-offs include duplicated bundle dependencies and complex shared state management.",
      },
      {
        id: "fe-3",
        title: "Offline-First Sync & Conflict Resolution",
        company: "Figma • Linear • Notion",
        difficulty: "Staff Frontend Architect",
        question:
          "How would you design an offline-first web application where users can edit complex hierarchical documents without internet, resolving merge conflicts automatically when reconnected?",
        signals:
          "CRDTs (Yjs/Automerge), IndexedDB local storage, service worker caching, optimistic UI updates, last-write-wins vs semantic merging.",
        expectedKeywords: [
          "offline-first",
          "crdt",
          "indexeddb",
          "service worker",
          "conflict resolution",
          "optimistic",
          "sync",
          "yjs",
          "merge",
        ],
        modelAnswer:
          "I architect an offline-first state model using CRDTs (Conflict-free Replicated Data Types) like Yjs persisted locally in IndexedDB. Local user operations apply optimistically with zero UI latency. When network connectivity restores, a background sync service worker exchanges compressed delta updates with the server, resolving concurrent edits deterministically without destructive overwrites.",
        sampleTranscript:
          "I build the offline persistence layer with IndexedDB and CRDTs like Yjs. Mutations apply optimistically in the UI. When the network reconnects, the service worker pushes delta state changes to the backend, enabling conflict-free automatic merges.",
      },
      {
        id: "fe-4",
        title: "High-Frequency 60FPS Canvas Rendering",
        company: "Figma • Canva • Miro",
        difficulty: "Staff Graphics / Frontend Engineer",
        question:
          "How would you design a browser-based design canvas rendering 50,000 interactive vector nodes at 60 FPS without UI jank or memory leaks?",
        signals:
          "OffscreenCanvas in Web Workers, spatial partitioning (QuadTree/BVH), dirty-rect rendering, requestAnimationFrame batching.",
        expectedKeywords: [
          "canvas",
          "webgl",
          "quadtree",
          "spatial indexing",
          "web worker",
          "requestanimationframe",
          "60 fps",
          "dirty rect",
          "jank",
        ],
        modelAnswer:
          "I decouple the rendering pipeline from the DOM using an OffscreenCanvas transferred to a dedicated Web Worker to prevent main thread blocking. I index all 50,000 nodes using a QuadTree spatial partition so only nodes intersecting the current viewport bounding box are queried. During zoom or pan, we redraw only dirty rects inside a requestAnimationFrame loop, caching static layers onto offscreen bitmap buffers.",
        sampleTranscript:
          "I transfer the canvas to a Web Worker via OffscreenCanvas to keep the main thread fluid. A QuadTree indexes all shapes spatially so we only paint elements visible in the viewport, achieving smooth 60 FPS performance.",
      },
      {
        id: "fe-5",
        title: "Multi-Brand Design System Architecture",
        company: "GitHub • Uber • Atlassian",
        difficulty: "Staff UI Architect",
        question:
          "How do you architect a multi-brand Design System supporting light/dark themes and accessibility (WCAG AAA) across 150+ front-end repositories without breaking downstream apps?",
        signals:
          "CSS Custom Properties tokens, Style Dictionary, automated visual regression (Playwright/Chromatic), automated codemods for deprecation, semver versioning.",
        expectedKeywords: [
          "design system",
          "tokens",
          "css variables",
          "wcag",
          "codemod",
          "semver",
          "visual regression",
          "accessibility",
          "theming",
        ],
        modelAnswer:
          "I decouple design tokens into global primitives (colors, spacing) and semantic alias tokens (e.g. surface-primary) managed in Style Dictionary, exporting to CSS Custom Properties. Components enforce strict WCAG AAA contrast ratios programmatically. To prevent breaking downstream apps during updates, we publish automated AST codemods alongside major semver releases and run automated visual regression testing in CI.",
        sampleTranscript:
          "We structure design tokens using CSS Custom Properties exported via Style Dictionary. Semantic tokens handle dark and light theme switching. When updating component APIs, we distribute automated codemods to refactor consumer apps safely.",
      },
      {
        id: "fe-6",
        title: "Server-Driven UI (SDUI) Framework",
        company: "Airbnb • Lyft • DoorDash",
        difficulty: "Principal UI Architect",
        question:
          "How would you architect a Server-Driven UI (SDUI) framework enabling product managers to overhaul mobile and web layout schemas dynamically without requiring client redeployments?",
        signals:
          "JSON component schema contracts, schema validation with Zod/Protobuf, client component registry, version fallback for legacy clients, action dispatchers.",
        expectedKeywords: [
          "sdui",
          "server-driven ui",
          "schema",
          "json",
          "component registry",
          "versioning",
          "backward compatibility",
          "analytics",
          "action",
        ],
        modelAnswer:
          "I establish a strict JSON component schema validated via Protobuf or Zod. The frontend maintains a component registry that dynamically maps backend type identifiers to React components with declarative props and action dispatchers. For backwards compatibility, the client ignores unrecognized schema types or falls back to server-provided webview directives, ensuring older client builds never crash.",
        sampleTranscript:
          "In Server-Driven UI, the backend delivers a typed JSON tree specifying component types, layout ordering, and actions. The client maps these types to local components in a registry, with graceful fallback handling for unknown components in older app builds.",
      },
    ],
  },
  devops_cloud: {
    id: "devops_cloud",
    name: "Cloud, DevOps & SRE Reliability",
    badge: "Cloud & SRE",
    color: "purple",
    questions: [
      {
        id: "sre-1",
        title: "Zero-Downtime Canary Deployments in K8s",
        company: "Netflix • AWS • Datadog",
        difficulty: "Senior DevOps / SRE",
        question:
          "How would you architect a zero-downtime canary deployment pipeline in Kubernetes, and what specific metrics would you monitor to trigger an automated rollback?",
        signals:
          "Argo Rollouts, Istio traffic splitting, Prometheus p99 latency & 5xx error budget burn, automated progressive promotion.",
        expectedKeywords: [
          "canary",
          "kubernetes",
          "argo",
          "service mesh",
          "istio",
          "rollback",
          "prometheus",
          "p99",
          "traffic split",
          "telemetry",
        ],
        modelAnswer:
          "I implement progressive canary rollouts using Argo Rollouts with Istio traffic routing. The canary initially receives 5% of production traffic while Prometheus continuously monitors HTTP 5xx error ratios and p99 response latencies. If the error budget is breached or error rates exceed 0.5% over a 3-minute evaluation window, an automated rollback triggers immediately, reverting traffic to the stable replica set.",
        sampleTranscript:
          "I use Argo Rollouts with an Istio service mesh to route 5 percent of production traffic to the new release. Prometheus scrapes error rates and latency. If error rates exceed threshold or latencies spike, the deployment automatically aborts and rolls back to stable.",
      },
      {
        id: "sre-2",
        title: "Multi-Region Disaster Recovery & RPO/RTO",
        company: "Stripe • Apple • Microsoft",
        difficulty: "Principal Infrastructure Architect",
        question:
          "How do you design a disaster recovery strategy across multi-region cloud environments to meet an RTO under 15 minutes and RPO under 1 minute?",
        signals:
          "Active-active vs warm standby, cross-region asynchronous database replication, Route53 health checks, automated DNS failover, Terraform drift detection.",
        expectedKeywords: [
          "disaster recovery",
          "rto",
          "rpo",
          "active-active",
          "failover",
          "dns",
          "replication",
          "terraform",
          "multi-region",
          "backup",
        ],
        modelAnswer:
          "To achieve an RPO under 1 minute, I use cross-region asynchronous database replication paired with change data capture. For an RTO under 15 minutes, we deploy warm standby services in a secondary region with pre-warmed compute clusters. Global traffic managers and Route53 health checks detect regional failure within 30 seconds and reroute ingress traffic automatically.",
        sampleTranscript:
          "To achieve an RPO under 1 minute, I use cross-region streaming replication for data stores. For an RTO under 15 minutes, we maintain warm standby services in the secondary region. Route 53 health-checks detect outages and trigger automated DNS failover.",
      },
      {
        id: "sre-3",
        title: "Observability Stack & Alert Fatigue Mitigation",
        company: "Datadog • Spotify • Meta",
        difficulty: "Senior Site Reliability Engineer",
        question:
          "How do you build an end-to-end observability pipeline using metrics, logs, and distributed tracing while preventing alert fatigue for on-call teams?",
        signals:
          "OpenTelemetry, SLO/SLI-based alerting, log sampling & aggregation, burn-rate alerts vs symptomatic thresholds, blameless on-call handoffs.",
        expectedKeywords: [
          "observability",
          "opentelemetry",
          "tracing",
          "slo",
          "sli",
          "alert fatigue",
          "burn rate",
          "metrics",
          "logs",
          "pagerduty",
        ],
        modelAnswer:
          "I standardize telemetry collection using OpenTelemetry for distributed tracing, metrics, and structured logs. To eliminate alert fatigue, I ban alerts on host-level symptoms like transient CPU spikes, tying alerts exclusively to SLO/SLI error-budget burn rates via PagerDuty. Non-urgent anomalies are routed to asynchronous Slack digests rather than waking up engineers.",
        sampleTranscript:
          "I use OpenTelemetry for unified tracing and metrics across services. To combat alert fatigue, we only page on-call engineers for SLO burn-rate breaches affecting user journeys, while transient anomalies route to daily dashboard reports.",
      },
      {
        id: "sre-4",
        title: "Rapid Autoscaling for Flash Spikes (KEDA)",
        company: "Ticketmaster • DoorDash • Epic Games",
        difficulty: "Senior Cloud / Kubernetes Architect",
        question:
          "Your flash-sale platform experiences traffic spikes jumping from 2,000 to 200,000 RPS in under 90 seconds. How do you configure Kubernetes scaling to prevent 503 outages before cold pods boot?",
        signals:
          "Event-driven autoscaling with KEDA (Kafka queue depth lag), cluster over-provisioning/pre-warming, container image caching, priority classes.",
        expectedKeywords: [
          "keda",
          "hpa",
          "autoscaling",
          "cold start",
          "pre-warming",
          "traffic spike",
          "pod",
          "load shedding",
          "over-provisioning",
        ],
        modelAnswer:
          "Standard HPA based on CPU/RAM is too sluggish for 90-second surges. I implement KEDA to autoscale based on real-time ingress request rates and Kafka consumer queue lag. To absorb the initial surge while JVM/Node pods initialize, we maintain a 30% cluster over-provisioning buffer using low-priority pause pods that get instantly evicted when traffic surges, combined with pre-pulled container images across nodes.",
        sampleTranscript:
          "Standard CPU autoscaling is too slow for 90-second traffic spikes. I implement KEDA scaling on queue backlog and request rate metrics, combined with pre-warmed over-provisioned pause pods that free up instant capacity before cold starts complete.",
      },
      {
        id: "sre-5",
        title: "Production Chaos Engineering Program",
        company: "Netflix • Gremlin • Stripe",
        difficulty: "Staff Site Reliability Engineer",
        question:
          "How do you implement a Chaos Engineering program in production to validate that your distributed microservices survive upstream cloud zone dropouts?",
        signals:
          "Chaos Mesh / Chaos Monkey, hypothesis testing, steady-state definition, blast-radius containment, automated kill switches when SLOs degrade.",
        expectedKeywords: [
          "chaos engineering",
          "blast radius",
          "steady-state",
          "fault injection",
          "slo",
          "zone failure",
          "kill switch",
          "resilience",
        ],
        modelAnswer:
          "I establish chaos experiments using a structured framework: first, define steady-state metrics (e.g. 99.9% successful checkout rate). We formulate a hypothesis, start fault injection at 1% traffic during business hours using Chaos Mesh to simulate network packet loss or zone isolation, and observe if circuit breakers and fallbacks operate as expected. If error budgets or latency thresholds breach 1%, automated kill-switches terminate the experiment immediately.",
        sampleTranscript:
          "We define steady-state SLOs, then introduce controlled failure injections such as simulating zone latency or pod termination at low traffic percentages. If customer-facing metrics degrade beyond safety limits, automated kill switches abort the experiment.",
      },
      {
        id: "sre-6",
        title: "Terraform at Scale & State Drift Prevention",
        company: "HashiCorp • Coinbase • Snowflake",
        difficulty: "Senior DevOps / Cloud Engineer",
        question:
          "How do you structure Terraform at scale for 40+ engineering teams to prevent state-file corruption, concurrent execution deadlocks, and silent infrastructure drift?",
        signals:
          "Remote S3 backend with DynamoDB state locking, Terragrunt modularization, Atlantis/Terraform Cloud PR automation, scheduled drift detection crons.",
        expectedKeywords: [
          "terraform",
          "state lock",
          "dynamodb",
          "drift",
          "iac",
          "atlantis",
          "modules",
          "least privilege",
          "ci/cd",
        ],
        modelAnswer:
          "I isolate infrastructure into micro-state layers by environment and team boundary using Terragrunt, backed by Amazon S3 with DynamoDB distributed state locking to eliminate concurrent execution corruption. All terraform changes run exclusively through automated CI/CD tooling like Atlantis with mandatory peer review. Scheduled nightly plan runs detect and alert on manual console drift.",
        sampleTranscript:
          "We break infrastructure into small, modular state files using Terragrunt backed by S3 and DynamoDB locking. Changes only execute via PR automation with peer approval, while nightly automated drift detection alerts on out-of-band console modifications.",
      },
    ],
  },
  security: {
    id: "security",
    name: "Application Security & Cyber Defense",
    badge: "Security & Auth",
    color: "red",
    questions: [
      {
        id: "sec-1",
        title: "OAuth 2.0 / OIDC & Token Revocation",
        company: "Okta • Google • Microsoft",
        difficulty: "Staff Security Architect",
        question:
          "Explain the security trade-offs between short-lived stateless JWTs versus stateful session tokens. How do you revoke a compromised JWT immediately across distributed services?",
        signals:
          "Short expiry (<15 min), refresh token rotation in Redis, bloom filter blacklist, JTI tracking, cryptographic signature validation.",
        expectedKeywords: [
          "jwt",
          "revocation",
          "refresh token",
          "blacklist",
          "redis",
          "bloom filter",
          "signature",
          "oauth",
          "expiry",
          "stateless",
        ],
        modelAnswer:
          "Stateless JWTs eliminate database lookups but cannot be revoked without state. I use short-lived access tokens with a 10-minute expiry paired with refresh token rotation. For immediate revocation upon compromise or password reset, we publish the token's unique JTI identifier to a distributed Redis sliding-window blacklist or Redis Bloom Filter checked at the API gateway layer.",
        sampleTranscript:
          "JWTs are fast because they don't require database queries, but revocation is challenging. I use 10-minute short-lived JWTs and rotate refresh tokens. When an account is compromised, we add the token's unique ID to a fast Redis blacklist at the gateway.",
      },
      {
        id: "sec-2",
        title: "Mitigating Server-Side Request Forgery (SSRF)",
        company: "Cloudflare • Stripe • Palo Alto",
        difficulty: "Senior AppSec Engineer",
        question:
          "How do you protect a modern cloud microservice from Server-Side Request Forgery (SSRF) when allowing user-submitted webhook URLs or image fetching?",
        signals:
          "DNS rebinding defense, internal IP CIDR blacklisting (RFC 1918, 169.254.169.254 metadata service), isolated proxy egress, URL parser validation.",
        expectedKeywords: [
          "ssrf",
          "dns rebinding",
          "metadata",
          "egress",
          "proxy",
          "internal ip",
          "cidr",
          "whitelist",
          "webhook",
          "isolated",
        ],
        modelAnswer:
          "I route all outbound webhook and image fetching requests through an isolated egress proxy. The proxy resolves DNS and explicitly blocks private CIDR blocks, localhost, and cloud metadata endpoints such as 169.254.169.254. To prevent DNS rebinding attacks, the proxy connects directly to the resolved IP after validating it against the blocklist, rather than re-resolving the hostname.",
        sampleTranscript:
          "To prevent SSRF, all user-provided URLs are routed through an isolated egress proxy. The proxy validates the resolved IP against private RFC 1918 ranges and cloud metadata IP 169.254.169.254, while pinning the IP to avoid DNS rebinding attacks.",
      },
      {
        id: "sec-3",
        title: "Zero-Trust Microsegmentation & mTLS",
        company: "HashiCorp • Apple • CrowdStrike",
        difficulty: "Principal Security Engineer",
        question:
          "How do you transition a legacy perimeter-based corporate network into a Zero-Trust architecture with mutual TLS (mTLS) and SPIFFE/SPIRE identity?",
        signals:
          "SPIFFE/SPIRE workload identities, dynamic X.509 cert rotation, service-to-service RBAC, perimeter vs identity boundary.",
        expectedKeywords: [
          "zero-trust",
          "mtls",
          "spiffe",
          "spire",
          "identity",
          "certificate",
          "perimeter",
          "encryption",
          "rbac",
          "workload",
        ],
        modelAnswer:
          "I eliminate the perimeter model by treating internal networks as untrusted, issuing cryptographic workload identities using SPIFFE/SPIRE. Microservices communicate exclusively over mutual TLS with ephemeral X.509 certificates automatically rotated every 12 hours. Granular L7 authorization policies enforce least-privilege service-to-service RBAC at the service mesh proxy.",
        sampleTranscript:
          "Under Zero-Trust, we abandon network perimeter assumptions. Each microservice receives a cryptographically signed SPIFFE identity. All inter-service traffic is encrypted via mTLS with short-lived certificates, and service mesh policies enforce strict least-privilege access.",
      },
      {
        id: "sec-4",
        title: "Defense-in-Depth Against Stored and DOM XSS",
        company: "Meta • GitHub • Google",
        difficulty: "Senior Application Security Engineer",
        question:
          "How do you build a defense-in-depth architecture against Stored and DOM-based XSS attacks in rich single-page applications, and how do you rollout a strict nonce-based CSP without breaking features?",
        signals:
          "Context-aware output encoding (DOMPurify), Trusted Types API, strict nonce-based CSP (script-src 'nonce-...'), report-only rollout.",
        expectedKeywords: [
          "xss",
          "csp",
          "nonce",
          "dompurify",
          "trusted types",
          "sanitization",
          "content security policy",
          "injection",
          "report-only",
        ],
        modelAnswer:
          "I implement defense-in-depth using three layers: first, automatic context-aware output encoding and DOMPurify for any sanitized HTML insertion; second, enabling the browser Trusted Types API to enforce safe sinks at compile time; third, deploying a strict Content Security Policy (CSP) with cryptographic per-request nonces for scripts. We run the CSP in 'Content-Security-Policy-Report-Only' mode for two weeks to capture violations before enforcing.",
        sampleTranscript:
          "We prevent XSS by sanitizing inputs with DOMPurify, adopting the Trusted Types API, and enforcing a strict nonce-based Content Security Policy. We test CSP in report-only mode first to monitor telemetry before turning on hard enforcement.",
      },
      {
        id: "sec-5",
        title: "Automated Secrets & Dynamic Credentials",
        company: "HashiCorp • Palantir • AWS",
        difficulty: "Staff Cloud Security Engineer",
        question:
          "How do you eliminate hardcoded long-lived cloud credentials across developer machines and production containers using HashiCorp Vault or AWS Secrets Manager?",
        signals:
          "Dynamic ephemeral database credentials (TTL <1 hr), Kubernetes Vault agent sidecars with automatic token renewal, IAM role workload federation.",
        expectedKeywords: [
          "vault",
          "secrets manager",
          "ephemeral",
          "ttl",
          "dynamic credentials",
          "iam roles",
          "rotation",
          "least privilege",
        ],
        modelAnswer:
          "I replace static API keys and database credentials with HashiCorp Vault dynamic secrets. Application containers authenticate to Vault using Kubernetes service account tokens via a sidecar agent. Vault dynamically provisions unique, ephemeral database credentials with a 1-hour TTL and automatically rotates them. Developers access dev infrastructure through short-lived OIDC-backed IAM role federation instead of persistent keys.",
        sampleTranscript:
          "We use HashiCorp Vault to issue short-lived ephemeral credentials on-demand with 1-hour TTLs. Pods authenticate using Kubernetes service account tokens, eliminating hardcoded passwords and long-lived cloud keys.",
      },
      {
        id: "sec-6",
        title: "Software Supply Chain Security & SBOM",
        company: "Docker • Red Hat • Snyk",
        difficulty: "Senior DevSecOps Engineer",
        question:
          "How do you protect your CI/CD software delivery pipeline against malicious dependency tampering (similar to the SolarWinds and XZ backdoor attacks)?",
        signals:
          "Cryptographic artifact signing with Sigstore / Cosign, SLSA Level 3 compliance, automated SBOM generation (CycloneDX / SPDX), pinned hash lockfiles.",
        expectedKeywords: [
          "supply chain",
          "sbom",
          "sigstore",
          "cosign",
          "slsa",
          "dependency",
          "signing",
          "tampering",
          "vulnerability",
        ],
        modelAnswer:
          "I secure the supply chain across three pillars: build hermeticity, dependency provenance, and artifact signing. All package lockfiles are cryptographically pinned with sha256 checksums. CI pipelines generate Software Bill of Materials (SBOMs) using CycloneDX and scan for CVEs. Finally, containers and release binaries are signed cryptographically using Sigstore Cosign, with admission controllers in Kubernetes blocking any unsigned image from deploying.",
        sampleTranscript:
          "We protect our pipeline by generating automated SBOMs for every build and signing release artifacts using Sigstore Cosign. Kubernetes admission controllers reject any image that lacks a valid cryptographic signature.",
      },
    ],
  },
  ai_ml_eng: {
    id: "ai_ml_eng",
    name: "Machine Learning & GenAI Systems",
    badge: "AI & ML Systems",
    color: "violet",
    questions: [
      {
        id: "ml-1",
        title: "Enterprise RAG Pipeline Architecture",
        company: "OpenAI • Anthropic • Cohere",
        difficulty: "Senior AI / GenAI Engineer",
        question:
          "How would you architect a production-grade Retrieval-Augmented Generation (RAG) system handling 1,000 queries per second with low latency and minimal hallucination?",
        signals:
          "Chunking strategies, hybrid search (dense embeddings + BM25 keyword), reranking with Cross-Encoder, contextual compression, guardrails/hallucination verification.",
        expectedKeywords: [
          "rag",
          "embeddings",
          "vector database",
          "hybrid search",
          "bm25",
          "reranker",
          "chunking",
          "hallucination",
          "guardrails",
          "cache",
        ],
        modelAnswer:
          "I design the RAG pipeline with semantic document chunking and store embeddings in a distributed vector index like Milvus or Pinecone. At query time, we perform hybrid search combining dense vector similarity with sparse BM25 keyword matching, followed by a cross-encoder reranker to pick the top 5 most relevant passages. Semantic caching in Redis serves recurring queries with sub-50ms latency while LLM guardrails verify citations.",
        sampleTranscript:
          "I implement a hybrid search approach combining vector embeddings with BM25 keyword search. A cross-encoder reranks the retrieved chunks, ensuring only the highest quality context is provided to the LLM. We also utilize semantic caching in Redis to reduce redundant inference calls.",
      },
      {
        id: "ml-2",
        title: "High-Throughput LLM Serving & KV Cache Optimization",
        company: "Nvidia • Meta • Mistral",
        difficulty: "Staff ML Systems Architect",
        question:
          "What techniques and memory optimizations would you employ to maximize token throughput and minimize time-to-first-token (TTFT) when serving large language models?",
        signals:
          "PagedAttention (vLLM), continuous batching, KV cache management, model quantization (FP8/INT4/AWQ), speculative decoding, tensor parallelism.",
        expectedKeywords: [
          "kv cache",
          "pagedattention",
          "vllm",
          "continuous batching",
          "quantization",
          "tensor parallelism",
          "throughput",
          "latency",
          "gpu",
        ],
        modelAnswer:
          "I deploy models with vLLM using PagedAttention to eliminate memory fragmentation in the KV cache, enabling continuous dynamic request batching. To minimize time-to-first-token and expand throughput, we utilize FP8 quantization and speculative decoding where a compact draft model predicts tokens verified in parallel by the primary model across tensor-parallel GPUs.",
        sampleTranscript:
          "I utilize vLLM with PagedAttention to manage KV cache memory without fragmentation. Continuous dynamic batching keeps GPU compute saturated, while 8-bit quantization and speculative decoding reduce latency and maximize overall token throughput.",
      },
      {
        id: "ml-3",
        title: "Prompt Injection & Safety Guardrails",
        company: "Google DeepMind • Anthropic • Microsoft",
        difficulty: "Senior AI Safety & Alignment Engineer",
        question:
          "How do you protect enterprise LLM applications against direct and indirect prompt injection attacks when consuming untrusted third-party documents and web content?",
        signals:
          "Dual-LLM architecture (privileged vs untrusted parser), delimiter defense, semantic canary tokens, NeMo Guardrails / Llama Guard, output validation.",
        expectedKeywords: [
          "prompt injection",
          "guardrails",
          "canary",
          "delimiter",
          "safety",
          "untrusted",
          "jailbreak",
          "sanitization",
          "output validation",
        ],
        modelAnswer:
          "I establish a dual-LLM architecture separating the privileged orchestrator from an unprivileged ingestion LLM that processes untrusted text. Ingestion prompts use strict XML delimiter encapsulation and semantic canary tokens to detect instruction leakage. Pre-flight classification with Llama Guard and deterministic output schemas prevent malicious instructions from hijacking agent tool-execution.",
        sampleTranscript:
          "To prevent prompt injection, I isolate untrusted document processing in a sandboxed, unprivileged LLM tier. We wrap inputs in strict XML delimiters, inject canary tokens to detect leakage, and run output through guardrail filters before taking any actions.",
      },
      {
        id: "ml-4",
        title: "Decision Framework: Prompting vs RAG vs Fine-Tuning",
        company: "OpenAI • Meta • Scale AI",
        difficulty: "Staff AI / ML Systems Engineer",
        question:
          "Walk me through your decision framework for choosing between In-Context Prompt Engineering, Retrieval-Augmented Generation (RAG), and Parameter-Efficient Fine-Tuning (LoRA / QLoRA) for enterprise domains.",
        signals:
          "Knowledge retrieval vs stylistic tone adaptation, training cost and latency trade-offs, catastrophic forgetting, continual data freshness.",
        expectedKeywords: [
          "rag",
          "fine-tuning",
          "lora",
          "qlora",
          "in-context",
          "embeddings",
          "hallucination",
          "domain adaptation",
          "latency",
        ],
        modelAnswer:
          "I evaluate across two axes: required knowledge dynamism and task specialization. If requirements involve rapidly changing facts or verifiable citations, RAG is required because models cannot store live data reliably in weights. If the goal is teaching the model a specialized output schema, dialect, or domain terminology where prompting costs too many context tokens, I apply LoRA or QLoRA fine-tuning. For complex enterprise apps, we combine both: a fine-tuned model served over a RAG knowledge base.",
        sampleTranscript:
          "I choose RAG when the problem requires up-to-date facts, dynamic access controls, and transparent source citations. I use LoRA fine-tuning when the model must master a specific tone or JSON schema without burning context tokens on few-shot examples.",
      },
      {
        id: "ml-5",
        title: "Vector Search Indexing: HNSW vs IVF-PQ",
        company: "Pinecone • Weaviate • Qdrant",
        difficulty: "Senior Vector Search / ML Engineer",
        question:
          "Compare Hierarchical Navigable Small World (HNSW) and Inverted File with Product Quantization (IVF-PQ) for billion-scale vector retrieval. How do they balance recall, query latency, and RAM?",
        signals:
          "Graph-based proximity search vs clustered inverted indexing with vector compression, memory consumption trade-offs, recall percentage at scale.",
        expectedKeywords: [
          "hnsw",
          "ivf-pq",
          "vector search",
          "recall",
          "quantization",
          "ram",
          "latency",
          "embeddings",
          "graph",
        ],
        modelAnswer:
          "HNSW constructs multi-layer proximity graphs providing extremely high recall (98%+) and sub-millisecond query latency, but consumes significant RAM because raw uncompressed vectors and graph pointers must reside in memory. IVF-PQ clusters vectors into Voronoi cells and compresses high-dimensional vectors into compact byte codes via Product Quantization, reducing RAM usage by 90% at the expense of a 5-10% drop in recall. For billion-scale vector indexes with budget constraints, IVF-PQ or disk-backed HNSW (like DiskANN) is optimal.",
        sampleTranscript:
          "HNSW delivers maximum recall and fastest search speeds using hierarchical graph traversal, but has high RAM overhead. IVF-PQ compresses vector data through product quantization, cutting memory costs by nearly 90 percent for massive datasets.",
      },
      {
        id: "ml-6",
        title: "Autonomous Agent Loops & Tool Execution Reliability",
        company: "Anthropic • Google • LangChain",
        difficulty: "Senior GenAI Solutions Architect",
        question:
          "How do you architect an autonomous multi-step LLM agent with tool-calling capabilities while preventing infinite execution loops, API hallucination, and cascading failures?",
        signals:
          "ReAct framework (Reason + Act), deterministic schema enforcement (Pydantic / JSON schema), max step limits, timeout backoff, state machines with human-in-the-loop triggers.",
        expectedKeywords: [
          "agent",
          "tool calling",
          "react",
          "loop",
          "hallucination",
          "json schema",
          "timeout",
          "human-in-the-loop",
          "state machine",
        ],
        modelAnswer:
          "I implement a structured state machine with strict step limits (e.g. max 8 hops) following the ReAct (Reason + Act) pattern. Tool invocations require Pydantic/JSON schema validation to reject malformed parameters before reaching backend APIs. If a tool returns an error or consecutive attempts repeat identical actions, the agent breaks the loop, triggers exponential backoff, or escalates to a human-in-the-loop fallback with a complete trajectory log.",
        sampleTranscript:
          "I build agents using finite state machines with explicit step caps to prevent infinite loops. Tool definitions enforce strict JSON schemas so invalid parameters are rejected before executing. If an agent gets stuck, a circuit breaker halts execution and prompts the user.",
      },
    ],
  },
  api_backend: {
    id: "api_backend",
    name: "Backend Architecture & API Protocols",
    badge: "Backend & APIs",
    color: "blue",
    questions: [
      {
        id: "api-1",
        title: "REST vs GraphQL vs gRPC Protocols",
        company: "Uber • Netflix • GitHub",
        difficulty: "Senior Backend Engineer",
        question:
          "How do you evaluate and choose between REST, GraphQL, and gRPC across an enterprise architecture of public mobile apps and internal microservices?",
        signals:
          "Protobuf binary serialization, HTTP/2 multiplexing, over/under-fetching, schema enforcement, CDN cacheability, bidirectional streaming.",
        expectedKeywords: [
          "grpc",
          "graphql",
          "rest",
          "protobuf",
          "http/2",
          "serialization",
          "caching",
          "over-fetching",
          "microservices",
        ],
        modelAnswer:
          "I recommend gRPC over HTTP/2 with Protocol Buffers for internal microservice communications due to ultra-low binary serialization overhead and native bidirectional streaming. For client-facing mobile applications with complex polymorphic data requirements, I deploy a GraphQL BFF (Backend for Frontend) layer to eliminate over-fetching, while utilizing REST with standard HTTP caching for public third-party APIs.",
        sampleTranscript:
          "For internal microservices, I choose gRPC because HTTP/2 multiplexing and Protobuf binary serialization provide superior throughput and low latency. For mobile clients, GraphQL prevents over-fetching and under-fetching, while REST remains best for public APIs requiring CDN caching.",
      },
      {
        id: "api-2",
        title: "Real-Time Collaboration: WebSockets vs SSE",
        company: "Figma • Slack • Notion",
        difficulty: "Staff Backend Engineer",
        question:
          "You are architecting a real-time collaborative document platform. How do you evaluate WebSockets versus Server-Sent Events (SSE) and HTTP long-polling?",
        signals:
          "Full-duplex vs unidirectional, reconnection resilience, operational complexity with proxies/load balancers, connection statefulness, Operational Transformation (OT) / CRDTs.",
        expectedKeywords: [
          "websockets",
          "sse",
          "server-sent events",
          "full-duplex",
          "reconnection",
          "load balancer",
          "crdt",
          "real-time",
          "latency",
        ],
        modelAnswer:
          "Because collaborative document editing requires full-duplex, low-latency bidirectional communication for real-time cursor tracking and operational transformation or CRDT sync, WebSockets are the clear choice over unidirectional SSE. We manage stateful WebSocket connections using a distributed Redis pub/sub backplane with heartbeat ping/pong mechanisms to cleanly handle automatic reconnections through load balancers.",
        sampleTranscript:
          "For a collaborative document platform, WebSockets are ideal because they provide low-latency, full-duplex communication necessary for transmitting cursor positions and operational transformation events. SSE is unidirectional and would require separate HTTP POST requests for client updates.",
      },
      {
        id: "api-3",
        title: "Kafka vs RabbitMQ & Message Delivery Semantics",
        company: "LinkedIn • Confluent • PayPal",
        difficulty: "Senior Systems Engineer",
        question:
          "Compare Kafka and RabbitMQ regarding message ordering, delivery guarantees, replayability, and consumer group scaling. When would you choose one over the other?",
        signals:
          "Partition log vs AMQP message queue, at-least-once vs exactly-once semantics, consumer offsets, smart broker vs dumb broker, backpressure.",
        expectedKeywords: [
          "kafka",
          "rabbitmq",
          "partition",
          "offset",
          "replay",
          "at-least-once",
          "consumer group",
          "amqp",
          "throughput",
          "ordering",
        ],
        modelAnswer:
          "Kafka is a partitioned commit log optimized for high-throughput streaming telemetry, event-sourcing, and historical replayability via consumer offset management. RabbitMQ is a traditional message broker excelling at complex routing topologies, priority queues, and transient task queues. I choose Kafka for audit logs and event streaming, and RabbitMQ for granular RPC job queues and transactional task processing.",
        sampleTranscript:
          "Kafka works as a persistent partitioned log where consumers track their own offsets, making it great for high-throughput event streaming and replay. RabbitMQ excels at complex routing rules and individual message acknowledgments for task queues.",
      },
      {
        id: "api-4",
        title: "API Versioning & Zero-Downtime Deprecation",
        company: "Stripe • Twilio • Shopify",
        difficulty: "Principal API Architect",
        question:
          "How does Stripe architect its backwards-compatible API versioning layer so that integrations written 10 years ago continue working without breaking changes for newer users?",
        signals:
          "Immutable request snapshots, backward/forward transformation gates, header-based version negotiation, deprecation headers (Sunset RFC 8594), telemetry tracking of legacy callers.",
        expectedKeywords: [
          "versioning",
          "backward compatibility",
          "stripe",
          "transformation",
          "deprecation",
          "sunset",
          "headers",
          "immutable",
        ],
        modelAnswer:
          "Stripe implements versioning through event transformation gates. The core database and internal models always run on the latest current schema. When a request from an older API version arrives, request transformers upgrade the request payload step-by-step through chronological versions to the current schema. On response, response transformers downgrade the data back to the schema format expected by the caller's version header. We announce deprecations using RFC 8594 Sunset headers and alert callers with webhook telemetry.",
        sampleTranscript:
          "Stripe maintains backwards compatibility using transformation gates. Core services run the latest schema, and middleware transforms incoming requests forward and outgoing responses backward to match the caller's pinned API version.",
      },
      {
        id: "api-5",
        title: "Outbound Webhook Reliability & Retry Storms",
        company: "Stripe • GitHub • PagerDuty",
        difficulty: "Staff Backend Platform Engineer",
        question:
          "How do you design an outbound webhook delivery system that guarantees at-least-once delivery to 100,000 third-party developer endpoints while surviving customer endpoint downtime and retry storms?",
        signals:
          "HMAC-SHA256 signature headers with timestamp anti-replay, exponential backoff with randomized jitter, dead-letter queues (DLQ), customer disablement thresholds.",
        expectedKeywords: [
          "webhook",
          "hmac",
          "signature",
          "retry",
          "exponential backoff",
          "jitter",
          "dead-letter queue",
          "at-least-once",
          "idempotency",
        ],
        modelAnswer:
          "I construct the delivery pipeline with dedicated worker pools consuming from partitioned priority queues. Each webhook request includes an HMAC-SHA256 signature computed with a shared secret and a timestamp header to prevent replay attacks. If an endpoint fails (returns 5xx or timeouts), workers reschedule the message using exponential backoff with full randomized jitter across 72 hours. Repeatedly failing endpoints are moved to a dead-letter queue (DLQ) and paused with automated developer email notifications.",
        sampleTranscript:
          "We sign outbound webhooks using HMAC-SHA256 with timestamp headers to protect against replay attacks. Retries follow exponential backoff with randomized jitter to prevent thundering herds on customer servers, routing persistent failures to a dead-letter queue.",
      },
      {
        id: "api-6",
        title: "GraphQL N+1 Query Problem & DataLoader Batching",
        company: "Shopify • Meta • Twitter",
        difficulty: "Senior Full-Stack / Backend Engineer",
        question:
          "What is the N+1 problem in GraphQL resolvers, and how does Facebook's DataLoader pattern solve it through batching and per-request memoization?",
        signals:
          "Event loop tick batching, primary key arrays (WHERE id IN (...)), per-request request-scoped cache, nested relation resolvers.",
        expectedKeywords: [
          "n+1",
          "graphql",
          "dataloader",
          "batching",
          "resolver",
          "event loop",
          "memoization",
          "cache",
          "sql",
        ],
        modelAnswer:
          "The N+1 problem occurs when a parent query fetches N items, and the child resolver executes an individual database query for each item (1 + N queries). Facebook's DataLoader solves this by coalescing individual load requests occurring within a single Node.js event-loop tick into a single batched array query (e.g. SELECT * FROM users WHERE id IN (...)). It also memoizes keys within the lifecycle of that specific HTTP request, eliminating redundant duplicate lookups.",
        sampleTranscript:
          "The N+1 issue happens when fetching child records triggers separate database calls for each parent entity. DataLoader collects all IDs requested in an event loop tick and fires a single batched SQL query using the IN clause, while caching results for the duration of the request.",
      },
    ],
  },
};
