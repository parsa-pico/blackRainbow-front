import React, { useEffect, useState } from "react";
import { tryHTTP } from "../../../Common/commonFuncs";
import { Button, Chip, TextField } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Form } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
export default function GetOptions({
  readOnly,
  selectedOptions,
  setSelectedOptions,
}) {
  const optionBase = {
    localName: "",
    title: "",
    choices: [],
    currentChoice: "",
    isNew: true,
  };

  const [options, setOptions] = useState([optionBase]);
  const [showNewOption, setShowNewOption] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  useEffect(() => {
    search();
  }, []);
  function handleSelect() {}
  function handleDeleteChoice(i, j) {
    const optionsCopy = [...options];
    const thisOption = { ...optionsCopy[i] };
    const choicesCopy = [...thisOption.choices];
    choicesCopy.splice(j, 1);
    thisOption.choices = choicesCopy;
    optionsCopy[i] = thisOption;
    console.log(optionsCopy);
    setOptions(optionsCopy);
  }
  function handleAddChoice(i, newValue) {
    const optionsCopy = [...options];
    const thisOption = { ...optionsCopy[i] };
    const choicesCopy = [...thisOption.choices];
    choicesCopy.push(newValue);
    thisOption.choices = choicesCopy;
    thisOption.currentChoice = "";
    optionsCopy[i] = thisOption;

    setOptions(optionsCopy);
  }
  function handleChange(i, name, newValue) {
    const optionsCopy = [...options];

    const thisOption = { ...optionsCopy[i] };
    thisOption[name] = newValue;
    optionsCopy[i] = thisOption;

    setOptions(optionsCopy);
  }
  function handleSubmit(option) {
    const { isNew, _id, currentChoice, ...obj } = option;
    tryHTTP(
      async (http) => {
        if (isNew) await http.post("/options", obj);
        else await http.put(`/options/${_id}`, obj);
      },
      () => {
        alert("تغییرات انجام شد");
        window.location = window.location;
      }
    );
  }
  function search() {
    tryHTTP(async (http) => {
      let { data } = await http.post(
        "/options/get-options",
        {
          searchValue: searchVal,
        },
        { withCredentials: true }
      );
      console.log(data);
      data.unshift(optionBase);
      setOptions(data);
    });
  }
  return (
    <>
      <h2>آپشن محصولات</h2>
      <div className="bg-dark d-flex" style={{ height: "10vh" }}>
        <Form className="nav-search-wrapper d-flex">
          <Form.Control
            placeholder="جستجو"
            className="nav-search"
            aria-label="Search"
            value={searchVal}
            onChange={({ target }) => setSearchVal(target.value)}
          />

          <SearchIcon
            onClick={search}
            className="nav-search-icon pointer-cursor"
          />
        </Form>
      </div>
      {!showNewOption && !readOnly && (
        <Button
          onClick={() => {
            setShowNewOption(true);
          }}
          variant="contained"
          className="my-1"
        >
          آپشن جدید
        </Button>
      )}
      {options &&
        options.length > 0 &&
        options.map((option, i) => {
          const { choices, isNew } = option;
          const showLogic = !isNew || (isNew && showNewOption);
          const isSelected =
            readOnly && selectedOptions.find((opt) => opt._id === option._id);

          if (showLogic)
            return (
              <div key={i} className="my-3 p-5 bg-dark">
                {isNew && <h5 className="text-center mb-2">آپشن جدید</h5>}
                <TextField
                  autoComplete={"false"}
                  inputProps={{ readOnly: readOnly }}
                  name="localName"
                  onChange={({ target }) => {
                    handleChange(i, target.name, target.value);
                  }}
                  value={option.localName}
                  className="my-1"
                  label="اسم محلی"
                />
                <TextField
                  autoComplete={"false"}
                  inputProps={{ readOnly: readOnly }}
                  name="title"
                  onChange={({ target }) =>
                    handleChange(i, target.name, target.value)
                  }
                  className="my-1"
                  value={option.title}
                  label="اسم"
                />
                <hr />
                <p>گزینه ها:</p>
                {!readOnly && (
                  <span
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <AddCircleIcon
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "-15%",
                        transform: "translate(0,-50%)",
                      }}
                      onClick={() => {
                        handleAddChoice(i, option.currentChoice);
                      }}
                    >
                      +
                    </AddCircleIcon>

                    <TextField
                      autoComplete="false"
                      name="currentChoice"
                      onChange={({ target }) =>
                        handleChange(i, target.name, target.value)
                      }
                      value={option.currentChoice}
                      label="گزینه جدید"
                    />
                  </span>
                )}
                <div className="mt-2">
                  {choices &&
                    choices.length > 0 &&
                    choices.map((choice, j) => {
                      const delete_ = () => {
                        handleDeleteChoice(i, j);
                      };
                      return (
                        <Chip
                          key={j}
                          label={choice}
                          variant="outlined"
                          onDelete={readOnly ? null : delete_}
                        />
                      );
                    })}
                </div>
                <hr />
                {!readOnly ? (
                  <Button
                    onClick={() => handleSubmit(option)}
                    variant="outlined"
                    className="w-100"
                  >
                    ثبت
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      if (!isSelected)
                        setSelectedOptions((s) => [...s, option]);
                      else {
                        const copy = [...selectedOptions];
                        const index = copy.findIndex(
                          (opt) => opt._id === option._id
                        );
                        copy.splice(index);
                        setSelectedOptions(copy);
                      }
                    }}
                    variant="outlined"
                    className="w-100"
                    color={!isSelected ? "warning" : "error"}
                  >
                    {!isSelected ? "انتخاب" : "حذف انتخاب"}
                  </Button>
                )}
              </div>
            );
        })}
    </>
  );
}
