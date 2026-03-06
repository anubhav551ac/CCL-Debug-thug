import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    email: string;
    name: string;
    phoneNumber?: string;
    profilePic?: string;
    role: 'CITIZEN' | 'COLLECTOR' | 'WARD_OFFICER';
    reputation: number;
    mockBalance: number;
    municipality?: string;
    totalReports: number;
    totalCleanups: number;
    createdAt: string;
    updatedAt: string;
    _count: {
        reportsCreated: number;
        cleanupsDone: number;
    };
}

export interface UserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    isLoading: false,
    error: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Set the user data and automatically set isLoading to false
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        // Start loading the user
        startLoading: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        // Set error and stop loading
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        // Clear user (logout)
        clearUser: (state) => {
            state.user = null;
            state.isLoading = false;
            state.error = null;
        },
        // Update specific user fields
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
});

export const { setUser, startLoading, setError, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
