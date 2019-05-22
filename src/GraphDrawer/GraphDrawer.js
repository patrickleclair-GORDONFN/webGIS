import React, { Component } from 'react';
import { Drawer } from 'antd'
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';


class GraphDrawer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      temperature: null,
      conductivity: null,
      ph: null,
      flow_rate: null,
      visible: props.visible,
      location: props.location,
      precipitation: null,
    }
  }

  getData = (uuid, radius) => {

    return fetch("https://lrwu47ypal.execute-api.us-east-1.amazonaws.com/dev/metrics", {
      method: 'post',
      body: JSON.stringify({
        uuid: uuid,
        radius: radius
      })
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      return json
    });
  }

  getPrecipitation() {
    return fetch("https://lrwu47ypal.execute-api.us-east-1.amazonaws.com/dev/precipitation", {
      method: 'get'
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      return json
    });
  }

  formatXAxis = (tickItem) => { return moment(tickItem).format('DD MMM YY') }

  componentWillReceiveProps(props) {

    if (props.visible === true) {
      this.getData(props.location.uuid, props.location.radius).then((metrics) => {

        this.setState({
          title: props.location.label,
          temperature: metrics.temperature,
          conductivity: metrics.conductivity,
          ph: metrics.ph,
          flow_rate: metrics.flow_rate,
        });
      })

      this.getPrecipitation().then((precipitation) => {
        this.setState({
          precipitation: precipitation
        })
      })
    }
  }

  render () {

    return (
        <Drawer
          placement="right"
          closable={true}
          mask={false}
          maskClosable={false}
          onClose={this.props.onClose}
          visible={this.props.visible}
          width={500}
        >
          <h2>{this.state.title}</h2>
          <LineChart width={450} height={250} data={this.state.temperature}>
              <Line type="monotone" dataKey="value" stroke="#DB4437" />
              <XAxis dataKey="name" tickFormatter={this.formatXAxis}/>
              <YAxis label={{ value: "Temperature (deg C)", angle: -90, position: 'insideBottomLeft' }}/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
          </LineChart>

          <LineChart width={450} height={250} data={this.state.conductivity}>
              <Line type="monotone" dataKey="value" stroke="#4285F4" />
              <XAxis dataKey="name" tickFormatter={this.formatXAxis}/>
              <YAxis label={{ value: "Conductivity (µS/cm)", angle: -90, position: 'insideBottomLeft' }}/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
          </LineChart>

          <LineChart width={450} height={250} data={this.state.ph}>
              <Line type="monotone" dataKey="value" stroke="#0F9D58" />
              <XAxis dataKey="name" tickFormatter={this.formatXAxis}/>
              <YAxis label={{ value: "pH", angle: -90, position: 'insideBottomLeft' }} domain={[6, 9]}/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
          </LineChart>

          <LineChart width={450} height={250} data={this.state.flow_rate}>
              <Line type="monotone" dataKey="value" stroke="#add8e6" />
              <XAxis dataKey="name" tickFormatter={this.formatXAxis}/>
              <YAxis label={{ value: "Flow Rate (l/sec)", angle: -90, position: 'insideBottomLeft' }}/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
          </LineChart>

          <LineChart width={450} height={250} data={this.state.precipitation}>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <XAxis dataKey="date" tickFormatter={this.formatXAxis}/>
              <YAxis label={{ value: "Precipitation (mm) GISS SSI", angle: -90, position: 'insideBottomLeft' }}/>
              <Line dataKey="value" fill="#8884d8" />
          </LineChart>
        </Drawer>
      )
  }
}

export default GraphDrawer;