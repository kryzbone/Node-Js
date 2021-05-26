import React, { Component } from 'react'

export default class Users extends Component {
    state = {
        username: "",
    }

    username = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    submit = (e) => {
        e.preventDefault();

        const data = this.state
        console.log(data);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        fetch('http://localhost:5000/users/add', options)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))

        this.setState({
            username: ''
        })
    }

    
    render() {
        return (
            <div>
                <h3>Create New Exercise</h3>
                <form onSubmit={this.submit} >
                    <div className="form-group">
                        <label htmlFor="">Username: </label>
                        <input  type="text"
                                required
                                value={this.state.username}
                                className="form-control"
                                onChange={this.username}
                        />
                    </div>

                    <div className="form-group" >
                        <input type="submit" value="Create User" className="btn btn-primary" />
                    </div>

                </form>    
            </div>
        )
    }
}
