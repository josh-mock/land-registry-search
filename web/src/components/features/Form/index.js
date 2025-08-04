"use client";
import axios from "axios";
import debounce from "lodash.debounce";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useResultStore from "../../../store/resultStore";
import styles from "./Form.module.css";

const configs = {
  company: {
    queryName: "Company Name",
    autocomplete: true,
    schema: {
      required: "Company name is required",
      maxLength: {
        value: 255,
        message: "Maximum 255 characters allowed",
      },
      pattern: {
        value: /^[\p{L}\p{N} &]+$/u,
        message: "Only letters, numbers, spaces, and '&' allowed",
      },
    },
  },
  title: {
    queryName: "Title Number",
    autocomplete: false,
    schema: {
      required: "Title number is required",
      maxLength: {
        value: 16,
        message: "Maximum 16 characters allowed",
      },
      pattern: {
        value: /^[A-Za-z0-9]+$/,
        message: "Only letters and numbers allowed",
      },
    },
  },
};

export default function Form({ searchType }) {
  const config = configs[searchType];
  const enableAutocomplete = config.autocomplete === true;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const setResultData = useResultStore((state) => state.setResultData);
  const setLoading = useResultStore((state) => state.setLoading);
  const [suggestions, setSuggestions] = useState([]);

  // Debounced fetch for suggestions
  const fetchSuggestions = debounce(async (query) => {
    if (!query) return setSuggestions([]);
    try {
      const { data } = await axios.get(`/api/${searchType}/autocomplete`, {
        params: { q: query },
      });
      setSuggestions(data);
    } catch (err) {
      console.error("Autocomplete fetch error:", err);
      setSuggestions([]);
    }
  }, 300);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (enableAutocomplete) fetchSuggestions(val);
  };

  const handleSelect = (value) => {
    setValue("query", value, { shouldValidate: true });
    setSuggestions([]);
  };

  const onSubmit = async ({ query }) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/${searchType}/search`, {
        params: { query },
      });
      setResultData(data, searchType);
    } catch (err) {
      console.error("Search submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      <h2 className={"h2"}>{`Search by ${config.queryName}`}</h2>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className={styles.form__row} style={{ position: "relative" }}>
          <input
            id="query"
            placeholder={`Enter ${config.queryName.toLowerCase()}...`}
            className={`${styles.form__input} input`}
            autoComplete="off"
            {...register("query", config.schema)}
            onChange={handleInputChange}
          />
          <button type="submit" className={`${styles.forms__btn} btn`}>
            Search
          </button>

          {enableAutocomplete && suggestions.length > 0 && (
            <ul className={styles.form__autocomplete}>
              {suggestions.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelect(item.proprietor_name)}
                  className={styles.form__autocompleteSuggestion}
                >
                  {item.proprietor_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.query && (
          <span className={styles.form__errorText}>{errors.query.message}</span>
        )}
      </form>
    </div>
  );
}
