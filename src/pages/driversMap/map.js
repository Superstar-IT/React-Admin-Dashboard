import React, {Component} from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import { pinYellow, pinBlue, pinGreen, pinOrange, pinBadVersion, pinAthenaYellow, pinAthenaBlue, pinAthenaGreen, pinAthenaOrange }from '../../assets/images/index';

export class AvailableMap extends Component {

  state = {
    driver: {},
    activeMarker: {},
    showingInfoWindow: false
  };

  onMarkerClick = (driverClick, marker) => {
    console.log('driver',driverClick);
    this.setState({
      driver: driverClick,
      activeMarker: marker,
      showingInfoWindow: true,
    })
  };

  render() {
    const { availableDrivers, google } = this.props;
    const { activeMarker, showingInfoWindow, driver } = this.state;
    return (
      <Map
        google={google}
        zoom={12}
        initialCenter={{
          lat: 40.7127,
          lng: -74.0059
        }}
      >

        {availableDrivers.map((driverAv) => (
          <Marker
            key={driverAv.loc.lat}
            onClick={this.onMarkerClick}
            name={driverAv.full_name}
            ping={driverAv.ping}
            license={driverAv.vehicle_extra.license}
            version={driverAv.version}
            title={driverAv.driver_name}
            position={{lat: driverAv.loc.lat, lng: driverAv.loc.lon}}
            icon={{
              url: `${driverAv.athena_id != null ? (driverAv.mode === "Booked" ? pinAthenaBlue : (driverAv.mode ==="Arrived" || driverAv.mode ==="Confirmed") ? pinAthenaOrange : (driverAv.vehicle_extra && driverAv.vehicle_extra.license && driverAv.vehicle_extra.license.length === 4) ? pinAthenaYellow : (driverAv.vehicle_extra && driverAv.vehicle_extra.license && driverAv.vehicle_extra.license.length === 5) ? pinAthenaGreen : pinBadVersion) : driverAv.mode === "Booked" ? pinBlue : driverAv.mode ==="Arrived" ? pinOrange : (driverAv.vehicle_extra && driverAv.vehicle_extra.license && driverAv.vehicle_extra.license.length === 4) ? pinYellow : (driverAv.vehicle_extra && driverAv.vehicle_extra.license && driverAv.vehicle_extra.license.length === 5) ? pinGreen : pinBadVersion}`,
            }}
          />
        ))}
        <InfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}
        >
          <div>
            Name: <b>{driver.name}</b> <br />
            LastOnline: <b>{driver.ping}</b> <br />
            License: <b>{driver.license}</b> <br />
            App Version: <b>V {driver.version && driver.version.v} ( {driver.version && driver.version.id} )</b>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyC5YIg8-Yk_zqjzWpFyZrgYuzzjTCBJV7k')
})(AvailableMap)