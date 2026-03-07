import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Match the type defined in usePins
export interface Pin {
    id: string;
    latitude: number;
    longitude: number;
    municipality: string;
    wasteType: string[];
    wasteSize: string;
    description?: string;
    status: 'PENDING_GOV' | 'BOUNTY_OPEN' | 'CLAIMED' | 'VERIFYING' | 'RESOLVED';
    bountyPool: number;
    upvotes: number;
    reporterId: string;
    createdAt: string;
    updatedAt: string;
    imageUrl?: string;
    reporter?: {
        id: string;
        name: string;
        email: string;
        profilePic?: string;
    };
    cleanupProof?: {
        id: string;
        cleanerId: string;
        afterImage: string | null;
        beforeImage: string;
        description?: string;
        upvotes: number;
        createdAt: string;
        cleaner: {
            id: string;
            name: string;
            profilePic?: string;
        };
    } | null;
}

export interface PinsState {
    pins: Pin[];
    selectedPinId: string | null;
}

const initialState: PinsState = {
    pins: [],
    selectedPinId: null,
};

const pinsSlice = createSlice({
    name: 'pins',
    initialState,
    reducers: {
        setPins: (state, action: PayloadAction<Pin[]>) => {
            state.pins = action.payload;
        },
        addPin: (state, action: PayloadAction<Pin>) => {
            state.pins.push(action.payload);
        },
        setSelectedPinId: (state, action: PayloadAction<string | null>) => {
            state.selectedPinId = action.payload;
        },
    },
});

export const { setPins, addPin, setSelectedPinId } = pinsSlice.actions;
export default pinsSlice.reducer;
