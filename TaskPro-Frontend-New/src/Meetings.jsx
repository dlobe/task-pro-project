import { Box, Container, Button, TableBody, Table, TableCell, TableRow } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MaterialTable from "material-table";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getMeeting, setToken, deleteMeeting, getContact, getWorkstream, getOrgs, getTask, getStaticContent, getSingleMeeting } from "./service";
import Navbar from './Navbar';
import AddMeeting from './forms/AddMeeting';
import EditMeeting from './forms/EditMeeting';
import React from 'react';

console.log(React.version);

const Meetings = () => {
  const [data, setData] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [orgs, setOrgs] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [works, setWorks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staticcontent,  setStaticContent] = useState(null);

  const { enqueueSnackbar: snackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
      try {
        setToken();
        const { data } = await getMeeting();
        setData(data);
        //console.log(data);
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
        } catch (ex) {
        } finally {
            setLoading(false);
        }

        try {
            setLoading(true);
            setToken();
            const orgs = await getOrgs();
            setOrgs(orgs);
        } catch (ex) {
        } finally {
            setLoading(false);
        }

        try {
            setLoading(true);
            setToken();
            const tasks = await getTask();
            setTasks(tasks);
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
          if(data[i].Id == 'MeetingsPage'){
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
        console.log('no id passed');
      }
      else{
        getSingleMeeting(id).then(function(result){
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
    { title: "Topic", field: "Topic" },
    { title: "Attendees", field: "Attendees" },
    { title: "Organisations", field: "orgNames" },
    { title: "Workstream", field: "WorkStreamName" },
    { title: "Held date", field: "HeldDateDt" },
  ];

  const mapData = (data) => {
    const array = [];
    if (data === null) {
      return array;
    }
    for (var key in data) {
        // console.log(data);
        let row = data[key];
        let date = new Date(row.HeldDate);
        let HeldDateDt = date.toDateString();
        let orgNames = '';
        let Attendees = '';
        let taskNames = '';
        //console.log(row.Contacts);
        row.Contacts.map((value, index) => {
            if(index === ((row.Contacts.length)-1))
            {
                Attendees += value.FirstName;
            }
            else
            {
                Attendees += value.FirstName+', ';
            }
            return Attendees;
        });

        row.Organizations.map((value, index) => {
            if(index === ((row.Organizations.length)-1))
            {
                orgNames += value.Name;
            }
            else
            {
                orgNames += value.Name+', ';
            }
            return orgNames;
        });

        row.Tasks.map((value, index) => {
          if(index === ((row.Tasks.length)-1))
          {
              taskNames += value.Task;
          }
          else
          {
              taskNames += value.Task+', ';
          }
          return taskNames;
      });

        array.push({
          uid: Number(key)+1,
          Agenda: row.Agenda,
          ContactIds: row.ContactIds,
          Contacts: row.Contacts,
          Attendees: Attendees,
          HeldDate: row.HeldDate,
          HeldDateDt: HeldDateDt,
          Minutes: row.Minutes,
          OrgIds: row.OrgIds,
          Organizations: row.Organizations,
          orgNames: orgNames,
          TaskIds: row.TaskIds,
          Tasks: row.Tasks,
          taskNames: taskNames,
          Topic: row.Topic,
          WorkStreamId: row.WorkStreamId,
          WorkStreamName: row.WorkStreamName,
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
    setModalTitle(<div>Add Meeting</div>);
    setModalBody(<AddMeeting closeModal={closeModal} handleClose={handleClose} snackbar={snackbar} orgs={orgs} tasks={tasks} contacts={contacts} works={works} />);
    setOpen(true);
  };

  const closeModal = async () => {
    setLoading(true);
    setModalTitle('');
    setModalBody('');
    setOpen(false);
    try {
      setToken();
      const { data } = await getMeeting();
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
    setModalBody(<EditMeeting closeModal={closeModal} handleClose={handleClose} snackbar={snackbar} rowData={rowData} orgs={orgs} tasks={tasks} contacts={contacts} works={works} />);
    setOpen(true);
  };

  const handleDelete = async (rowData) => {
    setLoading(true);
    try {
      setToken();
      await deleteMeeting(rowData.Id);
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
      //console.log(row);
      setModalTitle('Organization Detail');
      var timestamp = row.CreatedTs;
      var date = new Date(timestamp);
      var dt = date.toLocaleString();

      let tasks_html = '';
      let stakeholders_html = '';
      let organizations_html = '';

      getSingleMeeting(row.Id).then(function(result){
        console.log(result);

        let tasks = result.data.Tasks;
        tasks.forEach(function(item, i){
          tasks_html += '<div class="anchor-element"><a href="tasks?id='+item.Id+'"><b>'+item.Task+'</b></a></div>';
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
                  <TableCell><b>Topic</b></TableCell>
                  <TableCell>{row.Topic}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Attendees</b></TableCell>
                  <TableCell>{row.Attendees}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Organizations</b></TableCell>
                  <TableCell>{row.orgNames}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Workstream</b></TableCell>
                  <TableCell>{row.WorkStreamName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Held Date</b></TableCell>
                  <TableCell>{row.HeldDateDt}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Tasks</b></TableCell>
                  <TableCell>{row.taskNames}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Agenda</b></TableCell>
                  <TableCell>{row.Agenda}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Minutes</b></TableCell>
                  <TableCell>{row.Minutes}</TableCell>
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
            </div>
  
            <div style={{"margin-top": "20px"}}><strong>Tasks</strong>
              <div dangerouslySetInnerHTML={{__html: tasks_html}} />
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

export default Meetings;
