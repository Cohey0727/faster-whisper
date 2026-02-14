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

echo "Downloading VRoid sample avatar (AvatarSample_B.vrm)..."
curl -L -o "${MODEL_PATH}" \
  "https://raw.githubusercontent.com/madjin/vrm-samples/master/vroid/stable/AvatarSample_B.vrm"

echo "Model downloaded to ${MODEL_PATH}"
