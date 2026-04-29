# Baja 411 Product Ideas

This file stores product ideas, community feedback, and future feature concepts that are not ready to become engineering tasks yet.

Use this file for ideas that need validation, provider conversations, or product thinking before they become GitHub issues or Codex tasks.

## How to use this file

Every idea should be framed in this order:

1. End user first
2. CEO/business strategy second
3. Engineer execution third

Do not turn an idea into code until the user value and business value are clear.

---

## Water and propane delivery scheduling

### Source

Community feedback from a Cerritos Beach Facebook post asked what happened to the person building an app for water delivery and propane.

### User problem

People in Baja regularly need water and propane delivery. Finding the right provider, confirming service area, checking availability, and scheduling delivery is often handled through scattered Facebook posts, WhatsApp threads, word of mouth, or outdated listings.

### End user value

A user should be able to:

1. Open Baja 411.
2. Search or tap Water or Propane.
3. Find trusted local providers.
4. Call or WhatsApp immediately.
5. Eventually request or schedule delivery from inside Baja 411.

This helps users find, contact, navigate, trust, and stay informed around a recurring practical need.

### Business strategy value

Water and propane are high-frequency local utility needs. They are strong repeat-use cases for Baja 411 because residents, travelers, and expats need them repeatedly, not once.

This could strengthen Baja 411 as the practical local intel hub, especially if provider info is verified and kept current.

### Start simple

Do not build full scheduling first.

First steps:

1. Add water and propane providers to the business directory.
2. Include call and WhatsApp buttons.
3. Capture service area, hours, delivery notes, and last verified date.
4. Talk to providers about whether they want delivery requests or scheduling through Baja 411.

### Later scheduling layer

Only after provider interest is validated, consider:

1. Request delivery.
2. Choose water or propane.
3. Provide location or map pin.
4. Choose preferred time/window.
5. Provide contact info.
6. Send provider confirmation via WhatsApp, email, or admin dashboard.

### Engineering note

This should not become a Codex task until provider workflow is understood.

Likely first engineering step later:

Business directory categories and provider detail fields for water/propane, not full scheduling.

---

## Local Directory data intake

Community feedback is already showing strong demand for practical local information.
This includes water, propane, SAPA, licenses, medical resources, tow trucks, mechanics, package receiving, home services, boat services, and local entertainment.
The first priority is collecting useful and verified directory data.
Do not build advanced submission workflows until intake fields are validated.
Start with manual and CSV intake.
Later consider a public Suggest a listing form.

## Sign-in page redesign

### Source

User feedback during Baja411 workflow.

### Problem

The sign-in page works but looks weaker than the rest of the current product direction.

### User value

A cleaner sign-in page should make adding pins and contributing feel trustworthy, simple, and app-like.

### Business value

Better sign-in UX supports community contribution, directory growth, map pins, and email opt-in.

### Start simple

Do not redesign now.
Later task should redesign `/signin` visually without changing auth behavior.

### Engineering note

Future task should edit only `baja411/app/signin/page.tsx` and related styling if needed. It should not touch NextAuth, Nodemailer, Prisma, database schema, or opt-in behavior unless explicitly requested.


## Rules & Permits

Community feedback showed demand for official answers, such as fishing regulations, FMM/visitor permits, licenses, public services, roadside help, and other rules.

The first version adds official-source starter cards for fishing, FMM, emergency number, Ángeles Verdes, pet entry, and temporary vehicle import permits.

Future content must include official source links and last-checked dates.
Do not publish unsourced legal, immigration, fishing, driving, or government-rule claims.
