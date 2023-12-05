import { Box, Container, Button, TableBody, Table, TableCell, TableRow } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MaterialTable from "material-table";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getContact, getSingleContact, setToken, deleteContact, getOrgs, getStaticContent } from "./service";
import Navbar from './Navbar';
import AddContact from './forms/AddContact';
import EditContact from './forms/EditContact';

import Switch from './components/Switch';

let detailed_data = [];

const Contacts = () => {
  const [data, setData] = useState(null);
  
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staticcontent,  setStaticContent] = useState(null);

  const { enqueueSnackbar: snackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setToken();
        const { data } = await getContact();
        setData(data);
      } catch (ex) {
        snackbar("Unable to fetch data.", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();


    const fetchOrgs = async () => {
        try {
            setToken();
            const org = await getOrgs();
            setOrg({ data: org });
        } catch (ex) {
        } finally {
        }
    };
    fetchOrgs();

    const fetchStaticContent = async () => {
      try {
        const { data } = await getStaticContent();
        for(let i=0; i<data.length; i++){
          if(data[i].Id == 'ContactsPage'){
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
        // console.log('no id passed');
      }
      else{
        getSingleContact(id).then(function(result){
          result = mapData([result.data]);
          viewDetail(result[0]); 
        })
      }
      
    }, 3000);
    return () => clearTimeout(timer);


  }, [snackbar]);

  const columns = [
    { title: "UID", field: "uid" },
    { title: "First Name", field: "FirstName" },
    { title: "Email", field: "Email" },
    { title: "Org", field: "OrgName" },
    { title: "Role", field: "Role" },
  ];

  const mapData = (data) => {
    const array = [];
    if (data === null) {
      return array;
    }
    for (var key in data) {

        let row = data[key];

        array.push({
          uid: Number(key)+1,
          FirstName: row.FirstName,
          LastName: row.LastName,
          OrgName: row.OrgName,
          Email: row.Email,
          Mobile: row.Mobile,
          WorkExt: row.WorkExt,
          Department: row.Department,
          PostalCode: row.PostalCode,
          Country: row.Country,
          Role: row.Role,
          OrgId: row.OrgId,
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
    setModalTitle(<div>Add Contact</div>);
    setModalBody(<AddContact closeModal={closeModal} handleClose={handleClose} snackbar={snackbar} org={org} />);
    setOpen(true);
  };

  const closeModal = async () => {
    setLoading(true);
    setModalTitle('');
    setModalBody('');
    setOpen(false);
    try {
      setToken();
      const { data } = await getContact();
      setData(data);
    } catch (ex) {
      snackbar("Unable to fetch data.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (rowData) => {
    // setLoading(true);
    setModalTitle(<div>Edit Contact</div>);
    setModalBody(<EditContact closeModal={closeModal} handleClose={handleClose} snackbar={snackbar} rowData={rowData} org={org} />);
    setOpen(true);
  };

  const handleDelete = async (rowData) => {
    setLoading(true);
    try {
      setToken();
      await deleteContact(rowData.Id);
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
      setModalTitle('Contact Detail');
      var timestamp = row.CreatedTs;
      var date = new Date(timestamp);
      var dt = date.toLocaleString();
      let meetings_html = '';
      let workstreams_html = '';
      let tasks_html = '';
      let task_switches = {};

      detailed_data[row.Id] = getSingleContact(row.Id).then(function(result){
        //console.log(result);
        let meetings = result.data.Meetings;
        meetings.forEach(function(item, i){
          meetings_html += '<div class="anchor-element"><a href="meetings?id='+item.Id+'"><b>'+item.Topic+'</b></a><span style={{"margin-left": "30px"}}><b>01Nov2020</b></span></div>';
        })

        let tasks = result.data.Tasks;
        tasks.forEach(function(item, i){
          tasks_html += '<div class="anchor-element"><a href="tasks?id='+item.Id+'"><b>'+item.Task+'</b></a></div>';
        })

        let workstreams = result.data.WorkStreams;
        workstreams.forEach(function(item, i){
          workstreams_html += '<div class="anchor-element"><a href="workstream?id='+item.Id+'"><b>'+item.Name+'</b></a></div>';
        })

        let b = (
          <>
            <Table className="mb">
              <TableBody>
                <TableRow>
                  <TableCell><b>First Name</b></TableCell>
                  <TableCell>{row.FirstName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Last Name</b></TableCell>
                  <TableCell>{row.LastName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell>{row.Email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Mobile</b></TableCell>
                  <TableCell>{row.Mobile}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>WorkExt</b></TableCell>
                  <TableCell>{row.WorkExt}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Department</b></TableCell>
                  <TableCell>{row.Department}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Postal Code</b></TableCell>
                  <TableCell>{row.PostalCode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Country</b></TableCell>
                  <TableCell>{row.Country}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Role</b></TableCell>
                  <TableCell>{row.Role}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Organization</b></TableCell>
                  <TableCell>{row.OrgName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Create At</b></TableCell>
                  <TableCell>{dt}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
           
             <div><strong>Workstreams</strong>
                <div dangerouslySetInnerHTML={{__html: workstreams_html}} />
             </div>
  
             <div style={{"margin-top": "20px"}}><strong>Tasks</strong>
                {/* <div dangerouslySetInnerHTML={{__html: tasks_html}} /> */}

                { tasks.map(task => (
                    
                    <div>
                      <span key={ task.Id } class="anchor-element">
                        <a href={'tasks?id=' + task.Id}>
                          <b>{task.Task}</b>
                        </a>
                      </span>
                      <Switch checked={task.IsCompleted} />

                    </div>
                )) }

                {/* <div><Switch /><span class="stakeholder-text">Paint the room</span></div> */}
                {}
             </div>
  
             <div style={{"margin-top": "20px"}}><strong>Meetings</strong>
                {/* <Switch checked={item.IsCompleted} /> +'<div class="anchor-element"><a href="tasks?id='+item.Id+'"><b>'+item.Task+'</b></a></div>' */}
                  
                <div dangerouslySetInnerHTML={{__html: meetings_html}} />
                {/* <div class="anchor-element"><a href=""><b>New website project</b></a><span style={{"margin-left": "30px"}}><b>01Nov2020</b></span></div> */}
             </div>
  
  
  
            <div className="margin">
              <Button variant="contained" onClick={handleClose} className="margin" color="primary">Close</Button>
            </div>
  
            {/* <div className="margin"  style={{"margin-top": "20px"}}>
              <center>
                <Button variant="contained" onClick={handleClose} className="margin" color="default">Discard</Button>
                <Button variant="contained" onClick={handleClose} className="margin" color="default" style={{"margin-left": "35px"}}>Save</Button>
              </center>
              
            </div> */}
          </>
        );
        setModalBody(b);
        handleOpen();
        
      });
      
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

export default Contacts;
