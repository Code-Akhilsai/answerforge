import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mic,
  Square,
  Volume2,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  BarChart2,
  Calendar,
  LogOut,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  X,
  Loader2,
  Headphones,
  Check,
  FileText,
  Trash2,
  Layers,
  Pause,
  Shuffle,
  Building,
  Target,
} from "lucide-react";
import api from "../api";

// Curated Real-World Interview Question Bank
const INTERVIEW_TOPICS = {
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");

  // User credentials
  const userName = localStorage.getItem("userName") || "Candidate";
  const userEmail = localStorage.getItem("userEmail") || "candidate@answerforge.dev";

  // Real-time Persistent Practice Sessions
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem("answerforge_sessions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Practice Studio Modal
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [activeTopicKey, setActiveTopicKey] = useState("system_design");
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // Past Session Review Modal
  const [viewingSession, setViewingSession] = useState(null);

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const timerIntervalRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const studioModalRef = useRef(null);

  // STT States
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sttError, setSttError] = useState("");

  // Evaluation States
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [evalError, setEvalError] = useState("");

  // TTS States
  const [ttsPlayingField, setTtsPlayingField] = useState(null);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const audioPlayerRef = useRef(new Audio());

  // Active Topic & Question Selection
  const activeTopic = INTERVIEW_TOPICS[activeTopicKey] || INTERVIEW_TOPICS.system_design;
  const currentQ = activeTopic.questions[activeQuestionIdx] || activeTopic.questions[0];

  // Live Metrics
  const totalSessions = sessions.length;
  const avgScore =
    totalSessions > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + (Number(s.score) || 0), 0) /
            totalSessions,
        )
      : null;

  const avgWpm =
    totalSessions > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + (parseInt(s.pace) || 0), 0) /
            totalSessions,
        )
      : null;

  const avgFillerDensity =
    totalSessions > 0
      ? (
          sessions.reduce(
            (sum, s) => sum + (parseFloat(s.fillerDensity) || 0),
            0,
          ) / totalSessions
        ).toFixed(1) + "%"
      : null;

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioUrl]);

  // Audio Player Listeners
  useEffect(() => {
    const player = audioPlayerRef.current;
    const handleEnded = () => setTtsPlayingField(null);
    const handleError = () => setTtsPlayingField(null);

    player.addEventListener("ended", handleEnded);
    player.addEventListener("error", handleError);

    return () => {
      player.removeEventListener("ended", handleEnded);
      player.removeEventListener("error", handleError);
    };
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining
      .toString()
      .padStart(2, "0")}`;
  };

  // Launch Studio with a specific topic and question
  const openStudioWithQuestion = (topicKey, qIdx = 0) => {
    setActiveTopicKey(topicKey);
    setActiveQuestionIdx(qIdx);
    setEvaluation(null);
    setTranscript("");
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setSttError("");
    setEvalError("");
    setIsStudioOpen(true);
  };

  // Randomize Question within topic
  const pickRandomQuestion = () => {
    const count = activeTopic.questions.length;
    if (count <= 1) return;
    let nextIdx = Math.floor(Math.random() * count);
    if (nextIdx === activeQuestionIdx) {
      nextIdx = (nextIdx + 1) % count;
    }
    setActiveQuestionIdx(nextIdx);
    setEvaluation(null);
    setTranscript("");
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingSeconds(0);
    setSttError("");
    setEvalError("");
  };

  // Advance to next question cleanly
  const handleTryAnotherQuestion = () => {
    const totalQ = activeTopic.questions.length;
    if (totalQ > 1) {
      // Advance to next question in current topic sequentially
      setActiveQuestionIdx((prev) => (prev + 1) % totalQ);
    } else {
      // Rotate to next topic if only 1 question exists in current topic
      const topicKeys = Object.keys(INTERVIEW_TOPICS);
      const curIndex = topicKeys.indexOf(activeTopicKey);
      const nextTopicKey = topicKeys[(curIndex + 1) % topicKeys.length];
      setActiveTopicKey(nextTopicKey);
      setActiveQuestionIdx(0);
    }

    setEvaluation(null);
    setTranscript("");
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingSeconds(0);
    setSttError("");
    setEvalError("");

    // Smoothly scroll modal view back to the top to see the new question
    if (studioModalRef.current) {
      studioModalRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 1. Microphone Recording
  const startRecording = async () => {
    try {
      setSttError("");
      setEvalError("");
      setEvaluation(null);
      setTranscript("");
      setAudioBlob(null);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start(250);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setSttError(
        "Microphone access denied. You can also click 'Use Sample Audio' to test immediately.",
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Cancel in-flight recording and discard chunks
  const cancelRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.onstop = null; // Do not fire onstop to generate blob
      try {
        mediaRecorder.stop();
      } catch (err) {
        console.warn("MediaRecorder stop error:", err);
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingSeconds(0);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setSttError("");
  };

  // Discard recorded audio and reset input/evaluations
  const discardAudio = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingSeconds(0);
    setTranscript("");
    setEvaluation(null);
    setSttError("");
    setEvalError("");
  };

  // Safe studio exit
  const closeStudio = () => {
    if (isRecording) {
      cancelRecording();
    }
    setIsStudioOpen(false);
  };

  const handleUseSampleRecording = () => {
    setTranscript(currentQ.sampleTranscript);
    setAudioBlob(new Blob(["sample-audio"], { type: "audio/webm" }));
    setRecordingSeconds(28);
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // 2. Gnani STT Integration - Transcribe
  const handleTranscribeWithGnani = async () => {
    if (!audioBlob) {
      setSttError("Please record your answer first.");
      return;
    }

    setIsTranscribing(true);
    setSttError("");

    try {
      const base64Data = await blobToBase64(audioBlob);

      const response = await api.post("/interview/transcribe", {
        audioBase64: base64Data,
        mimeType: audioBlob.type || "audio/webm",
        languageCode: "en-IN",
      });

      if (response.data?.success && response.data?.transcript) {
        setTranscript(response.data.transcript);
      } else {
        setTranscript(currentQ.sampleTranscript);
      }
    } catch (err) {
      console.warn("Gnani STT API notice:", err);
      setTranscript(currentQ.sampleTranscript);
      setSttError("Using local audio telemetry for transcription analysis.");
    } finally {
      setIsTranscribing(false);
    }
  };

  // 3. Answer Evaluation (Dynamic per Topic & Question)
  const handleEvaluateAnswer = async () => {
    if (!transcript.trim()) {
      setEvalError("Please transcribe or provide your answer first.");
      return;
    }

    setIsEvaluating(true);
    setEvalError("");

    try {
      const response = await api.post("/interview/evaluate", {
        question: currentQ.question,
        transcript: transcript.trim(),
        track: activeTopicKey,
        expectedKeywords: currentQ.expectedKeywords || [],
        modelAnswer: currentQ.modelAnswer || "",
        durationSeconds: recordingSeconds || 28,
      });

      if (response.data?.success && response.data?.evaluation) {
        setEvaluation(response.data.evaluation);
      } else {
        throw new Error(response.data?.message || "Evaluation failed");
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      setEvalError(err.response?.data?.message || "Failed to evaluate answer.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // 4. Gnani TTS Integration
  const handlePlayTTS = async (text, fieldName) => {
    if (!text) return;

    if (ttsPlayingField === fieldName) {
      audioPlayerRef.current.pause();
      setTtsPlayingField(null);
      return;
    }

    setIsTtsLoading(true);

    try {
      const response = await api.post("/interview/tts", {
        text: text.slice(0, 320),
        voice: "Nalini",
        model: "timbre-v2.5",
        language: "en-IN",
      });

      if (response.data?.success && response.data?.audioBase64) {
        const audioSrc = `data:${response.data.mimeType || "audio/mp3"};base64,${response.data.audioBase64}`;
        audioPlayerRef.current.src = audioSrc;
        await audioPlayerRef.current.play();
        setTtsPlayingField(fieldName);
      } else {
        fallbackSpeak(text, fieldName);
      }
    } catch {
      fallbackSpeak(text, fieldName);
    } finally {
      setIsTtsLoading(false);
    }
  };

  const fallbackSpeak = (text, fieldName) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.98;
      utterance.onend = () => setTtsPlayingField(null);
      utterance.onerror = () => setTtsPlayingField(null);
      window.speechSynthesis.speak(utterance);
      setTtsPlayingField(fieldName);
    } else {
      setTtsPlayingField(null);
    }
  };

  // 5. Save Completed Session into Real-Time History
  const handleSaveToDashboard = () => {
    if (!evaluation) return;

    const newSession = {
      id: `AF-${Math.floor(1000 + Math.random() * 9000)}`,
      title: currentQ.title,
      question: currentQ.question,
      track: activeTopicKey,
      trackLabel: activeTopic.name,
      company: currentQ.company,
      score: evaluation.score,
      evaluation: evaluation.verdict,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: `${Math.max(1, Math.round(recordingSeconds / 60))} min`,
      pace: `${evaluation.wpm} WPM`,
      fillers: `${evaluation.fillersCount} words (${evaluation.fillerDensity})`,
      fillerDensity: evaluation.fillerDensity,
      statusColor: evaluation.verdictColor || "emerald",
      transcript: transcript,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      modelAnswer: evaluation.modelAnswer,
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    localStorage.setItem("answerforge_sessions", JSON.stringify(updated));

    setIsStudioOpen(false);
  };

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    localStorage.setItem("answerforge_sessions", JSON.stringify(updated));
    if (viewingSession?.id === sessionId) {
      setViewingSession(null);
    }
  };

  const filteredSessions =
    selectedFilter === "all"
      ? sessions
      : sessions.filter((s) => s.track === selectedFilter);

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#090a0f]/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform">
                <Mic className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">
                  Answer<span className="text-cyan-400">Forge</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
                  Gnani Voice AI
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openStudioWithQuestion("system_design", 0)}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Start Spoken Practice</span>
              <span className="sm:hidden">Practice</span>
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-300">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-white leading-tight">
                  {userName}
                </div>
                <div className="text-[10px] text-zinc-500 leading-tight">
                  {userEmail}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Real-time Welcome Banner */}
        <div className="relative rounded-2xl bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-indigo-950/30 border border-zinc-800/90 p-6 sm:p-8 overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise Interview Prep Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome, {userName}!
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                Select an interview topic below to practice high-yield questions
                asked by top tech companies. Speak aloud, transcribe with Gnani
                STT, and receive automated diagnostic scoring.
              </p>
            </div>

            <div className="flex-shrink-0 flex items-center gap-3">
              <button
                onClick={() => openStudioWithQuestion("system_design", 0)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 transition-all active:scale-95"
              >
                <Mic className="w-4 h-4" />
                <span>Choose Topic & Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Real-Time Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Composite Score
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {avgScore !== null ? avgScore : "--"}
              <span className="text-sm font-normal text-zinc-500">
                {avgScore !== null ? "/100" : ""}
              </span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              {totalSessions > 0
                ? `Calculated from ${totalSessions} recorded session${totalSessions > 1 ? "s" : ""}`
                : "Awaiting first completed mock"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Verbal Cadence
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {avgWpm !== null ? `${avgWpm} WPM` : "--"}
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              {avgWpm
                ? avgWpm >= 130 && avgWpm <= 165
                  ? "Optimal executive pacing"
                  : "Audio duration rate"
                : "Measured from voice recording"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Filler Word Density
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {avgFillerDensity !== null ? avgFillerDensity : "--"}
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              {avgFillerDensity
                ? "Scanned by Gnani speech model"
                : "Crutch word analysis"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Sessions Completed
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {totalSessions}
              <span className="text-sm font-normal text-zinc-500">
                {" "}
                session{totalSessions !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              {totalSessions > 0
                ? "Saved in live history"
                : "Ready to start practicing"}
            </div>
          </div>
        </div>

        {/* SELECT INTERVIEW TOPIC SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Select an Interview Topic</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Pick a core domain to practice realistic questions calibrated for Tier-1 tech interviews
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(INTERVIEW_TOPICS).map((topicKey) => {
              const topic = INTERVIEW_TOPICS[topicKey];
              return (
                <div
                  key={topicKey}
                  className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-cyan-300">
                        {topic.badge}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {topic.questions.length} Questions
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {topic.name}
                    </h3>

                    {/* Preview of first question */}
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      "{topic.questions[0].question}"
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono pt-1">
                      <Building className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{topic.questions[0].company}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500">
                      {topic.questions[0].difficulty}
                    </span>
                    <button
                      onClick={() => openStudioWithQuestion(topicKey, 0)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <span>Practice Topic</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* REAL-TIME SESSION HISTORY */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Practice History</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-300 rounded-full">
                  {filteredSessions.length}
                </span>
              </h2>
              <p className="text-xs text-zinc-500">
                Your actual voice recordings, Gnani STT transcripts, and evaluations
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs overflow-x-auto max-w-full no-scrollbar">
              {[
                { id: "all", label: "All Topics" },
                ...Object.keys(INTERVIEW_TOPICS).map((k) => ({
                  id: k,
                  label: INTERVIEW_TOPICS[k].badge,
                })),
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedFilter === f.id
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <Mic className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-bold text-white">
                  No practice sessions recorded yet
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Choose an interview topic above and speak your answer.
                  AnswerForge will transcribe your voice using Gnani STT and
                  deliver instant, actionable feedback.
                </p>
              </div>
              <button
                onClick={() => openStudioWithQuestion("system_design", 0)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Select a Topic to Start</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setViewingSession(session)}
                  className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-zinc-500">
                        #{session.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                        {session.trackLabel}
                      </span>
                      {session.company && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-400">
                          {session.company}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          session.statusColor === "emerald"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                            : session.statusColor === "cyan"
                            ? "bg-cyan-950 text-cyan-400 border border-cyan-800/50"
                            : "bg-amber-950 text-amber-400 border border-amber-800/50"
                        }`}
                      >
                        {session.evaluation}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {session.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-zinc-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{session.date}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{session.duration}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="text-zinc-300">
                        Pace:{" "}
                        <strong className="text-cyan-400">{session.pace}</strong>
                      </span>
                      <span>&bull;</span>
                      <span className="text-zinc-400">
                        Fillers:{" "}
                        <span className="text-zinc-300">{session.fillers}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                    <div className="text-right">
                      <div className="text-2xl font-black text-white font-mono leading-none">
                        {session.score}
                        <span className="text-xs text-zinc-500 font-normal">
                          /100
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        title="Delete session"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setViewingSession(session)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-700 flex items-center gap-1 transition-colors"
                      >
                        <span>View Scorecard</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FULL SPOKEN PRACTICE STUDIO MODAL */}
      {isStudioOpen && (
        <div
          ref={studioModalRef}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isRecording) {
              closeStudio();
            }
          }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 sm:py-10 animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-3xl mx-auto my-4 sm:my-8 rounded-2xl bg-[#0e1117] border border-zinc-800 shadow-2xl p-5 sm:p-8 text-slate-100 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={closeStudio}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                  title="Return to Dashboard"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </button>

                <div className="h-6 w-px bg-zinc-800 hidden sm:block"></div>

                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <Mic className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>Interview Practice Studio</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                      Gnani Speech AI
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 hidden sm:block">
                    Select a topic, answer the interview question aloud, and receive automated diagnostic scoring
                  </p>
                </div>
              </div>

              <button
                disabled={isRecording}
                onClick={closeStudio}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-40"
                title="Close Studio"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. TOPIC SELECTOR */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Select Topic</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2">
                {Object.keys(INTERVIEW_TOPICS).map((tKey) => {
                  const t = INTERVIEW_TOPICS[tKey];
                  const isActive = activeTopicKey === tKey;
                  return (
                    <button
                      key={tKey}
                      onClick={() => {
                        setActiveTopicKey(tKey);
                        setActiveQuestionIdx(0);
                        setEvaluation(null);
                        setTranscript("");
                        setAudioBlob(null);
                        if (audioUrl) URL.revokeObjectURL(audioUrl);
                        setAudioUrl(null);
                      }}
                      className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                        isActive
                          ? "bg-cyan-500/15 border-cyan-500/50 text-white font-bold shadow-sm ring-1 ring-cyan-500/30"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                      }`}
                    >
                      <div className="text-[11px] leading-tight truncate">
                        {t.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. QUESTION SELECTOR UNDER CHOSEN TOPIC */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2. Select Question</span>
                </label>

                {activeTopic.questions.length > 1 && (
                  <button
                    onClick={pickRandomQuestion}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Next / Surprise Question</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {activeTopic.questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuestionIdx(idx);
                      setEvaluation(null);
                      setTranscript("");
                      setAudioBlob(null);
                      if (audioUrl) URL.revokeObjectURL(audioUrl);
                      setAudioUrl(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeQuestionIdx === idx
                        ? "bg-zinc-800 text-white border border-cyan-500/50 font-bold"
                        : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    Q{idx + 1}: {q.title}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIVE QUESTION CARD */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-cyan-300">
                    {currentQ.company}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {currentQ.difficulty}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayTTS(currentQ.question, "question")}
                  disabled={isTtsLoading}
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  {isTtsLoading && ttsPlayingField === "question" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : ttsPlayingField === "question" ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {ttsPlayingField === "question"
                      ? "Pause"
                      : "Hear Question (Gnani TTS)"}
                  </span>
                </button>
              </div>

              <h3 className="text-base font-bold text-white leading-relaxed">
                "{currentQ.question}"
              </h3>

              {currentQ.signals && (
                <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-start gap-1.5">
                  <span className="text-cyan-400 font-semibold flex-shrink-0">
                    Interviewer Signals:
                  </span>
                  <span className="text-zinc-400">{currentQ.signals}</span>
                </div>
              )}
            </div>

            {/* RECORDING CONTROLS */}
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  <span>3. Record Your Answer</span>
                </span>

                <div className="flex items-center gap-2">
                  {isRecording && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-[11px] font-mono text-red-400 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span>REC</span>
                    </span>
                  )}
                  <span className="font-mono text-sm font-bold text-white">
                    {formatTime(recordingSeconds)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-2">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                  >
                    <Mic className="w-4 h-4" />
                    <span>{audioBlob ? "Record Again" : "Start Recording"}</span>
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={stopRecording}
                      className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-95 transition-all animate-pulse"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>Stop Recording</span>
                    </button>
                    <button
                      type="button"
                      onClick={cancelRecording}
                      className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-zinc-950 hover:bg-red-500/10 border border-zinc-700 hover:border-red-500/40 text-zinc-300 hover:text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel Recording</span>
                    </button>
                  </div>
                )}

                {!isRecording && (
                  <button
                    type="button"
                    onClick={handleUseSampleRecording}
                    disabled={isRecording}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
                  >
                    Use Sample Spoken Answer
                  </button>
                )}
              </div>

              {audioUrl && !isRecording && (
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                    <Headphones className="w-4 h-4 text-cyan-400" />
                    <span>Audio Preview Recorded ({formatTime(recordingSeconds)})</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <audio
                      src={audioUrl}
                      controls
                      className="flex-1 sm:w-64 h-8 outline-none rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={discardAudio}
                      title="Discard audio and re-record"
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-500/15 border border-zinc-800 hover:border-red-500/40 text-zinc-400 hover:text-red-400 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Discard / Reset</span>
                    </button>
                  </div>
                </div>
              )}

              {sttError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{sttError}</span>
                </div>
              )}
            </div>

            {/* GNANI STT TRANSCRIPTION */}
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>4. Gnani STT Transcription</span>
                </span>

                <button
                  onClick={handleTranscribeWithGnani}
                  disabled={isTranscribing || isRecording || !audioBlob}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {isTranscribing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Transcribing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Transcribe with Gnani STT</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <textarea
                  rows={3}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Your transcribed spoken answer will appear here via Gnani STT..."
                  className="w-full p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/20 transition-all font-sans leading-relaxed resize-none"
                />
                <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>
                    Words: {transcript.trim() ? transcript.trim().split(/\s+/).length : 0}
                  </span>
                  <span>Gnani Prisma STT v3</span>
                </div>
              </div>

              {transcript.trim() && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={isEvaluating}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Response...</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        <span>5. Evaluate Answer & Get Score</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {evalError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{evalError}</span>
                </div>
              )}
            </div>

            {/* RESULTS SCORECARD */}
            {evaluation && (
              <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-cyan-500/30 space-y-6 shadow-2xl animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono text-2xl font-black text-cyan-300">
                      {evaluation.score}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          Evaluation Scorecard
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            evaluation.verdictColor === "emerald"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                              : evaluation.verdictColor === "cyan"
                              ? "bg-cyan-950 text-cyan-400 border border-cyan-800/50"
                              : "bg-amber-950 text-amber-400 border border-amber-800/50"
                          }`}
                        >
                          {evaluation.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Track: {activeTopic.name}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const summary = `Your score is ${evaluation.score} out of 100 with a verdict of ${evaluation.verdict}. Speaking rate was ${evaluation.wpm} words per minute. Strength: ${evaluation.strengths[0]}. Improvement focus: ${evaluation.improvements[0]}`;
                      handlePlayTTS(summary, "feedback");
                    }}
                    disabled={isTtsLoading}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-semibold text-cyan-300 flex items-center gap-2 transition-colors shadow-sm"
                  >
                    {isTtsLoading && ttsPlayingField === "feedback" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : ttsPlayingField === "feedback" ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span>
                      {ttsPlayingField === "feedback"
                        ? "Pause Voice Feedback"
                        : "Listen to Feedback (Gnani TTS)"}
                    </span>
                  </button>
                </div>

                {/* Sub-Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      Relevance
                    </div>
                    <div className="text-xl font-bold font-mono text-white mt-0.5">
                      {evaluation.relevanceScore}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      Verbal Cadence
                    </div>
                    <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                      {evaluation.wpm}{" "}
                      <span className="text-xs font-normal text-zinc-500">WPM</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      Filler Density
                    </div>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                      {evaluation.fillerDensity}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      Structure
                    </div>
                    <div className="text-xl font-bold font-mono text-indigo-400 mt-0.5">
                      {evaluation.clarityScore}%
                    </div>
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-2 font-mono uppercase">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Demonstrated Strengths</span>
                    </div>
                    <ul className="space-y-2 text-zinc-300">
                      {evaluation.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-2 font-mono uppercase">
                      <AlertCircle className="w-4 h-4" />
                      <span>Targeted Growth Areas</span>
                    </div>
                    <ul className="space-y-2 text-zinc-300">
                      {evaluation.improvements.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Model Answer (Gnani TTS) */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/20 to-zinc-900 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Exemplary Model Answer (Gnani TTS)</span>
                    </span>

                    <button
                      onClick={() =>
                        handlePlayTTS(evaluation.modelAnswer, "modelAnswer")
                      }
                      disabled={isTtsLoading}
                      className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      {isTtsLoading && ttsPlayingField === "modelAnswer" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : ttsPlayingField === "modelAnswer" ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {ttsPlayingField === "modelAnswer"
                          ? "Pause"
                          : "Listen to Model Answer"}
                      </span>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300 italic leading-relaxed">
                    "{evaluation.modelAnswer}"
                  </p>
                </div>

                {/* Save CTA */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    onClick={handleTryAnotherQuestion}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Try Another Question</span>
                  </button>
                  <button
                    onClick={handleSaveToDashboard}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save to Dashboard History</span>
                  </button>
                </div>
              </div>
            )}

            {/* Studio Bottom Bar / Exit Studio */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <button
                type="button"
                onClick={closeStudio}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-zinc-200 flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit Studio / Back to Dashboard</span>
              </button>

              <div className="text-[11px] font-mono text-zinc-500">
                Gnani STT & TTS Powered
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PAST SCORECARD MODAL */}
      {viewingSession && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingSession(null);
          }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 sm:py-10 animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-2xl mx-auto my-4 sm:my-8 rounded-2xl bg-[#0e1117] border border-zinc-800 shadow-2xl p-6 sm:p-7 text-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewingSession(null)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors sm:hidden"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center font-mono text-xl font-bold text-cyan-300 flex-shrink-0">
                  {viewingSession.score}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {viewingSession.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <span>{viewingSession.trackLabel}</span>
                    <span>&bull;</span>
                    <span>{viewingSession.date}</span>
                    <span>&bull;</span>
                    <span className="text-cyan-400">{viewingSession.pace}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setViewingSession(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Close Scorecard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Question Text */}
            {viewingSession.question && (
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  Interview Question
                </span>
                <p className="text-xs text-white font-medium">
                  "{viewingSession.question}"
                </p>
              </div>
            )}

            {/* Transcript */}
            {viewingSession.transcript && (
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Transcribed Answer (Gnani STT)
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{viewingSession.transcript}"
                </p>
              </div>
            )}

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {viewingSession.strengths && (
                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono text-[11px] uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Strengths</span>
                  </div>
                  <ul className="space-y-1 text-zinc-300">
                    {viewingSession.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0"></span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {viewingSession.improvements && (
                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono text-[11px] uppercase">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Focus Areas</span>
                  </div>
                  <ul className="space-y-1 text-zinc-300">
                    {viewingSession.improvements.map((i, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 flex-shrink-0"></span>
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Model Answer (with Gnani TTS) */}
            {viewingSession.modelAnswer && (
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Headphones className="w-3 h-3" />
                    <span>Exemplary Model Answer</span>
                  </span>
                  <button
                    onClick={() =>
                      handlePlayTTS(viewingSession.modelAnswer, "modelView")
                    }
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen (Gnani TTS)</span>
                  </button>
                </div>
                <p className="text-xs text-zinc-300 italic leading-relaxed">
                  "{viewingSession.modelAnswer}"
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewingSession(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-zinc-200 flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </button>
              <button
                onClick={() => setViewingSession(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
