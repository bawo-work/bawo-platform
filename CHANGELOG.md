# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.6.1] - 2026-01-30

### Added

### Fixed
- add correct logo


## [0.6.0] - 2026-01-30

### Added
- add production landing page with logo integration

### Fixed


## [0.5.0] - 2026-01-28

### Added
- complete Sprint 5 client dashboard (Batch 4-5)
- implement Sprint 5 client dashboard (Batch 1-3)

### Fixed


## [0.4.0] - 2026-01-28

### Added
- implement Sprint 4 payment infrastructure with Celo

### Fixed


## [0.3.0] - 2026-01-28

### Added
- implement Sprint 3 core worker flow

### Fixed


## [0.2.0] - 2026-01-28

### Added
- implement worker onboarding flow with MiniPay and verification

### Fixed


## [0.1.0] - 2026-01-28

### Added
- initialize Next.js 14 app with complete Sprint 1 setup

### Fixed

## [Unreleased]

## [Sprint 3] - 2026-01-28

### Added
- Sentiment analysis task type with 3-option selector (Positive/Negative/Neutral)
- Text classification task type with dynamic category lists
- Task timer component with visual warnings (yellow <10s, red pulsing <5s)
- Complete task submission flow with instant validation
- Golden task QA system with 10% injection rate
- Worker accuracy tracking and reputation tier system (newcomer/bronze/silver/gold/expert)
- Basic FIFO task assignment algorithm
- Task detail page at `/tasks/[id]` with full flow integration
- `useTaskTimer` hook for timer state management
- 32 new unit tests (78 total, 100% pass rate)
- Custom Bawo color palette in Tailwind (warm-white, cream, teal, terracotta, money-gold)

### Changed
- Updated vitest config to use jsdom environment for React component testing
- Enhanced Tailwind config with complete Bawo design system colors

### Technical
- Task logic: sentiment, classification, validation, golden tasks, assignment
- Worker accuracy tracking with reputation scoring
- Task API operations (submit, fetch, assign)
- 5 new task components (SentimentSelector, CategorySelector, TaskContent, TaskTimer, TaskResult)
- Bundle size: ~150-180kb gzipped (within target)

