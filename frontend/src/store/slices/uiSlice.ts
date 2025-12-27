import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    isExpanded: boolean;
    isMobileOpen: boolean;
    isMobile: boolean;
    isHovered: boolean;
    activeItem: string | null;
    openSubmenu: string | null;
}

const initialState: UiState = {
    isExpanded: true,
    isMobileOpen: false,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 1024 : false,
    isHovered: false,
    activeItem: null,
    openSubmenu: null,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isExpanded = !state.isExpanded;
        },
        toggleMobileSidebar: (state) => {
            state.isMobileOpen = !state.isMobileOpen;
        },
        setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.isMobileOpen = action.payload;
        },
        setIsMobile: (state, action: PayloadAction<boolean>) => {
            state.isMobile = action.payload;
            if (!action.payload) {
                state.isMobileOpen = false;
            }
        },
        setIsHovered: (state, action: PayloadAction<boolean>) => {
            state.isHovered = action.payload;
        },
        setActiveItem: (state, action: PayloadAction<string | null>) => {
            state.activeItem = action.payload;
        },
        toggleSubmenu: (state, action: PayloadAction<string>) => {
            if (state.openSubmenu === action.payload) {
                state.openSubmenu = null;
            } else {
                state.openSubmenu = action.payload;
            }
        },
    },
});

export const {
    toggleSidebar,
    toggleMobileSidebar,
    setMobileSidebarOpen,
    setIsMobile,
    setIsHovered,
    setActiveItem,
    toggleSubmenu,
} = uiSlice.actions;

export default uiSlice.reducer;
