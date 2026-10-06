# Aptivra Privacy and Quota Rules (A1, Week 1)

These are project policies for the prototype, not statutory requirements. Production use needs separate legal review.

## Retention
| Record | Rule |
|---|---|
| One-off preparation (CV, extracted content, practice attempts, unsaved reports) | Deleted 24 h after completion or failure. Limit shown before upload. Free report download. |
| Saved preparation history | Max 2 CV versions with reports. 90 days from explicit save or renewal. Page views do not renew. Warn before replacing. |
| Submitted application | While active, then 30 days after closure or withdrawal. Unresolved: expires 90 days after submission, then 30-day cleanup. Expiry is not rejection. |
| Account and preferences | Only necessary data. Closure revokes access immediately. Inactive 12 months: reviewed for deletion with advance notice. |
| Incomplete uploads | Hard upload and processing deadlines (set after Week 3 benchmark). |
| Derived files, caches, queues, backups | Explicit expiry each. |
| Audit and trial-use records | Separate minimal retention, no raw CV text. |

## Deletion behaviour
- Expiry blocks access immediately; cleanup removes source and derived content.
- Workers recheck deletion before saving output.
- Startup and restore-time cleanup handle overdue records before access resumes.
- Deleting optional history does not remove a separately retained application; its expiry is disclosed.
- Reuse offered only for an explicitly saved, unexpired CV.

## Data use
- Real CVs are not sent to external AI services.
- Uploads do not authorize research reuse or model training.
- Volunteers give consent. Identity links only by account, never by name or file hash.

## Quotas
| Who | Limit |
|---|---|
| Candidate | 3 completed one-CV/one-role reports per calendar month |
| Employer trial | 1 campaign, 1 reviewer seat, up to 25 applications in a 30-day intake window |
| Extra capacity | Second campaign or more than 25 applications requires (demo) upgrade |

## Credit and slot rules
- Credit reserved before work, consumed only when a usable report is delivered.
- Refresh, retry, or platform extraction correction costs nothing extra.
- Failed job stays recoverable without new charge, or is cancelled with a recorded release.
- Application slots reserved atomically; duplicates use one slot.
- Withdrawal or rejection does not refund the campaign allowance.
- Closing intake keeps accepted applications and issued tests.
- Renaming jobs or adding members does not reset a trial; trial ledger has its own retention.
- Rankings cannot be purchased. CV data is never sold.
