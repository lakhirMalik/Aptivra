# M1 Feasibility Decision (Week 4)

## Measured on development laptop (i5-5300U, 8 GB RAM, no GPU)

| Item                                 | Result                                                                                                   |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Rules-only extraction on 10 fixtures | Statuses 10/10 correct; name, email, skills, experience precision and recall 1.00 on clean synthetic CVs |
| Native text, PDF/DOCX                | about 0.01 s per file                                                                                    |
| OCR (PDFium + Tesseract)             | 0.7 to 2.7 s per CV; DOCX adds LibreOffice conversion (6.7 s first run)                                  |
| ClamAV scan                          | 22.8 s for 10 files, about 1 GB peak RAM                                                                 |
| Hidden-text CV                       | Flagged (about 25% of native words missing from OCR; threshold 10%)                                      |
| Corrupted PDF                        | Reaches `failed_unreadable`                                                                              |
| Scanned PDF                          | Read through OCR                                                                                         |

Limit: fixtures are clean and synthetic, so 1.00 scores show the pipeline works, not general accuracy.

## Not yet measured

Local model (Qwen3-4B-Instruct-2507, Q4_K_M, llama.cpp): speed and memory. Moved to the deployment server because the application will run on a cloud server, not the laptop.

## Decision: conditional GO

- Document pipeline (upload, scan, extract, OCR, mismatch check): feasible, proceed.
- Model: benchmark on the server (target 8 GB RAM) before M2 ends. Proposed acceptance (to confirm with supervisor): peak total memory fits with one heavy task at a time, and per-CV latency is acceptable for a queued job.
- Fallbacks in order: Qwen3-1.7B, then rules-only extraction with model used only for explanations. Any core scope change is raised with the supervisor first.
- One heavy task at a time: ClamAV, OCR/LibreOffice and the model never run concurrently.

## Deviations to report to supervisor

1. Deployment on a cloud server (AWS free plan) instead of a local installation only.
2. Hosting cost and credits: any paid use needs a spending limit and approval.
3. Real CVs are not used on the server; demos use fictional fixtures.
