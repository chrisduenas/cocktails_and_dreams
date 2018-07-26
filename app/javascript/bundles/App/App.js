import React, { Component } from "react";
import axios from "axios";
import NavigationBar from './components/NavigationBar';
import Jumbotron from './components/Jumbotron';
import moment from 'moment';
import Search from './components/Search';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      possibleResults: [],
      results: [],
      bartenderList: [],
      value: "",
      filters: [],
      selectedBartender: {},
      newDate: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios
      .get("/search.json")
      .then(response => {
        let bartenders = response.data.filter(user => {
          return user.bartender === true;
        });
        this.setState({ bartenderList: bartenders, results: bartenders });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleSearch = (event) => {
    const searchText = event.target.value;
    const regexp = new RegExp(searchText, "i");
    let results = [];
    if (searchText.trim() !== "") {
      results = this.state.bartenderList.filter(result => {
        return regexp.test(result.name);
      });
      this.setState({ results });
    } else {
      this.setState({ results: [] });
    }
  };

  handleChange = (event) => {
    let results = [];

    let filter = {
      type: this.refs.dropdown.value,
      gender: this.refs.maleBtn.checked ? "male" : "female",
      rating: this.refs.ratingNumber.value
    };

    if (filter.type === "all") {
      this.setState({ results: this.state.bartenderList });
    } else {
      results = this.state.bartenderList.filter(user => {
        return (
          user[filter.type] === true &&
          user.gender === filter.gender &&
          user.rating == filter.rating
        );
      });

      this.setState({ results: results });
    }
  };

  createEvent(event) {
    axios
      .post("/events.json", { event })
      .then(response => {
        return event.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleSubmit = e => {
    e.preventDefault();
    let eventDate = this.refs.newEventDate.value;
    eventDate = moment(eventDate).format("dddd");
    this.setState({ newDate: eventDate });
    let event = {
      user_id: this.props.user.id,
      location: this.refs.eventTitle.value,
      bartender_id: this.state.selectedBartender.id
    };
    this.createEvent(event);
  };

  render() {
    const { results } = this.state;
    return (
      <div>
        <NavigationBar />
        <Jumbotron />
        <Search handleSearch={this.handleSearch}/>
        <label>Bartender Type:</label>
        <select name="type" onChange={this.handleChange} ref="dropdown">
          <option value="standard">Standard</option>
          <option value="flair">Flair</option>
          <option value="mixologist">Mixologist</option>
          <option value="all">All</option>
        </select>
        <div onChange={this.handleChange}>
          <input type="radio" value="Male" name="gender" ref="maleBtn" /> Male
          <input type="radio" value="Female" name="gender" /> Female
        </div>
        <label>Availability:</label>
        <input type="checkbox" value="monday" name="day"/>Monday
        <input type="checkbox" value="tuesday" name="day"/>Tuesday
        <input type="checkbox" value="wednesday" name="day"/>Wednesday
        <input type="checkbox" value="thursday" name="day"/>Thursday
        <input type="checkbox" value="friday" name="day"/>Friday
        <input type="checkbox" value="saturday" name="day"/>Saturday
        <input type="checkbox" value="sunday" name="day"/>Sunday
        <label>Ratings:</label>
        <select name="rating" onChange={this.handleChange} ref="ratingNumber">
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
        <ul>
          {results.map((result, i) => {
            return (
              <li
                key={i}
                onClick={() => {
                  this.setState({ selectedBartender: result });
                }}
              >
                Name: {result.name}
                Gender: {result.gender}
                Mixologist: {result.mixologist}
                Flair: {result.flair}
                Standard: {result.standard}
                Rating: {result.rating}
                Bio: {result.bio}
              </li>
            );
          })}
        </ul>
        {results.length === 0 && <p>No Results</p>}
        <form onSubmit={this.handleSubmit}>
          <label>Event:</label>
          <div>
            <input type="text" defaultValue="Birthday" ref="eventTitle" />
          </div>
          <label>Date:</label>
          <div>
            <input type="date" ref="newEventDate" />
          </div>
          <label>Bartender:</label>
          <div>
            <input
              type="text"
              value={this.state.selectedBartender.name}
              ref="bartenderName"
            />
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;
