# Mockly — 1-Page PRD

> Wedge validated 2026-07-21 (research/2026-07-21-ai-mockup-audit-tool-market-research.md → GO).
> P0 landing + free mockup audit built and deployed. This PRD locks the product decision before MVP.

---

## 1. Problem
E-commerce and print-on-demand (POD) sellers win or lose on **product imagery** — 67% of consumers say images influence purchase more than the description, and listings with 5+ images convert ~50% better. Yet most sellers can't tell *whether their mockups are actually good, compliant, and differentiated*. The image-generator market (Photoroom/Pebblely/Flair/Claid) is a red ocean of "generate more images" — but **nobody tells the seller if what they have is working**. POD shops especially all pull from the same Placeit template library, so identical mockups blend in and get scrolled past.

## 2. Wedge (decided)
**The audit + recommendation layer for product images** — a free "Mockup & Listing-Image Audit" that scores five signals buyers respond to (image count, lifestyle-vs-flat ratio, marketplace compliance, template-clone risk, conversion readiness), then **upsells AI regeneration of weak mockups into unique, compliant scenes**.
- Avoids the generation red ocean: we sit *above* it as the trusted evaluator, then hand off to generation (our own or white-labeled).
- **Complements Listora**: Listora audits listing *text*, Mockly audits listing *images* → together a "complete listing optimizer" cross-sell.
- Horizontal image generators are funded and full-feature; we don't beat them at generation, we own the *judgment* layer they ignore.

## 3. Target user
E-commerce / POD sellers on Etsy, Amazon, Shopify, eBay. Core paying segment = the ~900k "serious" Etsy sellers + millions of Shopify/POD sellers (Printful/Printify, t-shirts/mugs/posters). Non-technical, high SKU counts, thin margins → image cost & differentiation directly move conversion.

## 4. Product
- **Input**: a few clicks describing the current image setup (platform, image count, lifestyle count, hero style, template usage, shadows, resolution).
- **Output**: **0–100 mockup health score** + five-dimension breakdown + prioritized fix list (free, P0 built).
- **Paid upsell**: one-click "regenerate this mockup" → unique AI scene (lifestyle/on-model/ghost-mannequin), marketplace-compliant, 300 DPI.
- **Funnel**: free on-page Audit (built, P0) → N free regenerations → paid for unlimited / bulk catalog mode.

## 5. MVP scope (Next.js + Supabase + image model)
- Mockup-generation API (image model, single-gen cost **<$0.05**; text-audit stays free/client-side).
- Reuse P0 audit as top-of-funnel lead magnet.
- Email/waitlist capture (Formspree free tier; Supabase for MVP).
- Dashboard: describe → audit → regenerate weak image → download, with score before/after.
- **Out of MVP**: full virtual-model video, physical-goods photography, multi-platform auto-distribution, Chinese cross-border.

## 6. Business model (to validate)
Freemium. Free audit + a few free regenerations; paid unlocks unlimited + bulk/catalog mode.
Industry benchmark pricing exists at $4.99–$82.50/mo (Photoroom) and $19/mo (Vaybel full POD workflow); we anchor mid-low ($9–19/mo) for the audit+regen bundle, then tier up with bulk/catalog features.

## 7. Validation gate (must clear before MVP build)
Deploy landing → run traffic ~2 weeks. Proceed to MVP **only if**:
- **≥ 200 audits run**, AND
- **≥ 50 email subscribers**.
Otherwise: iterate on message/wedge, do not build MVP yet.

## 8. Success metrics
1. Traffic (unique visitors to landing)
2. Audit runs (activation)
3. Email subscribers (intent)
4. (post-MVP) Regeneration usage & paid conversion / MRR

## 9. Risks & mitigations
- **Generation competition**: stay the evaluator; partner/white-label generation rather than out-spend funded incumbents.
- **Marketplace ToS**: independent tool, never asks for marketplace login; clear "not affiliated" disclaimer.
- **Image-model cost/quality**: cap generations, cache, use cheap model; quality gate on output (no halo/flat shadows).
- **AI-content compliance**: mark AI-generated images; follow platform labeling rules (67% of consumers expect disclosure).

## 10. Next actions
- [x] P0 landing + free mockup audit (built + deployed 2026-07-21)
- [ ] Deploy + 2-week traffic validation (gate)
- [ ] P2 MVP dev (gated)
- [ ] P2 acquisition content (Xiaohongshu / YouTube / Reddit, leveraging zc's accounts)
