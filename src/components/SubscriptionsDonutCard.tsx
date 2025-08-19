// src/components/SubscriptionsDonutCard.tsx
import {
  Box,
  Grid,
  HStack,
  Text,
  useToken,
} from "@chakra-ui/react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

type Slice = { name: string; amount: number; pct: number; color: string };

const RAW: Slice[] = [
  { name: "Netflix (Premium)",      amount: 1199,   pct: 35.69, color: "red.400" },
  { name: "Мобильная связь (МТС)",  amount: 650,    pct: 19.35, color: "teal.400" },
  { name: "PlayStation Plus Extra", amount: 599.92, pct: 17.86, color: "purple.500" },
  { name: "GitHub Pro",             amount: 380,    pct: 11.31, color: "pink.400" },
  { name: "Яндекс Плюс",            amount: 299,    pct: 8.90,  color: "cyan.400" },
  { name: "iCloud+ (200 ГБ)",       amount: 149,    pct: 4.43,  color: "orange.400" },
  { name: "Продление домена .ru",   amount: 82.5,   pct: 2.46,  color: "gray.500" },
];

const TOTAL = 2980;

export default function SubscriptionsDonutCard() {
  const fills = useToken("colors", RAW.map((s) => s.color));
  const chartData = RAW.map((s, i) => ({
    name: s.name,
    value: s.pct, // рисуем по долям
    amount: s.amount,
    pct: s.pct,
    fill: fills[i],
  }));

  const half = Math.ceil(RAW.length / 2);
  const leftList = RAW.slice(0, half);
  const rightList = RAW.slice(half);

  return (
    <Box bg="white" borderWidth="1px" rounded="md" p={5}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} alignItems="center">
        {/* 1/3 — пончик */}
        <Box position="relative" h="240px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="70%"
                outerRadius="90%"
                paddingAngle={2}
                isAnimationActive={false}
              >
                {chartData.map((d) => (
                  <Cell key={d.name} fill={d.fill} />
                ))}
              </Pie>
              <Tooltip
                cursor={false}
                formatter={(val: number, _n, p: any) => {
                  const pct = Number(val).toFixed(2) + "%";
                  const rub = Number(p.payload.amount).toLocaleString("ru-RU") + " ₽/мес";
                  return [`${rub} • ${pct}`, p.payload.name];
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* центр */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            textAlign="center"
            pointerEvents="none"
          >
            <Text textStyle="caption-1">{TOTAL.toLocaleString("ru-RU")} ₽</Text>
            <Text textStyle="caption-2" color="gray.500">Всего</Text>
          </Box>
        </Box>

        {/* 2/3 — подписи, две равные колонки */}
        <Box>
          {leftList.map((s) => (
            <HStack key={s.name} align="start" spacing={3} mb={3}>
              <Box boxSize="10px" rounded="full" bg={s.color} mt="6px" />
              <Box>
                <Text textStyle="caption-1">{s.name}</Text>
                <Text textStyle="caption-2" color="gray.600">
                  {s.amount.toLocaleString("ru-RU")} ₽ ({s.pct.toFixed(2)}%)
                </Text>
              </Box>
            </HStack>
          ))}
        </Box>

        <Box>
          {rightList.map((s) => (
            <HStack key={s.name} align="start" spacing={3} mb={3}>
              <Box boxSize="10px" rounded="full" bg={s.color} mt="6px" />
              <Box>
                <Text textStyle="caption-1">{s.name}</Text>
                <Text textStyle="caption-2" color="gray.600">
                  {s.amount.toLocaleString("ru-RU")} ₽ ({s.pct.toFixed(2)}%)
                </Text>
              </Box>
            </HStack>
          ))}
        </Box>
      </Grid>
    </Box>
  );
}