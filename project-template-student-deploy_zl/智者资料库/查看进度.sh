#!/bin/bash

echo "=== 智者资料库文件统计 ==="
echo ""

for dir in */; do
    if [ "$dir" != "" ]; then
        count=$(find "$dir" -name "*.md" -type f | wc -l)
        echo "📁 ${dir%/}: $count 个文件"
    fi
done

echo ""
echo "=== 总计 ==="
total=$(find . -name "*.md" -type f | wc -l)
echo "共 $total 个文档"

echo ""
echo "=== 文件类型分布 ==="
intro=$(find . -name "01-*.md" -type f | wc -l)
source=$(find . -name "02-*.md" -type f | wc -l)
cognitive=$(find . -name "03-*.md" -type f | wc -l)
personality=$(find . -name "04-*.md" -type f | wc -l)

echo "01-智者介绍: $intro"
echo "02-原始资料: $source"
echo "03-认知方式: $cognitive"
echo "04-人格卡: $personality"
