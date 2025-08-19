// src/components/SubscriptionsDonut.tsx
import { Box, Stack, Text } from "@chakra-ui/react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const raw = [
  { name: "Netflix (Premium)", value: 1199 },
  { name: "Мобильная связь (МТС)", value: 650 },
  { name: "PlayStation Plus Extra", value: 599.92 },
  { name: "GitHub Pro", value: 380 },
  { name: "Яндекс Плюс", value: 299 },
  { name: "iCloud+ (200 ГБ)", value: 149 },
  { name: "Продление домена .ru", value: 82.5 },
];

const data = [...raw].sort((a, b) => b.value - a.value);

const COLORS = [
  "#1A73E8",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#06B6D4",
  "#8B5CF6",
  "#6B7280",
];

const total = data.reduce((s, r) => s + r.value, 0);

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const name = p?.name ?? p?.payload?.name;
  const value = Number(p?.value) || 0;
  const pct = (value / total) * 100;
  return (
    <Box
      bg="white"
      color="black"
      borderWidth="1px"
      p={2}
      rounded="md"
      boxShadow="sm"
    >
      <Text fontWeight="semibold" mb={1}>
        {name}
      </Text>
      <Text fontSize="sm">
        {value.toLocaleString("ru-RU")} ₽/мес • {pct.toFixed(2)}%
      </Text>
    </Box>
  );
}

export default function SubscriptionsDonut() {
  return (
    <Box position="relative" w="full" maxW="420px" h="320px">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="70%"
            outerRadius="90%"
            paddingAngle={2}
            isAnimationActive={false}
          >
            {data.map((entry, idx) => (
              <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} cursor={false} />
        </PieChart>
      </ResponsiveContainer>

      {/* Центровая подпись */}
      <Stack
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        spacing={0}
        align="center"
      >
        <Text fontSize="xl" fontWeight="bold">
          {Math.round(total).toLocaleString("ru-RU")} ₽
        </Text>
        <Text fontSize="sm" color="gray.500">
          в месяц
        </Text>
      </Stack>
    </Box>
  );
}
