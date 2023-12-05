import React, { Component } from 'react';
import { TextField, Button, CircularProgress, InputLabel, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
import { setToken, addMeeting, getTasksByWorkStreamId } from '../service';
import AddBoxIcon from '@material-ui/icons/AddBox';


class AddMeeting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Agenda: '',
            ContactIds: [],
            HeldDate: '',
            Minutes: '',
            OrgIds: [],
            OrgNames: [],
            TaskIds: [],
            Topic: '',
            WorkStreamId: '',
            WorkStreamName: '',
            loading: false,
            TasksList: {},     // tasks list, will updated on workstream
            OrganizationsList: []    // tasks list, will updated on workstream
        };
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    contactChangeHandler = (event) => {

        let name = event.target.name;
        let contactId = event.target.value;
        this.setState({[name]: contactId}, () => {
            this.setState({
                OrgIds: [],
                OrgNames: [],
                OrganizationsList: []
            }, () => {
                let stateContact = this.state.ContactIds;
                let propsContacts = this.props.contacts.data;

                console.log(stateContact);
                console.log(propsContacts);

                let ois = [];
                let ons = [];
                let ol = [];

                for(let i=0; i<stateContact.length; i++){
                    var row = propsContacts.find(o => o.Id == stateContact[i]);

                    // for(let j=0; j<propsContacts.length; j++){
                    //     if(stateContact[i] == propsContacts[j].Id){
                            ois.push(row.OrgId);
                            ons.push(row.OrgName);
                            ol.push({ 'Id': row.OrgId, 'Name': row.OrgName });
                    //     }
                    // }

                    
                }
                this.setState({ OrgIds: ois, OrgNames: ons,  OrganizationsList: ol })
            });
            
        });

    }


    workChangeHandler = (event) => {
        let workId = event.target.value;
        // this.setState({WorkStreamId: workId});
        // let works = this.props.works.data;
        // var row = works.find(o => o.Id >= workId);
        // this.setState({WorkStreamName: row.Name });

        let nam = event.target.name;
        let v = event.target.value;
        this.setState({[nam]: v});

        // update tasks list
        const fetchTasks = async () => {
            try {
                setToken();
                const tasks = await getTasksByWorkStreamId(workId);
                if(tasks.data.length){
                    this.setState({TasksList: tasks})
                }
                else{
                    this.setState({TasksList: {}})
                }
                
            } catch (ex) {
            } finally {
            }
        };
        fetchTasks();

    }

    handleFieldChange = (event) => {
        let nam = event.target.name;
        let v = event.target.value;
        this.setState({[nam]: v});
      };

    chkChangeHandler = (event) => {
        let tasksids = this.state.TaskIds;
        let tid = event.target.value;
        if(event.target.checked)
        {
            tasksids.push(tid);
        }
        else
        {
            tasksids.pop(tid);
        }
        this.setState({TaskIds: tasksids});
    }


    mySubmitHandler = (event) => {

        event.preventDefault();

        // check for nessasry fields
        //let c_contact_ids = ;
        
        if(!this.state.ContactIds.length){
            this.props.snackbar("Please select Attendees.", { variant: "error" });
            return;
        }

        if(!this.state.WorkStreamId){
            this.props.snackbar("Please select Workstream.", { variant: "error" });
            return;
        }

        if(!this.state.HeldDate){
            this.props.snackbar("Please select Held Date.", { variant: "error" });
            return;
        }

        if(!this.state.TaskIds.length){
            this.props.snackbar("Please select atleast 1 task.", { variant: "error" });
            return;
        }

        //console.log()
        
        // event.preventDefault();
            let data = {
                Agenda: this.state.Agenda,
                ContactIds: this.state.ContactIds,
                HeldDate: this.state.HeldDate,
                Minutes: this.state.Minutes,
                OrgIds: this.state.OrgIds,
                TaskIds: this.state.TaskIds,
                Topic: this.state.Topic,
                WorkStreamId: this.state.WorkStreamId,
            }
        var ok = 0;
        this.setState({ loading: true });
        if (ok === 0) {
            try {
                setToken();
                addMeeting(data);
                this.props.snackbar("Data added successfully.", { variant: "success" });
            } catch (ex) {
                this.props.snackbar("Unable to add data.", { variant: "error" });
                this.setState({ loading: false });
            } finally {
                setTimeout(() => {
                    this.props.closeModal();
                }, 1000);
            }
        }
        else {
            this.setState({ loading: false });
        }
    }

    render() {
        return (
            <div className="margin">
                <form onSubmit={this.mySubmitHandler}>
                    <TextField id="Topic" name="Topic" value={this.state.Topic} fullWidth className="mb" label="Topic" onChange={this.myChangeHandler} variant="outlined" />
                    <TextField
                        select
                        name="ContactIds"
                        id="ContactIds"
                        variant="outlined"
                        label="Attendees"
                        fullWidth
                        className="mb"
                        SelectProps={{
                            multiple: true,
                            value: this.state.ContactIds,
                            // onChange: this.handleFieldChange
                            onChange: this.contactChangeHandler
                        }}
                    >
                        {this.props.contacts.data.map((value, index) => {
                            let n = value.FirstName+' '+value.LastName;
                            return <MenuItem value={value.Id} key={index}>{n}</MenuItem>
                        })}
                    </TextField>
                    { console.log('ddddd') }
                    { console.log(this.state.OrganizationsList) }
                    <div style = {{ marginBottom : 30 }}>
                        <p><strong>Organizations:</strong></p>
                        <div>
                            {this.state.OrganizationsList.map((value, index) => {
                                return <p value={value.Id} key={index}><a href={'organizations?id='+ value.Id}>{value.Name}</a></p>
                            })}
                        </div>
                    </div>

                    {/* <TextField
                        select 
                        name="OrgIds"
                        id="OrgIds"
                        variant="outlined"
                        placeholder="Organizations"
                        //label="Organizations"
                        fullWidth
                        className="mb"
                        SelectProps={{
                            readOnly: true,
                            multiple: true,
                            value: this.state.OrgIds,
                            onChange: this.handleFieldChange
                        }}
                    >
                        { {this.props.orgs.data.map((value, index) => {
                            return <MenuItem value={value.Id} key={index}>{value.Name}</MenuItem>
                        })} }
                        {this.state.OrganizationsList.map((value, index) => {
                            return <MenuItem value={value.Id} key={index}>{value.Name}</MenuItem>
                        })}
                    </TextField> */}
                    

                    <TextField
                        select
                        name="WorkStreamId"
                        id="WorkStreamId"
                        variant="outlined"
                        label="Workstream"
                        fullWidth
                        className="mb"
                        SelectProps={{
                            value: this.state.WorkStreamId,
                            // onChange: this.handleFieldChange
                            onChange: this.workChangeHandler
                        }}
                    >
                        <MenuItem value={0}>None</MenuItem>
                           {this.props.works.data.map((value, index) => {
                             return <MenuItem value={value.Id} key={index}>{value.Name}</MenuItem>
                           })}
                    </TextField>
                    
                    <TextField 
                    id="HeldDate" 
                    name="HeldDate" 
                    fullWidth 
                    className="mb" 
                    label="Held Date" 
                    type="date"
                    value={this.state.HeldDate}
                    onChange={this.myChangeHandler} 
                    variant="outlined" 
                    InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <TextField 
                        id="Agenda" 
                        name="Agenda" 
                        fullWidth 
                        className="mb" 
                        label="Agenda" 
                        onChange={this.myChangeHandler} 
                        variant="outlined" 
                        rows={5}
                        value={this.state.Agenda}
                        multiline
                        />

                    <TextField 
                        id="Minutes" 
                        name="Minutes" 
                        fullWidth 
                        className="mb" 
                        label="Minutes" 
                        onChange={this.myChangeHandler} 
                        variant="outlined" 
                        rows={5}
                        value={this.state.Minutes}
                        multiline
                        />
                        <InputLabel>Related tasks <a href="tasks?open-add-model=1"><AddBoxIcon style={{ verticalAlign: "middle", color: "#3f51b5" }} /></a></InputLabel>
                        {/* {this.props.tasks.data.map((value, index) => { */}
                        
                        {Object.keys(this.state.TasksList).length > 0 && this.state.TasksList.data.map((value, index) => {
                             return <div key={index}>
                                    <FormControlLabel 
                                    value={value.Id} 
                                    data-task={value}
                                    control={<Checkbox color="primary" 
                                    id={"TaskIds"+index} 
                                    name="TaskIds[]" 
                                    checked={this.state.IsCompleted} 
                                    onChange={this.chkChangeHandler} />} 
                                    label={value.Task} 
                                    labelPlacement="end" 
                                    />
                                    </div>
                        })}
                        
                    <div className="margin">
                        <Button type="button" variant="contained" color="default" onClick={this.props.handleClose} >Cancel</Button> &nbsp;
                        <Button type="submit" variant="contained" color="primary" disabled={this.state.loading} >{this.state.loading ? <CircularProgress color="primary" variant="indeterminate" /> : "Save"}</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default AddMeeting;
