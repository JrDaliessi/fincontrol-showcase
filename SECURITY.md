# Security Policy

## Public showcase rules

This repository is a sanitized public showcase of a private development project.

The following content must never be committed here:

- `.env`, `.env.local` or environment files containing values;
- Supabase service-role keys or other privileged credentials;
- API tokens, passwords, cookies or private keys;
- personal financial data or production database exports;
- `.codex/` logs or `.codex-remote-attachments/`;
- `.vercel/` local metadata;
- private operational documentation that exposes infrastructure details unnecessarily.

Only placeholder environment variable names belong in `.env.example`.

If a credential is ever committed, removing the file in a later commit is not sufficient. The credential must be revoked/rotated and the Git history reviewed before the repository is considered safe again.
