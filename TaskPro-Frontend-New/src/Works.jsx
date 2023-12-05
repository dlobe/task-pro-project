import { Box, Container, Button, TableBody, Table, TableCell, TableRow } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MaterialTable from "material-table";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getWorkstream, setToken, deleteWorkstream, getSingleWorkStream, getStaticContent } from "./service";
import Navbar from './Navbar';
import AddWork from './forms/AddWork';
import EditWork from './forms/EditWork';


const Works = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staticcontent,  setStaticContent] = useState(null);

  const { enqueueSnackbar: snackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setToken();
        const { data } = await getWorkstream();
        setData(data);
      } catch (ex) {
        snackbar("Unable to fetch data.", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const fetchStaticContent = async () => {
      try {
        const { data } = await getStaticContent();
        for(let i=0; i<data.length; i++){
          if(data[i].Id == 'WorkstreamsPage'){
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
        getSingleWorkStream(id).then(function(result){
          //console.log(result.data);
          result = mapData([result.data]);
          //console.log(result);
          viewDetail(result[0]); 
        })
      }
      
    }, 3000);
    return () => clearTimeout(timer);

  }, [snackbar]);

  const columns = [
    { title: "UID", field: "uid" },
    { title: "Name", field: "name" },
    { title: "Priority", field: "Priority" },
    { title: "Status", field: "Status" },
    { title: "Blocked", field: "b" },
  ];

  const mapData = (data) => {
    const array = [];
    if (data === null) {
      return array;
    }
    for (var key in data) {
        // console.log(data);
        let row = data[key];
        var b = "Yes";
        if(row.Blocked===false)
        {
            b = "No";
        }
        array.push({
          uid: Number(key)+1,
          name: row.Name,
          b: b,
          Priority: row.Priority,
          Status: row.Status,
          Blocked: row.Blocked,
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
    setModalTitle(<div>Add Workstream</div>);
    setModalBody(<AddWork closeModal={closeModal} handleClose={handleClose} snackbar={snackbar} />);
    setOpen(true);
  };

  const closeModal = async () => {
    setLoading(true);
    setModalTitle('');
    setModalBody('');
    setOpen(false);
    try {
      setToken();
      const { data } = await getWorkstream();
      setData(data);
    } catch (ex) {
      snackbar("Unable to fetch data.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (rowData) => {
    // setLoading(true);
    setModalTitle(<div>Edit Workstream</div>);
    setModalBody(<EditWork closeModal={closeModal} handleClose={handleClose} snackbar={snackbar} rowData={rowData} />);
    setOpen(true);
  };

  const handleDelete = async (rowData) => {
    setLoading(true);
    try {
      setToken();
      await deleteWorkstream(rowData.Id);
      snackbar("Data deleted successfully.", { variant: "success" });
    } catch (ex) {
      snackbar("Unable to delete data.", { variant: "error" });
    } finally {
      setTimeout(() => {
        closeModal();
      }, 200);
    }
  };


  const viewDetail = (row) => {
      // console.log(row);
      setModalTitle('Workstream Detail');
      var timestamp = row.CreatedTs;
      var date = new Date(timestamp);
      var dt = date.toLocaleString();

      let meetings_html = '';
      let stakeholders_html = '';
      let organizations_html = '';

      getSingleWorkStream(row.Id).then(function(result){
        
        let meetings = result.data.Meetings;
        meetings.forEach(function(item, i){
          meetings_html += '<div class="anchor-element"><a href="meetings?id='+item.Id+'"><b>'+item.Topic+'</b></a><span style={{"margin-left": "30px"}}><b>01Nov2020</b></span></div>';
        })

        let contacts = result.data.Contacts;
        contacts.forEach(function(item, i){
          stakeholders_html += '<div class="anchor-element"><a href="contacts?id='+item.Id+'"><b>'+item.FirstName+' '+item.LastName+'</b></a></div>';
        })

        let organizations = result.data.Organizations;
        organizations.forEach(function(item, i){
          organizations_html += '<div class="anchor-element"><a href="organizations?id='+item.Id+'"><b>'+item.Name+'</b></a></div>';
        })

        let b = (
          <>
            <Table className="mb">
              <TableBody>
                <TableRow>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell>{row.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Priority</b></TableCell>
                  <TableCell>{row.Priority}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell>{row.Status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Blocked</b></TableCell>
                  <TableCell>{row.b}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Create At</b></TableCell>
                  <TableCell>{dt}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div><strong>Organizations</strong>
              <div dangerouslySetInnerHTML={{__html: organizations_html}} />
            </div>
  
            <div style={{"margin-top": "20px"}}><strong>Stake Holders</strong>
              <div dangerouslySetInnerHTML={{__html: stakeholders_html}} />
              {/* <div><Switch /><span class="stakeholder-text">Paint the room</span></div> */}
            </div>
  
            <div style={{"margin-top": "20px"}}><strong>Meetings</strong>
              <div dangerouslySetInnerHTML={{__html: meetings_html}} />
              {/* <div class="anchor-element"><a href=""><b>New website project</b></a><span style={{"margin-left": "30px"}}><b>01Nov2020</b></span></div> */}
            </div>

            <div className="margin">
              <Button variant="contained" onClick={handleClose} className="margin" color="primary">Close</Button>
            </div>
          </>
        );
        setModalBody(b);
        handleOpen();

      })

      
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
      <Container maxWidth="md">
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

export default Works;
