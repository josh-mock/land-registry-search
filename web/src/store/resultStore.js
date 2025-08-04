import { create } from "zustand";
import axios from "axios";

const useResultStore = create((set) => ({
  resultData: null,
  loading: false,
  setLoading: (loading) => set({ loading }),
  setResultData: (data, type) =>
    set({ resultData: { data, type }, loading: false }),

  topTen: null,
  topTenLoading: false,
  topTenError: null,
  fetchTopTen: async () => {
    set({ topTenLoading: true, topTenError: null });
    try {
      const response = await axios.get("/api/top-ten");
      set({ topTen: response.data, topTenLoading: false });
    } catch (err) {
      set({ topTenError: err.message, topTenLoading: false });
    }
  },
}));

export default useResultStore;
