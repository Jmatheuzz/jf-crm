import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

export default function FindImovel({ fecthImoveis, label = "Usuário", value, onChange }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {

    setLoading(true);
    fecthImoveis(inputValue).then((res) => {
      setOptions(res);
      setLoading(false);
    });
  }, [inputValue, fecthImoveis]);



  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(e, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
      getOptionLabel={(option) =>
        option.endereco ? `${option.endereco} (${option.valor})` : ""
      }
      isOptionEqualToValue={(option, val) => option.id === val.id} // 🔑 compara pelo id
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />

  );
}