import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TabKey } from "../types/ui";

type UiState = { activeTab: TabKey };

const initialState: UiState = { activeTab: "subs" };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<TabKey>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = uiSlice.actions;
export default uiSlice.reducer;
export const selectActiveTab = (s: { ui: UiState }) => s.ui.activeTab;
