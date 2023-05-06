import { createSlice } from '@reduxjs/toolkit';

// project imports
import { dispatch } from '../index';
import axios from 'utils/axios';

// initial state
const initialState = {
    selectedItem: ['dashboard'],
    selectedID: null,
    drawerOpen: false,
    error: null,
    menu: {},
    fileUploadList: []
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        activeItem(state, action) {
            state.selectedItem = action.payload;
        },

        activeID(state, action) {
            state.selectedID = action.payload;
        },

        openDrawer(state, action) {
            state.drawerOpen = action.payload;
        },

        // has error
        hasError(state, action) {
            state.error = action.payload;
        },

        // get dashboard menu
        getMenuSuccess(state, action) {
            state.menu = action.payload;
        },

        updateFileUploadList(state, action) {
            console.log(state, action)
            var index  = state.fileUploadList.findIndex((a) => a.file_name ===  action.payload.file_name);
            if (index > -1) {
                state.fileUploadList[index] = action.payload;
                console.log(state.fileUploadList)   
            } else {
                state.fileUploadList.push(action.payload);
            }
        },

        removeDoneFileUpload(state, action) {
            state.fileUploadList  = state.fileUploadList.filter((a) => a.file_name !==  action.payload.file_name);
        }
    }
});

export default menu.reducer;

export const { activeItem, openDrawer, activeID, updateFileUploadList, removeDoneFileUpload } = menu.actions;

export function getMenu() {
    return async () => {
        try {
            const response = await axios.get('/api/menu/widget');
            dispatch(menu.actions.getMenuSuccess(response.data.widget));
        } catch (error) {
            dispatch(menu.actions.hasError(error));
        }
    };
}
