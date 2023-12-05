import React, { Component } from 'react';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import { setToken, updateOrgs } from '../service';


class EditOrganization extends Component {

    constructor(props) {
        super(props);
        this.state = {
          name: props.rowData.name,
          website: props.rowData.website,
          address: props.rowData.address,
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
        this.setState({[nam]: val});
      }

      mySubmitHandler = (event) => {
        
        event.preventDefault();
        let name = this.state.name;
        let website = this.state.website;
        let address = this.state.address;
        var ok = 0;
        this.setState({err_name: ''});
        this.setState({err_website: ''});
        this.setState({err_address: ''});
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
        if(website.trim()==='')
        {
            this.setState({err_website: 'Website is required!'});
            this.setState({err_w: true});
            ok++;
        }
        if(address.trim()==='')
        {
            this.setState({err_address: 'Postal Address is required!'});
            this.setState({err_a: true});
            ok++;
        }
        if(ok===0)
        {
            try {
                setToken();
                updateOrgs(this.props.rowData.Id, {Name:name, Address:address, Website: website});
                this.props.snackbar("Data updated successfully.", { variant: "success" });
            } catch(ex){
                this.props.snackbar("Unable to update data.", { variant: "error" });
                this.setState({loading: false});
            } finally {
                setTimeout(() => {
                    this.props.closeModal();
                }, 500);
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
                    <TextField id="name" name="name" value={this.state.name} fullWidth className="mb" label="Name" onChange={this.myChangeHandler} variant="outlined" error={this.state.err_n} helperText={this.state.err_name} />
                    <TextField id="website" name="website" value={this.state.website} fullWidth className="mb" label="Website" onChange={this.myChangeHandler} variant="outlined" error={this.state.err_w} helperText={this.state.err_website} />
                    <TextField id="address" name="address" value={this.state.address} fullWidth className="mb" label="Postal Addres" onChange={this.myChangeHandler} variant="outlined" error={this.state.err_a} helperText={this.state.err_address} />
                    <div className="margin">
                        <Button type="button" variant="contained" color="default" onClick={this.props.handleClose} >Cancel</Button> &nbsp;
                        <Button type="submit" variant="contained" color="primary" disabled={this.state.loading} >{this.state.loading ? <CircularProgress color="primary" variant="indeterminate" /> : "Save"}</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default EditOrganization;
