import { Box, Container, Button, TableBody, Table, TableCell, TableRow } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MaterialTable from "material-table";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getTask, setToken, deleteTask, getContact, getWorkstream, getSingleTask, getStaticContent } from "./service";
import Navbar from './Navbar';
import AddTask from './forms/AddTask';
import EditTask from './forms/EditTask';


const Tasks = () => {
  const [data, setData] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [works, setWorks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staticcontent,  setStaticContent] = useState(null);

  const { enqueueSnackbar: snackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
      try {
        setToken();
        const { data } = await getTask();
        setData(data);
      } catch (ex) {
        snackbar("Unable to fetch data.", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();


    //   console.log(getOrgs());
    const fetchOrgs = async () => {
        
        try {
            setLoading(true);
            setToken();
            const contacts = await getContact();
            setContacts(contacts);
            console.log(contacts);
        } catch (ex) {
        } finally {
            setLoading(false);
        }

        try {
            setLoading(true);
            setToken();
            const works = await getWorkstream();
            setWorks(works);
        } catch (ex) {
        } finally {
            setLoading(false);
        }
    };
    fetchOrgs();
    // console.log(org);

    const fetchStaticContent = async () => {
      try {
        const { data } = await getStaticContent();
        for(let i=0; i<data.length; i++){
          if(data[i].Id == 'TasksPage'){
            setStaticContent(data[i]);
          }
        }        
      } catch (ex) {
      } finally {
      }
    };
    fetchStaticContent();

    const timer = setTimeout(() => {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const id = params.get('id');
      if(id === null){
        //console.log('no id passed');
      }
      else{
        getSingleTask(id).then(function(result){
          //console.log(result.data);
          result = mapData([result.data]);
          //console.log(result);
          viewDetail(result[0]); 
        })
      }

      const open_add_model = params.get('open-add-model');
      if(open_add_model == 1){
        // console.log({contacts});
        // console.log(works);
        if(contacts){
          handleAdd();
        }
      }

      
    }, 3000);
    return () => clearTimeout(timer);

  }, [snackbar]);

  const columns = [
    { title: "UID", field: "uid" },
    { title: "Task Name", field: "Task" },
    { title: "Task Detail", field: "Detail" },
    { title: "Completed", field: "IsCompleted" },
    { title: "Stakeholder", field: "ContactName" },
    { title: "Workstream", field: "WorkStreamName" },
    { title: "Required by date", field: "RequiredByDt" },
  ];

  const mapData = (data) => {
    const array = [];
    if (data === null) {
      return array;
    }
    for (var key in data) {
        // console.log(data);
        let row = data[key];
        var date = new Date(row.RequiredBy);
        var dt = date.toDateString();
        array.push({
          uid: Number(key)+1,
          Detail: row.Detail,
          IsCompleted: row.IsCompleted,
          ContactName: row.ContactName,
          WorkStreamName: row.WorkStreamName,
          RequiredBy: row.RequiredBy,
          RequiredByDt: dt,
          ContactId: row.ContactId,
          OrgId: row.OrgId,
          Task: row.Task,
          WorkStreamId: row.WorkStreamId,
          Id: row.Id,
          UpdatedBy: row.UpdatedBy,
          CreatedBy: row.CreatedBy,
          CreatedTs: row.CreatedTs,
          LastUpdatedTs: row.LastUpdatedTs,
        });
    }
    return array;
  };

  const handleAdd = async () => {
    setModalTitle(<div>Add Task</div>);
    setModalBody(<AddTask closeModal={closeModal} handleClose={handleClose} snackbar={snackbar} contacts={contacts} works={works} />);
    setOpen(true);
  };

  const closeModal = async () => {
    setLoading(true);
    setModalTitle('');
    setModalBody('');
    setOpen(false);
    try {
      setToken();
      const { data } = await getTask();
      setData(data);
    } catch (ex) {
      snackbar("Unable to fetch data.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (rowData) => {
    // setLoading(true);
    setModalTitle(<div>Edit Task</div>);
    setModalBody(<EditTask closeModal={closeModal} handleClose={handleClose} snackbar={snackbar} rowData={rowData} contacts={contacts} works={works} />);
    setOpen(true);
  };

  const handleDelete = async (rowData) => {
    setLoading(true);
    try {
      setToken();
      await deleteTask(rowData.Id);
      snackbar("Data deleted successfully.", { variant: "success" });
    } catch (ex) {
      snackbar("Unable to delete data.", { variant: "error" });
    } finally {
      setTimeout(() => {
        closeModal();
      }, 500);
    }
  };


  const viewDetail = (row) => {
      // console.log(row);
      setModalTitle('Task Detail');
      var timestamp = row.CreatedTs;
      var date = new Date(timestamp);
      var dt = date.toLocaleString();
      var completed = "No";
      if(row.IsCompleted)
      {
          completed = "Yes";
      }
      let b = (
        <>
          <Table className="mb">
            <TableBody>
              <TableRow>
                <TableCell><b>Task</b></TableCell>
                <TableCell>{row.Task}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Stakeholder</b></TableCell>
                <TableCell>{row.ContactName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Workstream</b></TableCell>
                <TableCell>{row.WorkStreamName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Required by</b></TableCell>
                <TableCell>{row.RequiredByDt}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Completed</b></TableCell>
                <TableCell>{completed}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Task detail</b></TableCell>
                <TableCell>{row.Detail}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Create At</b></TableCell>
                <TableCell>{dt}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="margin">
            <Button variant="contained" onClick={handleClose} className="margin" color="primary">Close</Button>
          </div>
        </>
      );
      setModalBody(b);
      handleOpen();
  }

    // getModalStyle is not a pure function, we roll the style only on the first render
    const [open, setOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState("");
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


  return (
    <>
    <Navbar />
    <Box margin={2}>
      <Container maxWidth="lg">
        <MaterialTable
          title= { (staticcontent !== null) ? staticcontent.Content.Title : '' }
          columns={columns}
          data={mapData(data)}
          options={{
            actionsColumnIndex: -1,
            pageSize: 10,
          }}
          isLoading={loading}
          actions={[
            {
              icon: 'add_box',
              tooltip: 'Add',
              onClick: (event, rowData) => handleAdd(),
              isFreeAction: true,
            },
            {
              icon: 'visibility',
              tooltip: 'View',
              onClick: (event, rowData) => viewDetail(rowData),
            },
            {
              icon: 'edit',
              tooltip: 'Edit',
              onClick: (event, rowData) => handleUpdate(rowData),
            },
            // {
            //   icon: 'delete',
            //   tooltip: 'Delete',
            //   onClick: (event, rowData) => handleDelete(rowData),
            // },
          ]}
        />
      </Container>
    </Box>
    <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{modalTitle}</DialogTitle>
        <DialogContent>
            {modalBody}
            <br />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Tasks;
