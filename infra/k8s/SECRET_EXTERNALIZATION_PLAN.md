# Secret Externalization Plan

This plan moves runtime secrets out of Kubernetes manifests and git-managed files.

## Current State

- Dev overlay uses inline `Secret` (`overlays/dev/server-secret.yaml`).
- Prod overlay uses `secretGenerator` from ignored local file (`overlays/prod/secrets/server-secrets.env`).

This is acceptable as an interim baseline, but production should pull secrets from a managed secret store.

## Target State

- Secrets live in an external manager (AWS Secrets Manager or HashiCorp Vault).
- Kubernetes receives secrets through an operator (External Secrets Operator) or CSI driver.
- No plaintext secret values in git.
- Rotation is performed in the secret manager without manual manifest edits.

## Migration Phases

1. Bootstrap external secret manager
- Create secret path/key for `JWT_SECRET`.
- Scope IAM permissions to the app namespace/workload only.

2. Install sync mechanism
- Install External Secrets Operator in cluster.
- Define `SecretStore`/`ClusterSecretStore` for the cloud account.

3. Replace generated secret
- Create `ExternalSecret` named `closecount-server-secrets`.
- Map remote secret key to `JWT_SECRET`.
- Remove `secretGenerator` usage from prod overlay.

4. Rotation and rollback
- Rotate `JWT_SECRET` in manager during maintenance window.
- Roll deployments to pick up new secret values.
- Keep rollback version in manager with strict retention policy.

5. Policy and audit controls
- Add admission policy blocking literal `Secret` `stringData` in prod namespaces.
- Enable access audit logging for secret reads.

## Operational Checklist

- [ ] Secret manager selected and provisioned.
- [ ] IAM role/service account binding implemented.
- [ ] External secret CRDs installed.
- [ ] Prod overlay switched from `secretGenerator` to `ExternalSecret`.
- [ ] Rotation runbook documented and tested.
