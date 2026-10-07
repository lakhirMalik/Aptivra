# Aptivra API and Runner Contract (A2, Week 4)

## Document states

`queued`, `scanning`, `extracting`, `ready`, `needs_clarification`, `failed_unsafe`, `failed_unreadable`, `expired`

## Requirement result

`evidenced`, `uncertain`, `not_shown`, `unassessed`. Never a hire probability. Coverage always shows denominator and criteria version.

## Laravel to Python runner (stdin JSON)

```json
{
    "operation_id": "uuid",
    "document_id": 1,
    "path": "quarantine/ab12.pdf",
    "format": "pdf",
    "limits": { "max_pages": 10, "max_bytes": 5242880, "timeout_s": 60 }
}
```

## Runner to Laravel (stdout JSON)

```json
{
    "operation_id": "uuid",
    "status": "ready",
    "pages_total": 2,
    "pages_processed": 2,
    "mismatch_ratio": 0.0,
    "passages": [
        { "id": "p1-3", "page": 1, "source": "native", "text": "..." }
    ],
    "fields": {
        "name": "",
        "email": "",
        "skills": [],
        "experience": [],
        "education": [],
        "projects": []
    },
    "flags": ["hidden_text"],
    "error": null
}
```

Rules: runner has no DB credentials or app secrets. Laravel validates the schema, rechecks that the document has not expired or been withdrawn, then saves. Partial pages (`pages_processed < pages_total`) never produce a full-document result.

## Routes (Laravel, all behind auth and policies unless noted)

| Cap | Method and path                                                                           | Purpose                          |
| --- | ----------------------------------------------------------------------------------------- | -------------------------------- |
| C01 | POST /register, /login, /logout                                                           | Account                          |
| C01 | POST /organizations; POST /organizations/{o}/members                                      | Org and members                  |
| C01 | PATCH /admin/organizations/{o}/approval                                                   | Admin approve/suspend            |
| C02 | GET /jobs; GET /jobs/{v}                                                                  | Public browsing                  |
| C02 | POST /orgs/{o}/vacancies; POST /vacancies/{v}/versions; POST /vacancies/{v}/publish       | Versioned vacancy                |
| C03 | POST /documents                                                                           | Upload to quarantine             |
| C03 | GET /documents/{d}                                                                        | State and passages               |
| C04 | GET /documents/{d}/comparison?role= or ?vacancy=                                          | Requirement results              |
| C04 | POST /documents/{d}/amendments                                                            | Recorded correction              |
| C05 | POST /preparation/reports                                                                 | One-off report (reserves credit) |
| C05 | GET /preparation/reports/{r}/download                                                     | Free download                    |
| C05 | GET /practice/questions?role=; POST /practice/attempts                                    | Private practice                 |
| C06 | POST /preparation/saved; DELETE /preparation/saved/{s}; POST /preparation/saved/{s}/renew | Saved versions                   |
| C06 | GET /preparation/compare?a=&b=                                                            | Side-by-side                     |
| C07 | POST /vacancies/{v}/applications                                                          | Submit snapshot                  |
| C07 | DELETE /applications/{a}                                                                  | Withdraw                         |
| C07 | GET /orgs/{o}/applications; GET /applications/{a}                                         | Org-scoped directory             |
| C07 | POST /applications/{a}/reviews; POST /applications/{a}/decisions                          | Human review                     |
| C08 | POST /orgs/{o}/assessments; POST /assessments/{a}/publish                                 | Authoring                        |
| C08 | POST /assessments/{a}/invitations                                                         | Invite                           |
| C08 | POST /attempts/{t}/start, /answers, /submit                                               | Timed attempt (idempotency key)  |
| C08 | POST /attempts/{t}/grade; POST /attempts/{t}/release                                      | Grading and release              |
| C09 | POST /applications/{a}/interviews; PATCH and DELETE /interviews/{i}                       | Schedule, reschedule, cancel     |
| C10 | GET /notifications; POST /notifications/{n}/read                                          | In-app                           |
| C10 | PUT /alerts                                                                               | Opt-in job alert filters         |
| C11 | GET /plan; POST /plan/upgrade                                                             | Allowances and demo upgrade      |
| C12 | GET /privacy/export; DELETE /privacy/data                                                 | Export and delete                |
| C12 | GET /admin/audit; GET /admin/reports                                                      | Audit and ops (admin)            |

Every route: policy check, rate limit, audit event. Slow work goes to the queue and returns an operation id.
