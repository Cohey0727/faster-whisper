#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MODEL_DIR="${SCRIPT_DIR}/../public/models"
MODEL_PATH="${MODEL_DIR}/avatar.vrm"

if [ -f "${MODEL_PATH}" ]; then
  echo "Model already exists at ${MODEL_PATH}"
  exit 0
fi

mkdir -p "${MODEL_DIR}"

echo "Downloading sample VRM model..."
curl -L -o "${MODEL_PATH}" \
  "https://github.com/pixiv/three-vrm/raw/dev/packages/three-vrm/examples/models/VRM1_Constraint_Twist_Sample.vrm"

echo "Model downloaded to ${MODEL_PATH}"
