#!/bin/bash

# 引数で指定されたGit タグ名でリリースできるかどうか
# ※GitHub CLI のアクセス権限等の設定が必要
#
# $1 -> Git タグ名

if gh release view $1 > /dev/null; then
  echo "$1 is already released!"
  exit 1
fi
