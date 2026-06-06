/**
 * Female wise persons data module.
 *
 * Provides the list of female wise person slugs and a helper
 * to filter the full wise person list by gender.
 */
import { getAllWisePersons } from "@/lib/data/wise-persons-combined"
import type { WisePerson } from "@/types"

export const FEMALE_WISE_SLUGS: string[] = [
  "andrea-k-hler-ludescher",  // 安德烈娅·克勒-卢德舍
  "mary-catherine-bateson",  // 玛丽·凯瑟琳·贝特森
  "betty-jean-craige",  // 贝蒂·琼·克雷格
  "a-69962eac",  // 琳达·利尔
  "a-5c5779cd",  // 蕾切尔·卡森
  "robin-marantz-henig",  // 罗宾·马兰茨·赫尼格
  "a-1e6513b5",  // 西蒙娜·波伏瓦
  "gemelli-giuliana",  // 杰梅利·朱利亚娜
  "a-837abfe0",  // 安妮特·拉鲁
  "a-fc92af23",  // 珍妮特·洛尔
  "a-7f26bb2e",  // 西尔维娅·娜萨
  "a-3d11a5fe",  // 维维安娜·泽利泽
  "a-ba66ca70",  // 伊丽莎白·扬-布鲁尔
  "a-14353eb5",  // 汉娜·阿伦特
  "margaret-m-caffrey",  // 玛格丽特·M·卡弗里
  "a-f38fd28b",  // 玛格丽特·米德
  "a-10e00af9",  // 玛吉特·冯·米塞斯
  "a-96da4c3b",  // 玛丽安妮·韦伯
  "a-45399c65",  // 玛丽·鲍曼-克鲁姆
  "a-471bac0c",  // 玛丽·道格拉斯
  "a-dd5f2caa",  // 鲁思·本尼迪克特
  "a-78c9b5b4",  // 苏珊·菲斯克
  "a-3a579f4d",  // 伊莱恩.碧柯
  "a-96d9c8e2",  // 伊丽莎白·哈斯·埃德莎姆
  "a-6004314e",  // 艾莉森·高普尼克
  "a-789b603b",  // 阿莉·拉塞尔·霍赫希尔德
  "a-4029c6cc",  // 贝丝妮·索特曼
  "catherine-m-rakow",  // 凯瑟琳·拉科夫
  "a-a931ca71",  // 朱迪斯·巴特勒
  "a-d98a3988",  // 玛拉·塞尔维尼-帕拉佐利
  "a-0fe3ca3a",  // 玛莎·努斯鲍姆
  "a-f3d16d2a",  // 玛丽·安斯沃思
  "roberta-m-gilbert",  // 罗伯塔·吉尔伯特
  "a-a0e7ac5f",  // 罗斯.安妮.肯尼
  "a-7b51420b",  // 朱瑟琳·乔塞尔森
  "a-f2f39045",  // 桑德拉·斯米特
  "sue-erikson-bloland",  // 苏·埃里克森·布罗兰
  "a-309ef52c",  // 苏·约翰逊
  "a-2a52b866",  // 乌莎·戈斯瓦米
  "a-0ef009c1",  // 维吉尼亚·萨提亚
  "agneta-rahikainen",  // 阿格尼塔·拉希凯宁
  "agnieszka-gajewska",  // 阿涅什卡·加耶夫斯卡
  "claire-tomalin",  // 克莱尔·托马林
  "cynthia-l-haven",  // 辛西娅·哈文
  "a-d4054e80",  // 伊迪特·索德格朗
  "a-9fbc9940",  // 埃莉诺.吉布森
  "a-b834b176",  // 艾米莉·狄金森
  "fay-fransella",  // 费伊·弗兰塞拉
  "a-8fb1ff0d",  // 伊莱娜·内米洛夫斯基
  "a-24eca6ae",  // 奥斯丁
  "a-ae668101",  // 莉莎·费德曼·巴瑞特
  "a-c70f1774",  // 赛琳娜·黑斯廷斯
  "a-b1918000",  // 弗吉尼亚·伍尔夫
  "a-ea78b3e8",  // 埃丝特.史坦伯格
  "francine-mary-netter",  // 弗朗辛·玛丽·内特
  "marjorie-e-weishaar",  // 玛乔丽·韦沙尔
  "a-7815682d",  // 菲洛梅娜·布鲁伊森
  "a-14c25d8c",  // 莎拉·戈德哈根
  "a-952e8bc8",  // 温迪·伍德
]

const femaleSlugSet = new Set(FEMALE_WISE_SLUGS)

/** Get all female wise persons from the combined data pool. */
export function getFemaleWisePersons(): WisePerson[] {
  return getAllWisePersons().filter((p) => femaleSlugSet.has(p.slug))
}
