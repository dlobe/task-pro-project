import React, { Component } from 'react';
import { TextField, Button, CircularProgress, InputLabel, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
import { setToken, updateMeeting } from '../service';


class EditMeeting extends Component {

    constructor(props) {
        super(props);
        let row = props.rowData;
        this.state = {
            Agenda: row.Agenda,
            ContactIds: row.ContactIds,
            HeldDate: row.HeldDate,
            Minutes: row.Minutes,
            OrgIds: row.OrgIds,
            TaskIds: row.TaskIds,
            Topic: row.Topic,
            WorkStreamId: row.WorkStreamId,
            WorkStreamName: row.WorkStreamName,
            loading: false,
        };
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    contactChangeHandler = (event) => {
        let contactId = event.target.value;
        this.setState({ContactId: contactId});
        let contacts = this.props.contacts.data;
        var row = contacts.find(o => o.Id >= contactId);
        var FirstName = row.FirstName;
        var OrgId = row.OrgId;
        var OrgName = row.OrgName;
        this.setState({ContactName: FirstName });
        this.setState({OrgId: OrgId });
        this.setState({OrgName: OrgName });
    }


    workChangeHandler = (event) => {
        let workId = event.target.value;
        this.setState({WorkStreamId: workId});
        let works = this.props.works.data;
        var row = works.find(o => o.Id >= workId);
        this.setState({WorkStreamName: row.Name });
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
        // console.log(this.state.TaskIds);
    }


    mySubmitHandler = (event) => {

        event.preventDefault();
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
                updateMeeting(this.props.rowData.Id, data);
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
                            onChange: this.handleFieldChange
                        }}
                    >
                        {this.props.contacts.data.map((value, index) => {
                            return <MenuItem value={value.Id} key={index}>{value.FirstName} {value.LastName}</MenuItem>
                        })}
                    </TextField>


                    <TextField
                        select
                        name="OrgIds"
                        id="OrgIds"
                        variant="outlined"
                        label="Organizations"
                        fullWidth
                        className="mb"
                        SelectProps={{
                            multiple: true,
                            value: this.state.OrgIds,
                            onChange: this.handleFieldChange
                        }}
                    >
                        {this.props.orgs.data.map((value, index) => {
                            return <MenuItem value={value.Id} key={index}>{value.Name}</MenuItem>
                        })}
                    </TextField>
                    

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
                            onChange: this.handleFieldChange
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
                    <InputLabel>Related tasks</InputLabel>
                        {this.props.tasks.data.map((value, index) => {
                             return <div key={index}>
                                    <FormControlLabel 
                                    value={value.Id} 
                                    data-task={value}
                                    control={<Checkbox color="primary" 
                                    id={"TaskIds"+index} 
                                    name="TaskIds[]" 
                                    checked={this.state.TaskIds.includes(value.Id)} 
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

export default EditMeeting;
