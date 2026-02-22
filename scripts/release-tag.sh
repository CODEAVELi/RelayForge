#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 vX.Y.Z"
  exit 1
fi

TAG="$1"

git tag "$TAG"
git push origin "$TAG"

echo "✅ Tagged and pushed $TAG (GitHub Actions will package artifacts)"
