import React, { Component } from 'react';
import { TextField, Button, CircularProgress, FormControlLabel, Checkbox } from '@material-ui/core';
import { setToken, addWorkstream } from '../service';


class AddWork extends Component {

    constructor(props) {
        super(props);
        this.state = {
          name: '',
          Priority: '',
          Status: '',
          Blocked: false,
          err_name: '',
          err_Priority: '',
          err_Status: '',
          loading: false,
          err_n: false,
          err_w: false,
          err_a: false,
        };
      }

      myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
      }

      chkChangeHandler = (event) => {
        if(event.target.checked)
        {
            this.setState({Blocked: true});
        }
        else
        {
            this.setState({Blocked: false});
        }
        // setTimeout(() => {
        //     console.log(this.state.Blocked);
        // }, 50);
      }

      mySubmitHandler = (event) => {
        
        event.preventDefault();
        let name = this.state.name;
        let Priority = this.state.Priority;
        let Status = this.state.Status;
        let Blocked = this.state.Blocked;
        var ok = 0;
        this.setState({err_name: ''});
        this.setState({err_Priority: ''});
        this.setState({err_Status: ''});
        this.setState({err_n: false});
        this.setState({err_w: false});
        this.setState({err_a: false});
        this.setState({loading: true});
        if(name.trim()==='')
        {
            this.setState({err_name: 'Name is required!'});
            this.setState({err_n: true});
            ok++;
        }
        if(Priority.trim()==='')
        {
            this.setState({err_Priority: 'Priority is required!'});
            this.setState({err_w: true});
            ok++;
        }
        if(Status.trim()==='')
        {
            this.setState({err_Status: 'Status is required!'});
            this.setState({err_a: true});
            ok++;
        }
        if(ok===0)
        {
            try {
                setToken();
                addWorkstream({Name:name, Status:Status, Priority: Priority, Blocked:Blocked});
                this.props.snackbar("Data added successfully.", { variant: "success" });
            } catch(ex){
                this.props.snackbar("Unable to add data.", { variant: "error" });
                this.setState({loading: false});
            } finally {
                this.props.closeModal();
            }
        }
        else
        {
            this.setState({loading: false});
        }
      }

    render() {
        return (
            <div className="margin">
                <form  onSubmit={this.mySubmitHandler}>
                    <TextField id="name" name="name" fullWidth className="mb" label="Name" onChange={this.myChangeHandler} variant="outlined" error={this.state.err_n} helperText={this.state.err_name} />
                    <TextField id="Priority" name="Priority" fullWidth className="mb" label="Priority" onChange={this.myChangeHandler} variant="outlined" error={this.state.err_w} helperText={this.state.err_Priority} />
                    <TextField id="Status" name="Status" fullWidth className="mb" label="Status" onChange={this.myChangeHandler} variant="outlined" error={this.state.err_a} helperText={this.state.err_Status} />
                    <FormControlLabel 
                                value="start" 
                                control={<Checkbox color="primary" 
                                id="Blocked" 
                                name="Blocked" 
                                checked={this.state.Blocked} 
                                onChange={this.chkChangeHandler} />} 
                                label="Blocked" 
                                labelPlacement="start" 
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

export default AddWork;
