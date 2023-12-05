// import { option } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getOrgs, setToken } from "./service";


const SelectOrgs = () => {
  const [data, setData] = useState(null);

  const { enqueueSnackbar: snackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setToken();
        const { data } = await getOrgs();
        setData(data);
      } catch (ex) {
        snackbar("Unable to fetch data.", { variant: "error" });
      } finally {
      }
    };
    fetchData();
  }, [snackbar]);


  const mapData = () => {
    const array = [];
    if (data === null) {
      return array;
    }
    for (var key in data) {
        // console.log(data);
        let row = data[key];
        array.push({
          uid: Number(key)+1,
          name: row.Name,
          website: row.Website,
          address: row.Address,
          Id: row.Id,
          UpdatedBy: row.UpdatedBy,
          CreatedBy: row.CreatedBy,
          CreatedTs: row.CreatedTs,
          LastUpdatedTs: row.LastUpdatedTs,
        });
    }
    return array;
  };


return mapData();
//   return (
//     <>
//     <option value="">None</option>
//         {mapData().map((value, index) => {
//             return (<option value={value.Id} key={index}>{value.name}</option>);
//         })}
//     </>
//   );
};

export default SelectOrgs;