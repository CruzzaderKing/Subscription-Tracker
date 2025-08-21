// src/components/SubscriptionsDonutCard.tsx
import { Box, Grid, HStack, Text, useToken } from '@chakra-ui/react';
import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { useAuth } from '../auth/AuthProvider';
import { listenSubscriptions } from '../lib/db/subscriptions';
import type { Subscription } from '../types/subscription';

// ==== Типы данных для диаграммы и тултипа ====
type ChartDatum = {
  name: string;
  value: number; // процент (0..100)
  amount: number; // руб/мес
  pct: number; // тот же процент, просто для удобства
  fill: string; // цвет сектора
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number; // значение dataKey (= процент)
    payload: ChartDatum; // исходная запись
  }>;
};

function DonutTooltip({ active, payload }: CustomTooltipProps): ReactElement | null {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0];
  const d = entry.payload;
  return (
    <Box bg="white" color="black" borderWidth="1px" p={2} rounded="md" boxShadow="sm">
      <Text fontWeight="semibold" mb={1}>
        {d.name}
      </Text>
      <Text fontSize="sm">
        {d.amount.toLocaleString('ru-RU')} ₽/мес • {d.value.toFixed(2)}%
      </Text>
    </Box>
  );
}

// Годовой платёж переводим в «руб/мес»
function toMonthlyAmount(sub: Subscription): number {
  const raw = Number(sub.amount) || 0;
  if (sub.cycle === 'Ежегодно') return raw / 12;
  return raw;
}

export default function SubscriptionsDonutCard() {
  const { user } = useAuth();
  const uid = user?.uid ?? '';

  const [subs, setSubs] = useState<Subscription[]>([]);

  useEffect(() => {
    if (!uid) return;
    return listenSubscriptions(uid, setSubs);
  }, [uid]);

  // Палитра — можно расширить/поменять токены Chakra
  const colorTokens = [
    'teal.400',
    'red.400',
    'purple.500',
    'cyan.400',
    'orange.400',
    'pink.400',
    'blue.400',
    'green.400',
    'yellow.400',
    'gray.500',
  ];
  const fills = useToken('colors', colorTokens);

  // Готовим данные графика
  const { chartData, total, leftList, rightList } = useMemo(() => {
    // Берём только неотменённые
    const filtered = subs.filter((s) => s.status !== 'Отменена');

    // Считаем месячные суммы
    const withMonthly = filtered.map((s) => ({
      name: s.name,
      monthly: toMonthlyAmount(s),
    }));

    // Сумма по всем
    const totalAmount = withMonthly.reduce((sum, r) => sum + r.monthly, 0);

    // Если нечего показывать
    if (totalAmount <= 0) {
      return {
        chartData: [] as ChartDatum[],
        total: 0,
        leftList: [] as typeof withMonthly,
        rightList: [] as typeof withMonthly,
      };
    }

    // Нормализация → проценты
    const data: ChartDatum[] = withMonthly
      .filter((r) => r.monthly > 0)
      .sort((a, b) => b.monthly - a.monthly)
      .map((r, idx) => {
        const pct = (r.monthly / totalAmount) * 100;
        return {
          name: r.name,
          amount: r.monthly,
          pct,
          value: pct,
          fill: fills[idx % fills.length],
        };
      });

    const half = Math.ceil(data.length / 2);
    const left = data.slice(0, half).map((d) => ({ name: d.name, monthly: d.amount }));
    const right = data.slice(half).map((d) => ({ name: d.name, monthly: d.amount }));

    return { chartData: data, total: totalAmount, leftList: left, rightList: right };
  }, [subs, fills]);

  // Пустое состояние
  if (chartData.length === 0) {
    return (
      <Box
        borderWidth="1px"
        rounded="md"
        p={5}
        textAlign="center"
        bg="white"
        _dark={{ bg: 'gray.800' }}
      >
        <Text color="gray.600" _dark={{ color: 'gray.300' }}>
          Недостаточно данных для диаграммы.
        </Text>
      </Box>
    );
  }

  return (
    <Box bg="white" borderWidth="1px" rounded="md" p={5} _dark={{ bg: 'gray.800' }}>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} alignItems="center">
        {/* 1/3 — диаграмма */}
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

              <Tooltip content={<DonutTooltip />} cursor={false} />
            </PieChart>
          </ResponsiveContainer>

          {/* Центровая подпись */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            textAlign="center"
            pointerEvents="none"
          >
            <Text textStyle="caption-1">{Math.round(total).toLocaleString('ru-RU')} ₽</Text>
            <Text textStyle="caption-2" color="gray.500">
              в месяц
            </Text>
          </Box>
        </Box>

        {/* 1/3 — список слева */}
        <Box>
          {leftList.map((s) => (
            <HStack key={s.name} align="start" spacing={3} mb={3}>
              <Box
                boxSize="10px"
                rounded="full"
                bg={chartData.find((d) => d.name === s.name)?.fill}
                mt="6px"
              />
              <Box>
                <Text textStyle="caption-1">{s.name}</Text>
                <Text textStyle="caption-2" color="gray.600" _dark={{ color: 'gray.300' }}>
                  {s.monthly.toLocaleString('ru-RU')} ₽/мес
                </Text>
              </Box>
            </HStack>
          ))}
        </Box>

        {/* 1/3 — список справа */}
        <Box>
          {rightList.map((s) => (
            <HStack key={s.name} align="start" spacing={3} mb={3}>
              <Box
                boxSize="10px"
                rounded="full"
                bg={chartData.find((d) => d.name === s.name)?.fill}
                mt="6px"
              />
              <Box>
                <Text textStyle="caption-1">{s.name}</Text>
                <Text textStyle="caption-2" color="gray.600" _dark={{ color: 'gray.300' }}>
                  {s.monthly.toLocaleString('ru-RU')} ₽/мес
                </Text>
              </Box>
            </HStack>
          ))}
        </Box>
      </Grid>
    </Box>
  );
}
