export const TABS = ["subs", "stats"] as const;
export type TabKey = typeof TABS[number];

export interface NavMenuProps {
  activeKey?: TabKey;
  onChange?: (key: TabKey) => void;
}
