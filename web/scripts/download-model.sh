#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MODEL_DIR="${SCRIPT_DIR}/../public/models"
BASE_URL="https://raw.githubusercontent.com/madjin/vrm-samples/master/vroid/stable"

mkdir -p "${MODEL_DIR}"

download_model() {
  local filename="$1"
  local source="$2"
  local dest="${MODEL_DIR}/${filename}"

  if [ -f "${dest}" ]; then
    echo "Already exists: ${filename}"
    return
  fi

  echo "Downloading ${source} -> ${filename}..."
  curl -L -o "${dest}" "${BASE_URL}/${source}"
  echo "Downloaded: ${filename}"
}

download_model "avatar_A.vrm" "AvatarSample_A.vrm"
download_model "avatar_B.vrm" "AvatarSample_B.vrm"
download_model "avatar_C.vrm" "AvatarSample_C.vrm"

# Keep backward compatibility: symlink avatar.vrm -> avatar_A.vrm
if [ ! -f "${MODEL_DIR}/avatar.vrm" ] && [ -f "${MODEL_DIR}/avatar_A.vrm" ]; then
  ln -s "avatar_A.vrm" "${MODEL_DIR}/avatar.vrm"
  echo "Created symlink: avatar.vrm -> avatar_A.vrm"
fi

echo "All models ready in ${MODEL_DIR}"
