import { Box, Container } from "@material-ui/core";
// import {useNavigate} from 'react-router-dom';
import MaterialTable from "material-table";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getData, updateData } from "./service";
import Navbar from './Navbar'

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar: snackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getData();
        setData(data);
      } catch (ex) {
        snackbar("Unable to fetch data.", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [snackbar]);

  const columns = [
    { title: "Field Name", field: "fieldName" },
    { title: "Field Value", field: "fieldValue" },
  ];

  const mapData = () => {
    const array = [];
    if (data === null) {
      return array;
    }
    for (var key in data) {
      if (
        key !== "UserSub" &&
        key !== "bv_client" &&
        key !== "email" &&
        key !== "Table"
      ) {
        array.push({
          fieldName: key,
          fieldValue: data[key],
        });
      }
    }
    return array;
  };

  const handleAdd = async (newData) => {
    setLoading(true);
    try {
      let prevData = { ...data };
      prevData = {
        [newData.fieldName]: newData.fieldValue,
        ...prevData,
      };
      await updateData(prevData);
      setData(prevData);
      snackbar("Data added successfully.", { variant: "success" });
    } catch (ex) {
      snackbar("Unable to add new data.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (newData, oldData) => {
    setLoading(true);
    try {
      let prevData = { ...data };
      delete prevData[oldData.fieldName];
      prevData = { [newData.fieldName]: newData.fieldValue, ...prevData };
      await updateData(prevData);
      setData(prevData);
      snackbar("Data updated successfully.", { variant: "success" });
    } catch (ex) {
      snackbar("Unable to edit data.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (oldData) => {
    setLoading(true);
    try {
      const prevData = { ...data };
      delete prevData[oldData.fieldName];
      await updateData(prevData);
      setData(prevData);
      snackbar("Data deleted successfully.", { variant: "success" });
    } catch (ex) {
      snackbar("Unable to delete data.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };
  // const navigate = useNavigate();

  /* const handleLogout = () => {
    localStorage.clear();
    // window.location = "https://www.bonovox.net";
    navigate('/login', { replace: true });
  }; */

  return (
    <>
    <Navbar />
    <Box margin={2}>
      <Container maxWidth="md">
        {/* <Box marginY={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box> */}
        <MaterialTable
          title="Dashboard"
          columns={columns}
          data={mapData()}
          options={{
            actionsColumnIndex: -1,
            maxBodyHeight: 500,
          }}
          isLoading={loading}
          editable={{
            onRowAdd: (newData) => handleAdd(newData),
            onRowUpdate: (newData, oldData) => handleUpdate(newData, oldData),
            onRowDelete: (oldData) => handleDelete(oldData),
          }}
        />
      </Container>
    </Box>
    </>
  );
};

export default Dashboard;
