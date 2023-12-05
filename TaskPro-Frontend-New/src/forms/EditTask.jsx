import React, { Component } from 'react';
import { TextField, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
import { setToken, updateTask } from '../service';


class EditTask extends Component {

    constructor(props) {
        super(props);
        let row = props.rowData;
        this.state = {
            Task: row.Task,
            Detail: row.Detail,
            ContactId: row.ContactId,
            OrgId: row.OrgId,
            WorkStreamId: row.WorkStreamId,
            RequiredBy: row.RequiredBy,
            IsCompleted: row.IsCompleted,
            OrgName: row.OrgName,
            ContactName: row.ContactName,
            WorkStreamName: row.WorkStreamName,
            err_name: '',
            err_website: '',
            err_address: '',
            loading: false,
            err_n: false,
            err_w: false,
            err_a: false,
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

    chkChangeHandler = (event) => {
        if(event.target.checked)
        {
            this.setState({IsCompleted: true});
        }
        else
        {
            this.setState({IsCompleted: false});
        }
    }


    mySubmitHandler = (event) => {

        event.preventDefault();
        /* Task: '',
            Detail: '',
            ContactId: '',
            OrgId: '',
            WorkStreamId: '',
            RequiredBy: '',
            IsCompleted: '',
            OrgName: '',
            ContactName: '',
            WorkStreamName: '', */
            let data = {
                Task: this.state.Task,
                Detail: this.state.Detail,
                ContactId: this.state.ContactId,
                OrgId: this.state.OrgId,
                WorkStreamId: this.state.WorkStreamId,
                RequiredBy: this.state.RequiredBy,
                IsCompleted: this.state.IsCompleted,
                OrgName: this.state.OrgName,
                ContactName: this.state.ContactName,
                WorkStreamName: this.state.WorkStreamName
            }
        var ok = 0;
        this.setState({ loading: true });
        if (ok === 0) {
            try {
                setToken();
                updateTask(this.props.rowData.Id,data);
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
                    <TextField id="Task" name="Task" value={this.state.Task} fullWidth className="mb" label="Task" onChange={this.myChangeHandler} variant="outlined" />
                    <FormControl fullWidth variant="outlined" className="mb">
                        <InputLabel id="ContactId-select-outlined-label">Stakeholder</InputLabel>
                        <Select
                            labelId="ContactId-select-outlined-label"
                            id="ContactId"
                            name="ContactId"
                            label="Stakeholder"
                            onChange={this.contactChangeHandler}
                            value={this.state.ContactId}
                        >
                            <MenuItem value={0}>None</MenuItem>
                           {this.props.contacts.data.map((value, index) => {
                             return <MenuItem value={value.Id} key={index}>{value.FirstName} {value.LastName}</MenuItem>
                           })}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth variant="outlined" className="mb">
                        <InputLabel id="Workstream-select-outlined-label">Workstream</InputLabel>
                        <Select
                            labelId="Workstream-select-outlined-label"
                            id="WorkStreamId"
                            name="WorkStreamId"
                            label="Workstream"
                            onChange={this.workChangeHandler}
                            value={this.state.WorkStreamId}
                        >
                            <MenuItem value={0}>None</MenuItem>
                           {this.props.works.data.map((value, index) => {
                             return <MenuItem value={value.Id} key={index}>{value.Name}</MenuItem>
                           })}
                        </Select>
                    </FormControl>
                    <TextField 
                    id="RequiredBy" 
                    name="RequiredBy" 
                    fullWidth 
                    className="mb" 
                    label="Required by" 
                    type="date"
                    value={this.state.RequiredBy}
                    onChange={this.myChangeHandler} 
                    variant="outlined" 
                    InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <FormControlLabel 
                        value="start" 
                        className="mb"
                        control={<Checkbox color="primary" 
                        id="IsCompleted" 
                        name="IsCompleted" 
                        checked={this.state.IsCompleted} 
                        onChange={this.chkChangeHandler} />} 
                        label="Completed" 
                        labelPlacement="start" 
                        />
                    <TextField 
                        id="Detail" 
                        name="Detail" 
                        fullWidth 
                        className="mb" 
                        label="Task Detail" 
                        onChange={this.myChangeHandler} 
                        variant="outlined" 
                        rows={5}
                        value={this.state.Detail}
                        multiline
                        />
                    
                    <div className="margin">
                        <Button type="button" variant="contained" color="default" onClick={this.props.handleClose} >Cancel</Button> &nbsp;
                        <Button type="submit" variant="contained" color="primary" disabled={this.state.loading} >{this.state.loading ? <CircularProgress color="primary" variant="indeterminate" /> : "Save"}</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default EditTask;
