import React from "react";
import { useState } from "react";
import { tryHTTP, tryLoadingHTTP } from "../../Common/commonFuncs";
import { useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { CustuomLink } from "../../Common/commonComponents";
import PageviewIcon from "@mui/icons-material/Pageview";
import SearchIcon from "@mui/icons-material/Search";
import { getUser } from "../../Services/authService";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useGlobalLoading } from "../../context/globalLoadingContext";
import { useCategories } from "../../context/categoryContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
export default function NavCategories() {
  const user = getUser();
  const [categories, setCategories] = useCategories();
  // const [selectedCategory, setSelectedCategory] = useState(null);
  const [_, setGlobalLoading] = useGlobalLoading();
  // function handleSelectCategory(category) {
  //   setSelectedCategory(category);
  // }
  return (
    <div>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        // sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      >
        {categories &&
          categories.length > 0 &&
          categories.map((category, i) => {
            return (
              <TreeItem
                key={category._id}
                nodeId={category._id}
                label={
                  <CustuomLink>
                    {category.title}
                    <SearchIcon
                      name="search"
                      onClick={() => {
                        window.location = `/items?category=${category._id}`;
                      }}
                      className="me-3"
                    />
                    {user && user.isAdmin && (
                      <>
                        <EditIcon
                          onClick={(e) => {
                            const title = prompt("نام جدید را وارد کنید");
                            if (title)
                              updateCategory({ title, _id: category._id });
                          }}
                          className="me-3"
                        />
                        <DeleteForeverIcon
                          onClick={async () => {
                            await deleteCategory(category);
                          }}
                          className="me-3"
                        />
                      </>
                    )}
                  </CustuomLink>
                }
              >
                {category.subCategories.map((subCategory) => (
                  <TreeItem
                    className="my-1"
                    onClick={(e) => {
                      const name = e.target.getAttribute("name");
                      console.log(name);
                      if (name === "subLink")
                        window.location = `/items?category=${category._id}&subCategory=${subCategory._id}`;
                    }}
                    key={subCategory._id}
                    nodeId={subCategory._id}
                    label={
                      <div
                        name="subLink"
                        className="hstack"
                        style={{ justifyContent: "space-between" }}
                      >
                        {subCategory.title}
                        {user && user.isAdmin && (
                          <>
                            <EditIcon
                              onClick={() => {
                                const title = prompt("نام جدید را وارد کنید");
                                if (title)
                                  updateCategory({
                                    title,
                                    _id: subCategory._id,
                                  });
                              }}
                              className="me-3"
                            />
                            <DeleteForeverIcon
                              onClick={async () => {
                                await deleteCategory(subCategory);
                              }}
                              className="me-3"
                            />
                          </>
                        )}
                      </div>
                    }
                  />
                ))}
                {user && user.isAdmin && (
                  <div className="my-3">
                    <NewCategory parentId={category._id} />
                  </div>
                )}
              </TreeItem>
            );
          })}
        {user && user.isAdmin && (
          <div>
            <NewCategory />
          </div>
        )}
      </TreeView>
      <hr />
    </div>
  );
  async function insertCategory(title, parentId) {
    await tryHTTP(
      async (http) => {
        setGlobalLoading(true);
        const obj = { title };
        const api = "/categories";
        if (parentId) obj.parentId = parentId;
        await http.post(api, obj);
        alert("دسته بندی اضافه شد");

        window.location = "/";
      },
      () => {
        setGlobalLoading(false);
      }
    );
  }
  async function updateCategory(selectedCategory) {
    await tryHTTP(
      async (http) => {
        setGlobalLoading(true);
        const obj = { title: selectedCategory.title };
        const api = "/categories/" + selectedCategory._id;

        await http.put(api, obj);
        alert("دسته بندی ادیت شد");

        window.location = "/";
      },
      () => {
        setGlobalLoading(false);
      }
    );
  }
  async function deleteCategory(selectedCategory) {
    await tryHTTP(
      async (http) => {
        setGlobalLoading(true);

        const api = "/categories/" + selectedCategory._id;

        await http.delete(api);
        alert("دسته بندی حذف شد");

        window.location = "/";
      },
      () => {
        setGlobalLoading(false);
      }
    );
  }
  function NewCategory({ parentId }) {
    const [text, setText] = useState("");
    return (
      <div className="d-flex">
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={!parentId ? "دسته بندی جدید" : "زیردسته بندی جدید"}
          className="w-50 "
        />
        <Button
          onClick={() => {
            insertCategory(text, parentId);
          }}
          variant="outlined"
          className="me-2 w-25"
        >
          ثبت
        </Button>
      </div>
    );
  }
}
