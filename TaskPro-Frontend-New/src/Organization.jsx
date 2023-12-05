import React, { Component } from 'react';
import { Button, CircularProgress, TableBody, Table, TableCell, TableRow } from "@material-ui/core";
import { getSingleOrgs, setToken } from './service';

class Organization extends Component {

    constructor(props) {
        super(props);
        this.loadOrg();
        this.state = {
            tbody: (<TableBody>
                        <TableRow>
                            <TableCell><center><CircularProgress /></center></TableCell>
                        </TableRow>
                    </TableBody>)
        };
        this.loading = true;
    }

    loadOrg = (event) => {
        const fetchData = async () => {
            try {
                setToken();
                const org = await getSingleOrgs(this.props.rowData.Id);
                setTimeout(() => {
                    this.setState(org.data);// = org.data;
                    console.log(this.state);
                    let timestamp = this.state.CreatedTs;
                    let date = new Date(timestamp);
                    let dt = date.toLocaleString();
                    this.setState({created: dt});

                    let tablebody = (<TableBody> 
                            <TableRow>
                                <TableCell><b>Name</b></TableCell>
                                <TableCell>{this.state.Name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><b>Website</b></TableCell>
                                <TableCell>{this.state.Website}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><b>Address</b></TableCell>
                                <TableCell>{this.state.Address}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><b>Contacts</b></TableCell>
                                <TableCell>
                                {this.state.Contacts.map((value, index) => {
                                    let d = '';
                                    let n = value.FirstName+' '+value.LastName;
                                    if(index!=0)
                                    {
                                        d = ', '+n;
                                    }
                                    else
                                    {
                                        d = n;
                                    }
                                    return d;
                                })}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><b>Meetings</b></TableCell>
                                <TableCell>
                                {this.state.Meetings.map((value, index) => {
                                    let d = '';
                                    let n = value.Agenda;
                                    if(index!=0)
                                    {
                                        d = ', '+n;
                                    }
                                    else
                                    {
                                        d = n;
                                    }
                                    return d;
                                })}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><b>Tasks</b></TableCell>
                                <TableCell>
                                {this.state.Tasks.map((value, index) => {
                                    let d = '';
                                    let n = value.ContactName;
                                    if(index!=0)
                                    {
                                        d = ', '+n;
                                    }
                                    else
                                    {
                                        d = n;
                                    }
                                    return d;
                                })}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><b>WorkStreams</b></TableCell>
                                <TableCell>
                                {this.state.WorkStreams.map((value, index) => {
                                    let d = '';
                                    let n = value.Name;
                                    if(index!=0)
                                    {
                                        d = ', '+n;
                                    }
                                    else
                                    {
                                        d = n;
                                    }
                                    return d;
                                })}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><b>Create At</b></TableCell>
                                <TableCell>{this.state.created}</TableCell>
                            </TableRow>
                        </TableBody>);
                        this.setState({tbody:tablebody});

                }, 100);
            } catch (ex) {
                this.props.snackbar("Unable to load data.", { variant: "error" });
            } finally {
            }
        };
        fetchData();
    }


    render() {
        return (
            <>
                <Table className="mb">
                {this.state.tbody}
                </Table>
                <div className="margin">
                    <Button variant="contained" onClick={this.props.handleClose} className="margin" color="primary">Close</Button>
                </div>
            </>
        );
    }
}

export default Organization;
