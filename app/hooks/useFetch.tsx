import { useCallback, useEffect, useRef, useState } from "react";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useDebounce } from "./useDebounce";

type FetchState<T> = {
  data: T[] | any;
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalItems: number;
  currentPage: number;
  hasLoaded: boolean;
};

type UseFetchOptions<T> = {
  /** Base URI, e.g. "/api/orders" */
  uri: string;
  /** Items per page; defaults to 10 */
  limit?: number;
  /** Initial search term */
  initialSearch?: string;
  /** Debounce in ms; 0 to disable */
  debounceMs?: number;
  /** Function to map/transform the raw response */

  service?: string;
  mapResponse?: (res: any) => {
    items: T[];
    totalPages: number;
    totalItems: number;
    currentPage: number;
  };
};

export function useFetch<T>({
  uri,
  limit = 10,
  initialSearch = "",
  debounceMs = 300,
  mapResponse,
  service = ""
}: UseFetchOptions<T>) {
  // ========= state =========
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(initialSearch);

  const [state, setState] = useState<FetchState<T>>({
    data: [],
    loading: false,
    error: null,
    totalPages: 1,
    totalItems: 0,
    currentPage: 1,
    hasLoaded: false,
  });

  // ========= helpers =========
  const debouncedSearch = useDebounce(query, debounceMs);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(
    async (pageToFetch = page) => {
      // Cancel any in‑flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const res = await makeRequest(
          `${uri}?page=${pageToFetch}&limit=${limit}&searchTerm=${debouncedSearch}&service=${service}`,
          { method: "GET", cache: "no-store", signal: controller.signal }
        );
        console.log({res})
        const {
          items,
          totalPages,
          totalItems,
          currentPage,
        } = mapResponse
          ? mapResponse(res)
          : {
              items: res.items ?? res.data ?? [],
              totalPages: res.totalPages ?? 1,
              totalItems: res.totalItems ?? 0,
              currentPage: res.currentPage ?? pageToFetch,
            };

        setState({
          data: items,
          loading: false,
          error: null,
          totalPages,
          totalItems,
          currentPage,
          hasLoaded: true,
        });
      } catch (err: any) {
        if (err.name === "AbortError") return; // silently ignore aborted calls
        console.error("useFetch error:", err);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message || "Failed to load data",
          hasLoaded: true,
        }));
      }
    },
    [uri, limit, debouncedSearch, page, mapResponse]
  );

  // ========= side‑effects =========
  useEffect(() => {
    fetchPage(1); // reset to first page on new search
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ========= outward‑facing helpers =========
  const handleSearch = useCallback((v: string) => setQuery(v), []);
  const refetch = useCallback(() => fetchPage(), [fetchPage]);

  return {
    ...state,
    setPage,
    handleSearch,
    refetch,
    query,
  };
}
