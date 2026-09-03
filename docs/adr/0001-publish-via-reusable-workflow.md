# Publish via a reusable workflow, not a tag-push trigger

The release tag is pushed by "Update assets" using the default `GITHUB_TOKEN`, and GitHub deliberately suppresses workflow triggers for such pushes to prevent recursion, so an `on: push: tags` publish workflow would never fire. We call `publish.yml` as a reusable workflow (`workflow_call`) instead of pushing the tag with a personal access token or GitHub App credential, to avoid maintaining a long-lived secret that can write to `main`.

The tag is still load-bearing: it is passed to `publish.yml` as an input and checked out there, so the published tarball is exactly what `vX.Y.Z` points at.
