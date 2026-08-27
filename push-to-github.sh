#!/usr/bin/env bash
set -euo pipefail

# استخدام:
# ./push-to-github.sh https://github.com/اسم_المستخدم/AchriDZ-Marketplace.git

if [ $# -lt 1 ]; then
  echo "⚠️  يرجى تمرير رابط مستودعك على GitHub كمعامل، مثال:"
  echo "    ./push-to-github.sh https://github.com/username/AchriDZ-Marketplace.git"
  exit 1
fi

REPO_URL="$1"

echo "🇩🇿 جاري إعداد ودفع مشروع AchriDZ (69 ولاية - الخيار أ) إلى GitHub..."
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
git push -u origin main --force

echo "✅ تم رفع المشروع بنجاح إلى: $REPO_URL"
