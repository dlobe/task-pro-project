import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography';
import Navbar from './Navbar'

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {staticcontent: null};
    }

    componentDidMount() {
        this.getStaticContent();
    }

    getStaticContent() {
   
        fetch("https://im1gh0jvn9.execute-api.us-east-1.amazonaws.com/Prod/AppContent", {
            "method": "GET"
        })
        .then(response => response.json())
        .then(response => {
            for(let i=0; i<response.length; i++){
                if(response[i].Id == 'DashboardPage'){
                    this.setState({ staticcontent: response[i] })
                }
            } 
        })
    }

    render() {
        return (
            <div>
                <Navbar />
                <center style={{"padding": "50px"}}>
                    <Typography variant="h1" component="h2" gutterBottom>
                        { (this.state.staticcontent !== null) ? this.state.staticcontent.Content.WelcomeLine : '' }
                    </Typography>
                </center>
            </div>
        )
    }
}
