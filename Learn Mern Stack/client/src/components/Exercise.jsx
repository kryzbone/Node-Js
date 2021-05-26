import React, { Component } from 'react'

export default class Exercise extends Component {
    state = {
        username: "",
        description: "",
        duration: 0,
        users: []
    }

    userInput = React.createRef()

    componentDidMount() {
        fetch('http://localhost:5000/users')
        .then(res => res.json())
        .then(data => {
            const users =[]
            //filter users
            data.forEach(itm => {
                if(!itm.email) {
                    users.push(itm.username)
                } 
            })
            //set users state
            this.setState({
                users: users
            })
        })
        .catch(err => console.log(err))
    }


    username = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    description = (e) => {
        this.setState({
            description: e.target.value
        })
    }


    duration = (e) => {
        this.setState({
            duration: e.target.value
        })
    }


    submit = (e) => {
        e.preventDefault();

        const data = {
            username: this.state.username,
            description: this.state.description,
            duration: this.state.duration
        }
        console.log(data);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        fetch('http://localhost:5000/exercise/add', options)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))


    }



    render() {
        return (
            <div>
                <h3>Create New Exercise</h3>
                <form onSubmit={this.submit} >
                    <div className="form-group">
                        <label htmlFor="">Username: </label>
                        <select  ref={this.userInput}
                                required
                                className="form-control"
                                onChange={this.username}
                        >
                            <option value="">Select User</option>
                            {
                                this.state.users.map((user, i) => {
                                   return <option key={i} value={user}> {user} </option>
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Description: </label>
                        <input  type="text"
                                required
                                className="form-control"
                                onChange={this.description}
                        />    
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Duration (in min): </label>
                        <input  type="text"
                                required
                                className="form-control"
                                onChange={this.duration}
                        />    
                    </div>

                    <div className="form-group" >
                        <input type="submit" value="Create Exercise" className="btn btn-primary" />
                    </div>

                </form>
            </div>
        )
    }
}
