import { configureStore,combineReducers } from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import authSlice from "./slices/authSlice";
import boardSlice from "./slices/boardSlice"
import columnSlice from "./slices/columnSlice"
import activitySlice from "./slices/activitySlice"  
import cardSlice from "./slices/cardSlice"

const storage = {
    getItem: (key) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
}

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducers = combineReducers({
    auth: authSlice,
    board: boardSlice,
    column: columnSlice,
    activity: activitySlice,
    card: cardSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({serializableCheck: false})
});

export const persistor = persistStore(store)


// import { createStore } from 'redux'
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 
// import rootReducer from './reducers'
 
// const persistConfig = {
//   key: 'root',
//   storage,
// }
 
// const persistedReducer = persistReducer(persistConfig, rootReducer)
 
// export default () => {
//   let store = createStore(persistedReducer)
//   let persistor = persistStore(store)
//   return { store, persistor }
// }