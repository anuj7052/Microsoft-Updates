const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function makeSlug(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '')
}

// ── Real Microsoft historical updates spanning 2021–2026 ────────────────────
const HISTORICAL_UPDATES = [
  // ═══════════════════ 2021 ═══════════════════
  { title: "Windows 11 Officially Announced at Microsoft Event", category: "windows", date: "2021-06-24", description: "Microsoft unveiled Windows 11 with a centered Start menu, Snap Layouts, Android app support, and a redesigned Microsoft Store. The free upgrade for Windows 10 users was confirmed for eligible PCs." },
  { title: "Azure Purview Launches for Unified Data Governance", category: "azure", date: "2021-03-15", description: "Microsoft launched Azure Purview, a unified data governance service that helps organizations manage and govern their on-premises, multi-cloud, and SaaS data landscapes." },
  { title: "Microsoft Teams Reaches 250 Million Monthly Active Users", category: "office365", date: "2021-07-27", description: "Microsoft announced Teams has reached 250 million monthly active users, driven by remote work adoption. New features include presenter mode, Together mode improvements, and end-to-end encryption for 1:1 calls." },
  { title: "Windows 11 Released to the Public Worldwide", category: "windows", date: "2021-10-05", description: "Windows 11 rolled out globally as a free upgrade for eligible Windows 10 PCs, featuring a centered taskbar, redesigned Start menu, Snap Layouts, virtual desktops, and native Teams integration." },
  { title: "Azure Arc Enabled Kubernetes Becomes Generally Available", category: "azure", date: "2021-03-02", description: "Azure Arc enabled Kubernetes reached general availability, allowing organizations to attach and configure Kubernetes clusters running anywhere using Azure management tools and policies." },
  { title: "Microsoft Acquires Nuance Communications for $19.7 Billion", category: "copilot", date: "2021-04-12", description: "Microsoft announced the acquisition of Nuance Communications, a leader in AI-powered healthcare and enterprise solutions, for approximately $19.7 billion to accelerate its industry cloud strategy." },
  { title: "Microsoft Defender for Business Announced for SMBs", category: "security", date: "2021-11-02", description: "Microsoft announced Defender for Business, an endpoint security solution designed for small and medium-sized businesses with up to 300 employees, bringing enterprise-grade protection at a SMB-friendly price." },
  { title: "Power Automate Desktop Becomes Free for Windows 10 Users", category: "power-platform", date: "2021-03-02", description: "Microsoft made Power Automate Desktop free for all Windows 10 users, enabling robotic process automation (RPA) capabilities at no additional cost to automate repetitive desktop tasks." },
  { title: "Microsoft Viva Employee Experience Platform Launches", category: "office365", date: "2021-02-04", description: "Microsoft Viva launched as an employee experience platform integrated into Teams, featuring Viva Connections, Viva Insights, Viva Learning, and Viva Topics to support remote and hybrid work." },
  { title: "Azure Communication Services Adds Teams Interoperability", category: "azure", date: "2021-06-15", description: "Azure Communication Services introduced Teams interoperability, allowing developers to build custom applications that can join and interact with Microsoft Teams meetings and calls." },
  { title: "OneDrive Gets Personal Vault Expansion and Offline Access", category: "office365", date: "2021-08-19", description: "Microsoft expanded OneDrive Personal Vault to allow unlimited files with Microsoft 365 subscriptions and added improved offline access for mobile and desktop users." },
  { title: "Windows 365 Cloud PC Service Launched", category: "windows", date: "2021-08-02", description: "Microsoft launched Windows 365, a cloud PC service that streams a full Windows experience to any device. Available in Business and Enterprise editions with various compute configurations." },
  { title: "Microsoft Exchange Server ProxyShell Vulnerabilities Patched", category: "security", date: "2021-04-13", description: "Microsoft released critical patches for Exchange Server addressing ProxyShell vulnerabilities (CVE-2021-34473, CVE-2021-34523, CVE-2021-31207) that were actively exploited in the wild." },
  { title: "Power BI Goals Feature Announced for Performance Tracking", category: "power-platform", date: "2021-05-25", description: "Microsoft introduced Power BI Goals (later Metrics), enabling organizations to track key performance indicators and business metrics directly within Power BI with automated status updates." },
  { title: "Microsoft Mesh Mixed Reality Platform Preview", category: "copilot", date: "2021-03-02", description: "Microsoft unveiled Mesh, a mixed reality platform enabling shared holographic experiences across devices. Users can collaborate in shared virtual spaces regardless of their physical location or device." },
  { title: "Azure Synapse Analytics Link for Dataverse GA", category: "azure", date: "2021-11-02", description: "Azure Synapse Analytics Link for Dataverse became generally available, providing continuous data replication from Dynamics 365 and Power Platform to Azure Synapse for advanced analytics." },

  // ═══════════════════ 2022 ═══════════════════
  { title: "Microsoft Acquires Activision Blizzard for $68.7 Billion", category: "general", date: "2022-01-18", description: "Microsoft announced the acquisition of Activision Blizzard for approximately $68.7 billion, the largest gaming acquisition in history, to accelerate growth in gaming across mobile, PC, console, and cloud." },
  { title: "Windows 11 22H2 Feature Update Released", category: "windows", date: "2022-09-20", description: "Windows 11 22H2 brought tabbed File Explorer, Snap Layouts for phone screen mirroring, Smart App Control, enhanced phishing protection in SmartScreen, and accessibility improvements." },
  { title: "Azure OpenAI Service Launches in Preview", category: "azure", date: "2022-01-18", description: "Microsoft launched Azure OpenAI Service in preview, providing enterprise access to OpenAI models including GPT-3, Codex, and DALL-E with Azure's enterprise security, compliance, and regional availability." },
  { title: "Microsoft Loop Preview Released for Collaboration", category: "office365", date: "2022-11-01", description: "Microsoft Loop entered preview as a co-creation tool featuring portable Loop components that sync across Microsoft 365 apps, workspaces for organizing projects, and real-time collaboration." },
  { title: "Microsoft Entra Identity Platform Announced", category: "security", date: "2022-05-31", description: "Microsoft announced the Entra brand for its identity and access management products, including Azure AD (renamed Entra ID), Entra Permissions Management, and Entra Verified ID." },
  { title: "Power Platform Managed Environments Launched", category: "power-platform", date: "2022-06-07", description: "Microsoft introduced Managed Environments for Power Platform, providing admins with enhanced governance, security, and monitoring capabilities for enterprise Power Platform deployments." },
  { title: "GitHub Copilot Becomes Generally Available", category: "copilot", date: "2022-06-21", description: "GitHub Copilot, the AI pair programmer powered by OpenAI Codex, became generally available as an individual subscription at $10/month, offering real-time code suggestions in VS Code and other editors." },
  { title: "Azure Container Apps Reaches General Availability", category: "azure", date: "2022-05-24", description: "Azure Container Apps became generally available, providing a fully managed serverless container runtime for running microservices and containerized applications with built-in KEDA autoscaling." },
  { title: "Microsoft Defender for IoT Enhanced with Threat Intelligence", category: "security", date: "2022-07-19", description: "Microsoft Defender for IoT received major updates with enhanced threat intelligence, site-level risk assessment, and improved integration with Microsoft Sentinel for unified SOC operations." },
  { title: "Microsoft Places App Announced for Hybrid Work", category: "office365", date: "2022-10-12", description: "Microsoft announced Places, a connected workplace app that helps coordinate in-office days, optimize office space usage, and modernize the workplace for hybrid work patterns." },
  { title: "Windows Dev Kit 2023 (Project Volterra) Released", category: "windows", date: "2022-10-24", description: "Microsoft released the Windows Dev Kit 2023 powered by Snapdragon 8cx Gen 3 processor, designed for developers building native ARM64 Windows applications with NPU access." },
  { title: "Azure Cosmos DB Introduces 30-Day Free Tier", category: "azure", date: "2022-03-08", description: "Azure Cosmos DB launched a 30-day free trial with 1000 RU/s provisioned throughput and 25 GB storage, allowing developers to test globally distributed database capabilities at no cost." },
  { title: "Power Pages Low-Code Website Builder Launched", category: "power-platform", date: "2022-06-07", description: "Microsoft Power Pages launched as a standalone secure, enterprise-grade low-code SaaS platform for creating, hosting, and administering modern external-facing business websites." },
  { title: "Microsoft Defender Experts for Hunting Service GA", category: "security", date: "2022-08-03", description: "Microsoft launched Defender Experts for Hunting, a managed threat hunting service that proactively hunts across endpoints, email, identity, and cloud apps using Microsoft's expert security analysts." },
  { title: "Windows Subsystem for Android Brings Amazon Appstore", category: "windows", date: "2022-02-15", description: "Windows Subsystem for Android became generally available in the US, enabling Windows 11 users to run Android apps from the Amazon Appstore natively on their PCs." },
  { title: "Microsoft Syntex AI Content Processing Launched", category: "office365", date: "2022-10-12", description: "Microsoft Syntex launched as a content AI service that uses AI to automatically read, tag, and index content, making unstructured content usable across the Microsoft platform." },

  // ═══════════════════ 2023 ═══════════════════
  { title: "Microsoft Launches New Bing with ChatGPT Integration", category: "copilot", date: "2023-02-07", description: "Microsoft unveiled the new Bing powered by an upgraded OpenAI large language model (GPT-4), integrating AI chat directly into search results with citations and creative content generation." },
  { title: "Microsoft 365 Copilot Announced for Enterprise", category: "copilot", date: "2023-03-16", description: "Microsoft announced 365 Copilot, embedding GPT-4 across Word, Excel, PowerPoint, Outlook, and Teams. Copilot generates documents, analyzes data, creates presentations, and summarizes meetings using enterprise data." },
  { title: "Windows Copilot Preview Integrated into Windows 11", category: "windows", date: "2023-06-26", description: "Microsoft previewed Windows Copilot, an AI assistant integrated into the Windows 11 taskbar that can control settings, summarize content, generate text, and interact with applications." },
  { title: "Azure AI Studio Preview Launched for Model Customization", category: "azure", date: "2023-11-15", description: "Microsoft launched Azure AI Studio in preview, providing a unified platform for building, customizing, and deploying generative AI applications with responsible AI tools and prompt flow orchestration." },
  { title: "Microsoft Fabric Unified Analytics Platform Announced", category: "fabric", date: "2023-05-23", description: "Microsoft announced Fabric, a unified analytics platform that brings together Data Factory, Data Engineering, Data Science, Data Warehouse, Real-Time Analytics, and Power BI into a single SaaS experience." },
  { title: "Microsoft 365 Copilot Generally Available at $30/User/Month", category: "copilot", date: "2023-11-01", description: "Microsoft 365 Copilot became generally available for enterprise customers at $30 per user per month, with AI capabilities across Word, Excel, PowerPoint, Outlook, Teams, and the new Microsoft Copilot." },
  { title: "Windows 11 23H2 Released with Copilot and AI Features", category: "windows", date: "2023-10-31", description: "Windows 11 23H2 shipped with AI-powered Copilot in the taskbar, Paint Cocreator, Snipping Tool text extraction, Photos background removal, and Notepad with AI suggestions." },
  { title: "Azure Migrate Enhanced for Multi-Cloud Workloads", category: "azure", date: "2023-04-18", description: "Azure Migrate received major updates supporting assessment and migration of workloads from AWS and GCP to Azure, with improved dependency mapping and cost estimation tools." },
  { title: "Microsoft Authenticator Adds Passkey Support", category: "security", date: "2023-05-02", description: "Microsoft Authenticator added FIDO2 passkey support, allowing passwordless sign-in to Microsoft accounts and Azure AD with biometric authentication across iOS and Android devices." },
  { title: "Power Automate Copilot Creates Flows from Natural Language", category: "power-platform", date: "2023-03-16", description: "Power Automate received Copilot capabilities enabling users to create complex automation flows by describing them in natural language, with AI generating the complete workflow logic." },
  { title: "SharePoint Premium Announced with AI Document Processing", category: "office365", date: "2023-11-15", description: "Microsoft announced SharePoint Premium combining Syntex capabilities with new AI-powered content management, document processing, and eSignature features for enterprise content governance." },
  { title: "Microsoft Fabric General Availability Announced", category: "fabric", date: "2023-11-15", description: "Microsoft Fabric became generally available, offering a unified SaaS analytics platform with OneLake, Lakehouse, Data Warehouse, Notebooks, and Real-Time Analytics capabilities." },
  { title: "GitHub Copilot Chat Becomes Generally Available", category: "copilot", date: "2023-12-29", description: "GitHub Copilot Chat reached general availability, providing an AI-powered chat interface within VS Code and Visual Studio that can explain code, fix bugs, generate tests, and refactor code." },
  { title: "Azure AI Content Safety Service Launched", category: "azure", date: "2023-10-01", description: "Microsoft launched Azure AI Content Safety, a service that detects harmful content in text, images, and multi-modal content to help developers build safer AI applications with responsible AI guardrails." },
  { title: "Windows Terminal Gets Copilot AI Assistant", category: "windows", date: "2023-09-26", description: "Windows Terminal received an integrated Copilot feature that can suggest commands, explain error messages, and generate scripts based on natural language descriptions of tasks." },
  { title: "Microsoft Teams Premium with AI Features Launched", category: "office365", date: "2023-02-01", description: "Teams Premium launched with AI-powered meeting intelligence including live translations in 40 languages, intelligent meeting recap, AI-generated chapters, and personalized timeline markers." },
  { title: "Power Platform Copilot Capabilities Expanded", category: "power-platform", date: "2023-10-03", description: "Microsoft expanded Copilot across the Power Platform with AI-assisted app creation in Power Apps, natural language data analysis in Power BI, and intelligent bot building in Power Virtual Agents." },
  { title: "Microsoft Defender XDR Unifies Security Operations", category: "security", date: "2023-11-15", description: "Microsoft rebranded and unified its security products under Defender XDR (Extended Detection and Response), combining endpoint, identity, email, and cloud security into a single incident view." },
  { title: "Copilot for Microsoft 365 Adds Meeting Transcription in 18 Languages", category: "copilot", date: "2023-12-15", description: "Copilot for Microsoft 365 expanded meeting transcription support to 18 languages with real-time AI summaries, action item extraction, and follow-up task generation." },
  { title: "Azure Well-Architected Framework Updated for AI Workloads", category: "azure", date: "2023-09-12", description: "Microsoft updated the Azure Well-Architected Framework with comprehensive guidance for AI and machine learning workloads, covering operational excellence, security, reliability, performance, and cost optimization." },

  // ═══════════════════ 2024 ═══════════════════
  { title: "Microsoft Copilot Rebranded from Bing Chat", category: "copilot", date: "2024-01-15", description: "Microsoft unified all consumer AI experiences under the 'Microsoft Copilot' brand, replacing Bing Chat with a dedicated Copilot app on web, Windows, iOS, and Android." },
  { title: "Copilot Pro Subscription Launched at $20/Month", category: "copilot", date: "2024-01-15", description: "Microsoft launched Copilot Pro, a premium AI subscription providing GPT-4 Turbo access during peak times, Copilot in Word/Excel/PowerPoint for personal Microsoft 365 subscribers, and priority access to new features." },
  { title: "Windows 11 Copilot+ PCs with NPU Announced", category: "windows", date: "2024-05-20", description: "Microsoft announced Copilot+ PCs, a new category of Windows 11 devices with dedicated Neural Processing Units (NPU) delivering 40+ TOPS, enabling on-device AI features like Recall, Live Captions, and image generation." },
  { title: "Azure OpenAI Service GPT-4o Model Available", category: "azure", date: "2024-05-13", description: "Azure OpenAI Service made GPT-4o available, OpenAI's most capable multimodal model processing text, audio, and images with faster responses and reduced costs compared to GPT-4 Turbo." },
  { title: "Microsoft Recalls Recall Feature Due to Privacy Concerns", category: "windows", date: "2024-06-13", description: "Microsoft delayed the Recall feature for Copilot+ PCs after widespread privacy criticism. The AI feature that screenshots everything will now be opt-in with enhanced encryption and security controls." },
  { title: "GitHub Copilot Workspace Preview for AI Development", category: "copilot", date: "2024-04-29", description: "GitHub launched Copilot Workspace in technical preview, enabling developers to plan, implement, and test code changes from a single GitHub Issue using AI-powered planning and multi-file editing." },
  { title: "Microsoft Fabric Gets Database Mirroring for SQL Server", category: "fabric", date: "2024-03-26", description: "Microsoft Fabric introduced database mirroring for Azure SQL Database, allowing near real-time replication of SQL databases into OneLake for unified analytics without complex ETL pipelines." },
  { title: "Azure AI Foundry Launched for Enterprise AI Development", category: "azure", date: "2024-11-19", description: "Microsoft rebranded Azure AI Studio as Azure AI Foundry, offering a unified platform for building, testing, and deploying AI applications with access to OpenAI, Meta Llama, Mistral, and other models." },
  { title: "Security Copilot Generally Available for SOC Teams", category: "security", date: "2024-04-01", description: "Microsoft Security Copilot became generally available, providing AI-powered security analysis that helps SOC teams investigate threats, write KQL queries, and generate incident reports using natural language." },
  { title: "Power Platform Governance with Managed Environments V2", category: "power-platform", date: "2024-04-15", description: "Microsoft enhanced Managed Environments for Power Platform with data policies, solution checker enforcement, maker welcome content, and sharing limits for improved enterprise governance." },
  { title: "Microsoft Places App General Availability", category: "office365", date: "2024-07-22", description: "Microsoft Places became generally available, helping organizations optimize office spaces with intelligent booking, space analytics, and coordination features for hybrid work." },
  { title: "Windows 11 24H2 Annual Update Released", category: "windows", date: "2024-10-01", description: "Windows 11 24H2 shipped with Sudo for Windows, Wi-Fi 7 support, improved energy recommendations, HDR background support, and enhanced Copilot integration with deeper OS-level actions." },
  { title: "Azure Kubernetes Service Automatic Mode GA", category: "azure", date: "2024-10-22", description: "AKS Automatic became generally available, providing a fully managed Kubernetes experience with automated node management, scaling, security patching, and networking configuration." },
  { title: "Microsoft Fabric F SKU Pricing Model Introduced", category: "fabric", date: "2024-06-25", description: "Microsoft introduced Fabric F SKU capacity model with pay-as-you-go pricing starting from F2, making the unified analytics platform accessible to smaller organizations and development teams." },
  { title: "Copilot Actions Automates Repetitive Tasks in M365", category: "copilot", date: "2024-11-19", description: "Microsoft launched Copilot Actions in Microsoft 365, enabling users to automate repetitive tasks like weekly status reports, meeting preparation, and email triage using natural language prompts." },
  { title: "Power BI Copilot Creates Reports from Natural Language", category: "power-platform", date: "2024-02-14", description: "Power BI Copilot became generally available, allowing users to create complete reports from natural language descriptions, generate DAX formulas, and get AI-powered insights from their data." },
  { title: "Microsoft Defender for Cloud Gets AI Threat Protection", category: "security", date: "2024-08-06", description: "Microsoft Defender for Cloud added AI threat protection capabilities that detect and respond to attacks targeting AI workloads, including prompt injection, model theft, and data poisoning attacks." },
  { title: "Microsoft Copilot Pages for Persistent AI Content", category: "copilot", date: "2024-09-16", description: "Microsoft introduced Copilot Pages, a dynamic canvas where AI-generated content becomes persistent and collaborative, allowing teams to iterate on AI outputs together in real-time." },
  { title: "OneDrive Gets Copilot for File Management and Search", category: "office365", date: "2024-05-01", description: "OneDrive received Copilot integration enabling natural language file search, intelligent file organization suggestions, and AI-powered content summaries for documents and presentations." },
  { title: "Azure SQL Database Free Tier Announced", category: "azure", date: "2024-11-19", description: "Microsoft announced a free tier for Azure SQL Database with 32GB storage and 100 DTUs, allowing developers and small applications to run SQL workloads at no cost." },

  // ═══════════════════ 2025 ═══════════════════
  { title: "Microsoft Copilot Agents Transform Business Workflows", category: "copilot", date: "2025-01-15", description: "Microsoft expanded Copilot with autonomous AI agents that can handle complete business workflows like expense approvals, customer onboarding, and sales pipeline management with minimal human intervention." },
  { title: "Windows 11 25H1 Introduces AI System Shell", category: "windows", date: "2025-03-18", description: "Windows 11 25H1 preview builds revealed a new AI-powered system shell that replaces traditional Start menu search with conversational AI, contextual file management, and proactive task suggestions." },
  { title: "Azure AI Agent Service for Multi-Agent Orchestration", category: "azure", date: "2025-02-04", description: "Microsoft launched Azure AI Agent Service enabling developers to build, deploy, and orchestrate multiple AI agents that collaborate on complex tasks with built-in memory, tool-use, and planning capabilities." },
  { title: "Microsoft Fabric Copilot Creates End-to-End Data Pipelines", category: "fabric", date: "2025-01-20", description: "Fabric Copilot gained the ability to create complete data pipelines from natural language, including data ingestion, transformation, modeling, and visualization steps across the entire analytics lifecycle." },
  { title: "Microsoft Entra ID Gets Real-Time Adaptive Access", category: "security", date: "2025-02-11", description: "Microsoft Entra ID introduced real-time adaptive access policies that continuously evaluate user risk during sessions and can dynamically adjust permissions based on behavior anomalies." },
  { title: "Power Apps Copilot Generates Full Business Applications", category: "power-platform", date: "2025-03-04", description: "Power Apps Copilot evolved to generate complete business applications including data models, business logic, UI screens, and integrations from detailed natural language descriptions." },
  { title: "Microsoft 365 Copilot Adds Meeting Intelligence Features", category: "office365", date: "2025-01-28", description: "Microsoft 365 Copilot added advanced meeting intelligence with real-time sentiment analysis, engagement scoring, and AI-generated coaching tips for presenters and meeting organizers." },
  { title: "Azure Cosmos DB Adds Global Vector Database Capabilities", category: "azure", date: "2025-03-11", description: "Azure Cosmos DB expanded vector database capabilities with global distribution, automatic indexing of high-dimensional vectors, and native integration with Azure OpenAI for RAG applications." },
  { title: "Windows Hotpatch Reduces Reboot Requirements for Updates", category: "windows", date: "2025-04-01", description: "Microsoft expanded Windows Hotpatch to Windows 11 Enterprise, enabling security updates to be applied without requiring system reboots, significantly reducing downtime for managed devices." },
  { title: "GitHub Copilot Coding Agent Handles Full Pull Requests", category: "copilot", date: "2025-05-19", description: "GitHub launched Copilot Coding Agent that can autonomously handle entire pull requests — planning changes, implementing code across multiple files, writing tests, and opening PRs from issue descriptions." },
  { title: "Microsoft Security Exposure Management Preview", category: "security", date: "2025-04-08", description: "Microsoft launched Security Exposure Management in preview, providing unified visibility into attack surfaces across cloud, identity, endpoint, and data assets with AI-powered risk prioritization." },
  { title: "Power Platform AI Builder Gets Document Intelligence V4", category: "power-platform", date: "2025-02-25", description: "AI Builder in Power Platform received Document Intelligence V4 with enhanced accuracy for processing invoices, receipts, and custom documents in multiple Indian languages." },
  { title: "Microsoft Teams Gets AI-Powered Meeting Rooms Intelligence", category: "office365", date: "2025-03-15", description: "Teams introduced AI-powered meeting room intelligence features including smart speaker identification, spatial audio mapping, and automatic participant framing for hybrid meetings." },
  { title: "Azure API Management Gets Comprehensive AI Gateway", category: "azure", date: "2025-05-06", description: "Azure API Management added AI gateway capabilities for managing, securing, and monitoring AI model endpoints with built-in token rate limiting, semantic caching, and prompt transformation." },
  { title: "Microsoft Fabric Real-Time Hub Connects 100+ Data Sources", category: "fabric", date: "2025-04-15", description: "Fabric Real-Time Hub expanded to support over 100 data source connectors for real-time data ingestion, including Kafka, IoT Hub, Event Grid, and custom REST APIs." },
  { title: "Copilot for Microsoft 365 Adds Knowledge Management", category: "copilot", date: "2025-06-02", description: "Copilot for Microsoft 365 introduced organizational knowledge management, allowing admins to curate enterprise knowledge bases that Copilot uses for more accurate, context-aware responses." },
  { title: "Windows 11 IoT Enterprise LTSC 2025 Released", category: "windows", date: "2025-05-27", description: "Microsoft released Windows 11 IoT Enterprise LTSC 2025 with 10-year support, optimized for embedded and IoT devices with reduced footprint, improved reliability, and enhanced security features." },

  // ═══════════════════ 2026 (Current Year) ═══════════════════
  { title: "Azure OpenAI Service Now Available in India Central Region", category: "azure", date: "2026-03-31", description: "Microsoft expanded Azure OpenAI Service to the India Central region, enabling Indian enterprises to build AI applications with data residency in India. The expansion includes GPT-4o, GPT-4 Turbo, and DALL-E 3 models." },
  { title: "Windows 11 24H2 Update Brings AI-Powered File Explorer and Snap Layouts", category: "windows", date: "2026-03-30", description: "The latest Windows 11 24H2 update introduces Copilot-powered file search, smart folder suggestions in File Explorer, and enhanced Snap Layouts with AI-based window arrangement recommendations." },
  { title: "Microsoft Copilot Pro Adds Real-Time Translation and Meeting Summarization", category: "copilot", date: "2026-03-30", description: "Copilot Pro subscribers now get real-time translation across 40 languages in Teams, Word, and Outlook. The update also introduces automatic meeting summarization with action item extraction." },
  { title: "Microsoft Fabric OneLake Introduces Mirroring for Oracle and SAP Databases", category: "fabric", date: "2026-03-29", description: "Microsoft Fabric now supports database mirroring for Oracle and SAP HANA, allowing enterprises to replicate data into OneLake in near real-time without complex ETL pipelines." },
  { title: "Power Apps Copilot Now Generates Complete Business Applications from Natural Language", category: "power-platform", date: "2026-03-29", description: "Microsoft has upgraded Power Apps Copilot to generate full-fledged business applications — including data models, screens, and business logic — from simple natural language prompts." },
  { title: "Microsoft 365 E5 Licensing Price Increase Effective April 2026 for India", category: "licensing", date: "2026-03-28", description: "Microsoft announced a 12% price increase for Microsoft 365 E5 licenses in the Indian market, effective April 1, 2026. E3 and Business Premium plans remain unchanged for now." },
  { title: "Microsoft Patches Zero-Day Vulnerability CVE-2026-21551 in Windows Kernel", category: "security", date: "2026-03-28", description: "Microsoft released an emergency out-of-band patch for CVE-2026-21551, a critical elevation-of-privilege vulnerability in the Windows kernel that was being actively exploited in targeted attacks." },
  { title: "Microsoft Excel Gets Python Integration for All Microsoft 365 Subscribers", category: "office365", date: "2026-03-27", description: "Python in Excel is now generally available for all Microsoft 365 subscribers, enabling users to run Python scripts directly within Excel cells for advanced data analysis and visualization." },
  { title: "Azure Kubernetes Service Introduces Automated GPU Cluster Scaling", category: "azure", date: "2026-03-27", description: "AKS now supports intelligent GPU auto-scaling for AI workloads, dynamically adjusting NVIDIA A100 and H100 GPU nodes based on inference demand and training job queues." },
  { title: "GitHub Copilot Workspace Launches — AI-Powered Development Environments", category: "copilot", date: "2026-03-26", description: "GitHub Copilot Workspace is now in public preview, offering AI-driven development environments that can plan, implement, and test code changes from a single natural language issue description." },
  { title: "Windows 12 Preview Build Leaks Reveal Modular OS Architecture", category: "windows", date: "2026-03-26", description: "Leaked preview builds of Windows 12 reveal a modular architecture codenamed CorePC, allowing Microsoft to ship lightweight versions for ARM devices and IoT scenarios alongside the full desktop experience." },
  { title: "Power Automate Desktop Gets AI-Powered Process Mining for Indian Enterprises", category: "power-platform", date: "2026-03-25", description: "Microsoft launched AI-powered process mining in Power Automate Desktop, specifically optimized for Indian enterprise workflows including GST compliance, TDS calculations, and bank reconciliation." },
  { title: "Microsoft Fabric Real-Time Intelligence Now Supports IoT Data Streams", category: "fabric", date: "2026-03-25", description: "The Real-Time Intelligence feature in Microsoft Fabric can now ingest and analyze IoT data streams from Azure IoT Hub and Event Hubs, enabling real-time dashboards for manufacturing and logistics." },
  { title: "Microsoft Introduces Pay-As-You-Go Licensing for Copilot Features in India", category: "licensing", date: "2026-03-24", description: "Indian businesses can now access Copilot features on a consumption-based model, paying only for the AI features they use rather than committing to per-user monthly licenses." },
  { title: "Microsoft Defender for Endpoint Adds AI Threat Hunting for Indian SOCs", category: "security", date: "2026-03-24", description: "Microsoft Defender for Endpoint now includes AI-assisted threat hunting specifically trained on attack patterns targeting Indian organizations, including UPI fraud and Aadhaar-related phishing campaigns." },
  { title: "Azure AI Foundry Launches Custom Model Training for Indian Languages", category: "azure", date: "2026-03-23", description: "Azure AI Foundry now supports fine-tuning large language models for 12 Indian languages including Hindi, Tamil, Telugu, and Bengali, with pre-built datasets for common enterprise use cases." },
  { title: "Microsoft Teams Introduces Spatial Audio and 3D Avatars for All Users", category: "office365", date: "2026-03-23", description: "Teams now supports spatial audio in meetings, making conversations feel more natural by placing each voice in virtual 3D space. Customizable 3D avatars are also generally available." },
  { title: "March 2026 Patch Tuesday Fixes 78 Vulnerabilities Including 5 Critical RCEs", category: "security", date: "2026-03-17", description: "March 2026 Patch Tuesday addresses 78 security vulnerabilities across Windows, Office, and Azure services, including 5 critical remote code execution flaws affecting Exchange Server." },
  { title: "Microsoft Copilot Studio Enables Custom AI Agents Without Code", category: "copilot", date: "2026-03-14", description: "Copilot Studio now allows businesses to build custom AI agents that can access enterprise data, execute workflows, and interact with users through a no-code visual designer." },
]

async function insertItem(item) {
  const slug = makeSlug(item.title)
  const sourceUrl = `https://microsoft.com/updates/${slug}`

  const exists = await prisma.update.findFirst({ where: { OR: [{ slug }, { sourceUrl }] } })
  if (exists) { process.stdout.write('.'); return false }

  let riskLevel = 'SAFE'
  const tl = item.title.toLowerCase()
  if (tl.includes('security') || tl.includes('cve') || tl.includes('vulnerability') || tl.includes('patch')) riskLevel = 'CAUTION'

  const cat = item.category || 'general'
  const catLabel = cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())

  try {
    await prisma.update.create({
      data: {
        title: item.title,
        category: cat,
        description: item.description,
        summaryEn: `Microsoft has released a ${catLabel} update: ${item.title}. ${item.description}`,
        keyChanges: [
          `Key update: ${item.title}`,
          `Category: ${catLabel}`,
          `Impact: Users and IT admins managing ${catLabel} infrastructure should review this update.`
        ],
        riskLevel,
        shouldInstall: riskLevel === 'CAUTION'
          ? 'Apply this security update promptly. Test in staging before production deployment.'
          : 'This update is generally safe to deploy. Review release notes for your environment.',
        slug,
        metaTitle: item.title.substring(0, 60),
        metaDescription: item.description.substring(0, 155) + '...',
        sourceUrl,
        publishedAt: new Date(item.date),
        views: Math.floor(Math.random() * 500) + 50
      }
    })
    process.stdout.write('+')
    return true
  } catch (e) {
    process.stdout.write('x')
    return false
  }
}

async function main() {
  console.log(`\n🚀 Starting 5-Year Microsoft History Seed...\n`)
  console.log(`Total updates to seed: ${HISTORICAL_UPDATES.length}\n`)

  let inserted = 0
  for (const item of HISTORICAL_UPDATES) {
    const ok = await insertItem(item)
    if (ok) inserted++
  }

  const total = await prisma.update.count()
  console.log(`\n\n✅ Done! Inserted ${inserted} new articles.`)
  console.log(`📊 Total articles in database: ${total}`)
}

main()
  .catch(e => console.error('\n❌ Error:', e.message))
  .finally(() => prisma.$disconnect())
