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
        signals: "Idempotency keys (UUIDv4), atomic Redis leases (SETNX), 409 status handling, DB unique constraints, TTL caches.",
        expectedKeywords: [
          "idempotency", "redis", "uuid", "atomic", "timeout", "lease",
          "retry", "database", "lock", "unique", "transaction"
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
        signals: "Sliding window log vs token bucket, local edge in-memory counters, asynchronous Kafka cross-region reconciliation, partition tolerance.",
        expectedKeywords: [
          "rate limiter", "sliding window", "redis", "token bucket",
          "latency", "multi-region", "replication", "kafka", "edge"
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
        signals: "Partitioned Kafka queues, worker pools, Redis bloom/sliding filters, circuit breakers with exponential backoff, dead letter queues.",
        expectedKeywords: [
          "kafka", "queue", "priority", "deduplication", "circuit breaker",
          "dead letter", "batching", "worker", "fcm", "failover"
        ],
        modelAnswer:
          "I architect the pipeline using partitioned Kafka topics grouped by notification priority (Transactional, Urgent, Promotional). Distributed worker pools consume events, deduplicate using Redis sliding filters, and dispatch to third-party providers wrapped with circuit breakers and dead-letter queues to handle upstream provider downtime.",
        sampleTranscript:
          "I architect the pipeline using Kafka partitioned by user ID to guarantee ordering. Worker pools consume notifications, deduplicate via a Redis sliding filter, and forward to providers through circuit breakers with dead-letter queues for undelivered events.",
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
        signals: "Distributed mutex locks, probabilistic early expiration (XFetch algorithm), background warming crons, stale-while-revalidate.",
        expectedKeywords: [
          "thundering herd", "cache stampede", "mutex", "lock",
          "probabilistic", "ttl", "warm", "stale", "background", "expire"
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
        signals: "In-place updates vs append-only SSTables, write amplification, random reads vs sequential writes, compaction overhead.",
        expectedKeywords: [
          "b-tree", "lsm-tree", "cassandra", "postgresql",
          "write amplification", "sstable", "sequential", "throughput", "random"
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
        signals: "Saga pattern (choreography vs orchestration), compensating transactions, Transactional Outbox pattern, CDC with Debezium.",
        expectedKeywords: [
          "saga", "orchestration", "choreography", "outbox",
          "compensating", "eventual consistency", "kafka", "cdc", "debezium"
        ],
        modelAnswer:
          "I implement the Saga pattern with compensating transactions. Using the Transactional Outbox pattern paired with Debezium CDC, each microservice commits local database state and publishes domain events to Kafka. If an order or payment step fails, an orchestrator publishes compensating events to rollback earlier states gracefully.",
        sampleTranscript:
          "I apply the Saga pattern with compensating transactions instead of 2PC locks. By using the Transactional Outbox pattern, microservices emit events to Kafka, triggering compensating transactions if any downstream step fails.",
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
        signals: "STAR methodology, objective benchmarking, data over opinions, active stakeholder alignment, measurable outcome.",
        expectedKeywords: [
          "disagreement", "situation", "action", "result", "data",
          "benchmark", "compromise", "stakeholder", "consensus", "sla"
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
        signals: "Fast rollback/circuit-break (<5 min), blameless post-mortem, root cause analysis, automated prevention checks.",
        expectedKeywords: [
          "outage", "incident", "rollback", "circuit breaker",
          "post-mortem", "sla", "root cause", "monitoring", "prevention"
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
        signals: "Iterative milestones, continuous stakeholder reviews, risk de-scoping, progressive delivery.",
        expectedKeywords: [
          "ambiguity", "milestones", "iterative", "stakeholder",
          "mvp", "alignment", "scope", "feedback", "delivered"
        ],
        modelAnswer:
          "When tasked with building an internal ML analytics portal without finalized specs, I scheduled weekly 30-minute prototype demonstrations with cross-functional stakeholders. By shipping functional thin-slice MVPs every sprint, we validated assumptions early, reduced scope creep by 35%, and launched on schedule.",
        sampleTranscript:
          "When tasked with building an internal ML analytics portal with shifting specs, I scheduled weekly prototype reviews with stakeholders. Shipping thin-slice MVPs every sprint allowed us to validate assumptions early and deliver on schedule.",
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
        signals: "Cohort segmentation (OS/build/geo), funnel step isolation, logging telemetry, A/B rollback triggers, 48-hr recovery SLA.",
        expectedKeywords: [
          "drop-off", "funnel", "segmentation", "cohort", "telemetry",
          "otp", "triage", "hypothesis", "rollback", "metric"
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
        signals: "RICE framework, developer velocity vs revenue impact, SLO breach risks, dedicated capacity allocation (e.g. 20-25%).",
        expectedKeywords: [
          "technical debt", "rice", "velocity", "sla", "prioritization",
          "customer impact", "slo", "risk", "bandwidth"
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
        signals: "Grandfathering periods, tier calculators, usage spend alerts with soft caps, pilot cohorts, customer advisory board.",
        expectedKeywords: [
          "usage-based", "pricing", "churn", "grandfather", "pilot",
          "tier", "billing", "threshold", "consumption"
        ],
        modelAnswer:
          "I mitigate churn by introducing a 90-day grandfathering buffer with dual-run invoices comparing both pricing models. We offer interactive consumption simulators in the dashboard, automated budget alerts at 80% thresholds with soft caps, and rollout first with a controlled pilot cohort of 20 high-usage customers to calibrate before broad release.",
        sampleTranscript:
          "To prevent churn when shifting to usage-based pricing, I provide a 90-day transition period with dual billing statements. We build budget alert thresholds with soft limits so customers never experience bill shock, and test with a pilot cohort first.",
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
        signals: "Asset preloading via CDN, route/component code splitting, offloading work to Web Workers, breaking up long tasks, hydration strategies.",
        expectedKeywords: [
          "lcp", "tbt", "core web vitals", "code splitting", "lazy",
          "ssr", "bundle", "cdn", "memo", "hydration", "worker"
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
        signals: "Independent deployment, team autonomy, Module Federation, bundle overhead, CSS isolation, shared state synchronization.",
        expectedKeywords: [
          "micro-frontend", "module federation", "independent deployment",
          "bundle size", "isolated", "trade-offs", "spa", "autonomy"
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
        signals: "CRDTs (Yjs/Automerge), IndexedDB local storage, service worker caching, optimistic UI updates, last-write-wins vs semantic merging.",
        expectedKeywords: [
          "offline-first", "crdt", "indexeddb", "service worker",
          "conflict resolution", "optimistic", "sync", "yjs", "merge"
        ],
        modelAnswer:
          "I architect an offline-first state model using CRDTs (Conflict-free Replicated Data Types) like Yjs persisted locally in IndexedDB. Local user operations apply optimistically with zero UI latency. When network connectivity restores, a background sync service worker exchanges compressed delta updates with the server, resolving concurrent edits deterministically without destructive overwrites.",
        sampleTranscript:
          "I build the offline persistence layer with IndexedDB and CRDTs like Yjs. Mutations apply optimistically in the UI. When the network reconnects, the service worker pushes delta state changes to the backend, enabling conflict-free automatic merges.",
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
        signals: "Argo Rollouts, Istio traffic splitting, Prometheus p99 latency & 5xx error budget burn, automated progressive promotion.",
        expectedKeywords: [
          "canary", "kubernetes", "argo", "service mesh", "istio",
          "rollback", "prometheus", "p99", "traffic split", "telemetry"
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
        signals: "Active-active vs warm standby, cross-region asynchronous database replication, Route53 health checks, automated DNS failover, Terraform drift detection.",
        expectedKeywords: [
          "disaster recovery", "rto", "rpo", "active-active", "failover",
          "dns", "replication", "terraform", "multi-region", "backup"
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
        signals: "OpenTelemetry, SLO/SLI-based alerting, log sampling & aggregation, burn-rate alerts vs symptomatic thresholds, blameless on-call handoffs.",
        expectedKeywords: [
          "observability", "opentelemetry", "tracing", "slo", "sli",
          "alert fatigue", "burn rate", "metrics", "logs", "pagerduty"
        ],
        modelAnswer:
          "I standardize telemetry collection using OpenTelemetry for distributed tracing, metrics, and structured logs. To eliminate alert fatigue, I ban alerts on host-level symptoms like transient CPU spikes, tying alerts exclusively to SLO/SLI error-budget burn rates via PagerDuty. Non-urgent anomalies are routed to asynchronous Slack digests rather than waking up engineers.",
        sampleTranscript:
          "I use OpenTelemetry for unified tracing and metrics across services. To combat alert fatigue, we only page on-call engineers for SLO burn-rate breaches affecting user journeys, while transient anomalies route to daily dashboard reports.",
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
        signals: "Short expiry (<15 min), refresh token rotation in Redis, bloom filter blacklist, JTI tracking, cryptographic signature validation.",
        expectedKeywords: [
          "jwt", "revocation", "refresh token", "blacklist", "redis",
          "bloom filter", "signature", "oauth", "expiry", "stateless"
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
        signals: "DNS rebinding defense, internal IP CIDR blacklisting (RFC 1918, 169.254.169.254 metadata service), isolated proxy egress, URL parser validation.",
        expectedKeywords: [
          "ssrf", "dns rebinding", "metadata", "egress", "proxy",
          "internal ip", "cidr", "whitelist", "webhook", "isolated"
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
        signals: "SPIFFE/SPIRE workload identities, dynamic X.509 cert rotation, service-to-service RBAC, perimeter vs identity boundary.",
        expectedKeywords: [
          "zero-trust", "mtls", "spiffe", "spire", "identity",
          "certificate", "perimeter", "encryption", "rbac", "workload"
        ],
        modelAnswer:
          "I eliminate the perimeter model by treating internal networks as untrusted, issuing cryptographic workload identities using SPIFFE/SPIRE. Microservices communicate exclusively over mutual TLS with ephemeral X.509 certificates automatically rotated every 12 hours. Granular L7 authorization policies enforce least-privilege service-to-service RBAC at the service mesh proxy.",
        sampleTranscript:
          "Under Zero-Trust, we abandon network perimeter assumptions. Each microservice receives a cryptographically signed SPIFFE identity. All inter-service traffic is encrypted via mTLS with short-lived certificates, and service mesh policies enforce strict least-privilege access.",
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
        signals: "Chunking strategies, hybrid search (dense embeddings + BM25 keyword), reranking with Cross-Encoder, contextual compression, guardrails/hallucination verification.",
        expectedKeywords: [
          "rag", "embeddings", "vector database", "hybrid search", "bm25",
          "reranker", "chunking", "hallucination", "guardrails", "cache"
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
        signals: "PagedAttention (vLLM), continuous batching, KV cache management, model quantization (FP8/INT4/AWQ), speculative decoding, tensor parallelism.",
        expectedKeywords: [
          "kv cache", "pagedattention", "vllm", "continuous batching",
          "quantization", "tensor parallelism", "throughput", "latency", "gpu"
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
        signals: "Dual-LLM architecture (privileged vs untrusted parser), delimiter defense, semantic canary tokens, NeMo Guardrails / Llama Guard, output validation.",
        expectedKeywords: [
          "prompt injection", "guardrails", "canary", "delimiter",
          "safety", "untrusted", "jailbreak", "sanitization", "output validation"
        ],
        modelAnswer:
          "I establish a dual-LLM architecture separating the privileged orchestrator from an unprivileged ingestion LLM that processes untrusted text. Ingestion prompts use strict XML delimiter encapsulation and semantic canary tokens to detect instruction leakage. Pre-flight classification with Llama Guard and deterministic output schemas prevent malicious instructions from hijacking agent tool-execution.",
        sampleTranscript:
          "To prevent prompt injection, I isolate untrusted document processing in a sandboxed, unprivileged LLM tier. We wrap inputs in strict XML delimiters, inject canary tokens to detect leakage, and run output through guardrail filters before taking any actions.",
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
        signals: "Protobuf binary serialization, HTTP/2 multiplexing, over/under-fetching, schema enforcement, CDN cacheability, bidirectional streaming.",
        expectedKeywords: [
          "grpc", "graphql", "rest", "protobuf", "http/2",
          "serialization", "caching", "over-fetching", "microservices"
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
        signals: "Full-duplex vs unidirectional, reconnection resilience, operational complexity with proxies/load balancers, connection statefulness, Operational Transformation (OT) / CRDTs.",
        expectedKeywords: [
          "websockets", "sse", "server-sent events", "full-duplex",
          "reconnection", "load balancer", "crdt", "real-time", "latency"
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
        signals: "Partition log vs AMQP message queue, at-least-once vs exactly-once semantics, consumer offsets, smart broker vs dumb broker, backpressure.",
        expectedKeywords: [
          "kafka", "rabbitmq", "partition", "offset", "replay",
          "at-least-once", "consumer group", "amqp", "throughput", "ordering"
        ],
        modelAnswer:
          "Kafka is a partitioned commit log optimized for high-throughput streaming telemetry, event-sourcing, and historical replayability via consumer offset management. RabbitMQ is a traditional message broker excelling at complex routing topologies, priority queues, and transient task queues. I choose Kafka for audit logs and event streaming, and RabbitMQ for granular RPC job queues and transactional task processing.",
        sampleTranscript:
          "Kafka works as a persistent partitioned log where consumers track their own offsets, making it great for high-throughput event streaming and replay. RabbitMQ excels at complex routing rules and individual message acknowledgments for task queues.",
      },
    ],
  },
};
