import { createContext, useContext } from "react";

export const PlayerIdContext = createContext<string>("");

export const usePlayerId = () => useContext(PlayerIdContext);
