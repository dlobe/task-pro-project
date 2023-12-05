import React, { Component } from 'react';
import { TextField, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { setToken, updateContact, getSingleOrgs } from '../service';


class EditContact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            FirstName: this.props.rowData.FirstName,
            LastName: this.props.rowData.LastName,
            Email: this.props.rowData.Email,
            Mobile: this.props.rowData.Mobile,
            WorkExt: this.props.rowData.WorkExt,
            Department: this.props.rowData.Department,
            PostalCode: this.props.rowData.PostalCode,
            Country: this.props.rowData.Country,
            Role: this.props.rowData.Role,
            OrgId: this.props.rowData.OrgId,
            OrgName: this.props.rowData.OrgName,
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

    orgChangeHandler = (event) => {
        let orgid = event.target.value;
        this.setState({OrgId: orgid});
        const fetchOrg = async () => {
            try {
                setToken();
                const org = await getSingleOrgs(orgid);
                setTimeout(() => {
                    this.setState({OrgName: org.data.Name });
                }, 100);
            } catch (ex) {
            } finally {
            }
        };
        fetchOrg();
    }

    mySubmitHandler = (event) => {

        event.preventDefault();
        /* FirstName: '',
            LastName: '',
            Email: '',
            Mobile: '',
            WorkExt: '',
            Department: '',
            PostalCode: '',
            Country: '',
            Role: '',
            OrgId: 0,
            OrgName: '', */
            let data = {
                FirstName: this.state.FirstName,
                LastName: this.state.LastName,
                Email: this.state.Email,
                Mobile: this.state.Mobile,
                WorkExt: this.state.WorkExt,
                Department: this.state.Department,
                PostalCode: this.state.PostalCode,
                Country: this.state.Country,
                Role: this.state.Role,
                OrgId: this.state.OrgId,
                OrgName: this.state.OrgName
            }
        var ok = 0;
        this.setState({ loading: true });
        if (ok === 0) {
            try {
                setToken();
                updateContact(this.props.rowData.Id, data);
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
                    <TextField id="FirstName" name="FirstName" value={this.state.FirstName} fullWidth className="mb" label="First Name" onChange={this.myChangeHandler} variant="outlined" />
                    <TextField id="LastName" name="LastName" value={this.state.LastName} fullWidth className="mb" label="Last Name" onChange={this.myChangeHandler} variant="outlined" />
                    <TextField id="Email" name="Email" value={this.state.Email} fullWidth className="mb" label="Email" onChange={this.myChangeHandler} variant="outlined" />
                    <TextField id="Mobile" name="Mobile" value={this.state.Mobile} fullWidth className="mb" label="Mobile" onChange={this.myChangeHandler} variant="outlined" />
                    <TextField id="WorkExt" name="WorkExt" value={this.state.WorkExt} fullWidth className="mb" label="Work Extension" onChange={this.myChangeHandler} variant="outlined" />
                    <TextField id="Department" name="Department" value={this.state.Department} fullWidth className="mb" label="Department" onChange={this.myChangeHandler} variant="outlined" />
                    <TextField id="PostalCode" name="PostalCode" value={this.state.PostalCode} fullWidth className="mb" label="Postal Code" onChange={this.myChangeHandler} variant="outlined" />
                    <TextField id="Country" name="Country" value={this.state.Country} fullWidth className="mb" label="Country" onChange={this.myChangeHandler} variant="outlined" />
                    <TextField id="Role" name="Role" value={this.state.Role} fullWidth className="mb" label="Role" onChange={this.myChangeHandler} variant="outlined" />
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="OrgId-select-outlined-label">Organization</InputLabel>
                        <Select
                            labelId="OrgId-select-outlined-label"
                            id="OrgId"
                            name="OrgId"
                            label="Organization"
                            onChange={this.orgChangeHandler}
                            value={this.state.OrgId}
                        >
                            <MenuItem value={0}>None</MenuItem>
                           {this.props.org.data.data.map((value, index) => {
                             return <MenuItem value={value.Id} key={index}>{value.Name}</MenuItem>
                           })}
                        </Select>
                    </FormControl>
                    <div className="margin">
                        <Button type="button" variant="contained" color="default" onClick={this.props.handleClose} >Cancel</Button> &nbsp;
                        <Button type="submit" variant="contained" color="primary" disabled={this.state.loading} >{this.state.loading ? <CircularProgress color="primary" variant="indeterminate" /> : "Save"}</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default EditContact;
