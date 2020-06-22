import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3';
import file from './restaurantsa9126b3.csv';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      data:[],
      loading: true,
      search: "",
      cuisines:[],
      selectedCuisine: 0,
      sortBy: 0
    };
  }

  componentDidMount(){
    var data = [];
    var cuisines = [];
    let that = this;
    var cus;

    d3.csv(file, function(res) { 
        data.push({
          ratingNo: res["Aggregate rating"],
          costfortwo: res["Average Cost for two"],
          Cuisines: res["Cuisines"],
          Currency: res["Currency"],
          online: res["Has Online delivery"],
          tablebooking: res["Has Table booking"],
          color: res["Rating color"],
          rating: res["Rating text"],
          id: res["Restaurant ID"],
          name: res["Restaurant Name"],
          votes: isNaN(res["Votes"]) ? 0 : parseInt(res["Votes"]),
        });

        if(res["Cuisines"] != ""){
          cus = res["Cuisines"].split(",");

          for(var y = 0; y < cus.length; y++){
            if(!cuisines.includes(cus[y].trim()))
              cuisines.push(cus[y].trim());
          }
        }
        // console.log(data)
        cuisines.sort();
        that.setState({data: data, loading: false, cuisines: cuisines}); 
    });
  }

  sortChange(e){
    var data = this.state.data;
    var val = parseInt(e.target.value);

    switch(val){
      case 0: 
        data.sort((a, b) => {
            if (a.name < b.name) return -1
            return a.name > b.name ? 1 : 0
        });
        break;
      case 1: 
        data.sort((a, b) => {
            if (a.ratingNo < b.ratingNo) return 1
            return a.ratingNo > b.ratingNo ? -1 : 0
        });
        break;
      case 2: 
        data.sort((a, b) => {
            if (a.votes < b.votes) return 1
            return a.votes > b.votes ? -1 : 0
        });
        break;
      case 3: 
        data.sort((a, b) => {
            if (a.costfortwo < b.costfortwo) return -1
            return a.costfortwo > b.costfortwo ? 1 : 0
        });
        break;
      default:
          console.log('No');
    }

    this.setState({sortBy: e.target.value, data: data});
  }

  render(){
    const {selectedCuisine, search, sortBy} = this.state;
    return(
      <div className="App">
        <div className="header">
          <label className="logoText">Top Restaurant</label>
          <input  className="searchBar"
                  value={this.state.searchtext}
                  onChange={(e) => this.setState({search: e.target.value})}
                  placeholder="Enter Search Term" />
        </div>
        <div className="content" style={{padding: 15}}>
          <select className="drop_down" name="select" onChange={(e) => this.setState({selectedCuisine: e.target.value})}>
            <option value={0} selected={this.state.selectedCountry == 0}>Select Cuisine</option>
            {this.state.cuisines.map((y,yn) => {
              return(
                <option value={y} selected={this.state.selectedCuisine == y}>{y}</option>
              )
            })}
          </select>
          <select className="drop_down" name="select" onChange={(e) => this.sortChange(e)}>
            <option value={0} selected={this.state.sortBy == 0}>Sort By (Name)</option>
            <option value={1} selected={this.state.sortBy == 1}>Sort By (Ratings)</option>
            <option value={2} selected={this.state.sortBy == 2}>Sort By (Votes)</option>
            <option value={3} selected={this.state.sortBy == 3}>Sort By (Average Cost)</option>            
          </select>
        </div>
        <div className="content">
          {
            this.state.data.length == 0
            ?
            <div className="nodata">
              {
                this.state.loading
                ?
                "Data Loading..."
                :
                "No Data Present"
              }
            </div>
            :
            null
          }
          {this.state.data.map((item,index) => {
            if((selectedCuisine == 0 || item.Cuisines.includes(selectedCuisine)) && (search == "" || item.name.toLowerCase().includes(search.toLowerCase())))
              return(
                <div className="indView" key={index}>
                  <div className="rankingView">
                    <label className="title">{item.name}</label>
                  </div>
                  <div style={{display:'flex',justifyContent:'center'}}>
                    <div className="descView">
                    {item.Cuisines}
                    </div>
                  </div>
                  <div className="bottom">
                    <div className="rankingView" style={{justifyContent:'flex-start'}}>
                      <label className="ranking">Rating: </label>
                      <label className="rankingAns">{item.rating} ({item.ratingNo})</label>
                    </div>
                    <div className="countryView">
                      <label className="style">({item.votes} Votes)</label>
                    </div>
                  </div>
                  <div className="bottom">
                    <div className="rankingView" style={{justifyContent:'flex-start'}}>
                      <label className="ranking">Currency: </label>
                      <label className="rankingAns">{item.Currency}</label>
                    </div>
                    <div className="countryView">
                      <label className="style">({item.costfortwo}/-)</label>
                    </div>
                  </div>
                  <div className="bottom-icon">
                    {
                      item.online && item.online != 'No'
                      ?
                      <img src={require('./images/restaurant.png')} className="icons" /> : null }
                    {
                      item.tablebooking && item.tablebooking != 'No'
                      ?
                      <img src={require('./images/telephone.png')} className="icons" /> : null }
                    {
                      item.color && item.color != ""
                      ?
                      <div style={{backgroundColor: item.color}} className="rating-color"></div> : null }
                  </div>
                </div>
              )
          })}
        </div>
      </div>
    )
  }
}

export default App;
