#!/bin/bash

# 智者资料库格式检查工具
# 作用：检查现有文档是否符合格式规范
# 使用：bash 格式检查脚本.sh

echo "=== 智者资料库格式检查 ==="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 统计变量
total_files=0
issues_found=0

# 检查函数
check_file() {
    local file=$1
    local filename=$(basename "$file")
    local issues=0

    echo "检查: $filename"

    # 检查1: 文件名格式
    if [[ ! "$filename" =~ ^[0-9]{2}-.+\.md$ ]]; then
        echo -e "  ${YELLOW}⚠️  文件名格式不符合规范${NC}"
        ((issues++))
    else
        echo -e "  ${GREEN}✓ 文件名格式正确${NC}"
    fi

    # 检查2: 是否有中文标题
    if grep -q "^# [^#]" "$file" 2>/dev/null; then
        echo -e "  ${GREEN}✓ 有一级标题${NC}"
    else
        echo -e "  ${RED}✗ 缺少一级标题${NC}"
        ((issues++))
    fi

    # 检查3: 是否有英文标题
    if grep -q "^## [^#].*|" "$file" 2>/dev/null; then
        echo -e "  ${GREEN}✓ 有英文标题${NC}"
    else
        echo -e "  ${YELLOW}⚠️  缺少英文标题（生卒年）${NC}"
        ((issues++))
    fi

    # 检查4: 是否有引用块
    if grep -q "^> " "$file" 2>/dev/null; then
        echo -e "  ${GREEN}✓ 有引用块${NC}"
    else
        echo -e "  ${YELLOW}⚠️  缺少引用块（名言）${NC}"
        ((issues++))
    fi

    # 检查5: 是否有分隔线
    if grep -q "^---$" "$file" 2>/dev/null; then
        echo -e "  ${GREEN}✓ 有分隔线${NC}"
    else
        echo -e "  ${YELLOW}⚠️  缺少分隔线${NC}"
        ((issues++))
    fi

    # 检查6: 是否有资料来源
    if grep -q "资料来源\|原始来源\|资料来源：" "$file" 2>/dev/null; then
        echo -e "  ${GREEN}✓ 有资料来源${NC}"
    else
        echo -e "  ${YELLOW}⚠️  缺少资料来源${NC}"
        ((issues++))
    fi

    # 检查7: 是否有表格
    if grep -q "^|" "$file" 2>/dev/null; then
        echo -e "  ${GREEN}✓ 有表格${NC}"
    else
        echo -e "  ${YELLOW}⚠️  缺少表格（可能需要著作列表）${NC}"
        ((issues++))
    fi

    echo ""
    ((total_files++))
    if [ $issues -gt 0 ]; then
        ((issues_found+=issues))
    fi
}

# 遍历所有智者目录
echo "正在检查所有文档..."
echo ""

for dir in */; do
    if [ "$dir" != "00-" ] && [ -d "$dir" ]; then
        echo "=== $dir ==="
        for file in "$dir"*.md; do
            if [ -f "$file" ]; then
                check_file "$file"
            fi
        done
    fi
done

# 检查模板文件
echo "=== 00-模板文件 ==="
for file in 00-模板文件/*.md; do
    if [ -f "$file" ]; then
        check_file "$file"
    fi
done

# 总结
echo "=== 检查总结 ==="
echo -e "总文件数: ${GREEN}$total_files${NC}"
echo -e "发现问题: ${YELLOW}$issues_found${NC}"

if [ $issues_found -eq 0 ]; then
    echo -e "${GREEN}✓ 所有文件格式检查通过！${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  发现 $issues_found 个格式问题，请查看上方详情${NC}"
    exit 1
fi
